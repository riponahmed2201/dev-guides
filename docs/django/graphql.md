---
title: GraphQL with Django
description: Deep dive into Graphene-Django, Schemas, Queries, Mutations, and more.
---

# GraphQL with Django (Graphene-Django)

GraphQL হলো একটি আধুনিক Query Language যা REST API-এর বিকল্প হিসেবে ব্যবহৃত হয়। Django-তে GraphQL ইমপ্লিমেন্ট করার জন্য সবচেয়ে জনপ্রিয় লাইব্রেরি হলো **Graphene-Django**।

---

## ১. Graphene-Django কি?

**Graphene-Django** হলো Django-এর জন্য একটি GraphQL ফ্রেমওয়ার্ক। এটি আপনার Django Models-কে অটোমেটিক GraphQL Types-এ কনভার্ট করতে সাহায্য করে এবং Query/Mutation হ্যান্ডেল করার জন্য প্রয়োজনীয় টুলস প্রদান করে।

---

## ২. প্রজেক্ট সেটআপ

প্রথমে প্যাকেজটি ইন্সটল করে নিন:

```bash
pip install graphene-django
```

এরপর `settings.py`-তে এটি যুক্ত করুন:

```python
INSTALLED_APPS = [
    ...
    'graphene_django',
]

# Schema path ডিফাইন করুন
GRAPHENE = {
    "SCHEMA": "myproject.schema.schema"
}
```

---

## ৩. Schema Definition

GraphQL-এ সবকিছুর মূলে থাকে **Schema**। এতে আপনার ডেটার স্ট্রাকচার এবং টাইপ ডিফাইন করা থাকে।

### Model definitions:

```python
# models.py
from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    pages = models.IntegerField()
```

### GraphQL Types:

```python
# schema.py
import graphene
from graphene_django import DjangoObjectType
from .models import Book

class BookType(DjangoObjectType):
    class Meta:
        model = Book
        fields = ("id", "title", "author", "pages")
```

---

## ৪. Queries (ডেটা আনা)

Query ব্যবহার করে আমরা ডেটাবেস থেকে ডেটা রিড করি। এটি REST API-এর GET রিকোয়েস্টের মতো।

```python
# schema.py
class Query(graphene.ObjectType):
    all_books = graphene.List(BookType)
    book_by_id = graphene.Field(BookType, id=graphene.Int())

    def resolve_all_books(root, info):
        return Book.objects.all()

    def resolve_book_by_id(root, info, id):
        return Book.objects.get(pk=id)

schema = graphene.Schema(query=Query)
```

**GraphQL Query Example:**

```graphql
query {
  allBooks {
    id
    title
    author
  }
}
```

---

## ৫. Mutations (ডেটা পরিবর্তন)

ডেটা তৈরি, আপডেট বা ডিলিট করার জন্য Mutation ব্যবহার করা হয়। এটি REST API-এর POST, PUT, DELETE-এর মতো।

```python
class CreateBook(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        author = graphene.String(required=True)
        pages = graphene.Int(required=True)

    book = graphene.Field(BookType)

    def mutate(root, info, title, author, pages):
        book = Book(title=title, author=author, pages=pages)
        book.save()
        return CreateBook(book=book)

class Mutation(graphene.ObjectType):
    create_book = CreateBook.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
```

---

## ৬. Subscriptions (রিয়েল-টাইম আপডেট)

GraphQL Subscriptions ক্লায়েন্টকে রিয়েল-টাইম আপডেট পেতে সাহায্য করে। Django-তে এটি সাধারণত **Django Channels**-এর সাথে ব্যবহার করা হয়। এটি WebSocket ব্যবহার করে কাজ করে।

---

## ৭. DataLoader (N+1 Problem Solution)

যখন একটি Query-তে অনেকগুলো রিলেটেড অবজেক্ট থাকে, তখন Django ORM প্রতিটির জন্য আলাদা আলাদা কুয়েরি চালাতে পারে, যা পারফরম্যান্স কমিয়ে দেয় (N+1 Problem)।

**DataLoader** আপনার কুয়েরিগুলোকে ব্যাচ ফাইল করে (Group queries) ডেটাবেসে পাঠায়, যা পারফরম্যান্স অনেক বাড়িয়ে দেয়।

---

## ৮. Authentication & Permissions

GraphQL-এ অথেন্টিকেশন হ্যান্ডেল করার জন্য `info.context.user` ব্যবহার করা যায়।

```python
def resolve_all_books(root, info):
    if not info.context.user.is_authenticated:
        return Book.objects.none()
    return Book.objects.all()
```

এছাড়াও `django-graphql-jwt` প্যাকেজ ব্যবহার করে JWT অথেন্টিকেশন ইমপ্লিমেন্ট করা যায়।

---

## ৯. GraphQL Playground (GraphiQL)

Django-তে বিল্ট-ইন GraphQL ইন্টারফেস দেখার জন্য `urls.py` সেটআপ করুন:

```python
# urls.py
from django.urls import path
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),
]
```

এখন `/graphql/` ইউআরএল-এ ভিজিট করলে আপনি একটি ইন্টারঅ্যাক্টিভ প্লেগ্রাউন্ড পাবেন যেখানে কুয়েরি লিখে টেস্ট করা যায়।

---

::: tip মনে রাখবেন
GraphQL আপনাকে শুধুমাত্র সেই ডেটাটুকুই দেয় যা আপনি চেয়েছেন (Under-fetching বা Over-fetching হয় না)। বড় প্রজেক্টের ক্ষেত্রে এটি API ডেভেলপমেন্ট অনেক সহজ করে দেয়।
:::
