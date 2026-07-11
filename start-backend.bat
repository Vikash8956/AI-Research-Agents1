@echo off
echo ========================================
echo   ResearchAI Backend - Starting...
echo ========================================
cd /d "%~dp0backend"
node dist/app.js
pause
