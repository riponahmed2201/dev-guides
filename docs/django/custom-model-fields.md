# Custom Model Fields

Django এর built-in fields যথেষ্ট না হলে আপনি custom model fields তৈরি করতে পারেন। এই গাইডে আমরা custom fields তৈরির সব aspects নিয়ে বিস্তারিত আলোচনা করব।

## 1. Field Subclassing

### Basic Field Subclassing

```python
# myapp/fields.py

from django.db import models

class UpperCaseCharField(models.CharField):
    """
    CharField যা সবসময় uppercase এ store করে
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def get_prep_value(self, value):
        """Database এ save করার আগে uppercase করুন"""
        value = super().get_prep_value(value)
        if value is not None:
            return value.upper()
        return value
```

```python
# models.py

from myapp.fields import UpperCaseCharField

class Product(models.Model):
    name = models.CharField(max_length=200)
    sku = UpperCaseCharField(max_length=50)  # সবসময় uppercase
    
    # Usage:
    # product = Product.objects.create(name='Laptop', sku='abc123')
    # product.sku  # 'ABC123'
```

### Subclassing with Custom Parameters

```python
# myapp/fields.py

from django.db import models
from django.core.exceptions import ValidationError

class PriceField(models.DecimalField):
    """
    Price field with currency support
    """
    
    def __init__(self, currency='USD', *args, **kwargs):
        self.currency = currency
        # Set default decimal places for price
        kwargs.setdefault('max_digits', 10)
        kwargs.setdefault('decimal_places', 2)
        super().__init__(*args, **kwargs)
    
    def deconstruct(self):
        """
        Migration এর জন্য field reconstruct করুন
        """
        name, path, args, kwargs = super().deconstruct()
        # Custom parameter add করুন
        if self.currency != 'USD':
            kwargs['currency'] = self.currency
        return name, path, args, kwargs
    
    def formfield(self, **kwargs):
        """Form field customization"""
        kwargs['help_text'] = f'Price in {self.currency}'
        return super().formfield(**kwargs)
```

```python
# models.py

class Product(models.Model):
    name = models.CharField(max_length=200)
    price_usd = PriceField(currency='USD')
    price_bdt = PriceField(currency='BDT')
```

### Composite Field (Multiple Database Columns)

```python
# myapp/fields.py

from django.db import models

class LocationField(models.Field):
    """
    Location field যা latitude এবং longitude store করে
    """
    
    def db_type(self, connection):
        """Database column type"""
        return 'varchar(100)'
    
    def from_db_value(self, value, expression, connection):
        """Database থেকে Python object এ convert"""
        if value is None:
            return value
        lat, lng = value.split(',')
        return {'latitude': float(lat), 'longitude': float(lng)}
    
    def to_python(self, value):
        """Python object এ convert"""
        if isinstance(value, dict):
            return value
        
        if value is None:
            return value
        
        lat, lng = value.split(',')
        return {'latitude': float(lat), 'longitude': float(lng)}
    
    def get_prep_value(self, value):
        """Database এ save করার জন্য prepare"""
        if value is None:
            return value
        
        if isinstance(value, dict):
            return f"{value['latitude']},{value['longitude']}"
        
        return value
```

```python
# models.py

class Store(models.Model):
    name = models.CharField(max_length=200)
    location = LocationField()
    
    # Usage:
    # store = Store.objects.create(
    #     name='Main Store',
    #     location={'latitude': 23.8103, 'longitude': 90.4125}
    # )
    # store.location  # {'latitude': 23.8103, 'longitude': 90.4125}
```

---

## 2. from_db_value()

### Basic from_db_value Implementation

```python
# myapp/fields.py

from django.db import models
import json

class JSONField(models.TextField):
    """
    JSON data store করার field (Django 3.1 এর আগে)
    """
    
    def from_db_value(self, value, expression, connection):
        """
        Database থেকে value পড়ার পর call হয়
        """
        if value is None:
            return value
        
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
```

### Complex from_db_value

