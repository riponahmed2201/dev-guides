# Deployment Preparation

Django application কে production এ deploy করার আগে proper preparation অত্যন্ত গুরুত্বপূর্ণ। এই গাইডে আমরা settings management, environment variables, static files, migrations, logging, এবং error reporting নিয়ে বিস্তারিত আলোচনা করব।

## 1. Settings Management (django-environ)

### Install django-environ

```bash
pip install django-environ
```

### Basic Setup

```python
# settings.py

import environ
import os
from pathlib import Path

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environ
env = environ.Env(
    # Default values এবং casting
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, []),
    DATABASE_URL=(str, 'sqlite:///db.sqlite3'),
)

# Read .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Use environment variables
DEBUG = env('DEBUG')
SECRET_KEY = env('SECRET_KEY')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

# Database
DATABASES = {
    'default': env.db()
}
```

### .env File

```bash
# .env (project root)

# Django settings
DEBUG=False
SECRET_KEY=your-super-secret-key-here-min-50-chars
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379/1

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Sentry
SENTRY_DSN=https://your-sentry-dsn
```

### .env.example Template

```bash
# .env.example (commit to git)

# Django settings
DEBUG=True
SECRET_KEY=change-me-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379/1

# AWS (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

# Sentry (optional)
SENTRY_DSN=
```

### Advanced Configuration

```python
# settings.py

import environ

env = environ.Env()
environ.Env.read_env()

# Multiple database support
DATABASES = {
    'default': env.db('DATABASE_URL'),
    'analytics': env.db('ANALYTICS_DATABASE_URL', default='sqlite:///analytics.db'),
}

# Cache configuration
CACHES = {
    'default': env.cache('REDIS_URL'),
}

# Email configuration
EMAIL_CONFIG = env.email_url('EMAIL_URL', default='smtp://localhost:25')
vars().update(EMAIL_CONFIG)

# Search configuration
SEARCH_URL = env.search_url('SEARCH_URL', default='elasticsearch://localhost:9200')
```

---

## 2. Environment Variables

### Separate Settings Files

```python
# settings/base.py

import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env()

# Common settings
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    # ...
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # ...
]

# Templates, static files, etc.
```

```python
# settings/development.py

from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Development-specific settings
INSTALLED_APPS += [
    'debug_toolbar',
    'django_extensions',
]

MIDDLEWARE += [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

INTERNAL_IPS = ['127.0.0.1']
```

```python
# settings/production.py

from .base import *

DEBUG = False

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

DATABASES = {
    'default': env.db()
}

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Static files
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### Using Different Settings

```bash
# Development
python manage.py runserver --settings=myproject.settings.development

# Production
python manage.py runserver --settings=myproject.settings.production

# Or set environment variable
export DJANGO_SETTINGS_MODULE=myproject.settings.production
```

---

## 3. Production Settings

### Complete Production Settings

```python
# settings/production.py

import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = environ.Env()
environ.Env.read_env()

# Security
DEBUG = False
SECRET_KEY = env('SECRET_KEY')
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS')

# Database
DATABASES = {
    'default': env.db(),
}

# HTTPS/SSL
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# HSTS
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Cookies
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'

# Security headers
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
SECURE_REFERRER_POLICY = 'same-origin'

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env.int('EMAIL_PORT', default=587)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', default='noreply@example.com')

# Cache
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': env('REDIS_URL'),
    }
}

# Session
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

# Admin
ADMIN_URL = env('ADMIN_URL', default='admin/')
```

---

## 4. Static Files Collection

### Static Files Configuration

```python
# settings.py

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Static files finders
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]
```

### Collect Static Files

```bash
# Collect all static files to STATIC_ROOT
python manage.py collectstatic --noinput

# Clear existing files before collecting
python manage.py collectstatic --clear --noinput

# Dry run (test without actually copying)
python manage.py collectstatic --dry-run
```

### WhiteNoise for Static Files

```bash
pip install whitenoise
```

```python
# settings.py

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add here
    # Other middleware...
]

# WhiteNoise configuration
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Optional: Compression
WHITENOISE_COMPRESS_OFFLINE = True
```

### AWS S3 for Static Files

```bash
pip install django-storages boto3
```

```python
# settings.py

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
```

---

## 5. Database Migrations

### Pre-Deployment Migration Check

```bash
# Check for unapplied migrations
python manage.py showmigrations

# Check for migration conflicts
python manage.py makemigrations --check --dry-run

# Show SQL for migrations
python manage.py sqlmigrate myapp 0001
```

### Safe Migration Deployment

```bash
# Step 1: Backup database
pg_dump mydb > backup_$(date +%Y%m%d_%H%M%S).sql

# Step 2: Run migrations
python manage.py migrate --noinput

# Step 3: Verify migrations
python manage.py showmigrations
```

### Zero Downtime Migration Strategy

```python
# Step 1: Add nullable field (deploy code)
class Migration(migrations.Migration):
    operations = [
        migrations.AddField(
            model_name='product',
            name='new_field',
            field=models.CharField(max_length=100, null=True),
        ),
    ]

# Step 2: Populate data (run migration)
# Step 3: Make field non-nullable (deploy code)
class Migration(migrations.Migration):
    operations = [
        migrations.AlterField(
            model_name='product',
            name='new_field',
            field=models.CharField(max_length=100),
        ),
    ]
```

### Migration Rollback Plan

```bash
# Rollback to specific migration
python manage.py migrate myapp 0005

# Rollback all migrations for an app
python manage.py migrate myapp zero

