# Django Admin Customization

Django Admin হলো একটি powerful built-in interface যা আপনার application এর data manage করতে সাহায্য করে। এই গাইডে আমরা Django Admin কে customize এবং extend করার সব advanced techniques নিয়ে বিস্তারিত আলোচনা করব।

## 1. Custom Admin Site

### Basic Custom Admin Site

```python
# myapp/admin.py

from django.contrib import admin
from django.contrib.admin import AdminSite

class MyAdminSite(AdminSite):
    """Custom admin site"""
    
    # Site header, title, index title customize করুন
    site_header = 'My Company Administration'
    site_title = 'My Company Admin Portal'
    index_title = 'Welcome to My Company Admin'
    
    # Login template customize করুন
    login_template = 'admin/custom_login.html'
    
    # Logout template
    logout_template = 'admin/custom_logout.html'

# Custom admin site instance create করুন
my_admin_site = MyAdminSite(name='myadmin')
```

```python
# urls.py

from django.urls import path
from myapp.admin import my_admin_site

urlpatterns = [
    path('admin/', my_admin_site.urls),  # Custom admin site
]
```

### Multiple Admin Sites

```python
# myapp/admin.py

from django.contrib.admin import AdminSite

class StaffAdminSite(AdminSite):
    """Admin site for staff users"""
    site_header = 'Staff Administration'
    site_title = 'Staff Portal'

class ManagerAdminSite(AdminSite):
    """Admin site for managers"""
    site_header = 'Manager Administration'
    site_title = 'Manager Portal'

# Create instances
staff_admin_site = StaffAdminSite(name='staff_admin')
manager_admin_site = ManagerAdminSite(name='manager_admin')
```

```python
# urls.py

from myapp.admin import staff_admin_site, manager_admin_site

urlpatterns = [
    path('staff-admin/', staff_admin_site.urls),
    path('manager-admin/', manager_admin_site.urls),
]
```

---

## 2. AdminSite Subclass

### Custom AdminSite with Permissions

```python
# myapp/admin.py

from django.contrib.admin import AdminSite
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib.auth.views import redirect_to_login
from django.shortcuts import redirect

class CustomAdminSite(AdminSite):
    """
    Custom admin site with additional features
    """
    
    def has_permission(self, request):
        """
        Custom permission check
        """
        # শুধু staff users access করতে পারবে
        return request.user.is_active and request.user.is_staff
    
    def login(self, request, extra_context=None):
        """
        Custom login logic
        """
        # Custom login page redirect করুন
        if request.method == 'GET' and self.has_permission(request):
            # Already logged in
            index_path = self.get_urls()[0].pattern
            return redirect(index_path)
        
        return super().login(request, extra_context)
    
    def each_context(self, request):
        """
        Add custom context to all admin pages
        """
        context = super().each_context(request)
        
        # Custom context variables
        context['company_name'] = 'My Company'
        context['support_email'] = 'support@mycompany.com'
        context['custom_links'] = [
            {'url': '/reports/', 'title': 'Reports'},
            {'url': '/analytics/', 'title': 'Analytics'},
        ]
        
        return context

# Create instance
custom_admin = CustomAdminSite(name='custom_admin')
```

### AdminSite with Custom Index

```python
# myapp/admin.py

from django.contrib.admin import AdminSite
from django.shortcuts import render
from django.db.models import Count

class DashboardAdminSite(AdminSite):
    """
    Admin site with custom dashboard
    """
    
    index_template = 'admin/custom_index.html'
    
    def index(self, request, extra_context=None):
        """
        Custom index page with statistics
        """
        from myapp.models import Product, Order, Customer
        
        # Statistics gather করুন
        stats = {
            'total_products': Product.objects.count(),
            'total_orders': Order.objects.count(),
            'total_customers': Customer.objects.count(),
            'pending_orders': Order.objects.filter(status='pending').count(),
            'recent_orders': Order.objects.order_by('-created_at')[:5],
        }
        
        extra_context = extra_context or {}
        extra_context['stats'] = stats
        
        return super().index(request, extra_context)

dashboard_admin = DashboardAdminSite(name='dashboard_admin')
```

