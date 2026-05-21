# Purpose: Windows dev — MySQL must be running; starts API + Vite.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root`"; mvn -q spring-boot:run -pl backend"
Start-Sleep -Seconds 2
Set-Location "$root\frontend"
npm run dev