# Fake migrations (mark as applied without running)
python manage.py migrate myapp 0005 --fake
```

---

## 6. Log Configuration

### Basic Logging Setup

```python
# settings.py

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'level': 'WARNING',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/django/myapp.log',
            'maxBytes': 1024 * 1024 * 10,  # 10 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'filters': ['require_debug_false'],
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['mail_admins', 'file'],
            'level': 'ERROR',
            'propagate': False,
        },
        'myapp': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

### Application Logging

```python
# myapp/views.py

import logging

logger = logging.getLogger(__name__)

def my_view(request):
    logger.debug('Debug message')
    logger.info('Info message')
    logger.warning('Warning message')
    logger.error('Error message')
    logger.critical('Critical message')
    
    try:
        # Some operation
        result = risky_operation()
    except Exception as e:
        logger.exception('Operation failed')
        raise
    
    return render(request, 'template.html')
```

### Structured Logging (JSON)

```bash
pip install python-json-logger
```

```python
# settings.py

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(name)s %(levelname)s %(message)s',
        },
    },
    'handlers': {
        'json_file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/django/app.json',
            'maxBytes': 1024 * 1024 * 10,
            'backupCount': 5,
            'formatter': 'json',
        },
    },
    'loggers': {
        'myapp': {
            'handlers': ['json_file'],
            'level': 'INFO',
        },
    },
}
```

---

## 7. Error Reporting (Sentry)

### Install Sentry SDK

```bash
pip install sentry-sdk
```

### Basic Sentry Configuration

```python
# settings.py

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn=env('SENTRY_DSN'),
    integrations=[DjangoIntegration()],
    
    # Performance monitoring
    traces_sample_rate=1.0,
    
    # Error sampling
    sample_rate=1.0,
    
    # Environment
    environment=env('ENVIRONMENT', default='production'),
    
    # Release tracking
    release=env('RELEASE_VERSION', default='1.0.0'),
    
    # Send PII (Personally Identifiable Information)
    send_default_pii=False,
)
```

### Advanced Sentry Configuration

```python
# settings.py

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from sentry_sdk.integrations.celery import CeleryIntegration

def before_send(event, hint):
    """
    Filter events before sending to Sentry
    """
    # Ignore specific errors
    if 'exc_info' in hint:
        exc_type, exc_value, tb = hint['exc_info']
        if isinstance(exc_value, KeyboardInterrupt):
            return None
    
    return event

sentry_sdk.init(
    dsn=env('SENTRY_DSN'),
    
    integrations=[
        DjangoIntegration(),
        RedisIntegration(),
        CeleryIntegration(),
    ],
    
    # Sampling
    traces_sample_rate=0.1,  # 10% of transactions
    profiles_sample_rate=0.1,  # 10% profiling
    
    # Environment
    environment=env('ENVIRONMENT'),
    release=env('RELEASE_VERSION'),
    
    # Filtering
    before_send=before_send,
    
    # Additional options
    max_breadcrumbs=50,
    attach_stacktrace=True,
    send_default_pii=False,
)
```

### Custom Error Tracking

```python
# myapp/views.py

import sentry_sdk

def my_view(request):
    try:
        # Operation
        result = process_data()
    except Exception as e:
        # Capture exception with context
        sentry_sdk.capture_exception(e)
        
        # Add extra context
        sentry_sdk.set_context('operation', {
            'user_id': request.user.id,
            'data': 'some_data',
        })
        
        # Add tags
        sentry_sdk.set_tag('operation_type', 'data_processing')
        
        # Add breadcrumb
        sentry_sdk.add_breadcrumb(
            category='operation',
            message='Processing started',
            level='info',
        )
        
        raise
```

---

## Deployment Checklist

### Pre-Deployment Checklist

```bash
# ✅ 1. Environment variables configured
cat .env

# ✅ 2. Dependencies installed
pip install -r requirements.txt

# ✅ 3. Database migrations ready
python manage.py makemigrations --check
python manage.py showmigrations

# ✅ 4. Static files collected
python manage.py collectstatic --noinput

# ✅ 5. Tests passing
python manage.py test

# ✅ 6. Security check
python manage.py check --deploy

# ✅ 7. Database backup
pg_dump mydb > backup.sql

# ✅ 8. Logging configured
tail -f /var/log/django/app.log

# ✅ 9. Sentry configured
# Check Sentry dashboard

# ✅ 10. SSL certificate valid
openssl s_client -connect yourdomain.com:443
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e  # Exit on error

echo "🚀 Starting deployment..."

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# 3. Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# 4. Run migrations
echo "🗄️ Running migrations..."
python manage.py migrate --noinput

# 5. Restart application
echo "🔄 Restarting application..."
sudo systemctl restart gunicorn
sudo systemctl restart nginx

# 6. Health check
echo "🏥 Running health check..."
curl -f http://localhost/health/ || exit 1

echo "✅ Deployment completed successfully!"
```

---

## সারসংক্ষেপ

Django application কে production এ deploy করার জন্য proper preparation করুন:

### Key Points:

1. **Settings Management**: django-environ দিয়ে environment variables manage করুন
2. **Environment Variables**: .env file ব্যবহার করুন, sensitive data protect করুন
3. **Production Settings**: Security headers, HTTPS, secure cookies configure করুন
4. **Static Files**: collectstatic run করুন, WhiteNoise বা S3 ব্যবহার করুন
5. **Database Migrations**: Safe migration strategy follow করুন, backup নিন
6. **Logging**: Proper logging configure করুন, structured logging ব্যবহার করুন
7. **Error Reporting**: Sentry integrate করুন, real-time error tracking করুন

Deployment preparation properly করলে production এ smooth এবং secure deployment হয়! 🚀
