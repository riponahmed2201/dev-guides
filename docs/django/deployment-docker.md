# Deployment - Docker

Docker ব্যবহার করে Django application deploy করা modern এবং efficient approach। এই গাইডে আমরা Dockerfile, docker-compose, multi-stage builds, এবং container orchestration নিয়ে বিস্তারিত আলোচনা করব।

## 1. Dockerfile Creation

### Basic Dockerfile

```dockerfile
# Dockerfile

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
```

### Production Dockerfile

```dockerfile
# Dockerfile

FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health/')"

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "myproject.wsgi:application"]
```

---

## 2. docker-compose.yml

### Basic docker-compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  web:
    build: .
    command: gunicorn myproject.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=myproject_db
      - POSTGRES_USER=myproject_user
      - POSTGRES_PASSWORD=myproject_password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Production docker-compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    image: myproject:latest
    container_name: myproject_web
    command: gunicorn myproject.wsgi:application --bind 0.0.0.0:8000 --workers 3
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    expose:
      - 8000
    env_file:
      - .env.production
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app_network

  nginx:
    image: nginx:alpine
    container_name: myproject_nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - static_volume:/app/staticfiles:ro
      - media_volume:/app/media:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - web
    restart: unless-stopped
    networks:
      - app_network

  db:
    image: postgres:15-alpine
    container_name: myproject_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    restart: unless-stopped
    networks:
      - app_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: myproject_redis
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - app_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  celery:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: myproject_celery
    command: celery -A myproject worker -l info
    volumes:
      - .:/app
    env_file:
      - .env.production
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app_network

  celery-beat:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: myproject_celery_beat
    command: celery -A myproject beat -l info
    volumes:
      - .:/app
    env_file:
      - .env.production
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app_network

volumes:
  postgres_data:
  redis_data:
  static_volume:
  media_volume:

networks:
  app_network:
    driver: bridge
```

---

## 3. Multi-Stage Builds

### Optimized Multi-Stage Dockerfile

```dockerfile
# Dockerfile

# Stage 1: Builder
FROM python:3.11-slim as builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy wheels from builder
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .

# Install Python dependencies from wheels
RUN pip install --no-cache /wheels/*

# Copy project
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "myproject.wsgi:application"]
```

### Development vs Production Dockerfile

```dockerfile
# Dockerfile.dev

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

```dockerfile
# Dockerfile.prod

FROM python:3.11-slim as builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache /wheels/*

COPY . .

RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

USER appuser

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "myproject.wsgi:application"]
```

---

## 4. Container Orchestration

### Docker Compose Commands

```bash
# Build images
docker-compose build

# Build without cache
docker-compose build --no-cache

# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f web

# Execute commands in container
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser

# Scale services
docker-compose up -d --scale web=3

# Restart service
docker-compose restart web
```

### Health Checks

```yaml
# docker-compose.yml

services:
  web:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
```

---

## 5. Environment Configuration

### .env File

```bash
# .env

# Django
DEBUG=False
SECRET_KEY=your-super-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database
DB_NAME=myproject_db
DB_USER=myproject_user
DB_PASSWORD=strong_password_here
DB_HOST=db
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/1

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# AWS (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=

# Sentry (optional)
SENTRY_DSN=
```

### Environment-Specific Compose Files

```yaml
# docker-compose.override.yml (development)

version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
    environment:
      - DEBUG=True
    command: python manage.py runserver 0.0.0.0:8000
```

```yaml
# docker-compose.prod.yml (production)

version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    environment:
      - DEBUG=False
```

```bash
# Use specific compose file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 6. Volume Management

### Named Volumes

```yaml
# docker-compose.yml

services:
  web:
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media

  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  static_volume:
  media_volume:
  postgres_data:
```

### Bind Mounts (Development)

```yaml
# docker-compose.yml

services:
  web:
    volumes:
      - .:/app  # Bind mount for live code reloading
      - /app/staticfiles  # Anonymous volume for static files
```

### Volume Backup and Restore

```bash
# Backup volume
docker run --rm \
  -v myproject_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volume
docker run --rm \
  -v myproject_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /data

# List volumes
docker volume ls

# Inspect volume
docker volume inspect myproject_postgres_data

# Remove unused volumes
docker volume prune
```

---

## 7. Database Containers

### PostgreSQL Container

```yaml
# docker-compose.yml

services:
  db:
    image: postgres:15-alpine
    container_name: myproject_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=en_US.UTF-8 --lc-ctype=en_US.UTF-8
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Database Initialization Script

```sql
-- init.sql

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create additional databases (if needed)
CREATE DATABASE test_db;
```

### Database Backup Script

```bash
#!/bin/bash
# backup_db.sh

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="myproject_db"

mkdir -p $BACKUP_DIR

docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

---

## 8. Redis Containers

### Redis Configuration

```yaml
# docker-compose.yml

services:
  redis:
    image: redis:7-alpine
    container_name: myproject_redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    ports:
      - "6379:6379"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

volumes:
  redis_data:
```

### Custom Redis Configuration

```conf
# redis.conf

# Network
bind 0.0.0.0
protected-mode yes
port 6379

# General
daemonize no
supervised no
pidfile /var/run/redis_6379.pid
loglevel notice
logfile ""

# Persistence
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
dbfilename dump.rdb
dir /data

# Append only file
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru
```

---

## Complete Docker Setup

### Project Structure

```
myproject/
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── Dockerfile.dev
├── Dockerfile.prod
├── .env
├── .env.production
├── .dockerignore
├── requirements.txt
├── manage.py
├── myproject/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── nginx/
│   ├── nginx.conf
│   └── ssl/
├── scripts/
│   ├── entrypoint.sh
│   └── backup_db.sh
└── init.sql
```

### .dockerignore

```
# .dockerignore

__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.gitignore
.mypy_cache
.pytest_cache
.hypothesis
*.db
*.sqlite3
db.sqlite3
media/
staticfiles/
.env
.env.*
docker-compose*.yml
Dockerfile*
README.md
.DS_Store
```

### Entrypoint Script

```bash
#!/bin/bash
# scripts/entrypoint.sh

set -e

echo "Waiting for PostgreSQL..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done
echo "PostgreSQL started"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec "$@"
```

### Nginx Configuration for Docker

```nginx
# nginx/nginx.conf

upstream django {
    server web:8000;
}

server {
    listen 80;
    server_name localhost;

    location /static/ {
        alias /app/staticfiles/;
    }

    location /media/ {
        alias /app/media/;
    }

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Deployment Commands

```bash
# Development
docker-compose up -d
docker-compose logs -f

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec web python manage.py migrate

# Create superuser
docker-compose exec web python manage.py createsuperuser

# Collect static files
docker-compose exec web python manage.py collectstatic --noinput

# View logs
docker-compose logs -f web

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

---

## সারসংক্ষেপ

Docker দিয়ে Django application deploy করে portable এবং scalable infrastructure তৈরি করুন:

### Key Components:

1. **Dockerfile**: Multi-stage builds, optimization
2. **docker-compose.yml**: Service orchestration
3. **Multi-Stage Builds**: Smaller image size, faster builds
4. **Container Orchestration**: Health checks, dependencies
5. **Environment Configuration**: .env files, secrets management
6. **Volume Management**: Data persistence, backups
7. **Database Containers**: PostgreSQL with initialization
8. **Redis Containers**: Caching and message broker

Docker deployment আপনার application কে consistent এবং reproducible করে! 🐳🚀
