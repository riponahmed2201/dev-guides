# Database Transactions

Database transactions হলো একটি বা একাধিক database operations এর একটি logical unit যা সম্পূর্ণভাবে সফল হবে অথবা সম্পূর্ণভাবে ব্যর্থ হবে। Django এর transaction management system আপনার data integrity নিশ্চিত করতে সাহায্য করে।

## 1. Atomic Transactions

### Atomic Transaction কী?

Atomic transaction মানে হলো একটি transaction যা সম্পূর্ণভাবে execute হবে অথবা একদমই হবে না। কোনো partial execution হবে না।

### Django এর Default Behavior

```python
# Django এর default behavior (autocommit mode)
from myapp.models import Account

def transfer_money(from_account_id, to_account_id, amount):
    # ❌ Problem: যদি দ্বিতীয় operation fail করে, প্রথম operation committed থাকবে
    from_account = Account.objects.get(id=from_account_id)
    from_account.balance -= amount
    from_account.save()  # Committed immediately
    
    # যদি এখানে error হয়, তাহলে টাকা deduct হয়ে গেছে কিন্তু credit হয়নি!
    to_account = Account.objects.get(id=to_account_id)
    to_account.balance += amount
    to_account.save()  # Committed immediately
```

### ✅ Atomic Transaction দিয়ে সমাধান

```python
from django.db import transaction
from myapp.models import Account

@transaction.atomic
def transfer_money(from_account_id, to_account_id, amount):
    """
    Atomic decorator নিশ্চিত করে যে সব operations একসাথে commit হবে
    অথবা কোনো error হলে সব rollback হবে
    """
    from_account = Account.objects.get(id=from_account_id)
    from_account.balance -= amount
    from_account.save()
    
    # যদি এখানে error হয়, উপরের save() ও rollback হবে
    to_account = Account.objects.get(id=to_account_id)
    to_account.balance += amount
    to_account.save()
    
    # সব successful হলে একসাথে commit হবে
```

### Context Manager হিসেবে ব্যবহার

```python
from django.db import transaction
from myapp.models import Order, OrderItem, Inventory

def create_order(user, items):
    """
    Context manager দিয়ে transaction control
    """
    try:
        with transaction.atomic():
            # Order create করুন
            order = Order.objects.create(
                user=user,
                total_amount=0
            )
            
            total = 0
            for item_data in items:
                # OrderItem create করুন
                order_item = OrderItem.objects.create(
                    order=order,
                    product=item_data['product'],
                    quantity=item_data['quantity'],
                    price=item_data['price']
                )
                
                # Inventory update করুন
                inventory = Inventory.objects.select_for_update().get(
                    product=item_data['product']
                )
                
                if inventory.quantity < item_data['quantity']:
                    raise ValueError('Insufficient inventory')
                
                inventory.quantity -= item_data['quantity']
                inventory.save()
                
                total += item_data['price'] * item_data['quantity']
            
            # Order total update করুন
            order.total_amount = total
            order.save()
            
            return order
            
    except ValueError as e:
        # Transaction automatically rollback হবে
        print(f"Order creation failed: {e}")
        return None
```

### Nested Transactions

```python
from django.db import transaction

@transaction.atomic
def outer_function():
    """Outer transaction"""
    # কিছু operations
    User.objects.create(username='user1')
    
    # Nested transaction
    inner_function()
    
    # আরো operations
    User.objects.create(username='user2')

@transaction.atomic
def inner_function():
    """Inner transaction (savepoint হিসেবে কাজ করবে)"""
    User.objects.create(username='inner_user')
    
    # যদি এখানে error হয়, শুধু inner_function rollback হবে
    # outer_function continue করবে
```

---

## 2. @transaction.atomic Decorator

### Function Decorator

```python
from django.db import transaction
from myapp.models import Product, Category

@transaction.atomic
def create_product_with_category(product_data, category_name):
    """
    Product এবং Category একসাথে create করুন
    """
    # Category create বা get করুন
    category, created = Category.objects.get_or_create(
        name=category_name
    )
    
    # Product create করুন
    product = Product.objects.create(
        name=product_data['name'],
        price=product_data['price'],
        category=category
    )
    
    return product
```

### Class-Based View এ ব্যবহার