---

## 3. Custom Admin Templates

### Custom Base Template

::: v-pre
```html
<!-- templates/admin/base_site.html -->

{% extends "admin/base.html" %}

{% block title %}
    {% if subtitle %}{{ subtitle }} | {% endif %}{{ title }} | {{ site_title|default:_('Django site admin') }}
{% endblock %}

{% block branding %}
<h1 id="site-name">
    <a href="{% url 'admin:index' %}">
        <img src="/static/admin/img/logo.png" alt="Logo" style="height: 40px;">
        {{ site_header|default:_('Django administration') }}
    </a>
</h1>
{% endblock %}

{% block nav-global %}
<nav class="custom-nav">
    <ul>
        <li><a href="{% url 'admin:index' %}">Dashboard</a></li>
        <li><a href="/reports/">Reports</a></li>
        <li><a href="/analytics/">Analytics</a></li>
    </ul>
</nav>
{% endblock %}

{% block footer %}
<div id="footer">
    <p>&copy; 2026 My Company. All rights reserved.</p>
    <p>Support: <a href="mailto:support@mycompany.com">support@mycompany.com</a></p>
</div>
{% endblock %}
```
:::

### Custom Change List Template

::: v-pre
```html
<!-- templates/admin/myapp/product/change_list.html -->

{% extends "admin/change_list.html" %}

{% block content_title %}
<h1>Product Management</h1>
<p class="help">Manage your products inventory</p>
{% endblock %}

{% block object-tools %}
{{ block.super }}
<div class="custom-tools">
    <a href="{% url 'admin:myapp_product_export' %}" class="button">
        Export to CSV
    </a>
    <a href="{% url 'admin:myapp_product_import' %}" class="button">
        Import from CSV
    </a>
</div>
{% endblock %}

{% block result_list %}
<div class="custom-stats">
    <div class="stat-box">
        <h3>Total Products</h3>
        <p>{{ cl.result_count }}</p>
    </div>
    <div class="stat-box">
        <h3>In Stock</h3>
        <p>{{ in_stock_count }}</p>
    </div>
    <div class="stat-box">
        <h3>Out of Stock</h3>
        <p>{{ out_of_stock_count }}</p>
    </div>
</div>

{{ block.super }}
{% endblock %}
```
:::

### Custom Change Form Template

::: v-pre
```html
<!-- templates/admin/myapp/product/change_form.html -->

{% extends "admin/change_form.html" %}

{% block field_sets %}
<div class="custom-form-header">
    <h2>{% if original %}Edit Product{% else %}Add New Product{% endif %}</h2>
</div>

{{ block.super }}
{% endblock %}
```
:::
{% block after_field_sets %}
<div class="custom-help-section">
    <h3>Help & Guidelines</h3>
    <ul>
        <li>SKU must be unique</li>
        <li>Price should be in USD</li>
        <li>Upload high-quality images (min 800x800px)</li>
    </ul>
</div>
{% endblock %}

::: v-pre
```html
{% block submit_buttons_bottom %}
{{ block.super }}
<div class="custom-actions">
    <button type="submit" name="_continue" class="button">
        Save and Continue Editing
    </button>
    <button type="submit" name="_addanother" class="button">
        Save and Add Another
    </button>
</div>
{% endblock %}
```
:::

---

## 4. Admin Widgets

### Custom Widget for Admin

