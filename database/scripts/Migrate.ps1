# migrate.ps1
param()
$ErrorActionPreference = "Stop"

# Load .env file
$envFile = "..\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "DATABASE_URL=(.+)") { $env:DATABASE_URL = $matches[1] }
    }
} else {
    Write-Host ".env file not found!" -ForegroundColor Red
    exit 1
}

$migrationsDir = "../migrations"
$stateFile = "../.migrations_state"

# Ensure state file exists
if (-not (Test-Path $stateFile)) { Set-Content $stateFile "0" }

$currentVersion = [int](Get-Content $stateFile)

# Apply migrations
$upMigrations = Get-ChildItem $migrationsDir | Where-Object { $_.Name -like "*_up.sql" } | Sort-Object Name

foreach ($file in $upMigrations) {
    $version = [int]($file.BaseName.Split('_')[0])
    if ($version -gt $currentVersion) {
        Write-Host "Applying migration $($file.Name)"
        psql $env:DATABASE_URL -f $file.FullName
        Set-Content $stateFile $version
    }
}

Write-Host "All migrations applied successfully."