```python
from django.views.generic import CreateView
from django.db import transaction
from myapp.models import Order

class OrderCreateView(CreateView):
    model = Order
    fields = ['customer', 'items']
    
    @transaction.atomic
    def form_valid(self, form):
        """
        Form submission atomic করুন
        """
        # Order create করুন
        self.object = form.save()
        
        # Related operations
        self.process_payment()
        self.send_confirmation_email()
        
        return super().form_valid(form)
    
    def process_payment(self):
        # Payment processing logic
        pass
    
    def send_confirmation_email(self):
        # Email sending logic
        pass
```

### Method Decorator

```python
from django.db import transaction

class OrderService:
    
    @transaction.atomic
    def create_order(self, user, items):
        """
        Service method এ atomic decorator
        """
        order = Order.objects.create(user=user)
        
        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity']
            )
        
        return order
    
    @transaction.atomic
    def cancel_order(self, order_id):
        """
        Order cancel করুন এবং inventory restore করুন
        """
        order = Order.objects.get(id=order_id)
        
        # Inventory restore করুন
        for item in order.items.all():
            inventory = Inventory.objects.get(product=item.product)
            inventory.quantity += item.quantity
            inventory.save()
        
        # Order delete করুন
        order.delete()
```

### Partial Decorator Application

```python
from django.db import transaction

def process_bulk_data(data_list):
    """
    Bulk operations এ selective atomic ব্যবহার
    """
    for data in data_list:
        # প্রতিটি item এর জন্য আলাদা transaction
        with transaction.atomic():
            try:
                process_single_item(data)
            except Exception as e:
                # এই item fail হলেও অন্যগুলো continue করবে
                print(f"Failed to process {data}: {e}")
                continue

def process_single_item(data):
    # Single item processing
    pass
```

---

## 3. ACID Properties

### ACID কী?

ACID হলো database transactions এর চারটি মূল বৈশিষ্ট্য:

#### A - Atomicity (অবিভাজ্যতা)

```python
from django.db import transaction

@transaction.atomic
def atomicity_example():
    """
    Atomicity: সব operations একসাথে হবে অথবা কিছুই হবে না
    """
    # Operation 1
    user = User.objects.create(username='john')
    
    # Operation 2
    profile = Profile.objects.create(user=user, bio='Hello')
    
    # Operation 3 - যদি এখানে error হয়
    raise Exception('Something went wrong')
    
    # তাহলে উপরের সব operations rollback হবে
    # Database এ কোনো data save হবে না
```

#### C - Consistency (সামঞ্জস্যতা)

```python
from django.db import transaction
from django.core.exceptions import ValidationError

@transaction.atomic
def consistency_example(account_id, amount):
    """
    Consistency: Database সবসময় valid state এ থাকবে
    """
    account = Account.objects.get(id=account_id)
    
    # Business rule: Balance কখনো negative হতে পারবে না
    if account.balance - amount < 0:
        raise ValidationError('Insufficient balance')
    
    account.balance -= amount
    account.save()
    
    # যদি validation fail করে, transaction rollback হবে
    # Database consistent state এ থাকবে
```

#### I - Isolation (বিচ্ছিন্নতা)

```python
from django.db import transaction

@transaction.atomic
def isolation_example():
    """
    Isolation: Concurrent transactions একে অপরকে affect করবে না
    """
    # Transaction 1
    account = Account.objects.select_for_update().get(id=1)
    account.balance += 100
    account.save()
    
    # অন্য transaction এই account access করতে পারবে না
    # যতক্ষণ না এই transaction complete হয়
```

#### D - Durability (স্থায়িত্ব)

```python
@transaction.atomic
def durability_example():
    """
    Durability: Committed data permanently stored হবে
    """
    user = User.objects.create(username='john')
    # Transaction commit হওয়ার পর, এমনকি system crash হলেও
    # এই data database এ থাকবে
```

### ACID Properties একসাথে

```python
from django.db import transaction
from decimal import Decimal

@transaction.atomic
def transfer_with_acid(from_account_id, to_account_id, amount):
    """
    সব ACID properties একসাথে demonstrate করা
    """
    # Isolation: Lock accounts
    from_account = Account.objects.select_for_update().get(id=from_account_id)
    to_account = Account.objects.select_for_update().get(id=to_account_id)
    
    # Consistency: Validate business rules
    if from_account.balance < amount:
        raise ValueError('Insufficient balance')
    
    if amount <= 0:
        raise ValueError('Amount must be positive')
    
    # Atomicity: Both operations will succeed or fail together
    from_account.balance -= Decimal(str(amount))
    from_account.save()
    
    to_account.balance += Decimal(str(amount))
    to_account.save()
    
    # Durability: Changes will be permanent after commit
    
    # Log transaction
    TransactionLog.objects.create(
        from_account=from_account,
        to_account=to_account,
        amount=amount
    )
```

