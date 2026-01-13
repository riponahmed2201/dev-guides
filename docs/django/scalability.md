# Scalability

Django application কে scale করে millions of users handle করুন। এই গাইডে আমরা horizontal scaling, load balancing, database replication, caching, CDN, এবং microservices নিয়ে বিস্তারিত আলোচনা করব।

## 1. Horizontal Scaling

### Horizontal vs Vertical Scaling

```
Vertical Scaling (Scale Up):
┌─────────────┐
│  Single     │
│  Server     │
│  (Bigger)   │
└─────────────┘

Horizontal Scaling (Scale Out):
┌────┐ ┌────┐ ┌────┐
│ S1 │ │ S2 │ │ S3 │
└────┘ └────┘ └────┘
```

### Stateless Application Design

```python
# ❌ Bad: Stateful (stores data in memory)
class MyView(View):
    counter = 0  # Shared state - problematic in multi-server setup
    
    def get(self, request):
        self.counter += 1
        return JsonResponse({'count': self.counter})

# ✅ Good: Stateless (uses database/cache)
class MyView(View):
    def get(self, request):
        from django.core.cache import cache
        
        # Increment in cache (shared across servers)
        count = cache.get('counter', 0)
        cache.set('counter', count + 1)
        
        return JsonResponse({'count': count + 1})
```

### Session Management for Scaling

```python
# settings.py

# ❌ Bad: File-based sessions (not shared across servers)
SESSION_ENGINE = 'django.contrib.sessions.backends.file'

# ✅ Good: Database sessions
SESSION_ENGINE = 'django.contrib.sessions.backends.db'

# ✅ Better: Cache sessions (faster)
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'

# ✅ Best: Cached database sessions (fallback)
SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'
```

---

## 2. Load Balancing

### Nginx Load Balancer

```nginx
# /etc/nginx/nginx.conf

upstream django_servers {
    # Load balancing methods:
    
    # Round Robin (default)
    server 192.168.1.10:8000;
    server 192.168.1.11:8000;
    server 192.168.1.12:8000;
    
    # Least connections
    # least_conn;
    
    # IP Hash (sticky sessions)
    # ip_hash;
    
    # Weight-based
    # server 192.168.1.10:8000 weight=3;
    # server 192.168.1.11:8000 weight=2;
    # server 192.168.1.12:8000 weight=1;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://django_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### HAProxy Load Balancer

```conf
# /etc/haproxy/haproxy.cfg

global
    log /dev/log local0
    maxconn 4096

defaults
    log global
    mode http
    option httplog
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend http_front
    bind *:80
    default_backend django_servers

backend django_servers
    balance roundrobin
    option httpchk GET /health/
    
    server server1 192.168.1.10:8000 check
    server server2 192.168.1.11:8000 check
    server server3 192.168.1.12:8000 check
```

### Health Check Endpoint

```python
# myapp/views.py

from django.http import JsonResponse
from django.db import connection

def health_check(request):
    """Health check endpoint for load balancer"""
    
    # Check database connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_status = "ok"
    except Exception as e:
        db_status = "error"
    
    # Check cache
    try:
        from django.core.cache import cache
        cache.set('health_check', 'ok', 10)
        cache_status = "ok" if cache.get('health_check') == 'ok' else "error"
    except Exception:
        cache_status = "error"
    
    status = "healthy" if db_status == "ok" and cache_status == "ok" else "unhealthy"
    
    return JsonResponse({
        'status': status,
        'database': db_status,
        'cache': cache_status,
    })
```

---

## 3. Database Replication

### PostgreSQL Master-Slave Replication

```python
# settings.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'USER': 'myuser',
        'PASSWORD': 'mypassword',
        'HOST': 'master-db.example.com',
        'PORT': '5432',
    },
    'replica': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'USER': 'myuser',
        'PASSWORD': 'mypassword',
        'HOST': 'replica-db.example.com',
        'PORT': '5432',
    }
}
```

### Database Router

```python
# myapp/db_router.py

class PrimaryReplicaRouter:
    """
    Database router for read/write splitting
    """
    
    def db_for_read(self, model, **hints):
        """
        Read queries go to replica
        """
        return 'replica'
    
    def db_for_write(self, model, **hints):
        """
        Write queries go to primary
        """
        return 'default'
    
    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations between objects
        """
        return True
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Migrations only on primary
        """
        return db == 'default'
```

```python
# settings.py

DATABASE_ROUTERS = ['myapp.db_router.PrimaryReplicaRouter']
```

---

## 4. Read Replicas

### Multiple Read Replicas

```python
# settings.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'HOST': 'master.example.com',
    },
    'replica1': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'HOST': 'replica1.example.com',
    },
    'replica2': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'HOST': 'replica2.example.com',
    },
}
```

### Smart Router with Load Distribution

```python
# myapp/db_router.py

import random

