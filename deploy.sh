#!/usr/bin/env bash
# deploy.sh — deploy the latest master to Hetzner
# Usage: ./deploy.sh [--no-build]
#   --no-build  skip docker compose build (just pull + restart)

set -euo pipefail

SERVER="root@77.42.70.26"
REMOTE_DIR="/opt/bep-generator"
NO_BUILD=false

for arg in "$@"; do
  [[ "$arg" == "--no-build" ]] && NO_BUILD=true
done

echo "==> Connecting to $SERVER ..."

ssh "$SERVER" bash -s -- "$NO_BUILD" << 'REMOTE'
  NO_BUILD=$1
  DIR="/opt/bep-generator"

  set -euo pipefail

  cd "$DIR"

  echo ""
  echo "==> Pulling latest code from GitHub ..."
  # Preserve .env.production across pulls (gitignored, must not be overwritten)
  mv .env.production /tmp/.env.production.bak 2>/dev/null || true
  git pull origin master
  mv /tmp/.env.production.bak .env.production

  if [[ "$NO_BUILD" != "true" ]]; then
    echo ""
    echo "==> Building Docker images ..."
    docker compose build
  else
    echo ""
    echo "==> Skipping build (--no-build flag set)"
  fi

  echo ""
  echo "==> Starting containers ..."
  docker compose up -d

  echo ""
  echo "==> Waiting for backend to be ready ..."
  for i in $(seq 1 15); do
    STATUS=$(curl -sk -o /dev/null -w "%{http_code}" https://77.42.70.26.nip.io/health || true)
    if [[ "$STATUS" == "200" ]]; then
      echo "    Health check: OK"
      break
    fi
    echo "    Attempt $i/15 — status: $STATUS"
    sleep 2
  done

  if [[ "$STATUS" != "200" ]]; then
    echo ""
    echo "ERROR: Health check failed after 30s. Showing backend logs:"
    docker compose logs backend --tail=30
    exit 1
  fi

  echo ""
  echo "==> Container status:"
  docker compose ps

  echo ""
  echo "==> Deploy complete. App is live at https://77.42.70.26.nip.io"
REMOTE
