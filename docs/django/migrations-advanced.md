# Database Migrations Advanced

Django migrations হলো database schema changes track এবং apply করার একটি powerful system। এই গাইডে আমরা advanced migration concepts এবং techniques নিয়ে বিস্তারিত আলোচনা করব।

## 1. Migration Files

### Migration File Structure

```python
# migrations/0001_initial.py

from django.db import migrations, models

class Migration(migrations.Migration):
    
    # Migration metadata
    initial = True  # প্রথম migration কিনা
    
    # Dependencies - এই migration কোন migrations এর পর run হবে
    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]
    
    # Operations - কী কী changes করা হবে
    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('price', models.DecimalField(max_digits=10, decimal_places=2)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'products',
                'ordering': ['-created_at'],
            },
        ),
    ]
```

### Migration File Components

```python
# migrations/0002_add_category.py

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    
    # এই migration এর dependencies
    dependencies = [
        ('myapp', '0001_initial'),  # Previous migration
        ('categories', '0001_initial'),  # অন্য app এর migration
    ]
    
    # Operations list
    operations = [
        # Add field
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to='categories.category',
                null=True
            ),
        ),
        
        # Add index
        migrations.AddIndex(
            model_name='product',
            index=models.Index(
                fields=['category', '-created_at'],
                name='product_cat_created_idx'
            ),
        ),
    ]
```

### Custom Migration Operations

```python
# migrations/0003_custom_operation.py

from django.db import migrations

def create_default_categories(apps, schema_editor):
    """Custom function to create default data"""
    Category = apps.get_model('myapp', 'Category')
    
    default_categories = [
        {'name': 'Electronics', 'slug': 'electronics'},
        {'name': 'Clothing', 'slug': 'clothing'},
        {'name': 'Books', 'slug': 'books'},
    ]
    
    for cat_data in default_categories:
        Category.objects.create(**cat_data)

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0002_add_category'),
    ]
    
    operations = [
        migrations.RunPython(
            create_default_categories,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
```

### Migration File Naming

```bash
# Django automatically generates migration files with sequential numbers
migrations/
├── __init__.py
├── 0001_initial.py                    # প্রথম migration
├── 0002_product_category.py           # Field addition
├── 0003_alter_product_price.py        # Field modification
├── 0004_auto_20260113_1234.py         # Auto-generated
└── 0005_custom_data_migration.py      # Custom migration
```

---

## 2. Migration Dependencies

### Simple Dependencies

```python
# migrations/0002_add_profile.py

class Migration(migrations.Migration):
    
    dependencies = [
        # এই app এর previous migration
        ('myapp', '0001_initial'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('bio', models.TextField()),
            ],
        ),
    ]
```

### Cross-App Dependencies

```python
# app1/migrations/0003_add_foreign_key.py

class Migration(migrations.Migration):
    
    dependencies = [
        ('app1', '0002_previous_migration'),
        ('app2', '0001_initial'),  # অন্য app এর migration
    ]
    
    operations = [
        migrations.AddField(
            model_name='order',
            name='customer',
            field=models.ForeignKey(
                to='app2.customer',
                on_delete=models.CASCADE,
            ),
        ),
    ]
```

### Multiple Dependencies

```python
# migrations/0005_merge_branches.py

class Migration(migrations.Migration):
    
    # Multiple migration branches merge করা
    dependencies = [
        ('myapp', '0003_branch_a'),
        ('myapp', '0004_branch_b'),
    ]
    
    operations = [
        # Merge operations
    ]
```

### Dependency Resolution

```python
# migrations/0006_complex_dependencies.py

class Migration(migrations.Migration):
    
    dependencies = [
        # নিজের app
        ('myapp', '0005_merge_branches'),
        
        # অন্য apps
        ('auth', '0012_alter_user_first_name_max_length'),
        ('contenttypes', '0002_remove_content_type_name'),
        ('sessions', '0001_initial'),
    ]
    
    operations = [
        # Complex operations
    ]
```

---

## 3. Data Migrations

### Basic Data Migration

