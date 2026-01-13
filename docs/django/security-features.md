# Django Security Features

Django এর built-in security features আপনার application কে secure রাখতে সাহায্য করে। এই গাইডে আমরা Django এর core security features এবং তাদের proper configuration নিয়ে বিস্তারিত আলোচনা করব।

## 1. SECRET_KEY Management

### SECRET_KEY কী?

`SECRET_KEY` হলো একটি cryptographic signing key যা Django বিভিন্ন security-related কাজে ব্যবহার করে:
- Session data signing
- CSRF token generation
- Password reset tokens
- Cryptographic signing

### ⚠️ SECRET_KEY এর গুরুত্ব

```python
# ❌ NEVER DO THIS - Secret key exposed
SECRET_KEY = 'django-insecure-hard-coded-key-12345'

# ❌ NEVER commit SECRET_KEY to version control
# ❌ NEVER share SECRET_KEY publicly
# ❌ NEVER reuse SECRET_KEY across projects
```

### ✅ Proper SECRET_KEY Management

#### Method 1: Environment Variables (Recommended)

```python
# settings.py
import os
from django.core.exceptions import ImproperlyConfigured

def get_env_variable(var_name):
    """Environment variable get করুন অথবা exception raise করুন"""
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = f'Set the {var_name} environment variable'
        raise ImproperlyConfigured(error_msg)

SECRET_KEY = get_env_variable('DJANGO_SECRET_KEY')

# অথবা simple approach
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    raise ImproperlyConfigured('SECRET_KEY not set in environment variables')
```

#### Method 2: .env File (python-decouple)

```bash
# Install python-decouple
pip install python-decouple
```

```python
# .env file (project root এ)
DJANGO_SECRET_KEY=your-super-secret-key-here-min-50-chars
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

```python
# settings.py
from decouple import config, Csv

