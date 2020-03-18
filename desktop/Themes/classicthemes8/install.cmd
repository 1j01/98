@echo off
cd /d %~dp0 
copy /y ".\Themes\*.theme" "%userprofile%\appdata\local\Microsoft\Windows\Themes\*.*" > nul
echo Themes are installed. Open "Personalization" and enjoy"
echo Also you can visit our site:
echo.
echo http://windows8themes.ms
echo.
pause