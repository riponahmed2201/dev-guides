# Django Forms Advanced (Deep Dive)

Django Forms এর বেসিক ব্যবহারের বাইরেও অনেক শক্তিশালী ফিচার আছে যা কমপ্লেক্স ডাটা ভ্যালিডেশন এবং মাল্টিপল ফর্ম হ্যান্ডেল করতে সাহায্য করে। এই সেকশনে আমরা `ModelForm`, কাস্টম ভ্যালিডেশন এবং `Formsets` নিয়ে আলোচনা করবো।

---

## ১. `ModelForm` (মডেল থেকে অটোমেটিক ফর্ম)

সাধারণ `Form` ক্লাসে আমাদের প্রতিটি ফিল্ড আলাদা করে লিখতে হয়। কিন্তু `ModelForm` ব্যবহার করলে Django মডেলের ফিল্ডগুলো দেখে অটোমেটিক ফর্ম তৈরি করে দেয়।

```python
from django import forms
from .models import Product

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'price', 'description', 'category']
        # অথবা সব ফিল্ড চাইলে: fields = '__all__'
        
        # কাস্টম উইজেট (CSS class বা placeholder দেওয়ার জন্য)
        widgets = {
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'price': forms.NumberInput(attrs={'placeholder': 'Enter price in BDT'}),
        }
        
        # কাস্টম লেবেল
        labels = {
            'name': 'Product Title',
        }
```

---

## ২. কাস্টম ভ্যালিডেশন (Custom Validation)

Django-তে ফর্ম ভ্যালিডেশন দুইভাবে করা যায়: নির্দিষ্ট কোনো ফিল্ডের জন্য অথবা পুরো ফর্মের জন্য।

### ২.১ `clean_<fieldname>()` মেথড
শুধুমাত্র একটি নির্দিষ্ট ফিল্ড চেক করার জন্য।

```python
    def clean_price(self):
        price = self.cleaned_data.get('price')
        if price < 100:
            raise forms.ValidationError("Price must be at least 100 Taka.")
        return price
```

### ২.২ `clean()` মেথড
পুরো ফর্মের ডাটা চেক করার জন্য (যেমন: দুটি ফিল্ডের মধ্যে তুলনা)।

```python
    def clean(self):
        cleaned_data = super().clean()
        name = cleaned_data.get("name")
        description = cleaned_data.get("description")

        if name and description:
            if name.lower() in description.lower():
                raise forms.ValidationError("Description should not contain the Product Name directly.")
        
        return cleaned_data
```

---

## ৩. Form Inheritance

একই ধরনের ফর্ম একাধিকবার না লিখে ইনহেরিটেন্স ব্যবহার করা যায়।

```python
class ContactForm(forms.Form):
    name = forms.CharField()
    email = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea)

# ContactForm এর সব ফিল্ড পাবে + এক্সট্রা ফিল্ড
class JobApplicationForm(ContactForm):
    cv_upload = forms.FileField()
```

---

## ৪. Formsets (একসাথে অনেকগুলো ফর্ম)

ধরুন আপনি একটি পেজেই ৫টি বইয়ের তথ্য ইনপুট নিতে চান। তখন ৫টি আলাদা ফর্ম না বানিয়ে `formset_factory` ব্যবহার করা হয়।

### ৪.১ Regular Formset

```python
from django.forms import formset_factory
from .forms import BookForm

# একটি ফর্মসেট ক্লাস তৈরি হলো যা ৫টি ফর্ম জেনারেট করবে
BookFormSet = formset_factory(BookForm, extra=5)
```

**View-তে ব্যবহার:**
```python
def manage_books(request):
    if request.method == 'POST':
        formset = BookFormSet(request.POST)
        if formset.is_valid():
            for form in formset:
                print(form.cleaned_data)
    else:
        formset = BookFormSet()
    
    return render(request, 'manage_books.html', {'formset': formset})
```

**Template-এ ব্যবহার:**
```html
<form method="post">
    {% csrf_token %}
    {{ formset.management_form }} <!-- এটি মাস্ট দিতে হবে -->
    {% for form in formset %}
        {{ form.as_p }}
        <hr>
    {% endfor %}
    <button type="submit">Save All</button>
</form>
```

---

## ৫. Model Formsets

মডেলের ডাটা এডিট করার জন্য ফর্মসেট। যেমন: ডাটাবেসে থাকা সব প্রোডাক্টের দাম একসাথে আপডেট করা।

```python
from django.forms import modelformset_factory
from .models import Product

# সব প্রোডাক্টের জন্য ফর্ম তৈরি হবে (শুধু price এবং stock ফিল্ড)
ProductFormSet = modelformset_factory(Product, fields=('price', 'stock'), extra=0)
```

---

## ৬. Inline Formsets (Parent-Child এডিট)

এটি সবচেয়ে পাওয়ারফুল ফিচার। যেমন: একজন লেখকের (Author) নাম এডিট করার সময় তার সব বইয়ের (Book) নামও একই পেজে এডিট করা।

```python
from django.forms import inlineformset_factory
from .models import Author, Book

# Author এর সাথে যুক্ত Book গুলো এডিট করার ফর্মসেট
BookInlineFormSet = inlineformset_factory(
    Author, 
    Book, 
    fields=('title', 'price'), 
    extra=1, # একটি নতুন ব্ল্যাঙ্ক ফর্ম দেখাবে
    can_delete=True # ডিলিট করার অপশন থাকবে
)
```

**View:**
```python
def author_edit(request, pk):
    author = Author.objects.get(pk=pk)
    
    if request.method == "POST":
        form = AuthorForm(request.POST, instance=author)
        formset = BookInlineFormSet(request.POST, instance=author)
        
        if form.is_valid() and formset.is_valid():
            form.save()
            formset.save() # অটোমেটিক লেখকের সাথে বই লিংক হয়ে যাবে
            return redirect('author_list')
    else:
        form = AuthorForm(instance=author)
        formset = BookInlineFormSet(instance=author)
        
    return render(request, 'author_edit.html', {'form': form, 'formset': formset})
```
