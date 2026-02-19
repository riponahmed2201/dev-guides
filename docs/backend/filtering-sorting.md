# Filtering and Sorting (ফিল্টারিং ও সর্টিং)

## Filtering ও Sorting কী?

**Filtering** হলো data-এর মধ্য থেকে **শর্ত অনুযায়ী** নির্দিষ্ট items বের করা।
**Sorting** হলো data-কে **নির্দিষ্ট ক্রমে** সাজানো।

```
Database: 100,000 products

Filtering:
  GET /api/products?category=electronics&price_max=50000
  → শুধু electronics category ও 50,000 টাকার নিচের products

Sorting:
  GET /api/products?sort=price&order=asc
  → দাম কম থেকে বেশি ক্রমে সাজাও

Filter + Sort:
  GET /api/products?category=electronics&price_max=50000&sort=price&order=asc
  → Electronics, 50K-এর নিচে, দাম অনুযায়ী ascending
```

> **বাস্তব উদাহরণ:** Daraz/Amazon-এ "Electronics" category select করো → price range দাও → "Price: Low to High" sort করো। Backend-এ ঠিক এটাই ঘটছে।

---

## URL Query Parameter Design

### Common Patterns

```
Exact Match:       ?status=active
                   ?role=admin
                   ?category=electronics

Comparison:        ?price_min=100&price_max=5000
                   ?age_gte=18&age_lte=65
                   ?created_after=2026-01-01

Search (Partial):  ?search=ripon
                   ?q=macbook+pro

Multiple Values:   ?status=active,pending
                   ?category=electronics,books
                   ?tags=javascript,nodejs

Boolean:           ?is_active=true
                   ?featured=true
                   ?in_stock=true

Sorting:           ?sort=price&order=asc
                   ?sort=-price  (minus = descending)
                   ?sort=price:asc,name:desc

Pagination:        ?page=2&limit=20

Field Selection:   ?fields=name,email,createdAt
```

### URL Design Best Practices

```
✅ Good:
  /api/products?category=electronics&price_min=100&sort=price&order=asc

❌ Bad:
  /api/products/category/electronics/price/100-5000/sort/price/asc
  (URL path-এ filter দেওয়া — messy, inflexible)

✅ Naming Convention:
  snake_case → price_min, created_at, is_active
  বা camelCase → priceMin, createdAt, isActive
  (project-এ consistent থাকো)
```

---

## Filtering Implementation

### Basic Filtering (Express + MongoDB)

```javascript
app.get("/api/products", async (req, res) => {
  const filter = {};

  // Exact match
  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.brand) {
    filter.brand = req.query.brand;
  }

  // Boolean
  if (req.query.in_stock !== undefined) {
    filter.inStock = req.query.in_stock === "true";
  }

  if (req.query.featured !== undefined) {
    filter.featured = req.query.featured === "true";
  }

  // Range (price)
  if (req.query.price_min || req.query.price_max) {
    filter.price = {};
    if (req.query.price_min)
      filter.price.$gte = parseFloat(req.query.price_min);
    if (req.query.price_max)
      filter.price.$lte = parseFloat(req.query.price_max);
  }

  // Date range
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
  }

  // Multiple values (comma-separated)
  if (req.query.tags) {
    filter.tags = { $in: req.query.tags.split(",") };
  }

  const products = await Product.find(filter).limit(20);
  res.json({ data: products });
});
```

### Text Search

```javascript
// Simple regex search (ছোট dataset-এ)
if (req.query.search) {
  filter.$or = [
    { name: { $regex: req.query.search, $options: "i" } },
    { description: { $regex: req.query.search, $options: "i" } },
  ];
}

// MongoDB Full-Text Search (বড় dataset-এ)
// Schema: productSchema.index({ name: 'text', description: 'text' });
if (req.query.q) {
  filter.$text = { $search: req.query.q };
}
```

```
Regex Search:
  ✅ Partial match ("mac" → "Macbook Pro")
  ✅ Case-insensitive
  ❌ Large dataset-এ slow (no index)
  ❌ Fuzzy search নেই

Full-Text Search:
  ✅ Fast (text index ব্যবহার করে)
  ✅ Relevance score
  ❌ Partial match নেই ("mac" ≠ "macbook")
  ❌ text index তৈরি করতে হয়

Advanced Search → Elasticsearch/Meilisearch (আলাদা search engine)
```

### Nested Object Filtering

