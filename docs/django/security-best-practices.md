# Security Best Practices

Django একটি secure-by-default framework যা বিভিন্ন security threats থেকে protection প্রদান করে। এই গাইডে আমরা Django এর সকল security features এবং best practices নিয়ে বিস্তারিত আলোচনা করব।

## 1. CSRF Protection (Cross-Site Request Forgery)

### CSRF কী?

CSRF হলো একটি attack যেখানে attacker একজন authenticated user এর browser ব্যবহার করে unauthorized requests পাঠায়।

### Django এ CSRF Protection

Django automatically CSRF protection প্রদান করে middleware এর মাধ্যমে।

#### Settings Configuration

```python
# settings.py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',  # CSRF middleware
    # অন্যান্য middleware...
]

# CSRF settings
CSRF_COOKIE_SECURE = True  # Production এ True রাখুন
CSRF_COOKIE_HTTPONLY = True  # JavaScript থেকে access prevent করে
CSRF_COOKIE_SAMESITE = 'Strict'  # Cross-site requests block করে
CSRF_TRUSTED_ORIGINS = [
    'https://yourdomain.com',
    'https://api.yourdomain.com',
]
```

#### Template এ CSRF Token ব্যবহার

```html
<!-- forms.html -->
<form method="post">
    {% csrf_token %}
    <input type="text" name="username">
    <input type="password" name="password">
    <button type="submit">Login</button>
</form>
```

#### AJAX Requests এ CSRF Token

```javascript
// CSRF token get করা
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// Fetch API এ ব্যবহার
fetch('/api/endpoint/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({data: 'value'})
});

// jQuery এ ব্যবহার
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
```

#### API Views এ CSRF Exemption

```python
# views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

# সাবধান: শুধুমাত্র public API endpoints এ ব্যবহার করুন
@csrf_exempt
def public_api_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'error': 'Method not allowed'}, status=405)

# Better approach: Token-based authentication ব্যবহার করুন
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def secure_api_view(request):
    # Token authentication automatically CSRF থেকে protect করে
    return JsonResponse({'status': 'success'})
```

---

## 2. XSS Prevention (Cross-Site Scripting)

### XSS কী?

XSS attack এ attacker malicious scripts inject করে যা user এর browser এ execute হয়।

### Django এর Auto-Escaping

Django templates automatically HTML escape করে:

```html
<!-- template.html -->
<!-- Automatic escaping -->
<p>{{ user_input }}</p>
<!-- যদি user_input = "<script>alert('XSS')</script>" হয়,
     তাহলে output হবে: &lt;script&gt;alert('XSS')&lt;/script&gt; -->

<!-- Manual escaping disable করা (সাবধান!) -->
<p>{{ user_input|safe }}</p>

<!-- Specific escaping -->
<p>{{ user_input|escape }}</p>
```

#### Custom Template Filters এ Escaping

```python
# templatetags/custom_filters.py
from django import template
from django.utils.html import escape, format_html
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def custom_format(value):
    # সবসময় escape করুন
    escaped_value = escape(value)
    return format_html('<strong>{}</strong>', escaped_value)

@register.filter
def highlight_search(text, search_term):
    # Dangerous - XSS vulnerable
    # return text.replace(search_term, f'<mark>{search_term}</mark>')
    
    # Safe approach
    escaped_text = escape(text)
    escaped_term = escape(search_term)
    highlighted = escaped_text.replace(
        escaped_term, 
        format_html('<mark>{}</mark>', escaped_term)
    )
    return mark_safe(highlighted)
```

#### JavaScript Context এ Data Passing

```html
<!-- template.html -->
<script>
    // Unsafe - XSS vulnerable
    // var username = "{{ username }}";
    
    // Safe approach - JSON encoding
    var userData = {{ user_data|json_script:"user-data" }};
    var parsedData = JSON.parse(document.getElementById('user-data').textContent);
</script>

<!-- অথবা -->
<script>
    var username = {{ username|json_script:"username-data" }};
</script>
```

#### Views এ Safe HTML Generation

```python
# views.py
from django.utils.html import escape, format_html
from django.utils.safestring import mark_safe

def generate_safe_html(request):
    user_input = request.GET.get('input', '')
    
    # Unsafe
    # html = f'<div>{user_input}</div>'
    
    # Safe
    html = format_html('<div>{}</div>', user_input)
    
    # Multiple values
    html = format_html(
        '<div class="{}">{}</div>',
        'user-content',
        user_input
    )
    
    return render(request, 'template.html', {'safe_html': html})
```