```python
# migrations/0007_populate_default_data.py

from django.db import migrations

def create_default_users(apps, schema_editor):
    """Default users create করুন"""
    User = apps.get_model('auth', 'User')
    
    users_data = [
        {'username': 'admin', 'email': 'admin@example.com', 'is_staff': True},
        {'username': 'user1', 'email': 'user1@example.com', 'is_staff': False},
    ]
    
    for user_data in users_data:
        User.objects.create(**user_data)

def delete_default_users(apps, schema_editor):
    """Reverse operation"""
    User = apps.get_model('auth', 'User')
    User.objects.filter(username__in=['admin', 'user1']).delete()

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0006_complex_dependencies'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]
    
    operations = [
        migrations.RunPython(
            create_default_users,
            reverse_code=delete_default_users,
        ),
    ]
```

### Data Transformation Migration

```python
# migrations/0008_transform_data.py

from django.db import migrations

def transform_prices(apps, schema_editor):
    """Prices কে USD থেকে BDT তে convert করুন"""
    Product = apps.get_model('myapp', 'Product')
    
    # Bulk update for better performance
    products = Product.objects.all()
    
    for product in products:
        # USD to BDT conversion (1 USD = 110 BDT)
        product.price = product.price * 110
    
    # Bulk update
    Product.objects.bulk_update(products, ['price'])

def reverse_transform_prices(apps, schema_editor):
    """Reverse: BDT থেকে USD"""
    Product = apps.get_model('myapp', 'Product')
    
    products = Product.objects.all()
    
    for product in products:
        product.price = product.price / 110
    
    Product.objects.bulk_update(products, ['price'])

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0007_populate_default_data'),
    ]
    
    operations = [
        migrations.RunPython(
            transform_prices,
            reverse_code=reverse_transform_prices,
        ),
    ]
```

### Complex Data Migration

```python
# migrations/0009_migrate_user_profiles.py

from django.db import migrations

def migrate_user_profiles(apps, schema_editor):
    """
    Old UserProfile থেকে new Profile model এ data migrate করুন
    """
    OldProfile = apps.get_model('myapp', 'UserProfile')
    NewProfile = apps.get_model('myapp', 'Profile')
    User = apps.get_model('auth', 'User')
    
    # Batch processing for better performance
    batch_size = 1000
    old_profiles = OldProfile.objects.all()
    
    new_profiles = []
    
    for old_profile in old_profiles.iterator(chunk_size=batch_size):
        new_profile = NewProfile(
            user_id=old_profile.user_id,
            bio=old_profile.biography or '',
            avatar=old_profile.profile_picture,
            phone=old_profile.contact_number,
            # Data transformation
            full_name=f"{old_profile.first_name} {old_profile.last_name}",
        )
        new_profiles.append(new_profile)
        
        # Bulk create in batches
        if len(new_profiles) >= batch_size:
            NewProfile.objects.bulk_create(new_profiles)
            new_profiles = []
    
    # Create remaining profiles
    if new_profiles:
        NewProfile.objects.bulk_create(new_profiles)

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0008_transform_data'),
    ]
    
    operations = [
        migrations.RunPython(
            migrate_user_profiles,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
```

### Conditional Data Migration

```python
# migrations/0010_conditional_migration.py

from django.db import migrations

def conditional_data_update(apps, schema_editor):
    """
    শুধুমাত্র specific conditions এ data update করুন
    """
    Product = apps.get_model('myapp', 'Product')
    
    # শুধু inactive products এর price update করুন
    inactive_products = Product.objects.filter(is_active=False)
    
    for product in inactive_products:
        # 20% discount apply করুন
        product.price = product.price * 0.8
        product.discount_applied = True
    
    Product.objects.bulk_update(
        inactive_products,
        ['price', 'discount_applied']
    )

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0009_migrate_user_profiles'),
    ]
    
    operations = [
        migrations.RunPython(
            conditional_data_update,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
```

---

## 4. RunPython Operations

### Basic RunPython