```python
# myapp/fields.py

from django.db import models
from datetime import datetime, timezone

class TimestampField(models.BigIntegerField):
    """
    Unix timestamp field যা datetime object return করে
    """
    
    def from_db_value(self, value, expression, connection):
        """
        Database থেকে timestamp পড়ে datetime এ convert করুন
        """
        if value is None:
            return None
        
        # Unix timestamp থেকে datetime
        return datetime.fromtimestamp(value, tz=timezone.utc)
    
    def to_python(self, value):
        """
        Form/deserialization থেকে Python object এ convert
        """
        if isinstance(value, datetime):
            return value
        
        if value is None:
            return None
        
        # Unix timestamp থেকে datetime
        return datetime.fromtimestamp(int(value), tz=timezone.utc)
    
    def get_prep_value(self, value):
        """
        Database এ save করার জন্য timestamp এ convert
        """
        if value is None:
            return None
        
        if isinstance(value, datetime):
            # datetime থেকে Unix timestamp
            return int(value.timestamp())
        
        return int(value)
```

```python
# models.py

class Event(models.Model):
    name = models.CharField(max_length=200)
    event_time = TimestampField()
    
    # Usage:
    # from datetime import datetime, timezone
    # event = Event.objects.create(
    #     name='Conference',
    #     event_time=datetime.now(timezone.utc)
    # )
    # event.event_time  # datetime object
```

### Encrypted Field Example

```python
# myapp/fields.py

from django.db import models
from cryptography.fernet import Fernet
from django.conf import settings

class EncryptedTextField(models.TextField):
    """
    Encrypted text field
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cipher = Fernet(settings.FIELD_ENCRYPTION_KEY.encode())
    
    def from_db_value(self, value, expression, connection):
        """Database থেকে পড়ে decrypt করুন"""
        if value is None:
            return value
        
        try:
            # Decrypt করুন
            decrypted = self.cipher.decrypt(value.encode())
            return decrypted.decode()
        except Exception:
            return value
    
    def get_prep_value(self, value):
        """Database এ save করার আগে encrypt করুন"""
        if value is None:
            return value
        
        # Encrypt করুন
        encrypted = self.cipher.encrypt(value.encode())
        return encrypted.decode()
```

---

## 3. to_python()

### Basic to_python Implementation

```python
# myapp/fields.py

from django.db import models
from django.core.exceptions import ValidationError

class ColorField(models.CharField):
    """
    Hex color code field
    """
    
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 7  # #RRGGBB
        super().__init__(*args, **kwargs)
    
    def to_python(self, value):
        """
        Form input বা deserialization থেকে Python object এ convert
        """
        if value is None:
            return value
        
        # যদি already string হয়
        if isinstance(value, str):
            # # add করুন যদি না থাকে
            if not value.startswith('#'):
                value = f'#{value}'
            
            # Validate hex color
            if len(value) != 7:
                raise ValidationError('Invalid color format')
            
            try:
                int(value[1:], 16)  # Check if valid hex
            except ValueError:
                raise ValidationError('Invalid hex color')
            
            return value.upper()
        
        return value
```

```python
# models.py

class Theme(models.Model):
    name = models.CharField(max_length=100)
    primary_color = ColorField()
    secondary_color = ColorField()
    
    # Usage:
    # theme = Theme(name='Dark', primary_color='FF5733')
    # theme.primary_color  # '#FF5733'
```

### Complex to_python with Custom Class

```python
# myapp/fields.py

from django.db import models
from decimal import Decimal

class Money:
    """Custom Money class"""
    
    def __init__(self, amount, currency='USD'):
        self.amount = Decimal(str(amount))
        self.currency = currency
    
    def __str__(self):
        return f'{self.amount} {self.currency}'
    
    def __repr__(self):
        return f'Money({self.amount}, {self.currency})'

class MoneyField(models.CharField):
    """
    Money field যা amount এবং currency store করে
    """
    
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 50
        super().__init__(*args, **kwargs)
    
    def from_db_value(self, value, expression, connection):
        """Database থেকে Money object এ convert"""
        if value is None:
            return None
        
        amount, currency = value.split('|')
        return Money(amount, currency)
    
    def to_python(self, value):
        """Python object এ convert"""
        if isinstance(value, Money):
            return value
        
        if value is None:
            return None
        
        # String থেকে parse করুন
        if isinstance(value, str):
            if '|' in value:
                amount, currency = value.split('|')
                return Money(amount, currency)
            else:
                # শুধু amount দেওয়া হলে USD assume করুন
                return Money(value, 'USD')
        
        # Number থেকে
        return Money(value, 'USD')
    
    def get_prep_value(self, value):
        """Database format এ convert"""
        if value is None:
            return None
        
        if isinstance(value, Money):
            return f'{value.amount}|{value.currency}'
        
        return value
```

