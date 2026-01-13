# Deployment - Traditional

Traditional deployment এ আমরা Django application কে Linux server এ Gunicorn/uWSGI, Nginx, এবং PostgreSQL দিয়ে deploy করব। এই গাইডে production-ready deployment এর সব steps বিস্তারিত আলোচনা করা হবে।

## 1. Gunicorn/uWSGI

### Gunicorn Installation

```bash
# Install Gunicorn
pip install gunicorn

# Add to requirements.txt
echo "gunicorn==21.2.0" >> requirements.txt
```

### Gunicorn Configuration

```python
# gunicorn_config.py

import multiprocessing

# Server socket
bind = "127.0.0.1:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = '/var/log/gunicorn/access.log'
errorlog = '/var/log/gunicorn/error.log'
loglevel = 'info'

# Process naming
proc_name = 'myproject'

# Server mechanics
daemon = False
pidfile = '/var/run/gunicorn/myproject.pid'
user = 'www-data'
group = 'www-data'
tmp_upload_dir = None

# SSL (if needed)
# keyfile = '/path/to/keyfile'
# certfile = '/path/to/certfile'
```

### Running Gunicorn

```bash
# Simple run
gunicorn myproject.wsgi:application

# With config file
gunicorn -c gunicorn_config.py myproject.wsgi:application

# Specify workers and bind
gunicorn --workers 3 --bind 0.0.0.0:8000 myproject.wsgi:application

# With timeout
gunicorn --timeout 60 --workers 3 myproject.wsgi:application
```

### uWSGI Alternative

```bash
# Install uWSGI
pip install uwsgi
```

```ini
# uwsgi.ini

[uwsgi]
# Django project
chdir = /home/user/myproject
module = myproject.wsgi:application

# Process-related settings
master = true
processes = 4
threads = 2

# Socket
socket = /tmp/myproject.sock
chmod-socket = 666
vacuum = true

# Logging
logto = /var/log/uwsgi/myproject.log

# Environment
env = DJANGO_SETTINGS_MODULE=myproject.settings.production
```

```bash
# Run uWSGI
uwsgi --ini uwsgi.ini
```

---

## 2. Nginx Configuration

### Install Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Basic Nginx Configuration

```nginx
# /etc/nginx/sites-available/myproject

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    client_max_body_size 10M;
    
    # Static files
    location /static/ {
        alias /home/user/myproject/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Media files
    location /media/ {
        alias /home/user/myproject/media/;
        expires 7d;
    }
    
    # Proxy to Gunicorn
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Advanced Nginx Configuration

```nginx
# /etc/nginx/sites-available/myproject

