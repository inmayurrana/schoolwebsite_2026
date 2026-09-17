@echo off
title Cambridge International School Mandi - Restarting Application...
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ==============================================================================
echo   RESTARTING APPLICATION - CAMBRIDGE INTERNATIONAL SCHOOL MANDI
echo ==============================================================================
echo.

:: 1. Free ports 3000, 3001, and 3002
echo [1/4] Stopping active server instances on ports 3000, 3001, and 3002...
powershell -NoProfile -Command "3000, 3001, 3002 | ForEach-Object { $port = $_; try { Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue; Write-Host ('  - Stopped process on port ' + $port) } } catch {} }" >nul 2>&1

:: Double check fallback via taskkill
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3002" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

timeout /t 1 /nobreak >nul

:: 2. Verify database connection & sync Prisma
echo [2/4] Syncing Prisma client and database models...
call npx prisma generate >nul 2>&1

:: 3. Launch browser in background after server boots
echo [3/4] Preparing browser launcher...
start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"

:: 4. Start Next.js Development Server
echo [4/4] Starting fresh server instance on http://localhost:3000 ...
echo [INFO] Press Ctrl + C to stop the application.
echo.

call npm run dev -- -p 3000

pause