---

## 4. Transaction Isolation Levels

### Isolation Levels কী?

Isolation levels define করে concurrent transactions কিভাবে একে অপরকে দেখতে পারবে।

### Django এ Supported Isolation Levels

```python
from django.db import transaction

# PostgreSQL isolation levels
ISOLATION_LEVELS = {
    'READ UNCOMMITTED': 'read uncommitted',
    'READ COMMITTED': 'read committed',      # Default
    'REPEATABLE READ': 'repeatable read',
    'SERIALIZABLE': 'serializable',
}
```

### Read Committed (Default)

```python
from django.db import transaction

@transaction.atomic
def read_committed_example():
    """
    Read Committed: শুধুমাত্র committed data read করা যাবে
    """
    # এই transaction শুধুমাত্র committed changes দেখবে
    accounts = Account.objects.all()
    
    # অন্য transaction এর uncommitted changes visible হবে না
```

### Repeatable Read

```python
from django.db import transaction

def repeatable_read_example():
    """
    Repeatable Read: Transaction এর মধ্যে same query same result দেবে
    """
    with transaction.atomic():
        # First read
        account = Account.objects.get(id=1)
        balance1 = account.balance
        
        # অন্য transaction এ balance change হলেও
        # এই transaction এ same value পাবেন
        
        # Second read (same transaction)
        account = Account.objects.get(id=1)
        balance2 = account.balance
        
        # balance1 == balance2 (guaranteed)
```

### Serializable

```python
from django.db import transaction

@transaction.atomic
def serializable_example():
    """
    Serializable: Highest isolation level
    Transactions serially execute হওয়ার মতো behavior
    """
    # এই transaction সম্পূর্ণ isolated
    # কোনো concurrent transaction interference করতে পারবে না
    
    accounts = Account.objects.filter(balance__gt=1000)
    total = sum(acc.balance for acc in accounts)
    
    # Phantom reads prevent হবে
```

### Custom Isolation Level Set করা

```python
from django.db import connection, transaction

def set_isolation_level(level):
    """
    Custom isolation level set করুন
    """
    with connection.cursor() as cursor:
        cursor.execute(f"SET TRANSACTION ISOLATION LEVEL {level}")

@transaction.atomic
def custom_isolation_example():
    """
    Custom isolation level ব্যবহার করুন
    """
    set_isolation_level('SERIALIZABLE')
    
    # Operations with serializable isolation
    account = Account.objects.get(id=1)
    account.balance += 100
    account.save()
```

### Isolation Level Problems

```python
# Problem 1: Dirty Read (READ UNCOMMITTED এ হতে পারে)
def dirty_read_problem():
    """
    ❌ Uncommitted data read করা (Django default এ prevent হয়)
    """
    # Transaction 1 uncommitted change করেছে
    # Transaction 2 সেই uncommitted data read করছে
    pass

# Problem 2: Non-Repeatable Read
@transaction.atomic
def non_repeatable_read_problem():
    """
    Same query different results দিতে পারে
    """
    # First read
    account = Account.objects.get(id=1)
    balance1 = account.balance  # 1000
    
    # অন্য transaction balance change করলো এবং commit করলো
    
    # Second read
    account.refresh_from_db()
    balance2 = account.balance  # 1500 (changed!)
    
    # balance1 != balance2

# Problem 3: Phantom Read
@transaction.atomic
def phantom_read_problem():
    """
    Query results এ new rows appear হতে পারে
    """
    # First query
    accounts = list(Account.objects.filter(balance__gt=1000))
    count1 = len(accounts)  # 5
    
    # অন্য transaction নতুন account add করলো
    
    # Second query
    accounts = list(Account.objects.filter(balance__gt=1000))
    count2 = len(accounts)  # 6 (new row!)
    
    # count1 != count2
```

---

## 5. Savepoints

### Savepoint কী?

Savepoint হলো transaction এর মধ্যে একটি checkpoint যেখানে আপনি partial rollback করতে পারবেন।

### Basic Savepoint Usage