```python
# myapp/widgets.py

from django import forms
from django.utils.safestring import mark_safe

class ColorPickerWidget(forms.TextInput):
    """
    Color picker widget for admin
    """
    
    def __init__(self, attrs=None):
        default_attrs = {'type': 'color'}
        if attrs:
            default_attrs.update(attrs)
        super().__init__(default_attrs)
    
    class Media:
        css = {
            'all': ('admin/css/color-picker.css',)
        }
        js = ('admin/js/color-picker.js',)

class RichTextWidget(forms.Textarea):
    """
    Rich text editor widget (TinyMCE/CKEditor)
    """
    
    def __init__(self, attrs=None):
        default_attrs = {'class': 'rich-text-editor'}
        if attrs:
            default_attrs.update(attrs)
        super().__init__(default_attrs)
    
    class Media:
        js = (
            'https://cdn.tiny.cloud/1/YOUR_API_KEY/tinymce/5/tinymce.min.js',
            'admin/js/tinymce-init.js',
        )

class ImagePreviewWidget(forms.ClearableFileInput):
    """
    Image upload widget with preview
    """
    
    template_name = 'admin/widgets/image_preview.html'
    
    def render(self, name, value, attrs=None, renderer=None):
        html = super().render(name, value, attrs, renderer)
        
        if value and hasattr(value, 'url'):
            preview = f'''
            <div class="image-preview">
                <img src="{value.url}" alt="Preview" style="max-width: 200px;">
            </div>
            '''
            html = mark_safe(preview + html)
        
        return html
```

```python
# myapp/admin.py

from django.contrib import admin
from myapp.models import Product
from myapp.widgets import ColorPickerWidget, RichTextWidget, ImagePreviewWidget

class ProductAdmin(admin.ModelAdmin):
    formfield_overrides = {
        models.CharField: {'widget': forms.TextInput(attrs={'size': '80'})},
    }
    
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        """Custom widgets for specific fields"""
        
        if db_field.name == 'color':
            kwargs['widget'] = ColorPickerWidget()
        
        elif db_field.name == 'description':
            kwargs['widget'] = RichTextWidget()
        
        elif db_field.name == 'image':
            kwargs['widget'] = ImagePreviewWidget()
        
        return super().formfield_for_dbfield(db_field, request, **kwargs)

admin.site.register(Product, ProductAdmin)
```

---

## 5. Admin Forms

### Custom Admin Form

```python
# myapp/forms.py

from django import forms
from myapp.models import Product

class ProductAdminForm(forms.ModelForm):
    """
    Custom form for Product admin
    """
    
    # Extra fields যা model এ নেই
    notify_users = forms.BooleanField(
        required=False,
        help_text='Send notification to users about this product'
    )
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Field customization
        self.fields['name'].widget.attrs.update({
            'class': 'vTextField',
            'placeholder': 'Enter product name'
        })
        
        # Conditional field requirements
        if self.instance.pk:  # Editing existing product
            self.fields['sku'].disabled = True
    
    def clean_price(self):
        """Custom validation for price"""
        price = self.cleaned_data.get('price')
        
        if price and price < 0:
            raise forms.ValidationError('Price cannot be negative')
        
        return price
    
    def clean(self):
        """Cross-field validation"""
        cleaned_data = super().clean()
        
        stock = cleaned_data.get('stock')
        status = cleaned_data.get('status')
        
        if status == 'active' and stock == 0:
            raise forms.ValidationError(
                'Active products must have stock'
            )
        
        return cleaned_data
    
    def save(self, commit=True):
        """Custom save logic"""
        instance = super().save(commit=False)
        
        # Custom processing
        if self.cleaned_data.get('notify_users'):
            # Send notifications
            self.send_notifications(instance)
        
        if commit:
            instance.save()
        
        return instance
    
    def send_notifications(self, product):
        """Send notifications to users"""
        # Notification logic
        pass
```

```python
# myapp/admin.py

from django.contrib import admin
from myapp.models import Product
from myapp.forms import ProductAdminForm

class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'sku', 'category')
        }),
        ('Pricing', {
            'fields': ('price', 'discount')
        }),
        ('Inventory', {
            'fields': ('stock', 'status')
        }),
        ('Notifications', {
            'fields': ('notify_users',),
            'classes': ('collapse',)
        }),
    )

admin.site.register(Product, ProductAdmin)
```

### Dynamic Form Fields