```python
# models.py

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = MoneyField()
    
    # Usage:
    # product = Product(name='Laptop', price=Money(1500, 'USD'))
    # product.price  # Money(1500, USD)
    # str(product.price)  # '1500 USD'
```

---

## 4. get_prep_value()

### Basic get_prep_value

```python
# myapp/fields.py

from django.db import models

class LowercaseEmailField(models.EmailField):
    """
    Email field যা সবসময় lowercase এ store করে
    """
    
    def get_prep_value(self, value):
        """
        Database এ save করার আগে lowercase করুন
        """
        value = super().get_prep_value(value)
        
        if value is not None:
            return value.lower()
        
        return value
```

### Complex get_prep_value

```python
# myapp/fields.py

from django.db import models
import hashlib

class HashField(models.CharField):
    """
    Value এর hash store করে
    """
    
    def __init__(self, algorithm='sha256', *args, **kwargs):
        self.algorithm = algorithm
        kwargs['max_length'] = 64  # SHA256 hash length
        super().__init__(*args, **kwargs)
    
    def get_prep_value(self, value):
        """
        Database এ save করার আগে hash করুন
        """
        if value is None:
            return None
        
        # যদি already hashed হয়
        if len(value) == 64 and all(c in '0123456789abcdef' for c in value):
            return value
        
        # Hash করুন
        hasher = hashlib.new(self.algorithm)
        hasher.update(value.encode())
        return hasher.hexdigest()
    
    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        if self.algorithm != 'sha256':
            kwargs['algorithm'] = self.algorithm
        return name, path, args, kwargs
```

### Serialization with get_prep_value

```python
# myapp/fields.py

from django.db import models
import pickle
import base64

class PickleField(models.TextField):
    """
    Python objects কে pickle করে store করে
    """
    
    def get_prep_value(self, value):
        """
        Python object কে pickled string এ convert
        """
        if value is None:
            return None
        
        # Pickle এবং base64 encode
        pickled = pickle.dumps(value)
        encoded = base64.b64encode(pickled)
        return encoded.decode('ascii')
    
    def from_db_value(self, value, expression, connection):
        """
        Pickled string থেকে Python object এ convert
        """
        if value is None:
            return None
        
        # Base64 decode এবং unpickle
        decoded = base64.b64decode(value.encode('ascii'))
        return pickle.loads(decoded)
    
    def to_python(self, value):
        """
        Python object এ convert
        """
        if value is None:
            return None
        
        # যদি already unpickled হয়
        if not isinstance(value, str):
            return value
        
        # Unpickle করুন
        decoded = base64.b64decode(value.encode('ascii'))
        return pickle.loads(decoded)
```

---

## 5. Custom Lookups

### Basic Custom Lookup

```python
# myapp/lookups.py

from django.db.models import Lookup

class NotEqual(Lookup):
    """
    Not equal lookup: field__ne=value
    """
    lookup_name = 'ne'
    
    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)
        params = lhs_params + rhs_params
        return f'{lhs} <> {rhs}', params

# Register lookup
from django.db.models import CharField
CharField.register_lookup(NotEqual)
```

```python
# Usage in queries
from myapp.models import Product

# Find products where name is not 'Laptop'
products = Product.objects.filter(name__ne='Laptop')
```

### Complex Custom Lookup

```python
# myapp/lookups.py

from django.db.models import Lookup
from django.db.models.lookups import PatternLookup

class CaseInsensitiveContains(PatternLookup):
    """
    Case-insensitive contains: field__icontains_custom=value
    """
    lookup_name = 'icontains_custom'
    
    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)
        params = lhs_params + rhs_params
        
        # PostgreSQL
        if connection.vendor == 'postgresql':
            return f'UPPER({lhs}) LIKE UPPER({rhs})', params
        
        # MySQL
        elif connection.vendor == 'mysql':
            return f'UPPER({lhs}) LIKE UPPER({rhs})', params
        
        # SQLite
        else:
            return f'{lhs} LIKE {rhs}', params

# Register
from django.db.models import CharField
CharField.register_lookup(CaseInsensitiveContains)
```