---

## 3. SQL Injection Prevention

### SQL Injection কী?

SQL Injection এ attacker malicious SQL code inject করে database compromise করার চেষ্টা করে।

### Django ORM - Built-in Protection

Django ORM automatically SQL injection থেকে protect করে:

```python
# views.py
from django.shortcuts import render
from .models import User

def search_users(request):
    search_term = request.GET.get('q', '')
    
    # ✅ Safe - ORM parameterized queries ব্যবহার করে
    users = User.objects.filter(username__icontains=search_term)
    
    # ✅ Safe - Q objects
    from django.db.models import Q
    users = User.objects.filter(
        Q(username__icontains=search_term) | 
        Q(email__icontains=search_term)
    )
    
    # ✅ Safe - Extra filters
    users = User.objects.filter(
        username__icontains=search_term
    ).extra(
        where=['age > %s'],
        params=[18]
    )
    
    return render(request, 'users.html', {'users': users})
```

### Raw SQL Queries - সাবধানতা

```python
# models.py
from django.db import connection

def unsafe_query(user_input):
    # ❌ DANGEROUS - SQL Injection vulnerable
    # query = f"SELECT * FROM users WHERE username = '{user_input}'"
    # cursor.execute(query)
    
    # ✅ Safe - Parameterized query
    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM users WHERE username = %s",
            [user_input]
        )
        results = cursor.fetchall()
    return results

def complex_query(status, min_age):
    # ✅ Safe - Multiple parameters
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT u.*, p.* 
            FROM users u 
            JOIN profiles p ON u.id = p.user_id 
            WHERE u.status = %s AND u.age >= %s
            """,
            [status, min_age]
        )
        results = cursor.fetchall()
    return results
```

### Raw Queries এ Extra Validation

```python
# utils/validators.py
import re
from django.core.exceptions import ValidationError

def validate_table_name(table_name):
    """শুধুমাত্র alphanumeric এবং underscore allow করে"""
    if not re.match(r'^[a-zA-Z0-9_]+$', table_name):
        raise ValidationError('Invalid table name')
    
    # Whitelist approach
    allowed_tables = ['users', 'products', 'orders']
    if table_name not in allowed_tables:
        raise ValidationError('Table not allowed')
    
    return table_name

def dynamic_table_query(table_name, user_id):
    # Validate করুন
    table_name = validate_table_name(table_name)
    
    # এখন safe
    query = f"SELECT * FROM {table_name} WHERE user_id = %s"
    with connection.cursor() as cursor:
        cursor.execute(query, [user_id])
        return cursor.fetchall()
```

---

## 4. Clickjacking Protection

### Clickjacking কী?

Clickjacking এ attacker একটি invisible iframe এ আপনার site load করে users কে trick করে।

### X-Frame-Options Header

```python
# settings.py

# Option 1: সম্পূর্ণভাবে iframe block করুন
X_FRAME_OPTIONS = 'DENY'

# Option 2: শুধুমাত্র same origin allow করুন
X_FRAME_OPTIONS = 'SAMEORIGIN'

# Middleware enable করুন
MIDDLEWARE = [
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # অন্যান্য middleware...
]
```

### Per-View Configuration

```python
# views.py
from django.views.decorators.clickjacking import (
    xframe_options_deny,
    xframe_options_sameorigin,
    xframe_options_exempt
)

@xframe_options_deny
def sensitive_view(request):
    """এই view কখনো iframe এ load হবে না"""
    return render(request, 'sensitive.html')

@xframe_options_sameorigin
def dashboard_view(request):
    """শুধুমাত্র same origin এ iframe allow"""
    return render(request, 'dashboard.html')

@xframe_options_exempt
def embeddable_view(request):
    """এই view সব জায়গায় embed করা যাবে"""
    return render(request, 'widget.html')
```

### Content Security Policy (CSP) দিয়ে Advanced Protection

```python
# settings.py

# django-csp package install করুন
# pip install django-csp

MIDDLEWARE = [
    'csp.middleware.CSPMiddleware',
    # অন্যান্য middleware...
]

# CSP Configuration
CSP_DEFAULT_SRC = ("'self'",)
CSP_FRAME_ANCESTORS = ("'self'",)  # Clickjacking protection
CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'", "https://cdn.example.com")
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'")
CSP_IMG_SRC = ("'self'", "data:", "https:")
CSP_FONT_SRC = ("'self'", "https://fonts.gstatic.com")
```

---

## 5. HTTPS Enforcement