```python
# myapp/admin.py

from django.contrib import admin

class DynamicProductAdmin(admin.ModelAdmin):
    
    def get_form(self, request, obj=None, **kwargs):
        """
        Dynamically modify form based on user/object
        """
        form = super().get_form(request, obj, **kwargs)
        
        # Superuser এর জন্য additional fields
        if request.user.is_superuser:
            form.base_fields['internal_notes'] = forms.CharField(
                widget=forms.Textarea,
                required=False
            )
        
        # Editing existing object
        if obj:
            # Disable certain fields when editing
            form.base_fields['created_by'].disabled = True
        
        return form
    
    def get_readonly_fields(self, request, obj=None):
        """
        Dynamic readonly fields
        """
        readonly = list(super().get_readonly_fields(request, obj))
        
        # Non-superusers cannot edit price
        if not request.user.is_superuser:
            readonly.append('price')
        
        # Created date always readonly
        if obj:  # Editing
            readonly.append('created_at')
        
        return readonly
```

---

## 6. Admin Filters

### Custom List Filter

```python
# myapp/admin.py

from django.contrib import admin
from django.utils.translation import gettext_lazy as _

class PriceRangeFilter(admin.SimpleListFilter):
    """
    Custom filter for price ranges
    """
    title = _('Price Range')
    parameter_name = 'price_range'
    
    def lookups(self, request, model_admin):
        """Filter options"""
        return (
            ('0-100', _('$0 - $100')),
            ('100-500', _('$100 - $500')),
            ('500-1000', _('$500 - $1000')),
            ('1000+', _('$1000+')),
        )
    
    def queryset(self, request, queryset):
        """Apply filter"""
        if self.value() == '0-100':
            return queryset.filter(price__gte=0, price__lte=100)
        
        elif self.value() == '100-500':
            return queryset.filter(price__gte=100, price__lte=500)
        
        elif self.value() == '500-1000':
            return queryset.filter(price__gte=500, price__lte=1000)
        
        elif self.value() == '1000+':
            return queryset.filter(price__gte=1000)

class StockStatusFilter(admin.SimpleListFilter):
    """
    Filter by stock status
    """
    title = _('Stock Status')
    parameter_name = 'stock_status'
    
    def lookups(self, request, model_admin):
        return (
            ('in_stock', _('In Stock')),
            ('low_stock', _('Low Stock (< 10)')),
            ('out_of_stock', _('Out of Stock')),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'in_stock':
            return queryset.filter(stock__gt=0)
        
        elif self.value() == 'low_stock':
            return queryset.filter(stock__gt=0, stock__lt=10)
        
        elif self.value() == 'out_of_stock':
            return queryset.filter(stock=0)

class ProductAdmin(admin.ModelAdmin):
    list_filter = [
        PriceRangeFilter,
        StockStatusFilter,
        'category',
        'status',
    ]

admin.site.register(Product, ProductAdmin)
```

### Related Field Filter

```python
# myapp/admin.py

from django.contrib import admin

class CategoryFilter(admin.RelatedFieldListFilter):
    """
    Custom related field filter
    """
    
    def field_choices(self, field, request, model_admin):
        """
        Customize choices shown in filter
        """
        # শুধু active categories show করুন
        return field.get_choices(
            include_blank=False,
            limit_choices_to={'is_active': True}
        )

class ProductAdmin(admin.ModelAdmin):
    list_filter = [
        ('category', CategoryFilter),
    ]
```

### Date Hierarchy Filter

```python
# myapp/admin.py

class ProductAdmin(admin.ModelAdmin):
    # Date-based drilling down
    date_hierarchy = 'created_at'
    
    list_filter = [
        'created_at',
        'updated_at',
    ]
```

---

## 7. Admin Actions

### Basic Admin Action

```python
# myapp/admin.py

from django.contrib import admin
from django.contrib import messages

def make_active(modeladmin, request, queryset):
    """
    Mark selected products as active
    """
    updated = queryset.update(status='active')
    
    modeladmin.message_user(
        request,
        f'{updated} products marked as active.',
        messages.SUCCESS
    )

make_active.short_description = 'Mark selected as active'

class ProductAdmin(admin.ModelAdmin):
    actions = [make_active]

admin.site.register(Product, ProductAdmin)
```

### Advanced Admin Action