### Transform Lookup

```python
# myapp/lookups.py

from django.db.models import Transform

class Reverse(Transform):
    """
    Reverse transform: field__reverse='value'
    """
    lookup_name = 'reverse'
    
    def as_sql(self, compiler, connection):
        lhs, params = compiler.compile(self.lhs)
        return f'REVERSE({lhs})', params

# Register
from django.db.models import CharField
CharField.register_lookup(Reverse)
```

```python
# Usage
# Find products where reversed name is 'potpaL'
products = Product.objects.filter(name__reverse='potpaL')
```

### Custom Lookup for Custom Field

```python
# myapp/lookups.py

from django.db.models import Lookup

class WithinRadius(Lookup):
    """
    Location field এর জন্য radius lookup
    """
    lookup_name = 'within_radius'
    
    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)
        
        # rhs format: 'lat,lng,radius_km'
        params = lhs_params + rhs_params
        
        # Haversine formula for distance calculation
        sql = f"""
        (
            6371 * acos(
                cos(radians(CAST(SUBSTRING_INDEX({rhs}, ',', 1) AS DECIMAL(10,6))))
                * cos(radians(CAST(SUBSTRING_INDEX({lhs}, ',', 1) AS DECIMAL(10,6))))
                * cos(radians(CAST(SUBSTRING_INDEX({lhs}, ',', -1) AS DECIMAL(10,6)))
                    - radians(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX({rhs}, ',', 2), ',', -1) AS DECIMAL(10,6))))
                + sin(radians(CAST(SUBSTRING_INDEX({rhs}, ',', 1) AS DECIMAL(10,6))))
                * sin(radians(CAST(SUBSTRING_INDEX({lhs}, ',', 1) AS DECIMAL(10,6))))
            )
        ) <= CAST(SUBSTRING_INDEX({rhs}, ',', -1) AS DECIMAL(10,2))
        """
        
        return sql, params

# Register with LocationField
from myapp.fields import LocationField
LocationField.register_lookup(WithinRadius)
```

---

## 6. Custom Validators

### Field-Level Validator

```python
# myapp/validators.py

from django.core.exceptions import ValidationError
import re

def validate_phone_bd(value):
    """
    Bangladesh phone number validator
    """
    pattern = r'^(\+880|880|0)?1[3-9]\d{8}$'
    
    if not re.match(pattern, value):
        raise ValidationError(
            '%(value)s is not a valid Bangladesh phone number',
            params={'value': value},
        )

def validate_nid(value):
    """
    Bangladesh NID validator
    """
    if not value.isdigit():
        raise ValidationError('NID must contain only digits')
    
    if len(value) not in [10, 13, 17]:
        raise ValidationError('NID must be 10, 13, or 17 digits')
```

```python
# myapp/fields.py

from django.db import models
from myapp.validators import validate_phone_bd, validate_nid

class PhoneBDField(models.CharField):
    """
    Bangladesh phone number field
    """
    
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 15
        kwargs['validators'] = [validate_phone_bd]
        super().__init__(*args, **kwargs)

class NIDField(models.CharField):
    """
    Bangladesh NID field
    """
    
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 17
        kwargs['validators'] = [validate_nid]
        super().__init__(*args, **kwargs)
```

### Custom Validator Class

```python
# myapp/validators.py

from django.core.validators import BaseValidator
from django.core.exceptions import ValidationError
from decimal import Decimal

class MinValueValidator(BaseValidator):
    """
    Minimum value validator
    """
    message = 'Value must be at least %(limit_value)s'
    code = 'min_value'
    
    def compare(self, a, b):
        return a < b

class MaxValueValidator(BaseValidator):
    """
    Maximum value validator
    """
    message = 'Value must be at most %(limit_value)s'
    code = 'max_value'
    
    def compare(self, a, b):
        return a > b

class RangeValidator:
    """
    Range validator
    """
    message = 'Value must be between %(min)s and %(max)s'
    code = 'out_of_range'
    
    def __init__(self, min_value, max_value):
        self.min_value = min_value
        self.max_value = max_value
    
    def __call__(self, value):
        if not (self.min_value <= value <= self.max_value):
            raise ValidationError(
                self.message,
                code=self.code,
                params={'min': self.min_value, 'max': self.max_value}
            )
    
    def __eq__(self, other):
        return (
            isinstance(other, RangeValidator)
            and self.min_value == other.min_value
            and self.max_value == other.max_value
        )
```

