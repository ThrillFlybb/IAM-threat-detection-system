@echo off
title IAM Threat Detection System

echo ================================
echo Starting IAM Project...
echo ================================

:: Backend
echo Starting Backend...
start cmd /k "cd /d %~dp0 && npm install && npm run dev"

:: Wait
timeout /t 5 > nul

:: Frontend
echo Starting Frontend...
start cmd /k "cd /d %~dp0iam-frontend && npm install && npm start"

echo ================================
echo Project running...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ================================

pause