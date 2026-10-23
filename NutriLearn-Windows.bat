@echo off
title NutriLearn - Child Health & Nutrition App
color 0A

echo ===================================================================
echo                     NUTRILEARN PLATFORM
echo     E-Learning & Malnutrition Monitoring (Child Nutrition & Growth)
echo ===================================================================
echo.
echo Starting NutriLearn Application for Windows...
echo.

:: Ensure working directory is the NutriLearn project folder
cd /d "%~dp0"
set PORT=8085

:: Free up port 8085 if any stale server is lingering
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORT% "') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Check if python is available to run local HTTP server for full PWA and .env capabilities
set "PYTHON_CMD="
if exist "%LOCALAPPDATA%\Python\bin\python.exe" (
    set "PYTHON_CMD=%LOCALAPPDATA%\Python\bin\python.exe"
) else (
    for /f "delims=" %%p in ('where python 2^>nul') do (
        echo "%%p" | findstr /i "WindowsApps" >nul
        if errorlevel 1 (
            set "PYTHON_CMD=%%p"
            goto :found_python
        )
    )
)
:found_python

if defined PYTHON_CMD (
    "%PYTHON_CMD%" -c "import uvicorn" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo [OK] FastAPI Backend runtime ready. Launching full backend on port %PORT%...
        start /B "" "%PYTHON_CMD%" -m uvicorn main:app --port %PORT% >nul 2>&1
        set TARGET_URL=http://localhost:%PORT%/index.html
    ) else (
        echo [OK] Python runtime detected. Starting local server on port 8089...
        start /B "" "%PYTHON_CMD%" server.py >nul 2>&1
        set TARGET_URL=http://localhost:8089/
    )
    timeout /t 1 /nobreak >nul
) else (
    echo [INFO] Python runtime not detected. Launching PowerShell HTTP server on port 8080...
    start /B powershell -NoProfile -ExecutionPolicy Bypass -File .\server.ps1 >nul 2>&1
    set TARGET_URL=http://localhost:8080/index.html
    timeout /t 1 /nobreak >nul
)

:: Try to launch with Microsoft Edge in app standalone mode
where msedge >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Launching in dedicated Windows App window...
    start msedge --app="%TARGET_URL%" --window-size=1280,840
    goto :done
)

:: Try to launch with Google Chrome in app standalone mode
where chrome >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Launching in Chrome App window...
    start chrome --app="%TARGET_URL%" --window-size=1280,840
    goto :done
)

:: Fallback to default browser
echo [OK] Launching in default browser...
start "" "%TARGET_URL%"

:done
echo.
echo NutriLearn is now running at %TARGET_URL%! 
echo Keep this window open while using the app, or press any key to close.
pause >nul
