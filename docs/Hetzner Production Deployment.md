Hetzner Production Deployment
Context
The BEP Generator currently runs as a local dev setup (three concurrent processes: Vite :3000, Express :3001, Python ML :8000). The goal is to ship a production-ready deployment for a Hetzner VPS that:

Serves the built React app via Express in production mode
Exposes the app behind Nginx (for SSL termination + reverse proxy)
Runs the ML service as an optional sidecar
Persists the SQLite DB and uploaded documents across container restarts
Is operable via docker compose up -d
Note: The server already has CORS hard-coded to https://77.42.70.26.nip.io (line 33 of server/server.js) and has production static file serving set up. The production plumbing mostly exists — we're adding Docker + Nginx config.

Architecture on Hetzner

Internet (443/80)
    │
    ▼
Nginx (certbot SSL)
    ├─→ /           → app:3001 (Express serves build/ + /api/*)
    └─→ /api/ai     → ml-service:8000 (FastAPI, optional)

Volumes:
  db-data   → server/db/  (SQLite)
  uploads   → server/uploads/  (document files)
Files to Create
1. Dockerfile (root — Node.js app)
Multi-stage build. Stage 1 builds the frontend with Vite. Stage 2 is the production runtime.

Critical: Puppeteer requires system Chromium deps. Use node:20-bookworm-slim (Debian-based) instead of Alpine, and install Chromium deps. Set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true and point Puppeteer to the system Chromium.


# Stage 1: Build frontend
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-bookworm-slim AS production
WORKDIR /app

# Puppeteer/Chromium deps
RUN apt-get update && apt-get install -y \
    chromium fonts-liberation libatk-bridge2.0-0 libatk1.0-0 \
    libcairo2 libcups2 libdbus-1-3 libdrm2 libgbm1 libglib2.0-0 \
    libnss3 libpango-1.0-0 libxcomposite1 libxdamage1 libxfixes3 \
    libxkbcommon0 libxrandr2 xdg-utils \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev
COPY server/ ./server/
COPY --from=builder /app/build ./build

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 3001
CMD ["node", "server/server.js"]
2. ml-service/Dockerfile

FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "api_ollama:app", "--host", "0.0.0.0", "--port", "8000"]
⚠️ Risk: torch>=2.6.0 in requirements.txt makes this image ~3-4GB. Verify if torch is actually called at runtime — if not, move it to a requirements-dev.txt and strip from the production image.

3. docker-compose.yml

version: '3.8'
services:
  app:
    build: .
    env_file: .env
    environment:
      NODE_ENV: production
    volumes:
      - db-data:/app/server/db
      - uploads:/app/server/uploads
      - temp:/app/server/temp
    restart: unless-stopped
    depends_on:
      - ml-service

  ml-service:
    build: ./ml-service
    env_file: .env
    environment:
      OLLAMA_HOST: ${OLLAMA_HOST:-http://host.docker.internal:11434}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - certbot-www:/var/www/certbot:ro
      - certbot-data:/etc/letsencrypt:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  db-data:
  uploads:
  temp:
  certbot-www:
  certbot-data:
4. nginx/nginx.conf
HTTP→HTTPS redirect + reverse proxy. Proxies /api/ai to ml-service, everything else to app.


server {
    listen 80;
    server_name _;
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name 77.42.70.26.nip.io; # update with real domain

    ssl_certificate     /etc/letsencrypt/live/<domain>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<domain>/privkey.pem;

    client_max_body_size 25M; # match Express 50mb, but Nginx blocks first

    location /api/ai {
        proxy_pass http://ml-service:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://app:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
5. .env.example

# App
JWT_SECRET=change-this-to-a-long-random-string
NODE_ENV=production
PORT=3001

# CORS — comma-separated allowed origins
ALLOWED_ORIGINS=https://your-domain.com

# Email (optional — leave blank to disable)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Ollama (AI features)
# Use host.docker.internal:11434 if Ollama runs on host
# or http://ollama:11434 if running as Docker container
OLLAMA_HOST=http://host.docker.internal:11434
6. .dockerignore

node_modules/
build/
.env
.env.*
!.env.example
server/db/*.db
server/temp/
ml-service/__pycache__/
ml-service/venv/
ml-service/.venv/
*.log
.git/
Files to Modify
server/server.js — 2 changes
Change 1: Add trust proxy right after const app = require('./app'); (line 23):


app.set('trust proxy', 1); // Trust Nginx reverse proxy for correct req.ip
This ensures rate-limiting works correctly behind Nginx (uses X-Forwarded-For instead of Docker internal IP).

Change 2: Make CORS origin use ALLOWED_ORIGINS env var in production (line 32-34):


origin: process.env.NODE_ENV === 'production'
  ? (process.env.ALLOWED_ORIGINS || 'https://77.42.70.26.nip.io').split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
Deployment Steps (for verification)
On Hetzner VPS: install Docker + Docker Compose, clone repo
Copy .env.example → .env, fill in JWT_SECRET and optionally SMTP
docker compose build
For SSL: run Certbot once with webroot challenge (Nginx must be running with port 80)
docker compose up -d
Verify: curl https://<domain>/health → OK
Verify: docker compose logs app — no JWT_SECRET errors
For AI features: ensure Ollama is running on host at port 11434
Risks / Notes
torch in ML service: If torch isn't actually used at inference time, stripping it from the prod requirements reduces image from ~4GB to ~200MB. Worth checking ml-service/api_ollama.py imports before building.
Puppeteer Chromium path: The PUPPETEER_EXECUTABLE_PATH env var must match the actual chromium binary path in the Debian image (/usr/bin/chromium). Test PDF export after first deploy.
SQLite on volume: The DB file in server/db/ must be on a named volume (not baked into the image) or data is lost on docker compose up --build. The compose file above handles this correctly.
Electron: Deferred to a follow-up task. No Electron work in this plan.