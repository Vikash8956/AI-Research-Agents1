@echo off
echo ========================================
echo   ResearchAI - Starting All Servers
echo ========================================
echo.
echo Starting Backend on http://localhost:5000
start "ResearchAI Backend" cmd /k "cd /d "%~dp0backend" && node dist/app.js"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting Frontend on http://localhost:3000
start "ResearchAI Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ========================================
echo  Both servers starting in new windows!
echo  Backend  -> http://localhost:5000
echo  Frontend -> http://localhost:3000
echo  App      -> http://localhost:3000
echo ========================================
pause
