# Localization (l10n)

**Localization (l10n)** হলো ডেটা ফরম্যাটিং (তারিখ, সংখ্যা, মুদ্রা) লোকাল অনুযায়ী পরিবর্তন করা। যেমন: US এ তারিখ `12/31/2024` কিন্তু UK তে `31/12/2024`।

## Configuration

```python
# settings.py
USE_I18N = True  # Translation enable করে
USE_L10N = True  # Localization enable করে (Django 4.0+ এ deprecated)
USE_TZ = True    # Timezone support

LANGUAGE_CODE = 'en-us'
```

**Django 4.0+:** `USE_L10N` ডিফল্টভাবে `True`, তাই এটি সেট করার দরকার নেই।

## Date/Time Formatting

### Template এ

```html
{% load l10n %}

<!-- Localized format -->
{{ order.created_at }}

<!-- Force localization off -->
{% localize off %}
    {{ order.created_at }}
{% endlocalize %}
```

### Python Code এ

```python
from django.utils import formats

# Localized date
formatted_date = formats.date_format(order.created_at, "SHORT_DATE_FORMAT")

# Custom format
formatted_date = formats.date_format(order.created_at, "d M Y")
```

## Number Formatting

```python
from django.utils.formats import localize

price = 1234567.89

# US locale: 1,234,567.89
# EU locale: 1.234.567,89
localized_price = localize(price)
```

**Template এ:**
```html
{% load l10n %}
{{ price|localize }}

<!-- Force unlocalized -->
{{ price|unlocalize }}
```

## Currency Formatting

Django এ বিল্ট-ইন কারেন্সি ফরম্যাটিং নেই, তবে `babel` লাইব্রেরি ব্যবহার করা যায়।

```bash
pip install babel
```

```python
from babel.numbers import format_currency

amount = 1234.56
formatted = format_currency(amount, 'USD', locale='en_US')
# Output: $1,234.56

formatted = format_currency(amount, 'BDT', locale='bn_BD')
# Output: ১,২৩৪.৫৬৳
```

## Locale-aware Models

```python
from django.db import models
from django.utils.translation import gettext_lazy as _

class Product(models.Model):
    name = models.CharField(_("Name"), max_length=100)
    price = models.DecimalField(_("Price"), max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def get_formatted_price(self):
        from django.utils.formats import localize
        return localize(self.price)
```

## Custom Format Files

আপনি কাস্টম ফরম্যাট তৈরি করতে পারেন:

```python
# myapp/formats/bn/formats.py
DATE_FORMAT = 'd/m/Y'
TIME_FORMAT = 'H:i'
DATETIME_FORMAT = 'd/m/Y H:i'
DECIMAL_SEPARATOR = '.'
THOUSAND_SEPARATOR = ','
NUMBER_GROUPING = 3
```

**Enable করুন:**
```python
# settings.py
FORMAT_MODULE_PATH = [
    'myapp.formats',
]
```
