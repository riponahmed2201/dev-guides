# Multi-tenancy

Multi-tenancy হলো এমন একটি আর্কিটেকচার যেখানে একটি অ্যাপ্লিকেশন ইনস্ট্যান্স একাধিক ক্লায়েন্ট (Tenant) সার্ভ করে। প্রতিটি টেন্যান্টের ডেটা আলাদা এবং সিকিউর থাকে।

## Multi-tenancy Approaches

### 1. Shared Database with Tenant Column
প্রতিটি টেবিলে `tenant_id` কলাম যোগ করা। সহজ কিন্তু স্কেলেবিলিটি লিমিটেড।

### 2. Separate Databases
প্রতিটি টেন্যান্টের জন্য আলাদা ডাটাবেস। সিকিউর কিন্তু ম্যানেজমেন্ট কমপ্লেক্স।

### 3. Schema-based (PostgreSQL)
একই ডাটাবেসে প্রতিটি টেন্যান্টের জন্য আলাদা স্কিমা। **সবচেয়ে জনপ্রিয়।**

## django-tenant-schemas

PostgreSQL এর স্কিমা ফিচার ব্যবহার করে মাল্টি-টেন্যান্সি ইমপ্লিমেন্ট করার জন্য।

**Installation:**
```bash
pip install django-tenant-schemas
```

**Configuration:**
```python
# settings.py
INSTALLED_APPS = [
    'tenant_schemas',
    'customers',  # Your tenant app
    # ...
]

DATABASE_ROUTERS = (
    'tenant_schemas.routers.TenantSyncRouter',
)

TENANT_MODEL = "customers.Client"
TENANT_DOMAIN_MODEL = "customers.Domain"

# Shared apps (সব টেন্যান্টে থাকবে)
SHARED_APPS = (
    'tenant_schemas',
    'customers',
    'django.contrib.contenttypes',
    'django.contrib.auth',
)

# Tenant-specific apps
TENANT_APPS = (
    'django.contrib.admin',
    'myapp',
)
```

## Tenant Model

```python
# customers/models.py
from django.db import models
from tenant_schemas.models import TenantMixin, DomainMixin

class Client(TenantMixin):
    name = models.CharField(max_length=100)
    created_on = models.DateField(auto_now_add=True)
    
    auto_create_schema = True

class Domain(DomainMixin):
    pass
```

## Middleware

```python
# settings.py
MIDDLEWARE = [
    'tenant_schemas.middleware.TenantMiddleware',
    # ... other middleware
]
```

## Creating Tenants

```python
from customers.models import Client, Domain

# Create tenant
tenant = Client(schema_name='client1', name='Client 1')
tenant.save()

# Create domain
domain = Domain()
domain.domain = 'client1.example.com'
domain.tenant = tenant
domain.is_primary = True
domain.save()
```

## Domain Routing

প্রতিটি টেন্যান্টের জন্য সাবডোমেইন:
- `client1.example.com` → Client 1 এর স্কিমা
- `client2.example.com` → Client 2 এর স্কিমা

## Migrations

```bash
# Shared apps এর জন্য
python manage.py migrate_schemas --shared

# সব টেন্যান্টের জন্য
python manage.py migrate_schemas
```

## Accessing Tenant Data

```python
from tenant_schemas.utils import schema_context

with schema_context('client1'):
    # এখন client1 স্কিমায় কাজ করছি
    products = Product.objects.all()
```

## Tenant Isolation

প্রতিটি টেন্যান্টের ডেটা সম্পূর্ণ আলাদা স্কিমায় থাকে, তাই ডেটা লিক হওয়ার সম্ভাবনা কম।