```python
# migrations/0011_runpython_basic.py

from django.db import migrations

def forward_func(apps, schema_editor):
    """Forward migration logic"""
    MyModel = apps.get_model('myapp', 'MyModel')
    # Operations
    pass

def reverse_func(apps, schema_editor):
    """Reverse migration logic"""
    MyModel = apps.get_model('myapp', 'MyModel')
    # Reverse operations
    pass

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0010_conditional_migration'),
    ]
    
    operations = [
        migrations.RunPython(
            forward_func,
            reverse_code=reverse_func,
        ),
    ]
```

### RunPython with Database Router

```python
# migrations/0012_runpython_with_router.py

from django.db import migrations

def update_analytics_data(apps, schema_editor):
    """
    Specific database এ data update করুন
    """
    # Database alias check করুন
    if schema_editor.connection.alias != 'analytics':
        return
    
    AnalyticsData = apps.get_model('myapp', 'AnalyticsData')
    
    # Analytics database এ operations
    AnalyticsData.objects.using('analytics').update(
        processed=True
    )

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0011_runpython_basic'),
    ]
    
    operations = [
        migrations.RunPython(
            update_analytics_data,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
```

### RunPython with Hints

```python
# migrations/0013_runpython_hints.py

from django.db import migrations

def complex_operation(apps, schema_editor):
    """
    Complex operation with database hints
    """
    Product = apps.get_model('myapp', 'Product')
    Category = apps.get_model('myapp', 'Category')
    
    # Get database alias from schema_editor
    db_alias = schema_editor.connection.alias
    
    # Use specific database
    products = Product.objects.using(db_alias).all()
    
    for product in products:
        # Complex logic
        pass

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0012_runpython_with_router'),
    ]
    
    operations = [
        migrations.RunPython(
            complex_operation,
            hints={'target_db': 'default'},
        ),
    ]
```

### RunPython with Atomic

```python
# migrations/0014_runpython_atomic.py

from django.db import migrations, transaction

def atomic_operation(apps, schema_editor):
    """
    Atomic operation - সব success হবে অথবা সব rollback হবে
    """
    Product = apps.get_model('myapp', 'Product')
    
    with transaction.atomic():
        # All or nothing
        products = Product.objects.all()
        
        for product in products:
            product.updated = True
            product.save()

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0013_runpython_hints'),
    ]
    
    # atomic=False করলে migration non-atomic হবে
    atomic = True
    
    operations = [
        migrations.RunPython(
            atomic_operation,
            reverse_code=migrations.RunPython.noop,
            atomic=True,  # এই operation atomic
        ),
    ]
```

---

## 5. Reversible Migrations

### Fully Reversible Migration

```python
# migrations/0015_reversible.py

from django.db import migrations, models

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0014_runpython_atomic'),
    ]
    
    operations = [
        # AddField - automatically reversible
        migrations.AddField(
            model_name='product',
            name='sku',
            field=models.CharField(max_length=50, null=True),
        ),
        
        # RemoveField - automatically reversible
        migrations.RemoveField(
            model_name='product',
            name='old_field',
        ),
        
        # AlterField - automatically reversible
        migrations.AlterField(
            model_name='product',
            name='price',
            field=models.DecimalField(max_digits=12, decimal_places=2),
        ),
    ]
```

### Reversible Data Migration

```python
# migrations/0016_reversible_data.py

from django.db import migrations

def set_default_status(apps, schema_editor):
    """Forward: Set default status"""
    Order = apps.get_model('myapp', 'Order')
    Order.objects.filter(status__isnull=True).update(status='pending')

def clear_default_status(apps, schema_editor):
    """Reverse: Clear status"""
    Order = apps.get_model('myapp', 'Order')
    Order.objects.filter(status='pending').update(status=None)

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0015_reversible'),
    ]
    
    operations = [
        migrations.RunPython(
            set_default_status,
            reverse_code=clear_default_status,  # Reversible
        ),
    ]
```

### Irreversible Migration

```python
# migrations/0017_irreversible.py

from django.db import migrations

def delete_old_data(apps, schema_editor):
    """Delete old data - cannot be reversed!"""
    OldModel = apps.get_model('myapp', 'OldModel')
    OldModel.objects.all().delete()

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0016_reversible_data'),
    ]
    
    operations = [
        migrations.RunPython(
            delete_old_data,
            reverse_code=migrations.RunPython.noop,  # Irreversible
        ),
        
        # অথবা explicitly irreversible mark করুন
        migrations.RunPython(
            delete_old_data,
            reverse_code=None,  # None = irreversible
        ),
    ]
```