### Production এ HTTPS বাধ্যতামূলক করা

```python
# settings.py

# HTTPS settings
SECURE_SSL_REDIRECT = True  # সব HTTP requests কে HTTPS এ redirect করে
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# HSTS (HTTP Strict Transport Security)
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Session এবং CSRF cookies secure করুন
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Referrer Policy
SECURE_REFERRER_POLICY = 'same-origin'
```

### Development এ Conditional Settings

```python
# settings.py
import os

DEBUG = os.environ.get('DEBUG', 'False') == 'True'

if not DEBUG:
    # Production security settings
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
else:
    # Development settings
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/mysite
server {
    listen 80;
    server_name example.com www.example.com;
    
    # HTTP থেকে HTTPS এ redirect
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL Certificate
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # HSTS Header
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Host $host;
    }
}
```

---

## 6. Security Middleware

### Django এর Built-in Security Middleware

```python
# settings.py

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',  # Security headers
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Security Middleware Settings
SECURE_CONTENT_TYPE_NOSNIFF = True  # X-Content-Type-Options: nosniff
SECURE_BROWSER_XSS_FILTER = True    # X-XSS-Protection: 1; mode=block
```

### Custom Security Middleware

```python
# middleware/security.py
import logging
from django.http import HttpResponseForbidden
from django.core.cache import cache

logger = logging.getLogger(__name__)

class RateLimitMiddleware:
    """Simple rate limiting middleware"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Rate limiting logic
        ip_address = self.get_client_ip(request)
        cache_key = f'rate_limit_{ip_address}'
        
        request_count = cache.get(cache_key, 0)
        
        if request_count > 100:  # 100 requests per minute
            logger.warning(f'Rate limit exceeded for IP: {ip_address}')
            return HttpResponseForbidden('Rate limit exceeded')
        
        cache.set(cache_key, request_count + 1, 60)  # 60 seconds
        
        response = self.get_response(request)
        return response
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SecurityHeadersMiddleware:
    """Additional security headers"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Additional security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'same-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        return response


class RequestLoggingMiddleware:
    """Log suspicious requests"""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Suspicious patterns check
        suspicious_patterns = [
            '../', '..\\',  # Path traversal
            '<script', 'javascript:',  # XSS attempts
            'union select', 'drop table',  # SQL injection
        ]
        
        request_data = str(request.GET) + str(request.POST) + request.path
        
        for pattern in suspicious_patterns:
            if pattern.lower() in request_data.lower():
                logger.warning(
                    f'Suspicious request detected: {pattern} '
                    f'from IP: {request.META.get("REMOTE_ADDR")} '
                    f'Path: {request.path}'
                )
        
        response = self.get_response(request)
        return response
```

### Middleware Registration

```python
# settings.py

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'middleware.security.RateLimitMiddleware',  # Custom
    'middleware.security.SecurityHeadersMiddleware',  # Custom
    'middleware.security.RequestLoggingMiddleware',  # Custom
    # অন্যান্য middleware...
]
```

---

## 7. Secure Cookies

### Cookie Security Settings

```python
# settings.py

# Session Cookie Settings
SESSION_COOKIE_SECURE = True  # শুধুমাত্র HTTPS এ send হবে
SESSION_COOKIE_HTTPONLY = True  # JavaScript থেকে access prevent
SESSION_COOKIE_SAMESITE = 'Strict'  # CSRF protection
SESSION_COOKIE_AGE = 3600  # 1 hour (seconds)
SESSION_COOKIE_NAME = 'sessionid'  # Default name change করুন
SESSION_COOKIE_PATH = '/'
SESSION_COOKIE_DOMAIN = None  # Specific domain set করুন

# CSRF Cookie Settings
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True  # AJAX এ সমস্যা হতে পারে
CSRF_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_COOKIE_AGE = 31449600  # 1 year

# Session Engine
SESSION_ENGINE = 'django.contrib.sessions.backends.db'  # Database-backed
# অথবা
# SESSION_ENGINE = 'django.contrib.sessions.backends.cache'  # Cache-backed
# অথবা
# SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'  # Hybrid
```

### Custom Cookie Handling

