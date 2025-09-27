# ================================
# Flyway Migration Runner (Scoop-based)
# ================================

$FlywayCommand = "flyway"
$RepoPath = $PSScriptRoot
$FlywayConfigDir = $PSScriptRoot

function Install-Scoop {
    Write-Host "Scoop not found. Installing Scoop..."
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
}

function Install-Flyway {
    Write-Host "Installing Flyway with Scoop..."
    scoop bucket add extras
    scoop install flyway
}

function Run-FlywayMigrations {
    Write-Host "Running Flyway migrations..."
    Push-Location $FlywayConfigDir
    & flyway migrate
    Pop-Location
}

# MAIN SCRIPT
if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
    Install-Scoop
} else {
    Write-Host "Scoop is already installed."
}

if (-not (Get-Command $FlywayCommand -ErrorAction SilentlyContinue)) {
    Install-Flyway
} else {
    Write-Host "Flyway is already installed."
}

if (-Not (Test-Path $FlywayConfigDir)) {
    Write-Host "Error: Flyway config directory not found: $FlywayConfigDir"
    exit 1
}

Run-FlywayMigrations