class SmartReplicaRouter:
    """
    Distribute reads across multiple replicas
    """
    
    def db_for_read(self, model, **hints):
        """
        Randomly select a replica for read queries
        """
        replicas = ['replica1', 'replica2']
        return random.choice(replicas)
    
    def db_for_write(self, model, **hints):
        """
        All writes go to primary
        """
        return 'default'
    
    def allow_relation(self, obj1, obj2, **hints):
        return True
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return db == 'default'
```

### Manual Database Selection

```python
# views.py

from django.db import connections

def my_view(request):
    # Force read from primary (for consistency)
    products = Product.objects.using('default').all()
    
    # Read from specific replica
    products = Product.objects.using('replica1').all()
    
    # Write to primary
    product = Product(name='New Product')
    product.save(using='default')
    
    return render(request, 'template.html', {'products': products})
```

---

## 5. Sharding Strategies

### Horizontal Sharding (by User ID)

```python
# settings.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'users_shard_0',
        'HOST': 'shard0.example.com',
    },
    'shard1': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'users_shard_1',
        'HOST': 'shard1.example.com',
    },
    'shard2': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'users_shard_2',
        'HOST': 'shard2.example.com',
    },
}
```

### Shard Router

```python
# myapp/shard_router.py

class UserShardRouter:
    """
    Shard users across multiple databases
    """
    
    def _get_shard(self, user_id):
        """
        Determine shard based on user ID
        """
        num_shards = 3
        shard_num = user_id % num_shards
        
        if shard_num == 0:
            return 'default'
        else:
            return f'shard{shard_num}'
    
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'users':
            if 'instance' in hints:
                user_id = hints['instance'].id
                return self._get_shard(user_id)
        return 'default'
    
    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'users':
            if 'instance' in hints:
                user_id = hints['instance'].id
                return self._get_shard(user_id)
        return 'default'
    
    def allow_relation(self, obj1, obj2, **hints):
        return True
    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return True
```

### Shard Manager

```python
# myapp/managers.py

from django.db import models

class ShardedManager(models.Manager):
    """
    Manager for sharded models
    """
    
    def get_by_user_id(self, user_id):
        """
        Get object from correct shard
        """
        shard = self._get_shard(user_id)
        return self.using(shard).filter(user_id=user_id)
    
    def _get_shard(self, user_id):
        num_shards = 3
        shard_num = user_id % num_shards
        return 'default' if shard_num == 0 else f'shard{shard_num}'
```

---

## 6. Caching Layers

### Multi-Level Caching

```python
# settings.py

CACHES = {
    # L1: Local memory cache (fastest)
    'local': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'OPTIONS': {
            'MAX_ENTRIES': 1000,
        }
    },
    
    # L2: Redis cache (shared)
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    },
}
```

### Cache Strategy Implementation

```python
# myapp/cache.py

from django.core.cache import caches
from functools import wraps

def multi_level_cache(timeout=300):
    """
    Multi-level caching decorator
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{args}:{kwargs}"
            
            # Try L1 cache (local memory)
            local_cache = caches['local']
            result = local_cache.get(cache_key)
            if result is not None:
                return result
            
            # Try L2 cache (Redis)
            redis_cache = caches['default']
            result = redis_cache.get(cache_key)
            if result is not None:
                # Store in L1 for next time
                local_cache.set(cache_key, result, timeout)
                return result
            
            # Execute function
            result = func(*args, **kwargs)
            
            # Store in both caches
            local_cache.set(cache_key, result, timeout)
            redis_cache.set(cache_key, result, timeout)
            
            return result
        
        return wrapper
    return decorator

# Usage
@multi_level_cache(timeout=600)
def get_popular_products():
    return Product.objects.filter(featured=True)[:10]
```

### Cache Warming

```python
# myapp/management/commands/warm_cache.py

from django.core.management.base import BaseCommand
from django.core.cache import cache
from myapp.models import Product, Category

class Command(BaseCommand):
    help = 'Warm up cache with frequently accessed data'
    
    def handle(self, *args, **options):
        self.stdout.write('Warming cache...')
        
        # Cache popular products
        products = Product.objects.filter(featured=True)[:100]
        cache.set('featured_products', list(products), 3600)
        
        # Cache categories
        categories = Category.objects.all()
        cache.set('all_categories', list(categories), 3600)
        
        self.stdout.write(self.style.SUCCESS('Cache warmed successfully'))
```

---

## 7. CDN Integration

### CloudFlare CDN

```python
# settings.py

# Static files via CDN
STATIC_URL = 'https://cdn.example.com/static/'

# Media files via CDN
MEDIA_URL = 'https://cdn.example.com/media/'
```

### AWS CloudFront

```python
# settings.py

AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_CLOUDFRONT_DOMAIN = 'dxxxxxxxxxxxxx.cloudfront.net'

# Use CloudFront for static files
STATIC_URL = f'https://{AWS_CLOUDFRONT_DOMAIN}/static/'
MEDIA_URL = f'https://{AWS_CLOUDFRONT_DOMAIN}/media/'
```

### Cache Headers for CDN

```python
# middleware/cdn_cache.py

class CDNCacheMiddleware:
    """
    Add cache headers for CDN
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Static files: long cache
        if request.path.startswith('/static/'):
            response['Cache-Control'] = 'public, max-age=31536000, immutable'
        
        # API responses: short cache
        elif request.path.startswith('/api/'):
            response['Cache-Control'] = 'public, max-age=300'
        
        # HTML pages: no cache
        else:
            response['Cache-Control'] = 'no-cache, must-revalidate'
        
        return response