SECRET_KEY = config('DJANGO_SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())
```

```gitignore
# .gitignore
.env
*.env
.env.local
.env.production
```

#### Method 3: Separate Settings Files

```python
# settings/base.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Common settings
INSTALLED_APPS = [...]
MIDDLEWARE = [...]
```

```python
# settings/development.py
from .base import *

DEBUG = True
SECRET_KEY = 'dev-secret-key-only-for-development'
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

```python
# settings/production.py
from .base import *
import os

DEBUG = False
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

```bash
# Development এ run করুন
python manage.py runserver --settings=myproject.settings.development

# Production এ run করুন
python manage.py runserver --settings=myproject.settings.production

# অথবা environment variable set করুন
export DJANGO_SETTINGS_MODULE=myproject.settings.production
```

### SECRET_KEY Generate করা

```python
# Method 1: Django utility ব্যবহার করে
from django.core.management.utils import get_random_secret_key

print(get_random_secret_key())
# Output: 'django-insecure-a!b@c#d$e%f^g&h*i(j)k_l+m-n=o[p]q{r}s|t~u`v'
```

```bash
# Method 2: Command line থেকে
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Method 3: Python secrets module
python -c 'import secrets; print(secrets.token_urlsafe(50))'
```

### SECRET_KEY Rotation

```python
# settings.py
import os

# Current secret key
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# Old secret keys (for rotation period)
OLD_SECRET_KEYS = [
    os.environ.get('DJANGO_OLD_SECRET_KEY_1', ''),
    os.environ.get('DJANGO_OLD_SECRET_KEY_2', ''),
]

# Custom signing backend যা old keys support করে
# এটি session migration এর সময় useful
```

---

## 2. DEBUG = False in Production

### DEBUG Mode এর বিপদ

```python
# ❌ NEVER set DEBUG = True in production
DEBUG = True  # DANGEROUS!
```

**DEBUG = True থাকলে কী হয়:**
- Detailed error pages expose হয় (sensitive information leak)
- Stack traces publicly visible হয়
- SQL queries visible হয়
- Settings এবং environment variables expose হয়
- Performance significantly slow হয়

### ✅ Proper DEBUG Configuration

```python
# settings.py
import os

# Environment-based DEBUG
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# অথবা python-decouple দিয়ে
from decouple import config
DEBUG = config('DEBUG', default=False, cast=bool)

# Development check
DEVELOPMENT = os.environ.get('ENVIRONMENT') == 'development'
if DEVELOPMENT:
    DEBUG = True
else:
    DEBUG = False
```

### Custom Error Pages (DEBUG = False এর জন্য)

```python
# settings.py
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']

# Custom error handlers
handler404 = 'myapp.views.custom_404'
handler500 = 'myapp.views.custom_500'
handler403 = 'myapp.views.custom_403'
handler400 = 'myapp.views.custom_400'
```

```python
# myapp/views.py
from django.shortcuts import render

def custom_404(request, exception):
    """Custom 404 error page"""
    return render(request, 'errors/404.html', status=404)

def custom_500(request):
    """Custom 500 error page"""
    return render(request, 'errors/500.html', status=500)

def custom_403(request, exception):
    """Custom 403 error page"""
    return render(request, 'errors/403.html', status=403)

def custom_400(request, exception):
    """Custom 400 error page"""
    return render(request, 'errors/400.html', status=400)
```

```html
<!-- templates/errors/404.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Page Not Found</title>
</head>
<body>
    <h1>404 - Page Not Found</h1>
    <p>দুঃখিত, আপনি যে পেজটি খুঁজছেন তা পাওয়া যায়নি।</p>
    <a href="{% url 'home' %}">হোম পেজে ফিরে যান</a>
</body>
</html>
```

### Error Logging (Production এ)

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
            'formatter': 'verbose',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

# Admin email notifications
ADMINS = [
    ('Your Name', 'admin@yourdomain.com'),
]
SERVER_EMAIL = 'server@yourdomain.com'
```

---

## 3. ALLOWED_HOSTS

### ALLOWED_HOSTS কী?

`ALLOWED_HOSTS` একটি list যা define করে কোন host/domain names আপনার Django site serve করতে পারবে। এটি HTTP Host header attacks prevent করে।

### ⚠️ Common Mistakes

```python
# ❌ NEVER do this in production
ALLOWED_HOSTS = ['*']  # Allows ALL hosts - DANGEROUS!

# ❌ Empty list (DEBUG = False এ error দেবে)
ALLOWED_HOSTS = []
```

### ✅ Proper ALLOWED_HOSTS Configuration

```python
# settings.py

# Development
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']

# Production
DEBUG = False
ALLOWED_HOSTS = [
    'yourdomain.com',
    'www.yourdomain.com',
    'api.yourdomain.com',
]

# Environment-based
import os
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

if DEBUG:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1']
else:
    ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
```

### Wildcard Subdomains

```python
# settings.py

# Specific subdomains allow করুন
ALLOWED_HOSTS = [
    '.yourdomain.com',  # *.yourdomain.com এবং yourdomain.com
]

# এটি allow করবে:
# - yourdomain.com
# - www.yourdomain.com
# - api.yourdomain.com
# - blog.yourdomain.com
# - যেকোনো subdomain.yourdomain.com
```

### Custom ALLOWED_HOSTS Validation

```python
# settings.py

class CustomAllowedHosts(list):
    """Custom ALLOWED_HOSTS with logging"""
    
    def __contains__(self, host):
        allowed = super().__contains__(host)
        if not allowed:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f'Disallowed host attempted: {host}')
        return allowed

ALLOWED_HOSTS = CustomAllowedHosts([
    'yourdomain.com',
    'www.yourdomain.com',
])
```

### Docker/Kubernetes Environment

```python
# settings.py
import os

ALLOWED_HOSTS = []

# Add hosts from environment
env_hosts = os.environ.get('ALLOWED_HOSTS', '')
if env_hosts:
    ALLOWED_HOSTS.extend(env_hosts.split(','))

# Add internal IPs for health checks
ALLOWED_HOSTS.extend([
    '127.0.0.1',
    'localhost',
])

# Remove duplicates
ALLOWED_HOSTS = list(set(ALLOWED_HOSTS))
```

---

## 4. Password Hashing

### Django এর Password Hashing

Django automatically passwords hash করে। কখনো plain text passwords store করবেন না!

```python
# Django automatically এই hashers ব্যবহার করে
# settings.py

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',  # Most secure (recommended)
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',  # Default
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]
```

### Argon2 Setup (Recommended)

```bash
# Install argon2
pip install django[argon2]
# অথবা
pip install argon2-cffi
```

```python
# settings.py
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',  # First = default
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',  # Fallback
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]
```

### Password Hashing in Code

```python
# views.py
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password

# ❌ NEVER do this
user = User.objects.create(
    username='john',
    password='plain_password'  # WRONG! Plain text!
)

# ✅ Correct way - User model automatically hashes
user = User.objects.create_user(
    username='john',
    password='secure_password'  # Will be hashed automatically
)

# ✅ Manual hashing (if needed)
hashed_password = make_password('my_password')
user = User.objects.create(
    username='john',
    password=hashed_password
)

# Password verify করা
is_correct = check_password('my_password', user.password)
```

### Custom Password Hasher

```python
# myapp/hashers.py
from django.contrib.auth.hashers import PBKDF2PasswordHasher

class MyPBKDF2PasswordHasher(PBKDF2PasswordHasher):
    """
    Custom hasher with more iterations
    """
    iterations = PBKDF2PasswordHasher.iterations * 2  # Double iterations

# settings.py
PASSWORD_HASHERS = [
    'myapp.hashers.MyPBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',  # Fallback
]
```

### Password Migration

```python
# Existing passwords কে stronger algorithm এ migrate করুন

# settings.py
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',  # New default
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',  # Old hasher (for migration)
]

# Django automatically re-hash করবে যখন user login করবে
```

---

## 5. Password Validators

### Built-in Password Validators

```python
# settings.py

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        'OPTIONS': {
            'user_attributes': ('username', 'email', 'first_name', 'last_name'),
            'max_similarity': 0.7,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 12,  # Minimum 12 characters (default: 8)
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        # 20,000+ common passwords check করে
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        # Purely numeric passwords reject করে
    },
]
```

### Custom Password Validator

```python
# myapp/validators.py
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
import re

class SpecialCharacterValidator:
    """
    Password এ special characters থাকতে হবে
    """
    def validate(self, password, user=None):
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValidationError(
                _("Password must contain at least one special character."),
                code='password_no_special',
            )
    
    def get_help_text(self):
        return _("Your password must contain at least one special character (!@#$%^&* etc.)")


class UppercaseValidator:
    """
    Password এ uppercase letter থাকতে হবে
    """
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("Password must contain at least one uppercase letter."),
                code='password_no_upper',
            )
    
    def get_help_text(self):
        return _("Your password must contain at least one uppercase letter.")


class LowercaseValidator:
    """
    Password এ lowercase letter থাকতে হবে
    """
    def validate(self, password, user=None):
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("Password must contain at least one lowercase letter."),
                code='password_no_lower',
            )
    
    def get_help_text(self):
        return _("Your password must contain at least one lowercase letter.")


class NumberValidator:
    """
    Password এ number থাকতে হবে
    """
    def validate(self, password, user=None):
        if not re.search(r'\d', password):
            raise ValidationError(
                _("Password must contain at least one number."),
                code='password_no_number',
            )
    
    def get_help_text(self):
        return _("Your password must contain at least one number.")
```

```python
# settings.py
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 12}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
    # Custom validators
    {'NAME': 'myapp.validators.SpecialCharacterValidator'},
    {'NAME': 'myapp.validators.UppercaseValidator'},
    {'NAME': 'myapp.validators.LowercaseValidator'},
    {'NAME': 'myapp.validators.NumberValidator'},
]
```

### Password Validation in Views

```python
# views.py
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

def register_view(request):
    if request.method == 'POST':
        password = request.POST.get('password')
        
        try:
            # Password validate করুন
            validate_password(password)
            
            # Password valid হলে user create করুন
            user = User.objects.create_user(
                username=request.POST.get('username'),
                password=password
            )
            
            return redirect('login')
            
        except ValidationError as e:
            # Validation errors show করুন
            return render(request, 'register.html', {
                'errors': e.messages
            })
    
    return render(request, 'register.html')
```

### Password Validation in Forms

```python
# forms.py
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class RegistrationForm(forms.ModelForm):
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput,
        help_text='Enter a strong password'
    )
    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput
    )
    
    class Meta:
        model = User
        fields = ['username', 'email']
    
    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        
        # Django validators run করুন
        validate_password(password1)
        
        return password1
    
    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        
        return cleaned_data
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user
```

---

## 6. Session Security

### Session Configuration

```python
# settings.py

# Session Engine
SESSION_ENGINE = 'django.contrib.sessions.backends.db'  # Database (default)
# অথবা
# SESSION_ENGINE = 'django.contrib.sessions.backends.cache'  # Cache (faster)
# অথবা
# SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'  # Hybrid (recommended)

# Session Cookie Settings
SESSION_COOKIE_NAME = 'sessionid'  # Default name change করুন
SESSION_COOKIE_AGE = 1209600  # 2 weeks (seconds)
SESSION_COOKIE_SECURE = True  # HTTPS only (production)
SESSION_COOKIE_HTTPONLY = True  # JavaScript access prevent
SESSION_COOKIE_SAMESITE = 'Strict'  # CSRF protection
SESSION_COOKIE_DOMAIN = None  # Current domain
SESSION_COOKIE_PATH = '/'

# Session Expiry
SESSION_SAVE_EVERY_REQUEST = False  # True করলে প্রতি request এ session update হবে
SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # True করলে browser close এ session expire হবে

# Session Security
SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'  # Secure serializer
```

### Session Fixation Prevention

```python
# views.py
from django.contrib.auth import login, logout

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Login করুন
            login(request, user)
            
            # Session key regenerate করুন (session fixation prevent)
            request.session.cycle_key()
            
            # Additional session data
            request.session['login_ip'] = request.META.get('REMOTE_ADDR')
            request.session['login_time'] = str(timezone.now())
            
            return redirect('dashboard')
    
    return render(request, 'login.html')
```

### Session Hijacking Prevention

```python
# middleware/session_security.py
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin

class SessionSecurityMiddleware(MiddlewareMixin):
    """
    Session hijacking detect করুন
    """
    def process_request(self, request):
        if request.user.is_authenticated:
            # IP address verify করুন
            stored_ip = request.session.get('login_ip')
            current_ip = request.META.get('REMOTE_ADDR')
            
            if stored_ip and stored_ip != current_ip:
                # IP changed - possible hijacking
                logout(request)
                return redirect('login')
            
            # User agent verify করুন
            stored_ua = request.session.get('user_agent')
            current_ua = request.META.get('HTTP_USER_AGENT')
            
            if stored_ua and stored_ua != current_ua:
                # User agent changed - possible hijacking
                logout(request)
                return redirect('login')
        
        return None

# settings.py
MIDDLEWARE = [
    # ...
    'middleware.session_security.SessionSecurityMiddleware',
]
```

### Idle Session Timeout

```python
# middleware/session_timeout.py
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.utils import timezone
from datetime import timedelta

class SessionTimeoutMiddleware:
    """
    Idle session timeout implement করুন
    """
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if request.user.is_authenticated:
            last_activity = request.session.get('last_activity')
            
            if last_activity:
                last_activity_time = timezone.datetime.fromisoformat(last_activity)
                idle_time = timezone.now() - last_activity_time
                
                # 30 minutes idle timeout
                if idle_time > timedelta(minutes=30):
                    logout(request)
                    return redirect('login')
            
            # Update last activity
            request.session['last_activity'] = timezone.now().isoformat()
        
        response = self.get_response(request)
        return response
```

### Clear Expired Sessions

```bash
# Cron job setup করুন (daily)
0 0 * * * cd /path/to/project && python manage.py clearsessions
```

```python
# অথবা Celery task
from celery import shared_task
from django.core.management import call_command

@shared_task
def clear_expired_sessions():
    call_command('clearsessions')
```

---

## 7. Admin Security

### Admin URL Change করা

```python
# urls.py
from django.contrib import admin
from django.urls import path
import os

# Default 'admin/' থেকে change করুন
admin_url = os.environ.get('ADMIN_URL', 'secret-admin-panel/')

urlpatterns = [
    path(admin_url, admin.site.urls),  # Custom admin URL
    # অন্যান্য URLs...
]
```

### Admin Site Customization

```python
# admin.py
from django.contrib import admin
from django.contrib.auth.models import User, Group

# Admin site customization
admin.site.site_header = "My Company Admin"
admin.site.site_title = "Admin Portal"
admin.site.index_title = "Welcome to Admin Portal"

# Admin login message
admin.site.login_template = 'admin/custom_login.html'
```

### Admin Access Restriction

```python
# middleware/admin_ip_whitelist.py
from django.http import HttpResponseForbidden
from django.conf import settings

class AdminIPWhitelistMiddleware:
    """
    Admin panel শুধুমাত্র specific IPs থেকে access করা যাবে
    """
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Admin URL check করুন
        admin_url = settings.ADMIN_URL
        
        if request.path.startswith(f'/{admin_url}'):
            # IP whitelist check করুন
            allowed_ips = getattr(settings, 'ADMIN_ALLOWED_IPS', [])
            client_ip = self.get_client_ip(request)
            
            if client_ip not in allowed_ips:
                return HttpResponseForbidden('Access Denied')
        
        return self.get_response(request)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

# settings.py
ADMIN_URL = 'secret-admin/'
ADMIN_ALLOWED_IPS = [
    '192.168.1.100',  # Office IP
    '203.0.113.0',    # VPN IP
]

MIDDLEWARE = [
    'middleware.admin_ip_whitelist.AdminIPWhitelistMiddleware',
    # ...
]
```

### Two-Factor Authentication for Admin

```bash
# Install django-otp
pip install django-otp qrcode
```

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'django_otp',
    'django_otp.plugins.otp_totp',
    'django_otp.plugins.otp_static',
]

