# rollback.ps1
param()
$ErrorActionPreference = "Stop"

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

if (-not (Test-Path $stateFile)) { Write-Host "No migrations applied yet."; exit 1 }

$currentVersion = [int](Get-Content $stateFile)
$downFilePattern = "{0:D3}_*_down.sql" -f $currentVersion
$downFile = Get-ChildItem $migrationsDir | Where-Object { $_.Name -like $downFilePattern }

if ($downFile) {
    Write-Host "Rolling back migration $($downFile.Name)"
    psql $env:DATABASE_URL -f $downFile.FullName
    $prevVersion = $currentVersion - 1
    Set-Content $stateFile $prevVersion
} else {
    Write-Host "No rollback script found for version $currentVersion"
}
