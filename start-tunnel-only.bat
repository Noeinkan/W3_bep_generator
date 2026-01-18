@echo off
echo Starting Cloudflare Tunnel on port 3000 (Frontend)...
echo.
cloudflared tunnel --url http://localhost:3000