### Testing Reversibility

```bash
# Migration apply করুন
python manage.py migrate myapp 0017

# Migration reverse করুন
python manage.py migrate myapp 0016

# যদি irreversible হয় তাহলে error দেবে
# IrreversibleError: Operation RunPython is not reversible
```

---

## 6. Squashing Migrations

### Why Squash Migrations?

```bash
# অনেক migrations থাকলে slow হয়
migrations/
├── 0001_initial.py
├── 0002_add_field.py
├── 0003_alter_field.py
├── 0004_remove_field.py
├── ... (100+ migrations)
└── 0150_latest.py

# Squashing করে optimize করুন
```

### Squash Command

```bash
# Squash migrations from 0001 to 0050
python manage.py squashmigrations myapp 0001 0050

# Output: 0001_squashed_0050_auto.py
```

### Squashed Migration Example

```python
# migrations/0001_squashed_0050_auto.py

from django.db import migrations, models

class Migration(migrations.Migration):
    
    # Squashed migration marker
    replaces = [
        ('myapp', '0001_initial'),
        ('myapp', '0002_add_field'),
        ('myapp', '0003_alter_field'),
        # ... all replaced migrations
        ('myapp', '0050_latest'),
    ]
    
    initial = True
    
    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]
    
    operations = [
        # Optimized operations
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('price', models.DecimalField(max_digits=12, decimal_places=2)),
                ('sku', models.CharField(max_length=50)),
                # Final state of all fields
            ],
        ),
    ]
```

### Squashing Workflow

```bash
# Step 1: Squash migrations
python manage.py squashmigrations myapp 0001 0050

# Step 2: Test squashed migration
python manage.py migrate myapp 0001_squashed_0050_auto

# Step 3: যদি সব ঠিক থাকে, old migrations delete করুন
# (শুধু যদি সব environments এ squashed migration applied হয়)

# Step 4: replaces attribute remove করুন
# এখন এটি একটি normal migration
```

### Manual Squashing

```python
# migrations/0001_squashed_manual.py

from django.db import migrations, models

class Migration(migrations.Migration):
    """
    Manually squashed migration
    0001 থেকে 0050 পর্যন্ত সব migrations এর final state
    """
    
    replaces = [
        ('myapp', '0001_initial'),
        ('myapp', '0002_add_category'),
        # ... list all replaced migrations
    ]
    
    initial = True
    
    dependencies = []
    
    operations = [
        # শুধু final state define করুন
        migrations.CreateModel(
            name='Product',
            fields=[
                # All fields in their final state
            ],
        ),
        
        migrations.CreateModel(
            name='Category',
            fields=[
                # All fields in their final state
            ],
        ),
        
        # Indexes, constraints etc.
        migrations.AddIndex(
            model_name='product',
            index=models.Index(fields=['category']),
        ),
    ]
```

---

## 7. Zero Downtime Migrations

### Strategy 1: Add Field with Default

```python
# Step 1: Add nullable field
# migrations/0020_add_field_step1.py

class Migration(migrations.Migration):
    operations = [
        migrations.AddField(
            model_name='product',
            name='new_price',
            field=models.DecimalField(
                max_digits=10,
                decimal_places=2,
                null=True,  # Nullable - no downtime
            ),
        ),
    ]

# Step 2: Populate data
# migrations/0021_populate_new_price.py

def populate_new_price(apps, schema_editor):
    Product = apps.get_model('myapp', 'Product')
    Product.objects.update(new_price=models.F('old_price'))

class Migration(migrations.Migration):
    operations = [
        migrations.RunPython(populate_new_price),
    ]

# Step 3: Make field non-nullable
# migrations/0022_make_field_required.py

class Migration(migrations.Migration):
    operations = [
        migrations.AlterField(
            model_name='product',
            name='new_price',
            field=models.DecimalField(
                max_digits=10,
                decimal_places=2,
                null=False,  # এখন required
            ),
        ),
    ]

# Step 4: Remove old field
# migrations/0023_remove_old_field.py

class Migration(migrations.Migration):
    operations = [
        migrations.RemoveField(
            model_name='product',
            name='old_price',
        ),
    ]
```