```python
# myapp/admin.py

from django.contrib import admin
from django.http import HttpResponse
import csv

def export_to_csv(modeladmin, request, queryset):
    """
    Export selected products to CSV
    """
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="products.csv"'
    
    writer = csv.writer(response)
    
    # Header
    writer.writerow(['ID', 'Name', 'SKU', 'Price', 'Stock'])
    
    # Data
    for product in queryset:
        writer.writerow([
            product.id,
            product.name,
            product.sku,
            product.price,
            product.stock
        ])
    
    return response

export_to_csv.short_description = 'Export to CSV'

def bulk_discount(modeladmin, request, queryset):
    """
    Apply bulk discount
    """
    from django.db.models import F
    
    # 10% discount apply করুন
    updated = queryset.update(price=F('price') * 0.9)
    
    modeladmin.message_user(
        request,
        f'10% discount applied to {updated} products.',
        messages.SUCCESS
    )

bulk_discount.short_description = 'Apply 10% discount'

class ProductAdmin(admin.ModelAdmin):
    actions = [export_to_csv, bulk_discount]
```

### Action with Intermediate Page

```python
# myapp/admin.py

from django.contrib import admin
from django.shortcuts import render
from django import forms

class BulkUpdateForm(forms.Form):
    """Form for bulk update action"""
    discount_percentage = forms.DecimalField(
        max_digits=5,
        decimal_places=2,
        min_value=0,
        max_value=100
    )

def bulk_update_price(modeladmin, request, queryset):
    """
    Bulk update with intermediate page
    """
    if 'apply' in request.POST:
        # Form submitted
        form = BulkUpdateForm(request.POST)
        
        if form.is_valid():
            discount = form.cleaned_data['discount_percentage']
            
            # Apply discount
            from django.db.models import F
            updated = queryset.update(
                price=F('price') * (1 - discount / 100)
            )
            
            modeladmin.message_user(
                request,
                f'{discount}% discount applied to {updated} products.'
            )
            
            return None
    
    else:
        # Show form
        form = BulkUpdateForm()
    
    return render(
        request,
        'admin/bulk_update.html',
        {
            'form': form,
            'products': queryset,
            'action': 'bulk_update_price'
        }
    )

bulk_update_price.short_description = 'Bulk update prices'
```

---

## 8. Inline Editing

### Basic Inline

```python
# myapp/admin.py

from django.contrib import admin
from myapp.models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    """
    Inline for order items
    """
    model = OrderItem
    extra = 1  # Empty forms to show
    fields = ['product', 'quantity', 'price']
    
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    
    list_display = ['order_number', 'customer', 'total', 'status']

admin.site.register(Order, OrderAdmin)
```

### Stacked Inline

```python
# myapp/admin.py

class OrderItemInline(admin.StackedInline):
    """
    Stacked inline (vertical layout)
    """
    model = OrderItem
    extra = 1
    
    fieldsets = (
        ('Product Information', {
            'fields': ('product', 'quantity')
        }),
        ('Pricing', {
            'fields': ('price', 'discount')
        }),
    )
```

### Advanced Inline Configuration

```python
# myapp/admin.py

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    
    # Fields configuration
    fields = ['product', 'quantity', 'unit_price', 'total_price']
    readonly_fields = ['total_price']
    
    # Autocomplete for foreign keys
    autocomplete_fields = ['product']
    
    # Permissions
    can_delete = True
    show_change_link = True
    
    # Custom queryset
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('product')
    
    # Calculated field
    def total_price(self, obj):
        if obj.quantity and obj.unit_price:
            return obj.quantity * obj.unit_price
        return 0
    
    total_price.short_description = 'Total'
```

### Nested Inlines (Third-party: django-nested-admin)

```python
# Install: pip install django-nested-admin

# myapp/admin.py

import nested_admin

class OrderItemInline(nested_admin.NestedTabularInline):
    model = OrderItem
    extra = 1

class OrderInline(nested_admin.NestedStackedInline):
    model = Order
    inlines = [OrderItemInline]
    extra = 0

class CustomerAdmin(nested_admin.NestedModelAdmin):
    inlines = [OrderInline]

admin.site.register(Customer, CustomerAdmin)
```

