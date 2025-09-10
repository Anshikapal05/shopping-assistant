@echo off
echo Starting Voice Shopping Assistant...
echo.
echo Make sure MongoDB is running on your system!
echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
echo.
echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
echo.
echo Both servers are starting up...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
