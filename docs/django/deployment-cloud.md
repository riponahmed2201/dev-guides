# Deployment - Cloud Platforms

Django application বিভিন্ন cloud platforms এ deploy করা যায়। এই গাইডে আমরা AWS, Heroku, DigitalOcean, Google Cloud, Azure, PythonAnywhere, এবং CI/CD pipelines নিয়ে বিস্তারিত আলোচনা করব।

## 1. AWS (Amazon Web Services)

### AWS Elastic Beanstalk

#### Setup এবং Configuration

```bash
# Install EB CLI
pip install awsebcli

# Initialize Elastic Beanstalk
eb init -p python-3.11 myproject

# Create environment
eb create myproject-env

# Deploy
eb deploy

# Open application
eb open

# View logs
eb logs

# SSH into instance
eb ssh
```

#### .ebextensions Configuration

```yaml
# .ebextensions/01_packages.config

packages:
  yum:
    postgresql-devel: []
    git: []
```

```yaml
# .ebextensions/02_python.config

option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: myproject.wsgi:application
  aws:elasticbeanstalk:application:environment:
    DJANGO_SETTINGS_MODULE: myproject.settings.production
    PYTHONPATH: /var/app/current:$PYTHONPATH
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /static: staticfiles
```

```yaml
# .ebextensions/03_django.config

container_commands:
  01_migrate:
    command: "source /var/app/venv/*/bin/activate && python manage.py migrate --noinput"
    leader_only: true
  02_collectstatic:
    command: "source /var/app/venv/*/bin/activate && python manage.py collectstatic --noinput"
  03_createsu:
    command: "source /var/app/venv/*/bin/activate && python manage.py createsu"
    leader_only: true
```

### AWS EC2

#### EC2 Instance Setup

```bash
# Connect to EC2
ssh -i "mykey.pem" ubuntu@ec2-xx-xxx-xxx-xxx.compute.amazonaws.com

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3-pip python3-venv nginx postgresql-client -y

# Clone repository
git clone https://github.com/username/myproject.git
cd myproject

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup Gunicorn and Nginx (same as traditional deployment)
```

### AWS RDS (Database)

```python
# settings/production.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('RDS_DB_NAME'),
        'USER': env('RDS_USERNAME'),
        'PASSWORD': env('RDS_PASSWORD'),
        'HOST': env('RDS_HOSTNAME'),
        'PORT': env('RDS_PORT', default='5432'),
    }
}
```

### AWS S3 (Static and Media Files)

```bash
# Install boto3 and django-storages
pip install boto3 django-storages
```

```python
# settings/production.py

INSTALLED_APPS = [
    # ...
    'storages',
]

# AWS S3 settings
AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = env('AWS_S3_REGION_NAME', default='us-east-1')
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'

# Static files
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# Media files
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# S3 settings
AWS_S3_FILE_OVERWRITE = False
AWS_DEFAULT_ACL = None
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
```

---

## 2. Heroku Deployment

### Heroku Setup

```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create Heroku app
heroku create myproject

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Add Redis
heroku addons:create heroku-redis:mini

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=myproject.herokuapp.com

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser

# Open app
heroku open

# View logs
heroku logs --tail
```

### Heroku Configuration Files

```
# Procfile

web: gunicorn myproject.wsgi --log-file -
release: python manage.py migrate --noinput
```

```
# runtime.txt

python-3.11.7
```

```python
# settings/heroku.py

import dj_database_url

# Database
DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Allowed hosts
ALLOWED_HOSTS = ['.herokuapp.com']

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

```bash
# Install Heroku dependencies
pip install gunicorn dj-database-url whitenoise psycopg2-binary
```

---

## 3. DigitalOcean

### DigitalOcean App Platform

```yaml
# .do/app.yaml

name: myproject
region: nyc