---

## 9. Admin Permissions

### Custom Permissions

```python
# myapp/models.py

from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        permissions = [
            ('can_publish', 'Can publish products'),
            ('can_approve', 'Can approve products'),
            ('can_export', 'Can export products'),
        ]
```

```python
# myapp/admin.py

from django.contrib import admin

class ProductAdmin(admin.ModelAdmin):
    
    def has_publish_permission(self, request):
        """Check if user can publish"""
        return request.user.has_perm('myapp.can_publish')
    
    def get_actions(self, request):
        """Filter actions based on permissions"""
        actions = super().get_actions(request)
        
        # Remove export action if no permission
        if not request.user.has_perm('myapp.can_export'):
            if 'export_to_csv' in actions:
                del actions['export_to_csv']
        
        return actions
    
    def get_readonly_fields(self, request, obj=None):
        """Dynamic readonly based on permissions"""
        readonly = list(super().get_readonly_fields(request, obj))
        
        # Non-approvers cannot edit status
        if not request.user.has_perm('myapp.can_approve'):
            readonly.append('status')
        
        return readonly
```

### Row-Level Permissions

```python
# myapp/admin.py

class ProductAdmin(admin.ModelAdmin):
    
    def get_queryset(self, request):
        """
        Filter queryset based on user
        """
        qs = super().get_queryset(request)
        
        # Superusers see all
        if request.user.is_superuser:
            return qs
        
        # Others see only their own products
        return qs.filter(created_by=request.user)
    
    def has_change_permission(self, request, obj=None):
        """
        Object-level change permission
        """
        has_perm = super().has_change_permission(request, obj)
        
        if not has_perm:
            return False
        
        # Check object ownership
        if obj and obj.created_by != request.user:
            return False
        
        return True
    
    def has_delete_permission(self, request, obj=None):
        """
        Object-level delete permission
        """
        has_perm = super().has_delete_permission(request, obj)
        
        if not has_perm:
            return False
        
        # Only owner can delete
        if obj and obj.created_by != request.user:
            return False
        
        return True
```

### Permission-Based Field Display

```python
# myapp/admin.py

class ProductAdmin(admin.ModelAdmin):
    
    def get_fieldsets(self, request, obj=None):
        """
        Dynamic fieldsets based on permissions
        """
        fieldsets = [
            ('Basic Information', {
                'fields': ('name', 'sku', 'category')
            }),
        ]
        
        # Pricing fieldset শুধু authorized users এর জন্য
        if request.user.has_perm('myapp.view_pricing'):
            fieldsets.append(
                ('Pricing', {
                    'fields': ('price', 'cost', 'margin')
                })
            )
        
        # Internal notes শুধু staff এর জন্য
        if request.user.is_staff:
            fieldsets.append(
                ('Internal', {
                    'fields': ('internal_notes',),
                    'classes': ('collapse',)
                })
            )
        
        return fieldsets
    
    def get_list_display(self, request):
        """
        Dynamic list display based on permissions
        """
        list_display = ['name', 'sku', 'category']
        
        if request.user.has_perm('myapp.view_pricing'):
            list_display.extend(['price', 'stock'])
        
        if request.user.is_superuser:
            list_display.append('created_by')
        
        return list_display
```

---

## সারসংক্ষেপ

Django Admin কে customize করে powerful এবং user-friendly interface তৈরি করুন:

### Key Points:

1. **Custom Admin Site**: Multiple admin sites, custom branding
2. **AdminSite Subclass**: Custom permissions, dashboard, context
3. **Custom Templates**: Base, change list, change form templates
4. **Admin Widgets**: Color picker, rich text, image preview
5. **Admin Forms**: Validation, dynamic fields, custom save
6. **Admin Filters**: Price range, stock status, related fields
7. **Admin Actions**: Export, bulk update, intermediate pages
8. **Inline Editing**: Tabular, stacked, nested inlines
9. **Admin Permissions**: Custom, row-level, field-level permissions

Django Admin customization আপনার application এর management interface কে professional level এ নিয়ে যায়! 🚀
