# setup.ps1
param()
$ErrorActionPreference = "Stop"

Write-Host "Running migrations..."
./migrate.ps1

Write-Host "Seeding data..."
./seed.ps1

Write-Host "Database setup complete."