services:
  - name: web
    github:
      repo: username/myproject
      branch: main
      deploy_on_push: true
    
    build_command: |
      pip install -r requirements.txt
      python manage.py collectstatic --noinput
    
    run_command: gunicorn --worker-tmp-dir /dev/shm myproject.wsgi
    
    envs:
      - key: DEBUG
        value: "False"
      - key: SECRET_KEY
        value: ${SECRET_KEY}
        type: SECRET
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
    
    http_port: 8000
    
    instance_count: 1
    instance_size_slug: basic-xxs

databases:
  - name: db
    engine: PG
    version: "15"
    size: db-s-dev-database

static_sites:
  - name: static
    source_dir: staticfiles
    catchall_document: index.html
```

### DigitalOcean Droplet (VPS)

```bash
# Create Droplet (Ubuntu 22.04)
# SSH into droplet
ssh root@your-droplet-ip

# Setup same as traditional deployment
# (Nginx, Gunicorn, PostgreSQL, etc.)
```

---

## 4. Google Cloud Platform

### Google App Engine

```yaml
# app.yaml

runtime: python311
entrypoint: gunicorn -b :$PORT myproject.wsgi:application

env_variables:
  SECRET_KEY: "your-secret-key"
  DEBUG: "False"
  ALLOWED_HOSTS: ".appspot.com"

handlers:
  - url: /static
    static_dir: staticfiles/
  
  - url: /.*
    script: auto
```

```bash
# Install Google Cloud SDK
# Download from: https://cloud.google.com/sdk/docs/install

# Initialize gcloud
gcloud init

# Deploy
gcloud app deploy

# View logs
gcloud app logs tail -s default

# Open app
gcloud app browse
```

### Google Cloud SQL (Database)

```python
# settings/gcp.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': '/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
    }
}
```

### Google Cloud Storage (Static Files)

```bash
pip install django-storages[google]
```

```python
# settings/gcp.py

DEFAULT_FILE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'
STATICFILES_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'

GS_BUCKET_NAME = env('GS_BUCKET_NAME')
GS_PROJECT_ID = env('GS_PROJECT_ID')
GS_CREDENTIALS = service_account.Credentials.from_service_account_file(
    os.path.join(BASE_DIR, 'gcp-credentials.json')
)
```

---

## 5. Azure

### Azure App Service

```bash
# Install Azure CLI
# Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login
az login

# Create resource group
az group create --name myproject-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name myproject-plan \
  --resource-group myproject-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group myproject-rg \
  --plan myproject-plan \
  --name myproject \
  --runtime "PYTHON|3.11"

# Configure deployment
az webapp deployment source config \
  --name myproject \
  --resource-group myproject-rg \
  --repo-url https://github.com/username/myproject \
  --branch main \
  --manual-integration

# Set environment variables
az webapp config appsettings set \
  --resource-group myproject-rg \
  --name myproject \
  --settings SECRET_KEY=your-secret-key DEBUG=False
```

### Azure Database for PostgreSQL

```python
# settings/azure.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('AZURE_DB_NAME'),
        'USER': env('AZURE_DB_USER'),
        'PASSWORD': env('AZURE_DB_PASSWORD'),
        'HOST': env('AZURE_DB_HOST'),
        'PORT': '5432',
        'OPTIONS': {
            'sslmode': 'require',
        }
    }
}
```

---

## 6. PythonAnywhere

### PythonAnywhere Deployment

```bash
# 1. Create account at pythonanywhere.com
# 2. Open Bash console

# Clone repository
git clone https://github.com/username/myproject.git

# Create virtual environment
mkvirtualenv --python=/usr/bin/python3.11 myproject

# Install dependencies
cd myproject
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate
```

### WSGI Configuration

```python
# /var/www/username_pythonanywhere_com_wsgi.py

import os
import sys

# Add project directory to path
path = '/home/username/myproject'
if path not in sys.path:
    sys.path.append(path)

# Set environment variables
os.environ['DJANGO_SETTINGS_MODULE'] = 'myproject.settings.production'

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### Static Files Configuration

```python
# Web tab settings
# Static files:
# URL: /static/
# Directory: /home/username/myproject/staticfiles

# Media files:
# URL: /media/
# Directory: /home/username/myproject/media
```

---

## 7. CI/CD Pipelines

