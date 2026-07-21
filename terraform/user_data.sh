#!/bin/bash
set -euxo pipefail

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y openjdk-21-jre-headless

mkdir -p /opt/bankapi
chown ubuntu:ubuntu /opt/bankapi

cat >/etc/systemd/system/bankapi.service <<'SERVICE'
[Unit]
Description=Bank Spring Boot API
After=network-online.target
Wants=network-online.target

[Service]
User=ubuntu
WorkingDirectory=/opt/bankapi
EnvironmentFile=/etc/bankapi.env
ExecStart=/usr/bin/java -jar /opt/bankapi/bankapi.jar
SuccessExitStatus=143
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

touch /etc/bankapi.env
chmod 600 /etc/bankapi.env
systemctl daemon-reload
systemctl enable bankapi.service
