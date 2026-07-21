param(
    [Parameter(Mandatory = $true)]
    [string]$PemPath,

    [Parameter(Mandatory = $true)]
    [string]$MongoUri,

    [Parameter(Mandatory = $true)]
    [string]$JwtSecret,

    [string]$JarPath = "..\bankapi\target\bankapi-0.0.1-SNAPSHOT.jar"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $PemPath)) { throw "PEM file not found: $PemPath" }
if (-not (Test-Path $JarPath)) { throw "JAR file not found: $JarPath" }

$PublicIp = terraform output -raw public_ip
scp -o StrictHostKeyChecking=accept-new -i $PemPath $JarPath "ubuntu@${PublicIp}:/tmp/bankapi.jar"

$MongoB64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($MongoUri))
$JwtB64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($JwtSecret))

$RemoteScript = @"
set -e
echo '$MongoB64' | base64 -d | sudo tee /tmp/mongo_uri >/dev/null
echo '$JwtB64' | base64 -d | sudo tee /tmp/jwt_secret >/dev/null
sudo install -o ubuntu -g ubuntu -m 0644 /tmp/bankapi.jar /opt/bankapi/bankapi.jar
{
  printf 'MONGODB_URI='
  cat /tmp/mongo_uri
  printf '\nJWT_SECRET='
  cat /tmp/jwt_secret
  printf '\nPORT=8080\n'
} | sudo tee /etc/bankapi.env >/dev/null
sudo chmod 600 /etc/bankapi.env
sudo rm -f /tmp/mongo_uri /tmp/jwt_secret
sudo systemctl daemon-reload
sudo systemctl restart bankapi
sudo systemctl --no-pager --full status bankapi
"@

$RemoteScript | ssh -i $PemPath "ubuntu@$PublicIp" "bash -s"
Write-Host "Health URL: http://${PublicIp}:8080/actuator/health"
