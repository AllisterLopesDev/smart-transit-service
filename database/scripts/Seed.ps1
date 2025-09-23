# seed.ps1
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

$seedsDir = "../seeds"
$stateFile = "../.seeds_state"

if (-not (Test-Path $stateFile)) { Set-Content $stateFile "0" }

$currentVersion = [int](Get-Content $stateFile)
$seedFiles = Get-ChildItem $seedsDir | Where-Object { $_.Name -like "*_seed_*.sql" } | Sort-Object Name

foreach ($file in $seedFiles) {
    $version = [int]($file.BaseName.Split('_')[0])
    if ($version -gt $currentVersion) {
        Write-Host "Applying seed $($file.Name)"
        psql $env:DATABASE_URL -f $file.FullName
        Set-Content $stateFile $version
    }
}

Write-Host "All seeds applied successfully."
