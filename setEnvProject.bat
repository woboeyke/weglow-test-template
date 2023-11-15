@echo off
setlocal enabledelayedexpansion
REM THIS SCRIPT CHANGES THE VALUE OF THE PROJECT_NAME VARIABLE IN .env.production ON DEPLOYMENT

REM Define the paths to your firebase.json and .env.production files
set "firebaseJsonPath=firebase.json"
set "envProductionPath=.env.production"

REM Read the "site" property from firebase.json
for /f "tokens=2 delims=: " %%a in ('findstr /C:"\"site\":" %firebaseJsonPath%') do (
    set "siteValue=%%a"
)

REM Trim any surrounding double quotes from the siteValue
set "siteValue=!siteValue:"=!"

REM Format the value with double quotes
set "siteValue=^"!siteValue!^""

REM Remove any commas from the siteValue
set "siteValue=!siteValue:,=!"

REM Replace the value in .env.production
set "replaceText=PROJECT_NAME ="
set "newLine=!replaceText! %siteValue%"

(for /f "usebackq delims=" %%b in (%envProductionPath%) do (
    echo %%b | findstr /C:"%replaceText%" > nul
    if !errorlevel! equ 0 (
        echo !newLine!
    ) else (
        echo %%b
    )
)) > temp.env.production

REM Replace the original .env.production with the updated content
move /y temp.env.production %envProductionPath%

echo Value replaced successfully!

endlocal
