# Full-Text Search

সাধারণ `__icontains` লুকআপ দিয়ে সার্চ করা যায়, কিন্তু এটি স্লো এবং লিমিটেড। প্রফেশনাল সার্চ ফিচারের জন্য **Full-Text Search** ব্যবহার করা হয়।

## PostgreSQL Full-Text Search

PostgreSQL এর বিল্ট-ইন সার্চ ফিচার Django তে `django.contrib.postgres.search` মডিউলের মাধ্যমে ব্যবহার করা যায়।

**Setup:**
```python
# settings.py
INSTALLED_APPS = [
    'django.contrib.postgres',
    # ...
]
```

### SearchVector & SearchQuery

```python
from django.contrib.postgres.search import SearchVector, SearchQuery

# Simple search
Product.objects.annotate(
    search=SearchVector('name', 'description'),
).filter(search='laptop')
```

### SearchRank (Relevance Scoring)

সার্চ রেজাল্ট কতটা রিলেভেন্ট তার উপর ভিত্তি করে সর্ট করা।

```python
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

query = SearchQuery('laptop')
vector = SearchVector('name', 'description')

Product.objects.annotate(
    rank=SearchRank(vector, query)
).filter(rank__gte=0.3).order_by('-rank')
```

### SearchVectorField (Performance)

বারবার `SearchVector` ক্যালকুলেট না করে মডেলে স্টোর করে রাখা যায়।

```python
from django.contrib.postgres.search import SearchVectorField
from django.contrib.postgres.indexes import GinIndex

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    search_vector = SearchVectorField(null=True)

    class Meta:
        indexes = [
            GinIndex(fields=['search_vector']),
        ]
```

**Update Search Vector:**
```python
from django.contrib.postgres.search import SearchVector

Product.objects.update(search_vector=SearchVector('name', 'description'))
```

## Elasticsearch Integration

বড় ডেটাসেট এবং কমপ্লেক্স সার্চের জন্য Elasticsearch ব্যবহার করা হয়।

**Installation:**
```bash
pip install django-elasticsearch-dsl
```

**Configuration:**
```python
# settings.py
INSTALLED_APPS = [
    'django_elasticsearch_dsl',
    # ...
]

ELASTICSEARCH_DSL = {
    'default': {
        'hosts': 'localhost:9200'
    },
}
```

### Document Definition

```python
# documents.py
from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import Product

@registry.register_document
class ProductDocument(Document):
    class Index:
        name = 'products'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0
        }

    class Django:
        model = Product
        fields = [
            'name',
            'description',
            'price',
        ]
```

### Indexing

```bash
python manage.py search_index --rebuild
```

### Searching

```python
from .documents import ProductDocument

# Simple search
results = ProductDocument.search().query("match", name="laptop")

# Multi-field search
results = ProductDocument.search().query(
    "multi_match", 
    query="laptop", 
    fields=['name', 'description']
)
```

### Faceted Search

```python
search = ProductDocument.search()
search.aggs.bucket('price_ranges', 'range', field='price', ranges=[
    {"to": 100},
    {"from": 100, "to": 500},
    {"from": 500}
])
```
