# API Documentation

API ডকুমেন্টেশন ডেভেলপার এবং ক্লায়েন্টদের জন্য অত্যন্ত গুরুত্বপূর্ণ। **drf-spectacular** হলো DRF এর জন্য সবচেয়ে আধুনিক এবং OpenAPI 3.0 কমপ্লায়েন্ট ডকুমেন্টেশন টুল।

## Installation

```bash
pip install drf-spectacular
```

## Configuration

```python
# settings.py
INSTALLED_APPS = [
    # ...
    'rest_framework',
    'drf_spectacular',
]

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'My API',
    'DESCRIPTION': 'API documentation for My Project',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
```

## URL Configuration

```python
# urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Schema endpoint
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    
    # Swagger UI
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # ReDoc UI
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
```

এখন `/api/docs/` এ গেলে ইন্টারঅ্যাক্টিভ Swagger UI দেখতে পাবেন।

## Customizing Endpoints

### Adding Descriptions

```python
from drf_spectacular.utils import extend_schema

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    @extend_schema(
        summary="List all products",
        description="Returns a paginated list of all products in the database.",
        tags=['Products']
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
```

### Request/Response Examples

```python
@extend_schema(
    request=ProductSerializer,
    responses={
        200: ProductSerializer,
        400: OpenApiResponse(description='Bad request'),
    },
    examples=[
        OpenApiExample(
            'Valid Product',
            value={
                'name': 'Laptop',
                'price': 999.99,
                'stock': 10
            },
            request_only=True,
        ),
    ]
)
def create(self, request, *args, **kwargs):
    return super().create(request, *args, **kwargs)
```

### Grouping with Tags

```python
@extend_schema(tags=['Products'])
class ProductViewSet(viewsets.ModelViewSet):
    # ...
```

## Authentication Documentation

```python
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

@extend_schema(
    parameters=[
        OpenApiParameter(
            name='Authorization',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.HEADER,
            description='Bearer token',
            required=True
        ),
    ]
)
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    # ...
```

## Schema Generation (CLI)

স্ট্যাটিক ফাইল হিসেবে স্কিমা এক্সপোর্ট করতে:

```bash
python manage.py spectacular --file schema.yml
```