```python
# myapp/fields.py

from django.db import models
from myapp.validators import RangeValidator

class PercentageField(models.DecimalField):
    """
    Percentage field (0-100)
    """
    
    def __init__(self, *args, **kwargs):
        kwargs['max_digits'] = 5
        kwargs['decimal_places'] = 2
        kwargs['validators'] = [RangeValidator(0, 100)]
        super().__init__(*args, **kwargs)
```

### Conditional Validator

```python
# myapp/validators.py

from django.core.exceptions import ValidationError

class ConditionalValidator:
    """
    Conditional validation based on other field
    """
    
    def __init__(self, condition_field, condition_value, validator):
        self.condition_field = condition_field
        self.condition_value = condition_value
        self.validator = validator
    
    def __call__(self, value):
        # এটি model instance level এ কাজ করবে
        # Field level এ direct use করা যাবে না
        pass

# Model level validation
class Product(models.Model):
    product_type = models.CharField(max_length=50)
    weight = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    
    def clean(self):
        """Model-level validation"""
        if self.product_type == 'physical' and not self.weight:
            raise ValidationError('Physical products must have weight')
```

---

## 7. Field Serialization

### Custom Serialization

```python
# myapp/fields.py

from django.db import models
from django.core import serializers
import json

class SerializableField(models.TextField):
    """
    Field যা complex Python objects serialize করে
    """
    
    def __init__(self, *args, **kwargs):
        self.serializer = kwargs.pop('serializer', 'json')
        super().__init__(*args, **kwargs)
    
    def get_prep_value(self, value):
        """Serialize করে database এ save"""
        if value is None:
            return None
        
        if self.serializer == 'json':
            return json.dumps(value)
        else:
            # Custom serializer
            return str(value)
    
    def from_db_value(self, value, expression, connection):
        """Database থেকে deserialize করুন"""
        if value is None:
            return None
        
        if self.serializer == 'json':
            return json.loads(value)
        else:
            return value
    
    def to_python(self, value):
        """Python object এ convert"""
        if value is None:
            return None
        
        if isinstance(value, (dict, list)):
            return value
        
        if self.serializer == 'json':
            return json.loads(value)
        
        return value
    
    def value_to_string(self, obj):
        """
        Serialization এর জন্য string representation
        """
        value = self.value_from_object(obj)
        return self.get_prep_value(value)
```

### REST Framework Serialization

```python
# myapp/serializers.py

from rest_framework import serializers
from myapp.models import Product
from myapp.fields import MoneyField

class MoneyFieldSerializer(serializers.Field):
    """
    MoneyField এর জন্য DRF serializer
    """
    
    def to_representation(self, value):
        """Python object থেকে JSON"""
        if value is None:
            return None
        
        return {
            'amount': str(value.amount),
            'currency': value.currency
        }
    
    def to_internal_value(self, data):
        """JSON থেকে Python object"""
        if not isinstance(data, dict):
            raise serializers.ValidationError('Invalid money format')
        
        if 'amount' not in data or 'currency' not in data:
            raise serializers.ValidationError('Missing amount or currency')
        
        from myapp.fields import Money
        return Money(data['amount'], data['currency'])

class ProductSerializer(serializers.ModelSerializer):
    price = MoneyFieldSerializer()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price']
```

### Form Field Serialization