```python
from django.db import transaction

def savepoint_example():
    """
    Savepoint ব্যবহার করে partial rollback
    """
    with transaction.atomic():
        # Operation 1
        user1 = User.objects.create(username='user1')
        
        # Savepoint create করুন
        sid = transaction.savepoint()
        
        try:
            # Operation 2 (risky)
            user2 = User.objects.create(username='user2')
            profile = Profile.objects.create(user=user2)
            
            # Success হলে savepoint commit করুন
            transaction.savepoint_commit(sid)
            
        except Exception as e:
            # Error হলে শুধু savepoint পর্যন্ত rollback করুন
            transaction.savepoint_rollback(sid)
            print(f"Profile creation failed: {e}")
            # user1 থাকবে, কিন্তু user2 এবং profile rollback হবে
        
        # Operation 3
        user3 = User.objects.create(username='user3')
```

### Multiple Savepoints

```python
from django.db import transaction

def multiple_savepoints_example():
    """
    Multiple savepoints ব্যবহার করা
    """
    with transaction.atomic():
        # Checkpoint 1
        user = User.objects.create(username='john')
        sp1 = transaction.savepoint()
        
        try:
            # Risky operation 1
            profile = Profile.objects.create(user=user, bio='Hello')
            sp2 = transaction.savepoint()
            
            try:
                # Risky operation 2
                settings = UserSettings.objects.create(user=user)
                transaction.savepoint_commit(sp2)
                
            except Exception:
                # Rollback to sp2
                transaction.savepoint_rollback(sp2)
                print("Settings creation failed")
            
            transaction.savepoint_commit(sp1)
            
        except Exception:
            # Rollback to sp1
            transaction.savepoint_rollback(sp1)
            print("Profile creation failed")
```

### Savepoint with Context Manager

```python
from django.db import transaction

def savepoint_context_manager():
    """
    Context manager style savepoint
    """
    with transaction.atomic():
        user = User.objects.create(username='john')
        
        # Nested atomic block creates a savepoint
        try:
            with transaction.atomic():
                # এটি একটি savepoint create করবে
                profile = Profile.objects.create(user=user)
                settings = UserSettings.objects.create(user=user)
                # Error হলে শুধু এই block rollback হবে
                
        except Exception as e:
            print(f"Nested operations failed: {e}")
            # user থাকবে, কিন্তু profile এবং settings rollback হবে
        
        # Continue with main transaction
        user.is_active = True
        user.save()
```

### Practical Savepoint Example

```python
from django.db import transaction

def process_order_with_savepoints(order_data):
    """
    Order processing এ savepoints ব্যবহার
    """
    with transaction.atomic():
        # Main order create করুন
        order = Order.objects.create(
            customer=order_data['customer'],
            status='pending'
        )
        
        successful_items = []
        
        for item_data in order_data['items']:
            # প্রতিটি item এর জন্য savepoint
            sp = transaction.savepoint()
            
            try:
                # Item add করার চেষ্টা করুন
                item = OrderItem.objects.create(
                    order=order,
                    product=item_data['product'],
                    quantity=item_data['quantity']
                )
                
                # Inventory check করুন
                inventory = Inventory.objects.get(
                    product=item_data['product']
                )
                
                if inventory.quantity < item_data['quantity']:
                    raise ValueError('Insufficient inventory')
                
                # Inventory update করুন
                inventory.quantity -= item_data['quantity']
                inventory.save()
                
                # Success
                transaction.savepoint_commit(sp)
                successful_items.append(item)
                
            except Exception as e:
                # এই item skip করুন
                transaction.savepoint_rollback(sp)
                print(f"Skipped item: {e}")
        
        # যদি কোনো item successful না হয়
        if not successful_items:
            raise ValueError('No items could be added')
        
        # Order finalize করুন
        order.status = 'confirmed'
        order.save()
        
        return order
```

---

## 6. Manual Transaction Management

### Autocommit Disable করা

```python
from django.db import transaction

def manual_transaction_example():
    """
    Manual transaction management
    """
    # Autocommit disable করুন
    transaction.set_autocommit(False)
    
    try:
        # Operations
        user = User.objects.create(username='john')
        profile = Profile.objects.create(user=user)
        
        # Manually commit করুন
        transaction.commit()
        
    except Exception as e:
        # Error হলে rollback করুন
        transaction.rollback()
        print(f"Transaction failed: {e}")
        
    finally:
        # Autocommit re-enable করুন
        transaction.set_autocommit(True)
```

