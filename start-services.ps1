# Athleia.ai — Master Microservice Launcher
$root = $PSScriptRoot

# Load environment variables from local .env if present
if (Test-Path "$root\.env") {
    Get-Content "$root\.env" | ForEach-Object {
        if ($_ -match "^\s*([^#=]+)\s*=\s*(.*)\s*$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
        }
    }
}

$DB_URL = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { "postgresql+asyncpg://username:password@ep-instance.aws.neon.tech/neondb?ssl=require" }

Write-Host "Launching Athleia.ai Microservice Architecture..." -ForegroundColor Cyan

# 1. Retrieval Service (Port 8001)
Write-Host "[1/10] Starting Retrieval Service on Port 8001..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location '$root\services\semantic-serach-(retrievel)-service'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

# 2. Reasoning Service (Port 8002)
Write-Host "[2/10] Starting Reasoning Service on Port 8002..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location '$root\services\reasoning-service'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload"

# 3. Ingestion Service (Port 8003)
Write-Host "[3/10] Starting Ingestion Service on Port 8003..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location '$root\services\Ingestion-service'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload"

# 4. Knowledge Service (Port 8005)
Write-Host "[4/10] Starting Knowledge Service on Port 8005..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location '$root\services\knowledge-service'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8005 --reload"

# 5. Compliance Service (Port 8006)
Write-Host "[5/10] Starting Compliance Service on Port 8006..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location '$root\services\compliance-service'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8006 --reload"

# 6. Maintenance Service (Port 8007)
Write-Host "[6/10] Starting Maintenance Service on Port 8007..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location '$root\services\maintenance-service'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8007 --reload"

# 7. Auth Service (Port 8008)
Write-Host "[7/10] Starting Auth Service on Port 8008..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "`$env:AUTH_DATABASE_URL='$DB_URL'; Set-Location '$root\shared\authenticaion'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8008 --reload"

# 8. Notification Service (Port 8009)
Write-Host "[8/10] Starting Notification Service on Port 8009..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "`$env:NOTIFICATION_DATABASE_URL='$DB_URL'; Set-Location '$root\shared\notification-service'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8009 --reload"

# 9. Assistant Service (Port 8010)
Write-Host "[9/10] Starting Assistant Service on Port 8010..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "`$env:ASSISTANT_DATABASE_URL='$DB_URL'; Set-Location '$root\services\assistant-service'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8010 --reload"

# 10. API Gateway (Port 8000)
Write-Host "[10/10] Starting Central API Gateway on Port 8000..." -ForegroundColor Yellow
Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "Set-Location '$root\gateway'; py -3.12 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "All 9 microservices + API Gateway launched successfully!" -ForegroundColor Green
