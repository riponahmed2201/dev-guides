# API Documentation — Swagger / OpenAPI

## API Documentation কেন দরকার?

তুমি একটা চমৎকার API বানালে — কিন্তু কেউ বুঝতে পারছে না কীভাবে ব্যবহার করবে। Documentation ছাড়া API অর্থহীন।

```
Documentation ছাড়া:
Frontend Dev: "এই endpoint কী return করে?"
Backend Dev:  "Code দেখো..."
Frontend Dev: "required field কোনটা?"
Backend Dev:  "Hmm... code-এ আছে, দেখো..."
Frontend Dev: "Error হলে কী আসে?"
Backend Dev:  "...try করে দেখো"

Documentation দিয়ে:
Frontend Dev: docs.example.com → সব তথ্য আছে, নিজেই বুঝে নিলো ✅
```

---

## OpenAPI Specification কী?

**OpenAPI Specification (OAS)** হলো REST API describe করার **industry standard format**। আগে এটি **Swagger Specification** নামে পরিচিত ছিল।

```
ইতিহাস:
2011 → Swagger তৈরি হলো (Tony Tam)
2015 → SmartBear Swagger কিনে নিলো
2016 → OpenAPI Initiative-তে দান করলো (Linux Foundation)
2017 → OpenAPI 3.0 release
2021 → OpenAPI 3.1 release

Swagger = Tools (UI, Editor, Codegen)
OpenAPI = Specification (standard format)

অনেকে এখনো "Swagger" বলে — কিন্তু সঠিক নাম "OpenAPI Specification"
```

---

## OpenAPI vs Swagger — পার্থক্য

| বিষয় | OpenAPI | Swagger |
|-------|---------|---------|
| কী | Specification (standard) | Tools collection |
| কাজ | API কীভাবে কাজ করে তার format | API test, docs generate, code generate |
| Format | YAML / JSON file | UI, Editor, Codegen |
| Version | OpenAPI 3.0 / 3.1 | Swagger 2.0 (পুরনো) |

```
OpenAPI Specification = API-এর blueprint (YAML/JSON file)
Swagger UI            = সেই blueprint থেকে interactive docs তৈরি
Swagger Editor        = blueprint লেখার tool
Swagger Codegen       = blueprint থেকে code generate
```

---

## OpenAPI Spec Structure (YAML)

একটি সম্পূর্ণ OpenAPI file দেখা যাক:

### Basic Structure

```yaml
openapi: 3.0.3
info:
  title: User Management API
  description: API for managing users
  version: 1.0.0
  contact:
    name: Ripon Ahmed
    email: ripon@example.com

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging-api.example.com/v1
    description: Staging
  - url: http://localhost:3000/v1
    description: Local Development

paths:
  /users:
    get:
      ...
    post:
      ...
  /users/{id}:
    get:
      ...
    put:
      ...
    delete:
      ...

components:
  schemas:
    ...
  securitySchemes:
    ...
```

### Paths — Endpoints Define করা

```yaml
paths:
  /users:
    get:
      summary: Get all users
      description: Returns a paginated list of users
      operationId: getUsers
      tags:
        - Users
      parameters:
        - name: page
          in: query
          description: Page number
          required: false
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          description: Items per page
          required: false
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: role
          in: query
          description: Filter by role
          required: false
          schema:
            type: string
            enum: [admin, user, moderator]
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: success
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/ServerError'

    post:
      summary: Create a new user
      description: Creates a new user account
      operationId: createUser
      tags:
        - Users
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserInput'
            example:
              name: "Ripon Ahmed"
              email: "ripon@example.com"
              role: "developer"
      responses:
        '201':
          description: User created successfully
          headers:
            Location:
              description: URL of the created user
              schema:
                type: string
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                    example: success
                  data:
                    $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: Email already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /users/{id}:
    get:
      summary: Get user by ID
      operationId: getUserById
      tags:
        - Users
      parameters:
        - name: id
          in: path
          required: true
          description: User ID
          schema:
            type: integer
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                  data:
                    $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'

    patch:
      summary: Update user
      operationId: updateUser
      tags:
        - Users
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUserInput'
      responses:
        '200':
          description: User updated
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      summary: Delete user
      operationId: deleteUser
      tags:
        - Users
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '204':
          description: User deleted (no content)
        '404':
          $ref: '#/components/responses/NotFound'
```