### Low-Level Transaction Control

```python
from django.db import connection

def low_level_transaction():
    """
    Low-level transaction control
    """
    cursor = connection.cursor()
    
    try:
        # Start transaction
        cursor.execute("BEGIN")
        
        # Operations
        cursor.execute(
            "INSERT INTO myapp_user (username, email) VALUES (%s, %s)",
            ['john', 'john@example.com']
        )
        
        cursor.execute(
            "UPDATE myapp_account SET balance = balance + %s WHERE user_id = %s",
            [100, 1]
        )
        
        # Commit transaction
        cursor.execute("COMMIT")
        
    except Exception as e:
        # Rollback on error
        cursor.execute("ROLLBACK")
        print(f"Transaction failed: {e}")
        
    finally:
        cursor.close()
```

### Custom Transaction Manager

```python
from django.db import transaction
from contextlib import contextmanager

@contextmanager
def custom_transaction(using=None, savepoint=True):
    """
    Custom transaction context manager
    """
    try:
        # Transaction শুরু করুন
        with transaction.atomic(using=using, savepoint=savepoint):
            yield
            # Success - commit হবে
            
    except Exception as e:
        # Error - rollback হবে
        print(f"Transaction failed: {e}")
        raise

# Usage
def use_custom_transaction():
    with custom_transaction():
        User.objects.create(username='john')
        Profile.objects.create(user_id=1)
```

### Conditional Commit/Rollback

```python
from django.db import transaction

def conditional_transaction(data, dry_run=False):
    """
    Conditional commit based on parameter
    """
    with transaction.atomic():
        # Operations
        user = User.objects.create(username=data['username'])
        profile = Profile.objects.create(user=user)
        
        if dry_run:
            # Dry run mode - rollback করুন
            transaction.set_rollback(True)
            print("Dry run - changes rolled back")
        else:
            # Normal mode - commit হবে
            print("Changes committed")
        
        return user
```

---

## 7. Database Locking

### Select For Update (Row-Level Locking)

```python
from django.db import transaction

@transaction.atomic
def row_level_locking():
    """
    Row-level locking দিয়ে concurrent access prevent করুন
    """
    # Row lock করুন (অন্য transactions wait করবে)
    account = Account.objects.select_for_update().get(id=1)
    
    # এখন safely update করতে পারবেন
    account.balance += 100
    account.save()
    
    # Transaction commit হলে lock release হবে
```

### Select For Update with Nowait

```python
from django.db import transaction
from django.db.models import F

@transaction.atomic
def nowait_locking():
    """
    Lock না পেলে immediately error throw করুন
    """
    try:
        # Lock পাওয়ার জন্য wait করবে না
        account = Account.objects.select_for_update(nowait=True).get(id=1)
        account.balance += 100
        account.save()
        
    except Exception as e:
        print(f"Could not acquire lock: {e}")
```

### Select For Update with Skip Locked

```python
from django.db import transaction

@transaction.atomic
def skip_locked_example():
    """
    Locked rows skip করুন
    """
    # যে rows locked নেই শুধু সেগুলো নিন
    available_accounts = Account.objects.select_for_update(
        skip_locked=True
    ).filter(status='active')
    
    for account in available_accounts:
        # Process unlocked accounts
        account.process()
        account.save()
```

### Pessimistic Locking

```python
from django.db import transaction

@transaction.atomic
def pessimistic_locking():
    """
    Pessimistic locking: আগে lock, তারপর read/write
    """
    # Lock করুন
    product = Product.objects.select_for_update().get(id=1)
    
    # Check করুন
    if product.stock < 10:
        raise ValueError('Low stock')
    
    # Update করুন
    product.stock -= 10
    product.save()
    
    # Lock release হবে transaction commit এ
```

### Optimistic Locking

```python
from django.db import transaction
from django.db.models import F

def optimistic_locking():
    """
    Optimistic locking: version field দিয়ে conflict detect করুন
    """
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            with transaction.atomic():
                # Current version সহ object fetch করুন
                product = Product.objects.get(id=1)
                current_version = product.version
                
                # Update করুন
                product.stock -= 10
                
                # Version check করে update করুন
                updated = Product.objects.filter(
                    id=1,
                    version=current_version
                ).update(
                    stock=F('stock') - 10,
                    version=F('version') + 1
                )
                
                if updated == 0:
                    # Version mismatch - retry করুন
                    raise Exception('Concurrent modification detected')
                
                return True
                
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            continue
    
    return False
```

