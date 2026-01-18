@echo off
REM ===================================================================
REM BEP Generator - Demo Startup Script with Cloudflare Tunnel
REM ===================================================================
REM
REM This script will:
REM 1. Start the Node.js backend server (port 3001)
REM 2. Start the React frontend (port 3000)
REM 3. Start the ML service with Ollama (port 8000)
REM 4. Create a Cloudflare Tunnel to expose the app online
REM
REM ===================================================================

echo.
echo ===================================================================
echo   BEP Generator - Starting Demo Mode
echo ===================================================================
echo.

REM Check if cloudflared is in PATH
where cloudflared >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] cloudflared not found in PATH
    echo [*] Checking common installation locations...

    REM Check common winget installation path
    set "CLOUDFLARED_PATH=C:\Program Files\Cloudflare\cloudflared\cloudflared.exe"
    if exist "%CLOUDFLARED_PATH%" (
        echo [OK] Found cloudflared at: %CLOUDFLARED_PATH%
        goto :start_services
    )

    REM Check ProgramFiles(x86)
    set "CLOUDFLARED_PATH=C:\Program Files (x86)\Cloudflare\cloudflared\cloudflared.exe"
    if exist "%CLOUDFLARED_PATH%" (
        echo [OK] Found cloudflared at: %CLOUDFLARED_PATH%
        goto :start_services
    )

    REM Not found anywhere
    echo [X] ERROR: cloudflared not found!
    echo.
    echo Please install cloudflared first:
    echo    winget install --id Cloudflare.cloudflared
    echo.
    echo Then restart this script.
    echo.
    pause
    exit /b 1
) else (
    echo [OK] cloudflared found in PATH
    set "CLOUDFLARED_PATH=cloudflared"
)

:start_services
echo.
echo [1/4] Starting BEP Generator services...
echo       This will open 3 windows:
echo       - Frontend (React on port 3000)
echo       - Backend (Node.js on port 3001)
echo       - ML Service (Python on port 8000)
echo.

REM Start the main application (frontend + backend + ML)
start "BEP Generator - Services" cmd /k "npm start"

echo [OK] Services starting in new window...
echo.
echo [2/4] Waiting for services to initialize...
echo       (This takes about 30-45 seconds)
echo.

REM Wait for services to be ready
timeout /t 40 /nobreak >nul

echo [3/4] Starting Cloudflare Tunnel...
echo.
echo ===================================================================
echo   IMPORTANT: Copy the URL that appears below!
echo ===================================================================
echo.
echo   Your app will be accessible at: https://xxxxx.trycloudflare.com
echo   Share this URL with anyone who needs to test the app.
echo.
echo   The tunnel will remain active as long as this window is open.
echo   Press Ctrl+C to stop the tunnel and shutdown the demo.
echo.
echo ===================================================================
echo.

REM Start Cloudflare Tunnel
echo [*] Creating tunnel to http://localhost:3001 ...
echo.

"%CLOUDFLARED_PATH%" tunnel --url http://localhost:3001

REM This section runs after tunnel is stopped (Ctrl+C)
echo.
echo ===================================================================
echo   Demo Stopped
echo ===================================================================
echo.
echo The Cloudflare Tunnel has been stopped.
echo.
echo IMPORTANT: The BEP Generator services are still running!
echo            Close the "BEP Generator - Services" window to stop them.
echo.
pause