### Strategy 2: Rename Field Safely

```python
# Step 1: Add new field
class Migration(migrations.Migration):
    operations = [
        migrations.AddField(
            model_name='user',
            name='full_name',
            field=models.CharField(max_length=200, null=True),
        ),
    ]

# Step 2: Dual write (application code)
# models.py
class User(models.Model):
    name = models.CharField(max_length=100)  # Old field
    full_name = models.CharField(max_length=200, null=True)  # New field
    
    def save(self, *args, **kwargs):
        # Write to both fields
        if self.name and not self.full_name:
            self.full_name = self.name
        super().save(*args, **kwargs)

# Step 3: Backfill data
def backfill_full_name(apps, schema_editor):
    User = apps.get_model('myapp', 'User')
    User.objects.filter(full_name__isnull=True).update(
        full_name=models.F('name')
    )

# Step 4: Switch application code to use new field

# Step 5: Remove old field
class Migration(migrations.Migration):
    operations = [
        migrations.RemoveField(
            model_name='user',
            name='name',
        ),
    ]
```

### Strategy 3: Add Index Without Locking

```python
# PostgreSQL: CONCURRENT index creation

from django.contrib.postgres.operations import AddIndexConcurrently
from django.db import migrations, models

class Migration(migrations.Migration):
    
    atomic = False  # CONCURRENT operations require non-atomic migration
    
    operations = [
        AddIndexConcurrently(
            model_name='product',
            index=models.Index(
                fields=['category', 'created_at'],
                name='product_cat_created_idx'
            ),
        ),
    ]
```

### Strategy 4: Large Table Alterations

```python
# For large tables, use multiple small migrations

# Step 1: Add new table
class Migration(migrations.Migration):
    operations = [
        migrations.CreateModel(
            name='ProductNew',
            fields=[
                # New schema
            ],
        ),
    ]

# Step 2: Gradually copy data
def copy_data_batch(apps, schema_editor):
    Product = apps.get_model('myapp', 'Product')
    ProductNew = apps.get_model('myapp', 'ProductNew')
    
    # Copy in batches
    batch_size = 1000
    products = Product.objects.all()[:batch_size]
    
    new_products = [
        ProductNew(**product.__dict__)
        for product in products
    ]
    
    ProductNew.objects.bulk_create(new_products)

# Step 3: Switch application to new table

# Step 4: Rename tables
class Migration(migrations.Migration):
    operations = [
        migrations.RenameModel('Product', 'ProductOld'),
        migrations.RenameModel('ProductNew', 'Product'),
    ]

# Step 5: Drop old table
```

---

## 8. Migration Conflicts

### Detecting Conflicts

```bash
# Migration conflicts detect করুন
python manage.py makemigrations --check

# Output যদি conflict থাকে:
# CommandError: Conflicting migrations detected; multiple leaf nodes in the migration graph
```

### Conflict Scenario

```bash
# Developer A creates:
migrations/0005_add_field_a.py

# Developer B creates (same time):
migrations/0005_add_field_b.py

# Conflict! দুটি 0005 migration
```

### Resolving Conflicts - Method 1: Merge Migration

```bash
# Django automatically merge migration create করবে
python manage.py makemigrations --merge

# Output: 0006_merge_0005_add_field_a_0005_add_field_b.py
```

```python
# migrations/0006_merge.py

class Migration(migrations.Migration):
    
    # দুটি conflicting migrations এর উপর depend করে
    dependencies = [
        ('myapp', '0005_add_field_a'),
        ('myapp', '0005_add_field_b'),
    ]
    
    operations = [
        # Usually empty - just merges the branches
    ]
```

### Resolving Conflicts - Method 2: Manual Resolution

```bash
# Step 1: Rename one migration
mv migrations/0005_add_field_b.py migrations/0006_add_field_b.py

# Step 2: Update dependencies in 0006
```

```python
# migrations/0006_add_field_b.py

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0005_add_field_a'),  # Updated dependency
    ]
    
    operations = [
        # Original operations
    ]
```

