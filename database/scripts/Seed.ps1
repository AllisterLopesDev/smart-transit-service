#!/usr/bin/env pwsh
param()
$ErrorActionPreference = "Stop"

# Load env
$envFile = "..\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "DATABASE_URL=(.+)") { $env:DATABASE_URL = $matches[1] }
    }
} else {
    Write-Host ".env file not found!" -ForegroundColor Red
    exit 1
}

$seedsDir = "../seeds"

if (-not (Test-Path $seedsDir)) {
    Write-Host "Seeds directory not found: $seedsDir"
    exit 1
}

# Run all seed files (idempotent)
$seedFiles = Get-ChildItem $seedsDir -Filter "*_seed.sql" | Sort-Object Name

foreach ($file in $seedFiles) {
    Write-Host "Applying seed: $($file.Name)"
    psql $env:DATABASE_URL -f $file.FullName
}

Write-Host "✅ All seeds applied successfully."
