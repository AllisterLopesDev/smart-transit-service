#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Load environment variables
. ../.env

$MigrationsDir = "../migrations"

if (-Not (Test-Path $MigrationsDir)) {
    Write-Host "Migrations directory not found: $MigrationsDir"
    exit 1
}

# Run all *.sql files in migrations dir (one per table, idempotent)
$SqlFiles = Get-ChildItem -Path $MigrationsDir -Filter "*.sql" | Sort-Object Name

foreach ($File in $SqlFiles) {
    Write-Host "Applying migration: $($File.Name) ..."
    psql $env:DATABASE_URL -f $File.FullName
}

Write-Host "✅ All migrations applied successfully."