### Preventing Conflicts

```bash
# Best practices:

# 1. Always pull latest code before creating migrations
git pull origin main
python manage.py makemigrations

# 2. Communicate with team about migrations

# 3. Use feature branches
git checkout -b feature/add-new-field
python manage.py makemigrations
git push origin feature/add-new-field

# 4. Merge conflicts early
git merge main
python manage.py makemigrations --merge
```

### Complex Conflict Resolution

```python
# যদি merge migration এ operations প্রয়োজন হয়

# migrations/0007_merge_complex.py

from django.db import migrations

def resolve_conflict(apps, schema_editor):
    """
    Conflicting changes resolve করুন
    """
    Product = apps.get_model('myapp', 'Product')
    
    # দুটি migration এর effects reconcile করুন
    products = Product.objects.all()
    
    for product in products:
        # Conflict resolution logic
        pass

class Migration(migrations.Migration):
    
    dependencies = [
        ('myapp', '0005_branch_a'),
        ('myapp', '0006_branch_b'),
    ]
    
    operations = [
        migrations.RunPython(
            resolve_conflict,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
```

---

## Best Practices

### 1. Migration Organization

```bash
# ✅ Good: Descriptive names
0001_initial.py
0002_add_product_category.py
0003_add_product_sku_index.py
0004_populate_default_categories.py

# ❌ Bad: Auto-generated names only
0001_auto_20260113_1234.py
0002_auto_20260113_1456.py
```

### 2. Keep Migrations Small

```python
# ✅ Good: One logical change per migration
# migrations/0005_add_category_field.py
operations = [
    migrations.AddField(
        model_name='product',
        name='category',
        field=models.ForeignKey(...),
    ),
]

# ❌ Bad: Multiple unrelated changes
operations = [
    migrations.AddField(...),  # Add category
    migrations.AlterField(...),  # Change price
    migrations.CreateModel(...),  # Create new model
    migrations.RunPython(...),  # Data migration
]
```

### 3. Test Migrations

```python
# tests/test_migrations.py

from django.test import TestCase
from django.db.migrations.executor import MigrationExecutor
from django.db import connection

class MigrationTestCase(TestCase):
    
    def test_migration_0008_forward_backward(self):
        """Test migration can be applied and reversed"""
        executor = MigrationExecutor(connection)
        
        # Go to migration 0007
        executor.migrate([('myapp', '0007_previous')])
        
        # Apply migration 0008
        executor.migrate([('myapp', '0008_target')])
        
        # Reverse migration
        executor.migrate([('myapp', '0007_previous')])
```

### 4. Document Complex Migrations

```python
# migrations/0010_complex_data_migration.py

"""
Migration: Complex Data Transformation

Purpose:
    - Migrate user profiles from old schema to new schema
    - Transform phone numbers to international format
    - Merge duplicate user accounts

Dependencies:
    - Requires 0009_add_profile_fields to be applied first

Reversibility:
    - This migration is irreversible due to data merging

Performance:
    - Processes ~100,000 records
    - Estimated time: 5-10 minutes
    - Uses batch processing for efficiency

Author: John Doe
Date: 2026-01-13
"""

from django.db import migrations

def complex_transformation(apps, schema_editor):
    # Implementation
    pass

class Migration(migrations.Migration):
    # Migration definition
    pass
```

---

## সারসংক্ষেপ

Django migrations advanced features ব্যবহার করে complex database changes safely manage করুন:

### Key Points:

1. **Migration Files**: Structure, components, naming conventions বুঝুন
2. **Dependencies**: Simple, cross-app, multiple dependencies manage করুন
3. **Data Migrations**: Data transformation, population, migration করুন
4. **RunPython**: Custom Python code migrations এ execute করুন
5. **Reversible Migrations**: Forward এবং reverse operations define করুন
6. **Squashing**: অনেক migrations কে optimize করুন
7. **Zero Downtime**: Production এ downtime ছাড়া migrations apply করুন
8. **Conflicts**: Migration conflicts detect এবং resolve করুন

Migrations properly manage করা production applications এর জন্য critical! 🚀💾