### Components — Reusable Schemas

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
          example: 42
        name:
          type: string
          example: "Ripon Ahmed"
        email:
          type: string
          format: email
          example: "ripon@example.com"
        role:
          type: string
          enum: [admin, user, moderator]
          example: "user"
        is_active:
          type: boolean
          example: true
        created_at:
          type: string
          format: date-time
          example: "2026-02-18T14:30:00Z"
      required:
        - id
        - name
        - email

    CreateUserInput:
      type: object
      properties:
        name:
          type: string
          minLength: 2
          maxLength: 100
        email:
          type: string
          format: email
        role:
          type: string
          enum: [admin, user, moderator]
          default: user
        password:
          type: string
          minLength: 8
          format: password
      required:
        - name
        - email
        - password

    UpdateUserInput:
      type: object
      properties:
        name:
          type: string
        email:
          type: string
          format: email
        role:
          type: string

    Pagination:
      type: object
      properties:
        page:
          type: integer
          example: 1
        limit:
          type: integer
          example: 20
        total:
          type: integer
          example: 150
        total_pages:
          type: integer
          example: 8

    Error:
      type: object
      properties:
        status:
          type: string
          example: error
        error:
          type: object
          properties:
            code:
              type: string
              example: "VALIDATION_ERROR"
            message:
              type: string
              example: "Invalid input data"
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  message:
                    type: string

  responses:
    BadRequest:
      description: Invalid request data
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            status: error
            error:
              code: AUTH_REQUIRED
              message: "Please provide a valid token"

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    ServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: "JWT token from /auth/login endpoint"

    apiKey:
      type: apiKey
      in: header
      name: X-API-Key

security:
  - bearerAuth: []
```

---

## Swagger UI

OpenAPI spec file থেকে **interactive documentation** তৈরি করে। Browser-এ API test-ও করা যায়।

```
Swagger UI features:
- সব endpoint দেখায় (grouped by tags)
- Request/Response examples
- "Try it out" button → সরাসরি browser থেকে API call
- Authentication → Token/API key দিয়ে test
- Parameter description ও validation rules
```

```
Swagger UI URL:
https://api.example.com/docs         ← Swagger UI
https://api.example.com/openapi.json ← Raw spec file
https://api.example.com/redoc        ← ReDoc (alternative)
```

### Framework Integration

**Express.js (Node.js):**

```javascript
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./openapi.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
```

**FastAPI (Python) — Built-in!**

```python
from fastapi import FastAPI

app = FastAPI(
    title="User Management API",
    description="API for managing users",
    version="1.0.0"
)

@app.get("/users", tags=["Users"])
async def get_users(page: int = 1, limit: int = 20):
    """Get all users with pagination."""
    ...

# Automatic docs:
# http://localhost:8000/docs     → Swagger UI
# http://localhost:8000/redoc    → ReDoc
```

> FastAPI-তে code লিখলেই docs automatic তৈরি হয় — আলাদা YAML লিখতে হয় না!

**Django REST Framework:**

```python
# drf-spectacular
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(), name='swagger-ui'),
]
```

---

## Documentation Approaches

### 1. Spec-First (Design First)

আগে OpenAPI spec লেখো, তারপর code:

```
Step 1: YAML/JSON-এ API design (openapi.yaml)
Step 2: Team review করে
Step 3: Code generate বা manually implement
Step 4: Spec আর code sync রাখো
```

```
সুবিধা:
✅ Frontend ও Backend parallel কাজ করতে পারে
✅ API design ভালো হয় (আগে ভেবে design)
✅ Contract-first approach
✅ Code generate করা যায়

অসুবিধা:
❌ Spec maintain করতে হয়
❌ Code আর spec out-of-sync হতে পারে
```

### 2. Code-First

Code লেখো, docs automatic generate হয়:

```
Step 1: Code-এ annotations/decorators দাও
Step 2: Framework automatically spec generate করে
Step 3: Swagger UI automatically update হয়
```

```python
# FastAPI — Code-first example
@app.post("/users", status_code=201, response_model=UserResponse, tags=["Users"])
async def create_user(user: CreateUserInput):
    """
    Create a new user.

    - **name**: User's full name (2-100 characters)
    - **email**: Valid email address
    - **password**: Minimum 8 characters
    """
    ...
```

```
সুবিধা:
✅ Code আর docs সবসময় sync
✅ Code-ই single source of truth
✅ Developer-friendly

অসুবিধা:
❌ Code না লিখলে docs নেই (parallel development কঠিন)
❌ Framework-dependent
```

**কোনটা ভালো?**

```
Small team / Rapid development → Code-First (FastAPI, drf-spectacular)
Large team / Multiple clients  → Spec-First (OpenAPI YAML → code generate)
```

---

## Postman ও Insomnia

### Postman

সবচেয়ে জনপ্রিয় **API testing tool**:

```
Features:
- API request তৈরি ও পাঠানো (GET, POST, PUT, DELETE)
- Collections — related requests group করা
- Environment variables — dev/staging/prod আলাদা URL
- Pre-request scripts — dynamic data generate
- Tests — response assertion
- Mock server — backend ready না হলেও frontend test করতে পারে
- Documentation — collection থেকে docs generate
- Team collaboration — share collections
```

```
Postman workflow:

1. Collection তৈরি: "User API"
2. Request যোগ:
   - GET /api/users
   - POST /api/users
   - GET /api/users/{{userId}}
   - PATCH /api/users/{{userId}}
   - DELETE /api/users/{{userId}}

3. Environment set:
   - dev:  { "baseUrl": "http://localhost:3000" }
   - prod: { "baseUrl": "https://api.example.com" }

4. Test script:
   pm.test("Status is 200", () => {
     pm.response.to.have.status(200);
   });
   pm.test("Response has users", () => {
     const data = pm.response.json();
     pm.expect(data.data).to.be.an('array');
   });
```

**OpenAPI → Postman import:**

```
File → Import → openapi.yaml
→ Automatic collection তৈরি হয়ে যায়!
```

### Insomnia

Postman-এর lightweight alternative:

```
Postman vs Insomnia:

Postman:   Feature-rich, heavy, team collaboration, paid features
Insomnia:  Lightweight, fast, open-source friendly, simpler UI

ছোট team / personal → Insomnia
বড় team / enterprise → Postman
```

---

## API Documentation Tools তুলনা

| Tool | Type | বৈশিষ্ট্য | Free? |
|------|------|-----------|-------|
| **Swagger UI** | Interactive docs | Try it out, OpenAPI-based | ✅ |
| **ReDoc** | Beautiful docs | Clean UI, OpenAPI-based | ✅ |
| **Postman Docs** | From collections | Auto-generated | ⚠️ Limited |
| **Stoplight** | Design + Docs | Visual editor, mock server | ⚠️ Freemium |
| **ReadMe** | Developer portal | Customizable, analytics | ❌ Paid |
| **Docusaurus** | Custom docs | React-based, flexible | ✅ |
| **Slate** | Static docs | Clean, Markdown-based | ✅ |

---

## ভালো API Documentation-এর Checklist

```
✅ প্রতিটি endpoint documented
✅ Request/Response examples (real data দিয়ে)
✅ Authentication instructions
✅ Error codes ও messages
✅ Rate limiting information
✅ Query parameters (required/optional, default values)
✅ Request body schema (field types, validation rules)
✅ Status codes per endpoint
✅ Getting started / Quick start guide
✅ Code examples (cURL, JavaScript, Python)
✅ Changelog / Version history
✅ "Try it out" functionality
✅ Search support
```

**ভালো endpoint documentation:**

```
POST /api/v1/users

Description: Create a new user account

Authentication: Bearer token (admin only)

Request Body:
| Field    | Type   | Required | Rules                    |
|----------|--------|----------|--------------------------|
| name     | string | ✅       | 2-100 characters         |
| email    | string | ✅       | Valid email, unique       |
| password | string | ✅       | Min 8 chars, 1 uppercase |
| role     | string | ❌       | Default: "user"          |

Success Response: 201 Created
Error Responses:  400, 401, 409, 422, 500

Example:
  curl -X POST https://api.example.com/v1/users \
    -H "Authorization: Bearer eyJhbG..." \
    -H "Content-Type: application/json" \
    -d '{"name":"Ripon","email":"ripon@example.com","password":"Pass1234"}'
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
OpenAPI = Standard format (YAML/JSON) to describe REST APIs
Swagger = Tools (UI, Editor, Codegen) that use OpenAPI spec

Approaches:
Spec-First → YAML লেখো → Code generate (large team)
Code-First → Code লেখো → Docs auto-generate (small team)

Tools:
Write & Design  → Swagger Editor, Stoplight
View & Test     → Swagger UI, ReDoc
API Testing     → Postman, Insomnia
Auto-generate   → FastAPI (built-in), drf-spectacular

Good docs = Examples + Try it out + Error codes + Auth guide
```

---

## Interview Golden Lines

> **OpenAPI is the specification, Swagger is the toolset — people often confuse the two.**

> **Spec-first design lets frontend and backend teams work in parallel using a shared contract.**

> **FastAPI generates OpenAPI docs automatically from Python type hints — zero extra effort.**

> **The best API documentation has real examples, error descriptions, and a "Try it out" button.**

> **Postman is for testing APIs; Swagger UI is for documenting them — both can import OpenAPI specs.**