MIDDLEWARE = [
    # ...
    'django_otp.middleware.OTPMiddleware',
]

# Admin OTP required
OTP_TOTP_ISSUER = 'My Company Admin'
```

```python
# admin.py
from django_otp.admin import OTPAdminSite
from django.contrib import admin

# Replace default admin site
admin.site.__class__ = OTPAdminSite
```

### Admin Login Attempts Limiting

```python
# middleware/admin_login_limit.py
from django.core.cache import cache
from django.http import HttpResponseForbidden
from django.conf import settings
import hashlib

class AdminLoginLimitMiddleware:
    """
    Admin login attempts limit করুন
    """
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        admin_url = getattr(settings, 'ADMIN_URL', 'admin/')
        
        if request.path == f'/{admin_url}login/' and request.method == 'POST':
            ip = self.get_client_ip(request)
            cache_key = f'admin_login_attempts_{hashlib.md5(ip.encode()).hexdigest()}'
            
            attempts = cache.get(cache_key, 0)
            
            if attempts >= 5:  # Max 5 attempts
                return HttpResponseForbidden(
                    'Too many login attempts. Please try again later.'
                )
            
            # Increment attempts
            cache.set(cache_key, attempts + 1, 900)  # 15 minutes
        
        return self.get_response(request)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
```

### Admin Activity Logging

```python
# admin.py
from django.contrib import admin
from django.contrib.admin.models import LogEntry
import logging