### Table-Level Locking

```python
from django.db import connection, transaction

@transaction.atomic
def table_level_locking():
    """
    Table-level locking (PostgreSQL)
    """
    with connection.cursor() as cursor:
        # Table lock করুন
        cursor.execute("LOCK TABLE myapp_account IN EXCLUSIVE MODE")
        
        # এখন পুরো table locked
        # অন্য transactions এই table access করতে পারবে না
        
        # Bulk operations
        Account.objects.filter(status='inactive').update(balance=0)
        
        # Transaction commit এ lock release হবে
```

### Deadlock Handling

```python
from django.db import transaction
from django.db.utils import OperationalError
import time

def handle_deadlock(max_retries=3):
    """
    Deadlock handling with retry logic
    """
    for attempt in range(max_retries):
        try:
            with transaction.atomic():
                # Operations that might cause deadlock
                account1 = Account.objects.select_for_update().get(id=1)
                account2 = Account.objects.select_for_update().get(id=2)
                
                # Transfer money
                account1.balance -= 100
                account2.balance += 100
                
                account1.save()
                account2.save()
                
                return True
                
        except OperationalError as e:
            if 'deadlock' in str(e).lower():
                if attempt < max_retries - 1:
                    # Wait এবং retry করুন
                    time.sleep(0.1 * (attempt + 1))
                    continue
                else:
                    raise
            else:
                raise
    
    return False
```

### Lock Timeout

```python
from django.db import connection, transaction

@transaction.atomic
def lock_timeout_example():
    """
    Lock timeout set করুন
    """
    with connection.cursor() as cursor:
        # 5 seconds lock timeout
        cursor.execute("SET LOCAL lock_timeout = '5s'")
        
        try:
            # Lock পাওয়ার চেষ্টা করুন
            account = Account.objects.select_for_update().get(id=1)
            account.balance += 100
            account.save()
            
        except Exception as e:
            print(f"Lock timeout: {e}")
```

---

## Best Practices

### 1. Transaction Scope ছোট রাখুন

```python
# ❌ Bad: Long transaction
@transaction.atomic
def bad_long_transaction():
    user = User.objects.create(username='john')
    
    # External API call (slow!)
    send_welcome_email(user)  # 5 seconds
    
    # More operations
    profile = Profile.objects.create(user=user)

# ✅ Good: Short transaction
def good_short_transaction():
    with transaction.atomic():
        user = User.objects.create(username='john')
        profile = Profile.objects.create(user=user)
    
    # External call বাইরে করুন
    send_welcome_email(user)
```

### 2. Proper Error Handling

```python
from django.db import transaction, IntegrityError

@transaction.atomic
def proper_error_handling():
    try:
        user = User.objects.create(username='john')
        profile = Profile.objects.create(user=user)
        
    except IntegrityError as e:
        # Specific error handling
        print(f"Database integrity error: {e}")
        raise
        
    except Exception as e:
        # Generic error handling
        print(f"Unexpected error: {e}")
        raise
```

### 3. Use select_for_update Wisely

```python
# ✅ Good: শুধু যেখানে প্রয়োজন
@transaction.atomic
def wise_locking():
    # Read-only operations এ lock করবেন না
    products = Product.objects.filter(category='electronics')
    
    # শুধু update করার সময় lock করুন
    product = Product.objects.select_for_update().get(id=1)
    product.stock -= 1
    product.save()
```

---

## সারসংক্ষেপ

Database transactions properly ব্যবহার করে data integrity এবং consistency নিশ্চিত করুন:

### Key Points:

1. **Atomic Transactions**: `@transaction.atomic` ব্যবহার করুন
2. **ACID Properties**: Atomicity, Consistency, Isolation, Durability বুঝুন
3. **Isolation Levels**: সঠিক isolation level select করুন
4. **Savepoints**: Partial rollback এর জন্য savepoints ব্যবহার করুন
5. **Manual Management**: প্রয়োজনে manual transaction control করুন
6. **Database Locking**: Concurrent access control এর জন্য locking ব্যবহার করুন
7. **Best Practices**: Transaction scope ছোট রাখুন, proper error handling করুন

Transaction management Django application এর data integrity এর জন্য অত্যন্ত গুরুত্বপূর্ণ! 🔒💾