```python
# views.py
from django.http import HttpResponse
from datetime import datetime, timedelta

def set_secure_cookie(request):
    response = HttpResponse('Cookie set')
    
    # Secure cookie set করা
    response.set_cookie(
        key='user_preference',
        value='dark_mode',
        max_age=86400,  # 1 day
        secure=True,  # HTTPS only
        httponly=True,  # JavaScript access prevent
        samesite='Strict',  # CSRF protection
        domain='.example.com',  # Subdomain access
    )
    
    return response

def set_signed_cookie(request):
    """Tamper-proof cookie"""
    response = HttpResponse('Signed cookie set')
    
    # Signed cookie - tampering detect করবে
    response.set_signed_cookie(
        key='user_id',
        value=request.user.id,
        salt='my-secret-salt',
        max_age=3600,
        secure=True,
        httponly=True,
    )
    
    return response

def read_signed_cookie(request):
    """Signed cookie read করা"""
    try:
        user_id = request.get_signed_cookie(
            'user_id',
            salt='my-secret-salt',
            default=None
        )
        return HttpResponse(f'User ID: {user_id}')
    except:
        return HttpResponse('Invalid or tampered cookie', status=400)

def delete_cookie(request):
    """Cookie delete করা"""
    response = HttpResponse('Cookie deleted')
    response.delete_cookie('user_preference')
    return response
```

### Session Security

```python
# views.py
from django.contrib.auth import login, logout

def secure_login(request):
    if request.method == 'POST':
        # User authenticate করুন
        user = authenticate(
            username=request.POST['username'],
            password=request.POST['password']
        )
        
        if user:
            # Login করুন
            login(request, user)
            
            # Session key regenerate করুন (session fixation prevent)
            request.session.cycle_key()
            
            # Session data set করুন
            request.session['login_time'] = str(datetime.now())
            request.session['ip_address'] = request.META.get('REMOTE_ADDR')
            
            # Session expiry set করুন
            request.session.set_expiry(3600)  # 1 hour
            
            return redirect('dashboard')
    
    return render(request, 'login.html')

def check_session_security(request):
    """Session hijacking check করুন"""
    if request.user.is_authenticated:
        # IP address verify করুন
        stored_ip = request.session.get('ip_address')
        current_ip = request.META.get('REMOTE_ADDR')
        
        if stored_ip and stored_ip != current_ip:
            # Possible session hijacking
            logout(request)
            return redirect('login')
    
    return render(request, 'dashboard.html')
```

---

## 8. Content Security Policy (CSP)

### CSP কী?

Content Security Policy একটি HTTP header যা browser কে বলে কোন resources load করা safe।

### Django CSP Configuration

```python
# settings.py
# pip install django-csp

MIDDLEWARE = [
    'csp.middleware.CSPMiddleware',
    # অন্যান্য middleware...
]

# Basic CSP Configuration
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = (
    "'self'",
    "'unsafe-inline'",  # Inline scripts (avoid if possible)
    "'unsafe-eval'",    # eval() (avoid if possible)
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com",
)
CSP_STYLE_SRC = (
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
)
CSP_IMG_SRC = (
    "'self'",
    "data:",
    "https:",
    "blob:",
)
CSP_FONT_SRC = (
    "'self'",
    "https://fonts.gstatic.com",
)
CSP_CONNECT_SRC = (
    "'self'",
    "https://api.example.com",
)
CSP_FRAME_SRC = ("'self'",)
CSP_FRAME_ANCESTORS = ("'self'",)  # Clickjacking protection
CSP_OBJECT_SRC = ("'none'",)
CSP_BASE_URI = ("'self'",)
CSP_FORM_ACTION = ("'self'",)

# Report violations
CSP_REPORT_URI = '/csp-report/'
CSP_REPORT_ONLY = False  # True করলে শুধু report করবে, block করবে না
```

### Nonce-based CSP (More Secure)

```python
# settings.py
CSP_INCLUDE_NONCE_IN = ['script-src', 'style-src']

# views.py
from django.shortcuts import render

def my_view(request):
    # Template এ nonce available হবে
    return render(request, 'template.html')
```

```html
<!-- template.html -->
<!DOCTYPE html>
<html>
<head>
    <!-- Nonce ব্যবহার করে inline script -->
    <script nonce="{{ request.csp_nonce }}">
        console.log('This script is allowed');
    </script>
    
    <!-- Nonce ব্যবহার করে inline style -->
    <style nonce="{{ request.csp_nonce }}">
        body { background: #fff; }
    </style>
</head>
<body>
    <h1>Secure Page</h1>
</body>
</html>
```

### CSP Violation Reporting