```python
# myapp/forms.py

from django import forms
from myapp.fields import MoneyField, Money

class MoneyFormField(forms.MultiValueField):
    """
    MoneyField এর জন্য form field
    """
    
    def __init__(self, *args, **kwargs):
        fields = (
            forms.DecimalField(max_digits=10, decimal_places=2),
            forms.ChoiceField(choices=[
                ('USD', 'US Dollar'),
                ('BDT', 'Bangladeshi Taka'),
                ('EUR', 'Euro'),
            ])
        )
        super().__init__(fields, *args, **kwargs)
    
    def compress(self, data_list):
        """Form data থেকে Money object create"""
        if data_list:
            return Money(data_list[0], data_list[1])
        return None

# Field এর সাথে connect করুন
class MoneyField(models.CharField):
    def formfield(self, **kwargs):
        """Custom form field return করুন"""
        from myapp.forms import MoneyFormField
        kwargs['form_class'] = MoneyFormField
        return super().formfield(**kwargs)
```

---

## Complete Example: Custom Field

```python
# myapp/fields.py

from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Lookup
import re

class IPAddressRangeField(models.CharField):
    """
    IP address range field (CIDR notation)
    Example: 192.168.1.0/24
    """
    
    description = "IP Address Range in CIDR notation"
    
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 18  # xxx.xxx.xxx.xxx/xx
        super().__init__(*args, **kwargs)
    
    def deconstruct(self):
        """Migration support"""
        name, path, args, kwargs = super().deconstruct()
        del kwargs['max_length']
        return name, path, args, kwargs
    
    def from_db_value(self, value, expression, connection):
        """Database থেকে Python object"""
        if value is None:
            return None
        return self.to_python(value)
    
    def to_python(self, value):
        """Validate এবং normalize করুন"""
        if value is None:
            return None
        
        if isinstance(value, str):
            # Validate CIDR format
            pattern = r'^(\d{1,3}\.){3}\d{1,3}/\d{1,2}$'
            if not re.match(pattern, value):
                raise ValidationError('Invalid CIDR format')
            
            # Validate IP parts
            ip, mask = value.split('/')
            parts = ip.split('.')
            
            for part in parts:
                if not 0 <= int(part) <= 255:
                    raise ValidationError('Invalid IP address')
            
            # Validate mask
            if not 0 <= int(mask) <= 32:
                raise ValidationError('Invalid subnet mask')
            
            return value
        
        return value
    
    def get_prep_value(self, value):
        """Database এ save করার জন্য prepare"""
        value = super().get_prep_value(value)
        return self.to_python(value)
    
    def formfield(self, **kwargs):
        """Form field customization"""
        kwargs['help_text'] = 'Enter IP range in CIDR notation (e.g., 192.168.1.0/24)'
        return super().formfield(**kwargs)

# Custom lookup for IP range
class IPInRange(Lookup):
    """
    Check if IP is in range: field__ip_in_range='192.168.1.100'
    """
    lookup_name = 'ip_in_range'
    
    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)
        params = lhs_params + rhs_params
        
        # PostgreSQL inet operators
        if connection.vendor == 'postgresql':
            return f'{rhs}::inet <<= {lhs}::cidr', params
        
        # For other databases, use Python-level filtering
        return f'{lhs} = {lhs}', params

# Register lookup
IPAddressRangeField.register_lookup(IPInRange)
```

```python
# models.py

from myapp.fields import IPAddressRangeField

class NetworkSegment(models.Model):
    name = models.CharField(max_length=100)
    ip_range = IPAddressRangeField()
    
    # Usage:
    # segment = NetworkSegment.objects.create(
    #     name='Office Network',
    #     ip_range='192.168.1.0/24'
    # )
    # 
    # # Find segment containing IP
    # segment = NetworkSegment.objects.filter(
    #     ip_range__ip_in_range='192.168.1.100'
    # ).first()
```

---

## সারসংক্ষেপ

Custom model fields তৈরি করে Django এর functionality extend করুন:

### Key Points:

1. **Field Subclassing**: Built-in fields extend করুন
2. **from_db_value()**: Database থেকে Python object এ convert
3. **to_python()**: Input validation এবং normalization
4. **get_prep_value()**: Database এ save করার জন্য prepare
5. **Custom Lookups**: Query capabilities extend করুন
6. **Custom Validators**: Field-specific validation logic
7. **Serialization**: REST APIs এবং forms এর জন্য

Custom fields আপনার application এর specific needs পূরণ করতে powerful tool! 🚀
