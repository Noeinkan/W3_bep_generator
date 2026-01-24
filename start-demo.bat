@echo off
REM ===================================================================
REM BEP Generator - Demo Startup Script
REM ===================================================================
REM
REM This script will:
REM 1. Start the Node.js backend server (port 3001)
REM 2. Start the React frontend (port 3000)
REM 3. Start the ML service with Ollama (port 8000)
REM ===================================================================

echo.
echo ===================================================================
echo   BEP Generator - Starting Demo Mode
echo ===================================================================
echo.

echo.
echo [1/1] Starting BEP Generator services...
echo       This will open 3 windows:
echo       - Frontend (React on port 3000)
echo       - Backend (Node.js on port 3001)
echo       - ML Service (Python on port 8000)
echo.

REM Start the main application (frontend + backend + ML)
start "BEP Generator - Services" cmd /k "npm start"

echo [OK] Services starting in new window...
echo.
echo Close the "BEP Generator - Services" window to stop all services.
echo.
pause