upstream gunicorn {
    server 127.0.0.1:8000 fail_timeout=0;
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
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Client settings
    client_max_body_size 10M;
    client_body_timeout 60s;
    
    # Logging
    access_log /var/log/nginx/myproject_access.log;
    error_log /var/log/nginx/myproject_error.log;
    
    # Root directory
    root /home/user/myproject;
    
    # Static files with caching
    location /static/ {
        alias /home/user/myproject/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Media files
    location /media/ {
        alias /home/user/myproject/media/;
        expires 7d;
        add_header Cache-Control "public";
    }
    
    # Favicon
    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }
    
    # Robots.txt
    location = /robots.txt {
        access_log off;
        log_not_found off;
    }
    
    # Proxy to Gunicorn
    location / {
        proxy_pass http://gunicorn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

---

## 3. Systemd Service

### Create Systemd Service File

```ini
# /etc/systemd/system/gunicorn.service

[Unit]
Description=Gunicorn daemon for Django project
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/home/user/myproject
Environment="PATH=/home/user/myproject/venv/bin"
ExecStart=/home/user/myproject/venv/bin/gunicorn \
          --workers 3 \
          --bind 127.0.0.1:8000 \
          --timeout 60 \
          --access-logfile /var/log/gunicorn/access.log \
          --error-logfile /var/log/gunicorn/error.log \
          myproject.wsgi:application

ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### Manage Systemd Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Start service
sudo systemctl start gunicorn

# Enable on boot
sudo systemctl enable gunicorn

# Check status
sudo systemctl status gunicorn

# Restart service
sudo systemctl restart gunicorn

# Stop service
sudo systemctl stop gunicorn

# View logs
sudo journalctl -u gunicorn -f
```

### Celery Systemd Service

```ini
# /etc/systemd/system/celery.service

[Unit]
Description=Celery Service
After=network.target

[Service]
Type=forking
User=www-data
Group=www-data
WorkingDirectory=/home/user/myproject
Environment="PATH=/home/user/myproject/venv/bin"
ExecStart=/home/user/myproject/venv/bin/celery -A myproject worker \
          --loglevel=info \
          --logfile=/var/log/celery/worker.log \
          --pidfile=/var/run/celery/worker.pid

ExecStop=/bin/kill -s TERM $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 4. SSL Certificates (Let's Encrypt)

### Install Certbot

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### Obtain SSL Certificate

```bash
# Automatic Nginx configuration
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Manual certificate only
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Webroot method
sudo certbot certonly --webroot -w /home/user/myproject -d yourdomain.com
```

### Auto-Renewal Setup

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically creates cron job
# Check: /etc/cron.d/certbot

# Manual cron job (if needed)
sudo crontab -e

# Add line:
0 0 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

### Manual Nginx SSL Configuration

```nginx
# /etc/nginx/sites-available/myproject

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;
    
    # Other configurations...
}
```

---

## 5. Database Setup (PostgreSQL)

### Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start and enable
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE myproject_db;
CREATE USER myproject_user WITH PASSWORD 'strong_password';

# Grant privileges
ALTER ROLE myproject_user SET client_encoding TO 'utf8';
ALTER ROLE myproject_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE myproject_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE myproject_db TO myproject_user;

# Exit
\q
```

### Configure PostgreSQL for Remote Access (if needed)

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Change:
listen_addresses = 'localhost'  # or '*' for all

# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add:
host    myproject_db    myproject_user    127.0.0.1/32    md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Django Database Configuration

```python
# settings/production.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'myproject_db',
        'USER': 'myproject_user',
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '5432',
        'CONN_MAX_AGE': 600,
        'OPTIONS': {
            'connect_timeout': 10,
        }
    }
}
```

### Database Backup

```bash
# Backup database
pg_dump -U myproject_user myproject_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
psql -U myproject_user myproject_db < backup.sql

# Automated backup script
#!/bin/bash
# /home/user/scripts/backup_db.sh

BACKUP_DIR="/home/user/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="myproject_db"
DB_USER="myproject_user"

pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

# Add to crontab
# 0 2 * * * /home/user/scripts/backup_db.sh
```

---

## 6. Static File Serving

### Collect Static Files

```bash
# Collect static files
python manage.py collectstatic --noinput

# Directory structure
/home/user/myproject/
├── staticfiles/
│   ├── admin/
│   ├── css/
│   ├── js/
│   └── images/
```

### Nginx Static File Configuration

```nginx
# Optimized static file serving

location /static/ {
    alias /home/user/myproject/staticfiles/;
    
    # Caching
    expires 30d;
    add_header Cache-Control "public, immutable";
    
    # Compression
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
    gzip_vary on;
    
    # Security
    add_header X-Content-Type-Options "nosniff";
    
    # Disable logging
    access_log off;
}
```

### WhiteNoise Configuration

```python
# settings.py

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # Other middleware...
]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

---

## 7. Media File Serving

### Media Directory Setup

```bash
# Create media directory
mkdir -p /home/user/myproject/media
sudo chown -R www-data:www-data /home/user/myproject/media
sudo chmod -R 755 /home/user/myproject/media
```

### Django Media Configuration

```python
# settings.py

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880
```

### Nginx Media Configuration

```nginx
location /media/ {
    alias /home/user/myproject/media/;
    
    # Caching
    expires 7d;
    add_header Cache-Control "public";
    
    # Security
    add_header X-Content-Type-Options "nosniff";
    
    # File size limit
    client_max_body_size 10M;
}
```

---

## 8. Log Management

### Create Log Directories

```bash
# Create log directories
sudo mkdir -p /var/log/gunicorn
sudo mkdir -p /var/log/nginx
sudo mkdir -p /var/log/django

# Set permissions
sudo chown -R www-data:www-data /var/log/gunicorn
sudo chown -R www-data:www-data /var/log/django
```

### Logrotate Configuration

```bash
# /etc/logrotate.d/myproject

/var/log/gunicorn/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload gunicorn
    endscript
}

/var/log/django/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}

/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
```

### View Logs

```bash
# Gunicorn logs
sudo tail -f /var/log/gunicorn/access.log
sudo tail -f /var/log/gunicorn/error.log

# Nginx logs
sudo tail -f /var/log/nginx/myproject_access.log
sudo tail -f /var/log/nginx/myproject_error.log

# Django logs
sudo tail -f /var/log/django/myapp.log

# Systemd logs
sudo journalctl -u gunicorn -f
sudo journalctl -u nginx -f
```

---

## Complete Deployment Script

```bash
#!/bin/bash
# deploy.sh - Complete deployment script

set -e

PROJECT_DIR="/home/user/myproject"
VENV_DIR="$PROJECT_DIR/venv"

echo "🚀 Starting deployment..."

# 1. Pull latest code
cd $PROJECT_DIR
git pull origin main

# 2. Activate virtual environment
source $VENV_DIR/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Collect static files
python manage.py collectstatic --noinput

# 5. Run migrations
python manage.py migrate --noinput

# 6. Restart services
sudo systemctl restart gunicorn
sudo systemctl restart nginx

# 7. Health check
sleep 5
curl -f http://localhost/health/ || exit 1

echo "✅ Deployment completed successfully!"
```

---

## সারসংক্ষেপ

Traditional deployment এ Django application successfully deploy করুন:

### Key Components:

1. **Gunicorn/uWSGI**: WSGI server for Django
2. **Nginx**: Reverse proxy এবং static file serving
3. **Systemd**: Service management এবং auto-restart
4. **Let's Encrypt**: Free SSL certificates
5. **PostgreSQL**: Production database
6. **Static Files**: Nginx দিয়ে efficient serving
7. **Media Files**: User uploads management
8. **Logs**: Centralized logging এবং rotation

Production deployment সফল হলে আপনার application secure, scalable, এবং reliable হবে! 🚀
