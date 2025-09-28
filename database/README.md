
# Database Migrations Setup

This guide explains how to set up and run database migrations for this project using Flyway.
The `Run-Flyway.ps1` PowerShell script automates installing required tools and running migrations.


## Prerequisites
Before running migrations, you need:

- **PowerShell** (Windows, Linux, or macOS PowerShell Core)
- **Internet connection** (for installing tools)
- Access to the target **database**


## Installing Required Tools

The script uses Scoop to install Flyway.
Scoop does not require administrator privileges and handles tool installation automatically.

The first time you run migrations, Scoop and Flyway will be installed if they are not already available.

### Run-Flyway.ps1 Script
The script performs the following:

- Checks if Scoop is installed; if not, installs Scoop.
- Checks if Flyway is installed; if not, installs Flyway via Scoop.
- Runs Flyway migrations using the `flyway.conf` configuration file.
## Usage

Open a PowerShell terminal and run:

```powershell
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    .\Run-Flyway.ps1
```
The script will:

- Install Scoop if missing
- Install Flyway if missing
- Run Flyway migrations automatically

Example Output

```plaintext
    Scoop not found. Installing Scoop...
    Installing Flyway with Scoop...
    Running Flyway migrations...
    Successfully validated 2 migrations (execution time 00:00.032s)
    Current version of schema "public": 2
    Schema "public" is up to date. No migration necessary.
```


## Configuration

The script uses the flyway.conf file located in the migrations configuration directory.
Ensure flyway.conf is configured correctly with your database connection details, including:

- `flyway.url`
- `flyway.user`
- `flyway.password`
- `flyway.locations`

Example `flyway.conf` snippet:

```flyway.conf
    flyway.url=jdbc:postgresql://localhost:5432/my_database
    flyway.user=my_user
    flyway.password=my_password
    flyway.locations=filesystem:sql
```


## Notes

- The script uses $PSScriptRoot to determine the repository root directory dynamically.
- Ensure your migration scripts follow Flyway’s naming convention:

```bash
  V<version>__<description>.sql
```
- Example: V1__create_roles_table.sql
    
## Support

For support, email darron.dev@gmail.com