```python
# views.py
import json
import logging
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

logger = logging.getLogger(__name__)

@csrf_exempt
@require_POST
def csp_report(request):
    """CSP violation reports receive করুন"""
    try:
        report = json.loads(request.body)
        csp_report = report.get('csp-report', {})
        
        logger.warning(
            f'CSP Violation: '
            f'Blocked URI: {csp_report.get("blocked-uri")} '
            f'Violated Directive: {csp_report.get("violated-directive")} '
            f'Document URI: {csp_report.get("document-uri")}'
        )
        
        # Database এ save করতে পারেন
        # CSPViolation.objects.create(...)
        
    except Exception as e:
        logger.error(f'Error processing CSP report: {e}')
    
    return HttpResponse(status=204)

# urls.py
urlpatterns = [
    path('csp-report/', csp_report, name='csp_report'),
]
```

---

## 9. Security Checklist

### Deployment Checklist

```python
# settings.py - Production Security Checklist

# ✅ 1. DEBUG Mode
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# ✅ 2. Secret Key
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
# Generate করুন: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# ✅ 3. Database Security
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',  # SSL connection
        },
    }
}

# ✅ 4. HTTPS Settings
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# ✅ 5. Cookie Security
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'

# ✅ 6. Security Headers
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
SECURE_REFERRER_POLICY = 'same-origin'

# ✅ 7. Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 12}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ✅ 8. Admin Security
ADMIN_URL = os.environ.get('ADMIN_URL', 'admin/')  # Change default 'admin/'

# ✅ 9. File Upload Security
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
FILE_UPLOAD_PERMISSIONS = 0o644

# ✅ 10. Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/security.log',
        },
    },
    'loggers': {
        'django.security': {
            'handlers': ['file'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}

# ✅ 11. CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
]

# ✅ 12. CORS (if using django-cors-headers)
CORS_ALLOWED_ORIGINS = [
    'https://yourdomain.com',
]
CORS_ALLOW_CREDENTIALS = True

# ✅ 13. Rate Limiting (if using django-ratelimit)
RATELIMIT_ENABLE = True
RATELIMIT_USE_CACHE = 'default'
```

### Security Testing Commands

```bash
# Django security check
python manage.py check --deploy

# Check for common security issues
python manage.py check --tag security

# Test SSL/TLS configuration
openssl s_client -connect yourdomain.com:443 -tls1_2

# Check security headers
curl -I https://yourdomain.com

# Scan for vulnerabilities (using safety)
pip install safety
safety check

# Check dependencies
pip list --outdated
```

### Manual Security Tests

```python
# tests/test_security.py
from django.test import TestCase, Client
from django.urls import reverse

class SecurityTests(TestCase):
    
    def setUp(self):
        self.client = Client()
    
    def test_csrf_protection(self):
        """CSRF protection test"""
        response = self.client.post(reverse('login'), {
            'username': 'test',
            'password': 'test123'
        })
        # CSRF token ছাড়া 403 হওয়া উচিত
        self.assertEqual(response.status_code, 403)
    
    def test_xss_protection(self):
        """XSS protection test"""
        malicious_input = '<script>alert("XSS")</script>'
        response = self.client.get(
            reverse('search'),
            {'q': malicious_input}
        )
        # Script tag escaped হওয়া উচিত
        self.assertNotContains(response, '<script>')
        self.assertContains(response, '&lt;script&gt;')
    
    def test_sql_injection_protection(self):
        """SQL injection protection test"""
        malicious_input = "' OR '1'='1"
        response = self.client.get(
            reverse('user_detail'),
            {'id': malicious_input}
        )
        # Error না দিয়ে safely handle করা উচিত
        self.assertIn(response.status_code, [200, 404])
    
    def test_security_headers(self):
        """Security headers test"""
        response = self.client.get('/')
        
        self.assertEqual(
            response.get('X-Content-Type-Options'),
            'nosniff'
        )
        self.assertEqual(
            response.get('X-Frame-Options'),
            'DENY'
        )
        self.assertIn(
            'Strict-Transport-Security',
            response
        )
    
    def test_https_redirect(self):
        """HTTPS redirect test"""
        # শুধুমাত্র production এ test করুন
        if not settings.DEBUG:
            response = self.client.get('/', secure=False)
            self.assertEqual(response.status_code, 301)
            self.assertTrue(
                response.url.startswith('https://')
            )
```

---

## 10. Additional Security Measures

### File Upload Security

