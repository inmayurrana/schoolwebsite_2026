@echo off
title Cambridge International School Mandi - Application Server
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ==============================================================================
echo   CAMBRIDGE INTERNATIONAL SCHOOL MANDI - WEBSITE & CMS PORTAL
echo ==============================================================================
echo.

:: 1. Check for Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/ to run this application.
    echo.
    pause
    exit /b 1
)

:: 2. Check for dependencies
if not exist "node_modules\" (
    echo [INFO] First time setup: Installing project dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

:: 3. Generate Prisma Client
echo [INFO] Generating database client...
call npx prisma generate >nul 2>&1

:: 4. Launch browser after a short delay in background
start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"

:: 5. Start the Development Server
echo [SUCCESS] Starting application server on http://localhost:3000 ...
echo [INFO] Press Ctrl + C anytime in this window to stop the server.
echo.

call npm run dev -- -p 3000

pause
