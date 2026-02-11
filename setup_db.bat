@echo off
echo Setting up Tanuh Inventory Database...
echo Please enter your MySQL root password when prompted.
mysql -u root -p < backend/scripts/db_setup.sql
if %errorlevel% neq 0 (
    echo Database setup failed. Please check your password and try again.
    pause
    exit /b %errorlevel%
)
echo Database setup complete!
pause