```python
# utils/validators.py
from django.core.exceptions import ValidationError
import magic
import os

def validate_file_extension(value):
    """File extension validate করুন"""
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']
    ext = os.path.splitext(value.name)[1].lower()
    
    if ext not in allowed_extensions:
        raise ValidationError(
            f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}'
        )

def validate_file_size(value):
    """File size validate করুন"""
    max_size = 5 * 1024 * 1024  # 5MB
    
    if value.size > max_size:
        raise ValidationError(
            f'File size must not exceed {max_size / (1024*1024)}MB'
        )

def validate_file_content(value):
    """File content validate করুন (magic number check)"""
    allowed_mime_types = [
        'image/jpeg',
        'image/png',
        'application/pdf',
    ]
    
    # python-magic library ব্যবহার করুন
    file_mime = magic.from_buffer(value.read(1024), mime=True)
    value.seek(0)  # Reset file pointer
    
    if file_mime not in allowed_mime_types:
        raise ValidationError(
            f'Invalid file type. Detected: {file_mime}'
        )

# models.py
from django.db import models

class Document(models.Model):
    file = models.FileField(
        upload_to='documents/%Y/%m/%d/',
        validators=[
            validate_file_extension,
            validate_file_size,
            validate_file_content,
        ]
    )
    uploaded_by = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
```

### API Rate Limiting

```python
# views.py
from django.core.cache import cache
from django.http import HttpResponseForbidden
from functools import wraps

def rate_limit(max_requests=10, window=60):
    """
    Rate limiting decorator
    max_requests: Maximum requests allowed
    window: Time window in seconds
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # User বা IP based key
            if request.user.is_authenticated:
                key = f'rate_limit_user_{request.user.id}'
            else:
                ip = request.META.get('REMOTE_ADDR')
                key = f'rate_limit_ip_{ip}'
            
            # Current count get করুন
            count = cache.get(key, 0)
            
            if count >= max_requests:
                return HttpResponseForbidden(
                    'Rate limit exceeded. Please try again later.'
                )
            
            # Count increment করুন
            cache.set(key, count + 1, window)
            
            return view_func(request, *args, **kwargs)
        
        return wrapper
    return decorator

# Usage
@rate_limit(max_requests=5, window=60)
def api_endpoint(request):
    return JsonResponse({'status': 'success'})
```

### Input Sanitization

```python
# utils/sanitizers.py
import bleach
from django.utils.html import escape

def sanitize_html(html_content):
    """HTML content sanitize করুন"""
    allowed_tags = [
        'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code'
    ]
    
    allowed_attributes = {
        'a': ['href', 'title'],
        'img': ['src', 'alt'],
    }
    
    cleaned = bleach.clean(
        html_content,
        tags=allowed_tags,
        attributes=allowed_attributes,
        strip=True
    )
    
    return cleaned

def sanitize_user_input(user_input):
    """General user input sanitize করুন"""
    # HTML escape
    sanitized = escape(user_input)
    
    # Remove null bytes
    sanitized = sanitized.replace('\x00', '')
    
    # Trim whitespace
    sanitized = sanitized.strip()
    
    return sanitized

# views.py
def create_post(request):
    if request.method == 'POST':
        title = sanitize_user_input(request.POST.get('title'))
        content = sanitize_html(request.POST.get('content'))
        
        Post.objects.create(
            title=title,
            content=content,
            author=request.user
        )
        
        return redirect('post_list')
```

---

## সারসংক্ষেপ

Django security best practices follow করে আপনি আপনার application কে বিভিন্ন security threats থেকে protect করতে পারবেন:

### Key Points:

1. **CSRF Protection**: সব POST requests এ `{% csrf_token %}` ব্যবহার করুন
2. **XSS Prevention**: Template auto-escaping enable রাখুন, `|safe` filter সাবধানে ব্যবহার করুন
3. **SQL Injection**: সবসময় Django ORM ব্যবহার করুন, raw SQL এ parameterized queries ব্যবহার করুন
4. **Clickjacking**: `X-Frame-Options` header enable করুন
5. **HTTPS**: Production এ সবসময় HTTPS enforce করুন
6. **Security Middleware**: সব security middleware enable করুন
7. **Secure Cookies**: `SECURE`, `HTTPONLY`, `SAMESITE` flags ব্যবহার করুন
8. **CSP**: Content Security Policy implement করুন
9. **Security Checklist**: Deployment এর আগে security checklist follow করুন
10. **Regular Updates**: Django এবং dependencies regularly update করুন

### Best Practices:

- `python manage.py check --deploy` regularly run করুন
- Security headers verify করুন
- Dependencies এর vulnerabilities check করুন
- Logging এবং monitoring setup করুন
- Regular security audits করুন
- Penetration testing করুন

Security একটি ongoing process - সবসময় updated থাকুন এবং best practices follow করুন! 🔒
