# AutoPilot IDE - Production Deployment Guide

This guide covers deploying AutoPilot IDE to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Security Checklist](#security-checklist)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
- [Nginx Configuration](#nginx-configuration)
- [SSL/TLS Setup](#ssltls-setup)
- [Monitoring & Logging](#monitoring--logging)
- [Backup Strategy](#backup-strategy)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **OS**: Ubuntu 20.04+ / Debian 11+ / CentOS 8+ / RHEL 8+
- **Python**: 3.8 or higher
- **RAM**: Minimum 2GB, Recommended 4GB+
- **Storage**: Minimum 10GB free space
- **Network**: Static IP or domain name

### Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3 python3-pip python3-venv nginx -y

# Install certbot for SSL (optional)
sudo apt install certbot python3-certbot-nginx -y
```

## Security Checklist

Before deploying, ensure:

- [ ] Strong `SECRET_KEY` generated and set
- [ ] `DEBUG=False` in production
- [ ] CORS origins configured to specific domains
- [ ] Firewall configured (UFW/iptables)
- [ ] SSL/TLS certificates installed
- [ ] Non-root user created for running application
- [ ] File permissions properly set
- [ ] Database credentials secured (if applicable)
- [ ] Logs directory created with proper permissions
- [ ] Backup strategy implemented

## Environment Configuration

### 1. Create Production User

```bash
# Create dedicated user
sudo useradd -m -s /bin/bash autopilot
sudo usermod -aG sudo autopilot

# Switch to user
sudo su - autopilot
```

### 2. Clone Repository

```bash
cd /home/autopilot
git clone https://github.com/dehewgs/AutoPilot-IDE.git
cd AutoPilot-IDE
```

### 3. Set Up Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy template
cp .env.example .env

# Generate secure secret key
python3 -c "import os; print('SECRET_KEY=' + os.urandom(24).hex())" >> .env

# Edit configuration
nano .env
```

**Production .env example:**

```bash
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-generated-secret-key-here
DEBUG=False

# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Configuration
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Directory Configuration
PROJECTS_DIR=/home/autopilot/AutoPilot-IDE/projects
UPLOAD_FOLDER=/home/autopilot/AutoPilot-IDE/uploads

# File Upload Configuration
MAX_CONTENT_LENGTH=16777216

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=/home/autopilot/AutoPilot-IDE/logs/autopilot-ide.log
```

### 5. Create Required Directories

```bash
mkdir -p projects uploads logs
chmod 755 projects uploads
chmod 750 logs
```

### 6. Set File Permissions

```bash
# Secure .env file
chmod 600 .env

# Set ownership
sudo chown -R autopilot:autopilot /home/autopilot/AutoPilot-IDE
```

## Deployment Options

### Option 1: Gunicorn with Systemd (Recommended)

#### Create Systemd Service

```bash
sudo nano /etc/systemd/system/autopilot-ide.service
```

**Service file content:**

```ini
[Unit]
Description=AutoPilot IDE Application
After=network.target

[Service]
Type=notify
User=autopilot
Group=autopilot
WorkingDirectory=/home/autopilot/AutoPilot-IDE
Environment="PATH=/home/autopilot/AutoPilot-IDE/venv/bin"
ExecStart=/home/autopilot/AutoPilot-IDE/venv/bin/gunicorn \
    --worker-class eventlet \
    --workers 4 \
    --bind 0.0.0.0:8000 \
    --timeout 120 \
    --access-logfile /home/autopilot/AutoPilot-IDE/logs/access.log \
    --error-logfile /home/autopilot/AutoPilot-IDE/logs/error.log \
    --log-level info \
    app:app

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### Enable and Start Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable autopilot-ide

# Start service
sudo systemctl start autopilot-ide

# Check status
sudo systemctl status autopilot-ide

# View logs
sudo journalctl -u autopilot-ide -f
```

### Option 2: Docker Deployment

#### Create Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create directories
RUN mkdir -p projects uploads logs

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "--worker-class", "eventlet", "--workers", "4", "--bind", "0.0.0.0:8000", "app:app"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  autopilot-ide:
    build: .
    ports:
      - "8000:8000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=${SECRET_KEY}
      - DEBUG=False
      - CORS_ORIGINS=${CORS_ORIGINS}
    volumes:
      - ./projects:/app/projects
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Nginx Configuration

### 1. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/autopilot-ide
```

**Configuration:**

```nginx
upstream autopilot_ide {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/autopilot-ide-access.log;
    error_log /var/log/nginx/autopilot-ide-error.log;

    # Max upload size
    client_max_body_size 16M;

    # Proxy settings
    location / {
        proxy_pass http://autopilot_ide;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # WebSocket support
    location /socket.io {
        proxy_pass http://autopilot_ide/socket.io;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;
    }

    # Static files (if needed)
    location /static {
        alias /home/autopilot/AutoPilot-IDE/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. Enable Configuration

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/autopilot-ide /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## SSL/TLS Setup

### Using Let's Encrypt (Free)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Using Custom Certificate

```bash
# Copy certificates
sudo cp your-cert.crt /etc/ssl/certs/autopilot-ide.crt
sudo cp your-key.key /etc/ssl/private/autopilot-ide.key

# Set permissions
sudo chmod 644 /etc/ssl/certs/autopilot-ide.crt
sudo chmod 600 /etc/ssl/private/autopilot-ide.key

# Update Nginx configuration with certificate paths
```

## Firewall Configuration

### UFW (Ubuntu/Debian)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### Firewalld (CentOS/RHEL)

```bash
# Enable firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld

# Allow services
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh

# Reload
sudo firewall-cmd --reload
```

## Monitoring & Logging

### Log Rotation

```bash
sudo nano /etc/logrotate.d/autopilot-ide
```

**Configuration:**

```
/home/autopilot/AutoPilot-IDE/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 autopilot autopilot
    sharedscripts
    postrotate
        systemctl reload autopilot-ide > /dev/null 2>&1 || true
    endscript
}
```

### Monitoring with systemd

```bash
# View service status
sudo systemctl status autopilot-ide

# View logs
sudo journalctl -u autopilot-ide -f

# View last 100 lines
sudo journalctl -u autopilot-ide -n 100
```

### Application Logs

```bash
# View application logs
tail -f /home/autopilot/AutoPilot-IDE/logs/autopilot-ide.log

# View access logs
tail -f /home/autopilot/AutoPilot-IDE/logs/access.log

# View error logs
tail -f /home/autopilot/AutoPilot-IDE/logs/error.log
```

## Backup Strategy

### Automated Backup Script

```bash
#!/bin/bash
# /home/autopilot/backup.sh

BACKUP_DIR="/home/autopilot/backups"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/autopilot/AutoPilot-IDE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup projects and uploads
tar -czf $BACKUP_DIR/autopilot-backup-$DATE.tar.gz \
    $APP_DIR/projects \
    $APP_DIR/uploads \
    $APP_DIR/extensions.json \
    $APP_DIR/.env

# Keep only last 7 days of backups
find $BACKUP_DIR -name "autopilot-backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed: autopilot-backup-$DATE.tar.gz"
```

### Schedule with Cron

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/autopilot/backup.sh >> /home/autopilot/backup.log 2>&1
```

## Troubleshooting

### Service Won't Start

```bash
# Check service status
sudo systemctl status autopilot-ide

# View detailed logs
sudo journalctl -u autopilot-ide -n 50

# Check if port is in use
sudo netstat -tulpn | grep 8000

# Test application manually
cd /home/autopilot/AutoPilot-IDE
source venv/bin/activate
python app.py
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R autopilot:autopilot /home/autopilot/AutoPilot-IDE

# Fix permissions
chmod 755 /home/autopilot/AutoPilot-IDE
chmod 600 /home/autopilot/AutoPilot-IDE/.env
chmod 755 /home/autopilot/AutoPilot-IDE/projects
chmod 755 /home/autopilot/AutoPilot-IDE/uploads
```

### WebSocket Connection Issues

```bash
# Check Nginx configuration
sudo nginx -t

# Verify proxy settings in Nginx config
# Ensure Upgrade and Connection headers are set

# Check firewall
sudo ufw status
```

### High Memory Usage

```bash
# Reduce Gunicorn workers
# Edit /etc/systemd/system/autopilot-ide.service
# Change --workers 4 to --workers 2

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart autopilot-ide
```

## Performance Optimization

### Gunicorn Tuning

```bash
# Calculate optimal workers: (2 x CPU cores) + 1
# For 2 CPU cores: --workers 5

# Adjust timeout for long-running operations
--timeout 120

# Use eventlet for WebSocket support
--worker-class eventlet
```

### Nginx Caching

Add to Nginx configuration:

```nginx
# Cache static files
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Updates and Maintenance

### Update Application

```bash
# Stop service
sudo systemctl stop autopilot-ide

# Backup current version
cd /home/autopilot
tar -czf AutoPilot-IDE-backup-$(date +%Y%m%d).tar.gz AutoPilot-IDE/

# Pull updates
cd AutoPilot-IDE
git pull origin main

# Update dependencies
source venv/bin/activate
pip install -r requirements.txt --upgrade

# Start service
sudo systemctl start autopilot-ide

# Check status
sudo systemctl status autopilot-ide
```

## Support

For deployment issues:
- GitHub Issues: https://github.com/dehewgs/AutoPilot-IDE/issues
- Documentation: [README.md](README.md)
- Security: [SECURITY.md](SECURITY.md)

---

**Last Updated**: November 12, 2025