logger = logging.getLogger(__name__)

class CustomAdminSite(admin.AdminSite):
    """
    Admin actions log করুন
    """
    def log_addition(self, request, object, message):
        logger.info(
            f'Admin {request.user.username} added {object} - {message}'
        )
        return super().log_addition(request, object, message)
    
    def log_change(self, request, object, message):
        logger.info(
            f'Admin {request.user.username} changed {object} - {message}'
        )
        return super().log_change(request, object, message)
    
    def log_deletion(self, request, object, object_repr):
        logger.warning(
            f'Admin {request.user.username} deleted {object_repr}'
        )
        return super().log_deletion(request, object, object_repr)

# Replace default admin site
admin_site = CustomAdminSite(name='custom_admin')
admin.site = admin_site
```

---

## 8. django-security Package

### Installation

```bash
pip install django-security
```

### Configuration

```python
# settings.py

INSTALLED_APPS = [
    # ...
    'security',
]

MIDDLEWARE = [
    # ...
    'security.middleware.DoNotTrackMiddleware',
    'security.middleware.ContentNoSniff',
    'security.middleware.XssProtectMiddleware',
    'security.middleware.XFrameOptionsMiddleware',
]

# Security settings
SECURITY_CONTENT_TYPE_NOSNIFF = True
SECURITY_BROWSER_XSS_FILTER = True
SECURITY_X_FRAME_OPTIONS = 'DENY'