```javascript
// Address city দিয়ে filter
if (req.query.city) {
  filter["address.city"] = req.query.city;
}

// Rating range
if (req.query.min_rating) {
  filter["rating.average"] = { $gte: parseFloat(req.query.min_rating) };
}
```

---

## Sorting Implementation

### Basic Sorting

```javascript
app.get("/api/products", async (req, res) => {
  // Allowed sort fields (whitelist — security!)
  const ALLOWED_SORT_FIELDS = ["name", "price", "createdAt", "rating", "sales"];

  let sort = { createdAt: -1 }; // default: newest first

  if (req.query.sort) {
    const sortField = req.query.sort;
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    if (ALLOWED_SORT_FIELDS.includes(sortField)) {
      sort = { [sortField]: sortOrder };
    }
  }

  const products = await Product.find(filter).sort(sort).limit(20);
  res.json({ data: products });
});
```

### Alternative Sort Syntax

```
Style 1: Separate params
  ?sort=price&order=asc

Style 2: Prefix (- for descending)
  ?sort=-price        → descending
  ?sort=price         → ascending

Style 3: Colon syntax
  ?sort=price:asc
  ?sort=price:desc

Style 4: Multiple sort
  ?sort=price:asc,name:desc
  ?sort=-price,name
```

### Multi-Field Sorting

```javascript
function parseSort(sortString, allowedFields) {
  if (!sortString) return { createdAt: -1 };

  const sort = {};
  const fields = sortString.split(",");

  for (const field of fields) {
    // Style: "-price" or "price"
    if (field.startsWith("-")) {
      const name = field.slice(1);
      if (allowedFields.includes(name)) sort[name] = -1;
    } else {
      if (allowedFields.includes(field)) sort[field] = 1;
    }
  }

  return Object.keys(sort).length > 0 ? sort : { createdAt: -1 };
}

// Usage:
// ?sort=-price,name → { price: -1, name: 1 }
// ?sort=rating      → { rating: 1 }
const sort = parseSort(req.query.sort, ALLOWED_SORT_FIELDS);
```

### Colon-Style Multi-Sort

```javascript
function parseSortColon(sortString, allowedFields) {
  if (!sortString) return { createdAt: -1 };

  const sort = {};
  const fields = sortString.split(",");

  for (const field of fields) {
    const [name, order] = field.split(":");
    if (allowedFields.includes(name)) {
      sort[name] = order === "desc" ? -1 : 1;
    }
  }

  return Object.keys(sort).length > 0 ? sort : { createdAt: -1 };
}

// ?sort=price:asc,name:desc → { price: 1, name: -1 }
```

### Sorting Security

```javascript
// ❌ User-এর input সরাসরি sort-এ ব্যবহার করো না!
const sort = { [req.query.sort]: req.query.order };
// Attack: ?sort=password&order=1 → password field দেখে ফেলবে!

// ✅ Whitelist approach
const ALLOWED = ["name", "price", "createdAt"];
if (!ALLOWED.includes(req.query.sort)) {
  return res.status(400).json({ error: "Invalid sort field" });
}
```

---

## Field Selection (Sparse Fieldsets)

Client-কে শুধু দরকারি fields আনতে দাও:

```
GET /api/products?fields=name,price,image
→ শুধু name, price, image return করো (bandwidth save)
```

```javascript
function parseFields(fieldsString, allowedFields) {
  if (!fieldsString) return null;

  const requested = fieldsString.split(",");
  const valid = requested.filter((f) => allowedFields.includes(f));

  return valid.length > 0 ? valid.join(" ") : null;
}

const ALLOWED_FIELDS = [
  "name",
  "price",
  "description",
  "image",
  "category",
  "rating",
  "createdAt",
];

app.get("/api/products", async (req, res) => {
  const fields = parseFields(req.query.fields, ALLOWED_FIELDS);

  let query = Product.find(filter).sort(sort);
  if (fields) query = query.select(fields);

  const products = await query.limit(20);
  res.json({ data: products });
});
```

---

## SQL Implementation

### Filtering

```sql
SELECT id, name, price, category
FROM products
WHERE category = 'electronics'
  AND price BETWEEN 100 AND 5000
  AND in_stock = true
  AND name ILIKE '%macbook%'
ORDER BY price ASC
LIMIT 20 OFFSET 0;
```

### Parameterized Query Builder