```

---

## 8. Microservices with Django

### Service Architecture

```
┌─────────────────┐
│   API Gateway   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ User  │ │Product│
│Service│ │Service│
└───┬───┘ └──┬────┘
    │        │
┌───▼───┐ ┌──▼────┐
│User DB│ │Prod DB│
└───────┘ └───────┘
```

### Service Communication (REST)

```python
# user_service/views.py

import requests
from django.http import JsonResponse

def get_user_with_orders(request, user_id):
    """
    User service calls Order service
    """
    # Get user from local database
    user = User.objects.get(id=user_id)
    
    # Call Order service via REST API
    order_service_url = 'http://order-service:8001/api/orders/'
    response = requests.get(
        order_service_url,
        params={'user_id': user_id},
        timeout=5
    )
    
    orders = response.json() if response.status_code == 200 else []
    
    return JsonResponse({
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
        },
        'orders': orders
    })
```

### Service Communication (Message Queue)

```python
# Install: pip install celery redis

# user_service/tasks.py

from celery import Celery

app = Celery('user_service', broker='redis://localhost:6379/0')

@app.task
def notify_order_service(user_id, event_type):
    """
    Send event to order service
    """
    # Publish event to message queue
    app.send_task(
        'order_service.tasks.handle_user_event',
        args=[user_id, event_type]
    )
```

```python
# order_service/tasks.py

from celery import Celery

app = Celery('order_service', broker='redis://localhost:6379/0')

@app.task
def handle_user_event(user_id, event_type):
    """
    Handle user events from user service
    """
    if event_type == 'user_deleted':
        # Archive or delete user's orders
        Order.objects.filter(user_id=user_id).update(archived=True)
```

### API Gateway Pattern

```python
# api_gateway/views.py

import requests
from django.http import JsonResponse

class APIGateway:
    """
    Single entry point for all services
    """
    
    SERVICES = {
        'users': 'http://user-service:8001',
        'products': 'http://product-service:8002',
        'orders': 'http://order-service:8003',
    }
    
    def route_request(self, request, service, path):
        """
        Route request to appropriate service
        """
        service_url = self.SERVICES.get(service)
        
        if not service_url:
            return JsonResponse({'error': 'Service not found'}, status=404)
        
        url = f"{service_url}{path}"
        
        # Forward request
        response = requests.request(
            method=request.method,
            url=url,
            headers=self._get_headers(request),
            data=request.body,
            timeout=10
        )
        
        return JsonResponse(response.json(), status=response.status_code)
    
    def _get_headers(self, request):
        """
        Extract relevant headers
        """
        return {
            'Authorization': request.headers.get('Authorization', ''),
            'Content-Type': request.headers.get('Content-Type', 'application/json'),
        }
```

---

## Scalability Checklist

### Application Level

```python
# ✅ Stateless design
# ✅ Session in cache/database
# ✅ No file-based storage
# ✅ Asynchronous tasks (Celery)
# ✅ Efficient queries (select_related, prefetch_related)
# ✅ Database connection pooling
```

### Infrastructure Level

```bash
# ✅ Load balancer configured
# ✅ Multiple application servers
# ✅ Database replication
# ✅ Read replicas
# ✅ Redis cluster
# ✅ CDN for static files
# ✅ Auto-scaling enabled
```

### Monitoring

```python
# settings.py

# Application Performance Monitoring
INSTALLED_APPS += ['django_prometheus']

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    # Other middleware...
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]

# Metrics endpoint: /metrics
```

---

## সারসংক্ষেপ

Django application কে scale করে millions of users handle করুন:

### Key Strategies:

1. **Horizontal Scaling**: Multiple servers, stateless design
2. **Load Balancing**: Nginx/HAProxy, health checks
3. **Database Replication**: Master-slave, read/write splitting
4. **Read Replicas**: Multiple replicas, load distribution
5. **Sharding**: Horizontal partitioning, shard routing
6. **Caching Layers**: Multi-level caching, cache warming
7. **CDN Integration**: Static files, cache headers
8. **Microservices**: Service separation, API gateway

Scalability একটি journey - continuously monitor এবং optimize করুন! 🚀📈
