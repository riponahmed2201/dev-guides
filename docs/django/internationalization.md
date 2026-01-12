# Internationalization (i18n)

Django এ একাধিক ভাষায় অ্যাপ্লিকেশন তৈরি করা খুবই সহজ। এর জন্য **i18n (Internationalization)** এবং **l10n (Localization)** সিস্টেম ব্যবহার করা হয়।

## Configuration

```python
# settings.py
from django.utils.translation import gettext_lazy as _

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True

LANGUAGES = [
    ('en', _('English')),
    ('bn', _('Bangla')),
    ('es', _('Spanish')),
]

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]
```

## Middleware

```python
MIDDLEWARE = [
    # ...
    'django.middleware.locale.LocaleMiddleware',
    # ...
]
```

## Translation in Python Code

```python
from django.utils.translation import gettext as _
from django.utils.translation import gettext_lazy

def my_view(request):
    message = _("Welcome to our site")
    return HttpResponse(message)

# Model এ lazy translation ব্যবহার করুন
class Product(models.Model):
    name = models.CharField(_("Product Name"), max_length=100)
```

## Translation in Templates

```html
{% load i18n %}

<h1>{% trans "Welcome" %}</h1>

<!-- Variable সহ -->
{% blocktrans with name=user.name %}
    Hello {{ name }}!
{% endblocktrans %}
```

## Creating Translation Files

**১. Message ফাইল তৈরি করুন:**
```bash
python manage.py makemessages -l bn
python manage.py makemessages -l es
```

এটি `locale/bn/LC_MESSAGES/django.po` ফাইল তৈরি করবে।

**২. Translation যোগ করুন:**
```po
# locale/bn/LC_MESSAGES/django.po
msgid "Welcome"
msgstr "স্বাগতম"

msgid "Product Name"
msgstr "পণ্যের নাম"
```

**৩. Compile করুন:**
```bash
python manage.py compilemessages
```

এটি `.mo` (Machine Object) ফাইল তৈরি করবে যা Django ব্যবহার করে।

## Language Selection

### URL-based

```python
# urls.py
from django.conf.urls.i18n import i18n_patterns

urlpatterns = i18n_patterns(
    path('', home_view),
    path('products/', product_list),
)
```

এখন URL হবে: `/en/products/`, `/bn/products/`

### Language Switcher

```html
{% load i18n %}

<form action="{% url 'set_language' %}" method="post">
    {% csrf_token %}
    <select name="language">
        {% get_current_language as LANGUAGE_CODE %}
        {% get_available_languages as LANGUAGES %}
        {% for lang_code, lang_name in LANGUAGES %}
            <option value="{{ lang_code }}" {% if lang_code == LANGUAGE_CODE %}selected{% endif %}>
                {{ lang_name }}
            </option>
        {% endfor %}
    </select>
    <button type="submit">Change</button>
</form>
```

**URL Configuration:**
```python
urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
]
```

## RTL (Right-to-Left) Support

আরবি বা হিব্রু ভাষার জন্য RTL সাপোর্ট:

```html
{% load i18n %}
<html dir="{% if LANGUAGE_BIDI %}rtl{% else %}ltr{% endif %}">
```

```python
# settings.py
LANGUAGES = [
    ('en', 'English'),
    ('ar', 'Arabic'),  # RTL language
]
```