```javascript
function buildQuery(filters) {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (filters.category) {
    conditions.push(`category = $${paramIndex++}`);
    params.push(filters.category);
  }

  if (filters.price_min) {
    conditions.push(`price >= $${paramIndex++}`);
    params.push(parseFloat(filters.price_min));
  }

  if (filters.price_max) {
    conditions.push(`price <= $${paramIndex++}`);
    params.push(parseFloat(filters.price_max));
  }

  if (filters.search) {
    conditions.push(
      `(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`,
    );
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  if (filters.in_stock !== undefined) {
    conditions.push(`in_stock = $${paramIndex++}`);
    params.push(filters.in_stock === "true");
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return { where, params };
}

// Usage
const { where, params } = buildQuery(req.query);
const sql = `SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT 20`;
const result = await db.query(sql, params);
```

### Prisma Implementation

```javascript
app.get("/api/products", async (req, res) => {
  const where = {};

  if (req.query.category) where.category = req.query.category;
  if (req.query.in_stock) where.inStock = req.query.in_stock === "true";

  if (req.query.price_min || req.query.price_max) {
    where.price = {};
    if (req.query.price_min) where.price.gte = parseFloat(req.query.price_min);
    if (req.query.price_max) where.price.lte = parseFloat(req.query.price_max);
  }

  if (req.query.search) {
    where.OR = [
      { name: { contains: req.query.search, mode: "insensitive" } },
      { description: { contains: req.query.search, mode: "insensitive" } },
    ];
  }

  if (req.query.tags) {
    where.tags = { hasSome: req.query.tags.split(",") };
  }

  const sortField = ["name", "price", "createdAt"].includes(req.query.sort)
    ? req.query.sort
    : "createdAt";
  const sortOrder = req.query.order === "asc" ? "asc" : "desc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sortField]: sortOrder },
      take: 20,
      skip: 0,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ data: products, total });
});
```

---

## Reusable Filter Builder

প্রতিটি route-এ filter logic repeat না করে **reusable builder** তৈরি করো:

```javascript
class QueryBuilder {
  constructor(model) {
    this.model = model;
    this.filter = {};
    this.sortObj = { createdAt: -1 };
    this.projection = null;
    this.skipVal = 0;
    this.limitVal = 20;
  }

  exact(field, value) {
    if (value !== undefined && value !== null && value !== "") {
      this.filter[field] = value;
    }
    return this;
  }

  boolean(field, value) {
    if (value !== undefined) {
      this.filter[field] = value === "true";
    }
    return this;
  }

  range(field, min, max) {
    if (min || max) {
      this.filter[field] = {};
      if (min) this.filter[field].$gte = parseFloat(min);
      if (max) this.filter[field].$lte = parseFloat(max);
    }
    return this;
  }

  dateRange(field, from, to) {
    if (from || to) {
      this.filter[field] = {};
      if (from) this.filter[field].$gte = new Date(from);
      if (to) this.filter[field].$lte = new Date(to);
    }
    return this;
  }

  search(fields, term) {
    if (term) {
      this.filter.$or = fields.map((f) => ({
        [f]: { $regex: term, $options: "i" },
      }));
    }
    return this;
  }

  inArray(field, values) {
    if (values) {
      const arr = typeof values === "string" ? values.split(",") : values;
      this.filter[field] = { $in: arr };
    }
    return this;
  }

  sort(sortString, allowedFields) {
    if (sortString) {
      this.sortObj = parseSort(sortString, allowedFields);
    }
    return this;
  }

  select(fieldsString, allowedFields) {
    if (fieldsString) {
      const fields = fieldsString
        .split(",")
        .filter((f) => allowedFields.includes(f));
      if (fields.length) this.projection = fields.join(" ");
    }
    return this;
  }

  paginate(page, limit, maxLimit = 100) {
    this.limitVal = Math.min(maxLimit, Math.max(1, parseInt(limit) || 20));
    const p = Math.max(1, parseInt(page) || 1);
    this.skipVal = (p - 1) * this.limitVal;
    return this;
  }

  async exec() {
    let query = this.model.find(this.filter);
    if (this.projection) query = query.select(this.projection);
    query = query.sort(this.sortObj).skip(this.skipVal).limit(this.limitVal);

    const [data, total] = await Promise.all([
      query.lean(),
      this.model.countDocuments(this.filter),
    ]);

    const totalPages = Math.ceil(total / this.limitVal);
    const page = Math.floor(this.skipVal / this.limitVal) + 1;

    return {
      data,
      pagination: {
        page,
        limit: this.limitVal,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
```

### QueryBuilder ব্যবহার

```javascript
const SORT_FIELDS = ["name", "price", "createdAt", "rating"];
const SELECT_FIELDS = [
  "name",
  "price",
  "image",
  "category",
  "rating",
  "createdAt",
];

app.get("/api/products", async (req, res) => {
  const result = await new QueryBuilder(Product)
    .exact("category", req.query.category)
    .exact("brand", req.query.brand)
    .boolean("inStock", req.query.in_stock)
    .boolean("featured", req.query.featured)
    .range("price", req.query.price_min, req.query.price_max)
    .range("rating.average", req.query.min_rating, req.query.max_rating)
    .dateRange("createdAt", req.query.from, req.query.to)
    .search(["name", "description"], req.query.search)
    .inArray("tags", req.query.tags)
    .sort(req.query.sort, SORT_FIELDS)
    .select(req.query.fields, SELECT_FIELDS)
    .paginate(req.query.page, req.query.limit)
    .exec();

  res.json(result);
});

// GET /api/products?category=electronics&price_min=100&price_max=5000
//     &search=macbook&sort=-price&fields=name,price,image&page=1&limit=10
```

---

## Python — FastAPI

```python
from fastapi import FastAPI, Query
from typing import Optional

app = FastAPI()

@app.get("/api/products")
async def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    in_stock: Optional[bool] = None,
    price_min: Optional[float] = Query(None, ge=0),
    price_max: Optional[float] = Query(None, ge=0),
    search: Optional[str] = Query(None, max_length=200),
    tags: Optional[str] = None,
    sort: str = Query("created_at", regex="^(name|price|created_at|rating)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    query = {}

    if category:
        query["category"] = category
    if brand:
        query["brand"] = brand
    if in_stock is not None:
        query["in_stock"] = in_stock
    if price_min is not None or price_max is not None:
        query["price"] = {}
        if price_min is not None:
            query["price"]["$gte"] = price_min
        if price_max is not None:
            query["price"]["$lte"] = price_max
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    if tags:
        query["tags"] = {"$in": tags.split(",")}

    skip = (page - 1) * limit
    sort_direction = 1 if order == "asc" else -1

    products = await db.products.find(query)\
        .sort(sort, sort_direction)\
        .skip(skip)\
        .limit(limit)\
        .to_list(limit)

    total = await db.products.count_documents(query)

    return {
        "data": products,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": -(-total // limit)
        }
    }
```

---

## Advanced Filtering Patterns

### 1. Faceted Search (Count Per Filter)

E-commerce-এ common — প্রতিটি filter value-তে কতগুলো item আছে দেখানো:

```javascript
// "Electronics (234), Books (89), Clothing (156)"
app.get("/api/products/facets", async (req, res) => {
  const facets = await Product.aggregate([
    { $match: filter }, // current filters apply করো
    {
      $facet: {
        categories: [
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        brands: [
          { $group: { _id: "$brand", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        priceRanges: [
          {
            $bucket: {
              groupBy: "$price",
              boundaries: [0, 1000, 5000, 10000, 50000, Infinity],
              default: "Other",
              output: { count: { $sum: 1 } },
            },
          },
        ],
        ratings: [
          {
            $group: { _id: { $floor: "$rating.average" }, count: { $sum: 1 } },
          },
          { $sort: { _id: -1 } },
        ],
      },
    },
  ]);

  res.json(facets[0]);
});
```

```json
{
  "categories": [
    { "_id": "electronics", "count": 234 },
    { "_id": "clothing", "count": 156 },
    { "_id": "books", "count": 89 }
  ],
  "brands": [
    { "_id": "Apple", "count": 45 },
    { "_id": "Samsung", "count": 38 }
  ],
  "priceRanges": [
    { "_id": 0, "count": 120 },
    { "_id": 1000, "count": 340 },
    { "_id": 5000, "count": 200 }
  ]
}
```

### 2. Geo-Location Filtering

```javascript
// কাছের restaurants খুঁজো
// Schema: locationSchema.index({ location: '2dsphere' });

if (req.query.lat && req.query.lng) {
  const maxDistance = parseInt(req.query.radius) || 5000; // 5km default

  filter.location = {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
      },
      $maxDistance: maxDistance,
    },
  };
}

// GET /api/restaurants?lat=23.8103&lng=90.4125&radius=3000
```

### 3. Aggregation Pipeline Filtering

```javascript
// Complex filtering with computed fields
const pipeline = [
  { $match: filter },
  {
    $addFields: {
      discountedPrice: {
        $multiply: [
          "$price",
          { $subtract: [1, { $divide: ["$discount", 100] }] },
        ],
      },
    },
  },
  { $match: { discountedPrice: { $lte: 5000 } } },
  { $sort: { discountedPrice: 1 } },
  { $skip: skip },
  { $limit: limit },
];

const products = await Product.aggregate(pipeline);
```

---

## Database Indexes

Filtering ও sorting fast করার key হলো **proper indexes**:

```javascript
// MongoDB indexes
productSchema.index({ category: 1 }); // Exact match filter
productSchema.index({ price: 1 }); // Range filter
productSchema.index({ category: 1, price: 1 }); // Compound filter
productSchema.index({ name: "text", description: "text" }); // Full-text search
productSchema.index({ createdAt: -1 }); // Sort
productSchema.index({ category: 1, price: 1, createdAt: -1 }); // Filter + Sort
```

```sql
-- SQL indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_cat_price ON products(category, price);
CREATE INDEX idx_products_created ON products(created_at DESC);
```

```
Index Strategy:
─────────────────────────────────────
1. সবচেয়ে বেশি filter হয় এমন field-এ index দাও
2. Compound index-এ order matters: equality → range → sort
   { category: 1, price: 1, createdAt: -1 }
   ✅ category = 'electronics' AND price < 5000 ORDER BY createdAt
3. প্রতিটি query-তে আলাদা index দরকার না — compound index অনেক query cover করে
4. Too many indexes → write performance কমে (insert/update slow)
```

---

## Filter Validation

User-এর filter input-ও validate করো:

```javascript
const Joi = require("joi");

const productFilterSchema = Joi.object({
  category: Joi.string()
    .valid("electronics", "books", "clothing", "food")
    .optional(),
  brand: Joi.string().max(50).optional(),
  in_stock: Joi.string().valid("true", "false").optional(),
  featured: Joi.string().valid("true", "false").optional(),
  price_min: Joi.number().min(0).optional(),
  price_max: Joi.number().min(0).optional(),
  min_rating: Joi.number().min(0).max(5).optional(),
  search: Joi.string().max(200).trim().optional(),
  tags: Joi.string().max(500).optional(),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional(),
  sort: Joi.string().valid("name", "price", "createdAt", "rating").optional(),
  order: Joi.string().valid("asc", "desc").optional(),
  fields: Joi.string().max(200).optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
}).with("price_max", "price_min"); // price_max দিলে price_min-ও দিতে হবে (optional)

app.get(
  "/api/products",
  validate(productFilterSchema, "query"),
  async (req, res) => {
    // ... validated query params
  },
);
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Filtering = শর্ত অনুযায়ী data বের করা
Sorting = নির্দিষ্ট ক্রমে সাজানো
Field Selection = শুধু দরকারি fields return

Filter Types:
  Exact     → ?category=electronics
  Range     → ?price_min=100&price_max=5000
  Search    → ?search=macbook (regex/text index)
  Boolean   → ?in_stock=true
  Multiple  → ?tags=js,node (comma-separated)
  Date      → ?from=2026-01-01&to=2026-12-31
  Geo       → ?lat=23.81&lng=90.41&radius=5000

Sort Syntax:
  ?sort=price&order=asc       → separate params
  ?sort=-price                → prefix style
  ?sort=price:asc,name:desc   → colon style + multi-sort

Security:
  ✅ Whitelist sort fields (NEVER use raw input)
  ✅ Validate filter values (Joi/Zod)
  ✅ Whitelist field selection
  ✅ Max limit enforce

Performance:
  ✅ Database index দাও (filter + sort fields)
  ✅ Compound index: equality → range → sort
  ✅ Projection (select) ব্যবহার করো
  ✅ .lean() (Mongoose)

QueryBuilder Pattern → Reusable, chainable filter builder
Faceted Search → প্রতিটি filter-এ count দেখাও (e-commerce)
```

---

## Interview Golden Lines

> **Always whitelist sort and filter fields — accepting arbitrary field names exposes internal data and enables injection attacks.**

> **Compound database indexes should follow the ESR rule: Equality fields first, then Sort fields, then Range fields.**

> **Faceted search counts items per filter value (like "Electronics: 234") — implemented via aggregation pipelines.**

> **Text search with regex works for small datasets, but large-scale search needs dedicated engines like Elasticsearch or Meilisearch.**

> **A reusable QueryBuilder pattern eliminates duplicate filter logic across endpoints — chain exact, range, search, sort, and paginate in one fluent API.**

> **Field selection (sparse fieldsets) reduces response size and improves performance — only return what the client needs.**