# Password expiry
SECURITY_PASSWORD_EXPIRY_DAYS = 90  # Password 90 days পর expire হবে

# Password history
SECURITY_PASSWORD_HISTORY_COUNT = 5  # Last 5 passwords reuse করা যাবে না

# Session security
SECURITY_SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SECURITY_SESSION_COOKIE_HTTPONLY = True
SECURITY_SESSION_COOKIE_SECURE = True

# CSRF
SECURITY_CSRF_COOKIE_HTTPONLY = True
SECURITY_CSRF_COOKIE_SECURE = True
```

### Password Expiry Implementation

```python
# models.py
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from datetime import timedelta

class PasswordHistory(models.Model):
    """
    User এর password history track করুন
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    @classmethod
    def check_password_reuse(cls, user, new_password):
        """
        Check করুন password আগে ব্যবহার হয়েছে কিনা
        """
        from django.contrib.auth.hashers import check_password
        
        history = cls.objects.filter(user=user)[:5]  # Last 5 passwords
        
        for entry in history:
            if check_password(new_password, entry.password):
                return False  # Password reused
        
        return True  # Password unique


class UserPasswordExpiry(models.Model):
    """
    Password expiry track করুন
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    password_changed_at = models.DateTimeField(default=timezone.now)
    
    def is_password_expired(self):
        """
        Check করুন password expire হয়েছে কিনা
        """
        expiry_days = 90  # 90 days
        expiry_date = self.password_changed_at + timedelta(days=expiry_days)
        return timezone.now() > expiry_date
    
    def days_until_expiry(self):
        """
        কত দিন বাকি আছে
        """
        expiry_days = 90
        expiry_date = self.password_changed_at + timedelta(days=expiry_days)
        days_left = (expiry_date - timezone.now()).days
        return max(0, days_left)