### GitHub Actions

::: v-pre
```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost/test_db
        run: |
          python manage.py test
      
      - name: Run linting
        run: |
          pip install flake8
          flake8 .

  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "myproject"
          heroku_email: "your-email@example.com"
```
:::

### GitLab CI/CD

```yaml
# .gitlab-ci.yml

stages:
  - test
  - deploy

variables:
  POSTGRES_DB: test_db
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres

test:
  stage: test
  image: python:3.11
  
  services:
    - postgres:15
  
  before_script:
    - pip install -r requirements.txt
  
  script:
    - python manage.py test
    - flake8 .
  
  only:
    - main

deploy_production:
  stage: deploy
  image: ruby:latest
  
  before_script:
    - apt-get update -qy
    - apt-get install -y ruby-dev
    - gem install dpl
  
  script:
    - dpl --provider=heroku --app=$HEROKU_APP_NAME --api-key=$HEROKU_API_KEY
  
  only:
    - main
```

### Jenkins Pipeline

```groovy
// Jenkinsfile

pipeline {
    agent any
    
    environment {
        VENV = 'venv'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/username/myproject.git'
            }
        }
        
        stage('Setup') {
            steps {
                sh '''
                    python3 -m venv ${VENV}
                    . ${VENV}/bin/activate
                    pip install -r requirements.txt
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    . ${VENV}/bin/activate
                    python manage.py test
                '''
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    ssh user@server 'cd /var/www/myproject && \
                    git pull origin main && \
                    source venv/bin/activate && \
                    pip install -r requirements.txt && \
                    python manage.py migrate && \
                    python manage.py collectstatic --noinput && \
                    sudo systemctl restart gunicorn'
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
```

### Docker + CI/CD

::: v-pre
```yaml
# .github/workflows/docker-deploy.yml

name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: username/myproject:latest
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/myproject
            docker-compose pull
            docker-compose up -d
```
:::

---

## Platform Comparison

### Feature Comparison

| Platform | Ease of Use | Cost | Scalability | Database | Storage |
|----------|-------------|------|-------------|----------|---------|
| **Heroku** | ⭐⭐⭐⭐⭐ | 💰💰💰 | ⭐⭐⭐⭐ | PostgreSQL | S3 |
| **AWS EB** | ⭐⭐⭐ | 💰💰 | ⭐⭐⭐⭐⭐ | RDS | S3 |
| **DigitalOcean** | ⭐⭐⭐⭐ | 💰💰 | ⭐⭐⭐⭐ | Managed DB | Spaces |
| **GCP** | ⭐⭐⭐ | 💰💰 | ⭐⭐⭐⭐⭐ | Cloud SQL | GCS |
| **Azure** | ⭐⭐⭐ | 💰💰 | ⭐⭐⭐⭐⭐ | Azure DB | Blob |
| **PythonAnywhere** | ⭐⭐⭐⭐⭐ | 💰 | ⭐⭐ | MySQL/Postgres | Local |

### Cost Estimation (Monthly)

```
Heroku (Hobby):
- Dyno: $7
- PostgreSQL: $9
- Total: ~$16/month

AWS (t2.micro):
- EC2: $8.50
- RDS: $15
- S3: $1-5
- Total: ~$25-30/month

DigitalOcean:
- Droplet: $6-12
- Managed DB: $15
- Total: ~$21-27/month

PythonAnywhere:
- Web app: $5
- Total: ~$5/month
```

---

## সারসংক্ষেপ

বিভিন্ন cloud platforms এ Django application deploy করুন:

### Key Platforms:

1. **AWS**: Enterprise-grade, highly scalable
2. **Heroku**: Easy deployment, developer-friendly
3. **DigitalOcean**: Simple, affordable
4. **Google Cloud**: Advanced features, good pricing
5. **Azure**: Microsoft ecosystem integration
6. **PythonAnywhere**: Beginner-friendly, affordable
7. **CI/CD**: Automated testing এবং deployment

আপনার requirements এবং budget অনুযায়ী platform select করুন! ☁️🚀
