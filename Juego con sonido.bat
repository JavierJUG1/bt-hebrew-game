@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Adivina la palabra - Beit Teshuva

rem ===================================================================
rem  ABRE EL JUEGO CON LA MUSICA SONANDO DESDE EL PRIMER INSTANTE
rem
rem  Por que existe este archivo:
rem  Ningun navegador reproduce audio hasta que la persona toca la
rem  pagina. Es una proteccion contra sitios que suenan solos y no se
rem  puede desactivar desde el codigo del juego. Si abres el HTML con
rem  doble clic, la musica espera al primer clic.
rem
rem  Este lanzador abre Chrome con el permiso ya concedido, en un
rem  perfil aparte para no tocar tu Chrome de siempre ni tus sesiones.
rem  Resultado: el juego suena solo, sin que nadie haga nada.
rem
rem  Uso: doble clic en este archivo. Debe estar en la misma carpeta
rem  que "Juego - Adivina la palabra (hebreo).html".
rem ===================================================================

set "JUEGO=%~dp0Juego - Adivina la palabra (hebreo).html"

if not exist "%JUEGO%" (
  echo.
  echo  No encuentro el juego en esta carpeta:
  echo    %JUEGO%
  echo.
  echo  Deja este .bat junto al archivo HTML y vuelve a intentarlo.
  echo.
  pause
  exit /b 1
)

rem --- Buscar Chrome en las rutas habituales de Windows ---
set "CHROME="
for %%R in (
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LocalAppData%\Google\Chrome\Application\chrome.exe"
) do if not defined CHROME if exist %%R set "CHROME=%%~R"

rem --- Si no hay Chrome, probar Edge: acepta el mismo parametro ---
if not defined CHROME (
  for %%R in (
    "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
    "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
  ) do if not defined CHROME if exist %%R set "CHROME=%%~R"
)

if not defined CHROME (
  echo.
  echo  No encontre Chrome ni Edge instalados.
  echo  Abro el juego con el navegador predeterminado: la musica
  echo  arrancara con el primer clic en la pagina.
  echo.
  start "" "%JUEGO%"
  timeout /t 4 >nul
  exit /b 0
)

rem  El perfil aparte es imprescindible: si Chrome ya esta abierto,
rem  reutiliza el proceso existente y los parametros nuevos se ignoran.
set "PERFIL=%TEMP%\juego-burro-chrome"

start "" "%CHROME%" ^
  --autoplay-policy=no-user-gesture-required ^
  --user-data-dir="%PERFIL%" ^
  --no-first-run ^
  --no-default-browser-check ^
  --start-maximized ^
  "%JUEGO%"

exit /b 0