```

```python
# middleware/password_expiry.py
from django.shortcuts import redirect
from django.urls import reverse
from .models import UserPasswordExpiry

class PasswordExpiryMiddleware:
    """
    Password expiry check করুন
    """
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if request.user.is_authenticated:
            try:
                expiry = UserPasswordExpiry.objects.get(user=request.user)
                
                if expiry.is_password_expired():
                    # Password change page ছাড়া অন্য কোথাও যেতে দেবেন না
                    if request.path != reverse('password_change'):
                        return redirect('password_change')
                
            except UserPasswordExpiry.DoesNotExist:
                # Create expiry record
                UserPasswordExpiry.objects.create(user=request.user)
        
        return self.get_response(request)
```

### Security Audit Logging

```python
# models.py
from django.db import models
from django.contrib.auth.models import User

class SecurityAuditLog(models.Model):
    """
    Security events log করুন
    """
    EVENT_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('failed_login', 'Failed Login'),
        ('password_change', 'Password Change'),
        ('permission_denied', 'Permission Denied'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)
    
    class Meta:
        ordering = ['-timestamp']
    
    @classmethod
    def log_event(cls, event_type, request, user=None, details=None):
        """
        Security event log করুন
        """
        return cls.objects.create(
            user=user or request.user if request.user.is_authenticated else None,
            event_type=event_type,
            ip_address=cls.get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            details=details or {}
        )
    
    @staticmethod
    def get_client_ip(request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
```

---

## সারসংক্ষেপ

Django এর security features properly configure করে আপনি একটি secure application build করতে পারবেন:

### Key Points:

1. **SECRET_KEY**: Environment variables এ store করুন, কখনো hardcode করবেন না
2. **DEBUG**: Production এ সবসময় `False` রাখুন
3. **ALLOWED_HOSTS**: Specific domains/IPs whitelist করুন
4. **Password Hashing**: Argon2 ব্যবহার করুন, কখনো plain text passwords store করবেন না
5. **Password Validators**: Strong password policies implement করুন
6. **Session Security**: Secure cookies, session timeout, hijacking prevention
7. **Admin Security**: URL change, IP whitelist, 2FA, login limiting
8. **django-security**: Additional security features এর জন্য

### Production Checklist:

```python
# settings.py - Production Security Checklist

# ✅ 1. Secret Key
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# ✅ 2. Debug
DEBUG = False

# ✅ 3. Allowed Hosts
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# ✅ 4. Password Hashing
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
]

# ✅ 5. Password Validators
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 12}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ✅ 6. Session Security
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'

# ✅ 7. HTTPS
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000

# ✅ 8. Admin Security
ADMIN_URL = os.environ.get('ADMIN_URL', 'secret-admin/')
```

Security একটি continuous process - regular audits এবং updates করতে থাকুন! 🔐
