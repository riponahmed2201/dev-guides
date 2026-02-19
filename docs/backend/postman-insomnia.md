# Postman ও Insomnia — API Testing Tools

## API Testing Tool কেন দরকার?

Backend developer হিসেবে API বানানোর পর সেটা **test করতে হয়**। Browser-এ শুধু GET request করা যায় — POST, PUT, DELETE করতে হলে tool দরকার।

```
Browser:
✅ GET /api/users     → কাজ করে
❌ POST /api/users    → করা যায় না (form ছাড়া)
❌ PUT /api/users/42  → করা যায় না
❌ DELETE            → করা যায় না
❌ Custom headers    → দেওয়া যায় না

Postman/Insomnia:
✅ GET, POST, PUT, PATCH, DELETE → সব method
✅ Custom headers → Authorization, Content-Type
✅ Request body → JSON, form-data, file upload
✅ Environment variables → dev/staging/prod switch
✅ Automated testing → response check
✅ Collection → requests organize
```

```
cURL দিয়েও করা যায়:
curl -X POST https://api.example.com/users \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ripon","email":"ripon@example.com"}'

কিন্তু:
❌ মনে রাখা কঠিন
❌ Response সুন্দরভাবে দেখায় না
❌ Save/reuse করা যায় না
❌ Team-এ share করা কঠিন

Postman/Insomnia GUI দিয়ে এসব সহজ!
```

---

## Postman

সবচেয়ে জনপ্রিয় API testing tool। ২৫ মিলিয়ন+ developer ব্যবহার করে।

### Request পাঠানো (Basic)

```
1. Method select করো: GET / POST / PUT / PATCH / DELETE
2. URL লেখো: https://api.example.com/users
3. Headers যোগ করো (optional):
   Authorization: Bearer eyJhbG...
   Content-Type: application/json
4. Body যোগ করো (POST/PUT/PATCH):
   { "name": "Ripon", "email": "ripon@example.com" }
5. Send বাটন চাপো!
6. Response দেখো: Status, Body, Headers, Time
```

**Response panel-এ দেখা যায়:**

```
Status:  200 OK
Time:    145 ms
Size:    2.3 KB

Body (Pretty):
{
  "status": "success",
  "data": {
    "id": 42,
    "name": "Ripon",
    "email": "ripon@example.com"
  }
}

Headers:
Content-Type: application/json
X-RateLimit-Remaining: 95
```

---

### Collections — Requests Organize করা

Related requests একটা folder-এ group করা:

```
📁 User Management API
├── 📁 Auth
│   ├── POST /auth/register
│   ├── POST /auth/login
│   └── POST /auth/refresh-token
├── 📁 Users
│   ├── GET /users
│   ├── GET /users/:id
│   ├── POST /users
│   ├── PATCH /users/:id
│   └── DELETE /users/:id
├── 📁 Posts
│   ├── GET /posts
│   ├── POST /posts
│   └── GET /posts/:id/comments
└── 📁 Admin
    ├── GET /admin/dashboard
    └── GET /admin/users?role=admin
```

> Collection export করে team-এ share করা যায় (JSON file)।

---

### Environment Variables

Development, staging, production — আলাদা URL/token ব্যবহার করতে:

```
Environment: Development
{
  "baseUrl": "http://localhost:3000/api/v1",
  "token": "dev-token-abc123"
}

Environment: Staging
{
  "baseUrl": "https://staging-api.example.com/v1",
  "token": "staging-token-xyz789"
}

Environment: Production
{
  "baseUrl": "https://api.example.com/v1",
  "token": "prod-token-secure456"
}
```

**Request-এ variable ব্যবহার:**

```
URL:    {{baseUrl}}/users
Header: Authorization: Bearer {{token}}

Environment switch করলে URL আর token automatic বদলে যায়!
```

**Variables-এর ধরন:**

```
Global Variables:     সব collection-এ কাজ করে
Collection Variables: শুধু ঐ collection-এ
Environment Variables: selected environment অনুযায়ী
Local Variables:      শুধু ঐ request-এ

Priority: Local > Environment > Collection > Global
```

---

### Dynamic Variables

Postman-এর built-in dynamic values:

```
{{$randomFullName}}      → "Ripon Ahmed"
{{$randomEmail}}         → "ripon42@example.com"
{{$randomUUID}}          → "6929bb52-3ab2-448a-9796-d6480ecad36b"
{{$randomInt}}           → 742
{{$randomBoolean}}       → true
{{$timestamp}}           → 1708271400 (Unix timestamp)
{{$isoTimestamp}}        → "2026-02-18T14:30:00.000Z"
```

```json
POST /api/users
{
  "name": "{{$randomFullName}}",
  "email": "{{$randomEmail}}",
  "age": {{$randomInt}}
}
→ প্রতিবার আলাদা random data দিয়ে test!
```

---

### Pre-request Scripts

Request পাঠানোর **আগে** JavaScript code চালানো:

```javascript
// Login করে token নিয়ে variable-এ set করো
const loginUrl = pm.environment.get("baseUrl") + "/auth/login";

pm.sendRequest({
    url: loginUrl,
    method: 'POST',
    header: { 'Content-Type': 'application/json' },
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            email: "ripon@example.com",
            password: "secret123"
        })
    }
}, (err, res) => {
    const token = res.json().token;
    pm.environment.set("token", token);
});
```

```javascript
// Timestamp generate করে variable-এ রাখো
const timestamp = new Date().toISOString();
pm.variables.set("currentTime", timestamp);

// Random ID generate
pm.variables.set("randomId", Math.floor(Math.random() * 1000));
```

---

### Test Scripts — Response Verify করা

Request-এর **পরে** response check করা:

```javascript
// Status code check
pm.test("Status code is 200", () => {
    pm.response.to.have.status(200);
});

// Response time check
pm.test("Response time < 500ms", () => {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Body content check
pm.test("Response has correct structure", () => {
    const json = pm.response.json();
    pm.expect(json.status).to.eql("success");
    pm.expect(json.data).to.be.an("array");
    pm.expect(json.data.length).to.be.greaterThan(0);
});

// Header check
pm.test("Content-Type is JSON", () => {
    pm.response.to.have.header("Content-Type", "application/json; charset=utf-8");
});

// Save response data for next request
pm.test("Save user ID", () => {
    const json = pm.response.json();
    pm.environment.set("userId", json.data.id);
});
```

```
Test Results panel:
✅ Status code is 200
✅ Response time < 500ms
✅ Response has correct structure
✅ Content-Type is JSON
✅ Save user ID

5/5 tests passed!
```

---

### Collection Runner — Bulk Test

Collection-এর সব request একসাথে চালানো:

```
📁 User API Collection
  1. POST /auth/login          ← token পায়
  2. GET /users                ← token ব্যবহার করে
  3. POST /users               ← নতুন user তৈরি
  4. GET /users/{{userId}}     ← সদ্য তৈরি user দেখায়
  5. PATCH /users/{{userId}}   ← update করে
  6. DELETE /users/{{userId}}  ← delete করে

Run Collection:
✅ Login — 200 OK (token saved)
✅ Get Users — 200 OK (array returned)
✅ Create User — 201 Created (userId saved)
✅ Get User — 200 OK (correct user)
✅ Update User — 200 OK (updated)
✅ Delete User — 204 No Content

6/6 passed! পুরো CRUD flow test হয়ে গেল!
```

**Data file দিয়ে multiple iteration:**

```csv
name,email,role
Ripon,ripon@example.com,admin
Karim,karim@example.com,user
Fatema,fatema@example.com,moderator
```

```
Run with data file:
Iteration 1: name=Ripon, email=ripon@... → ✅
Iteration 2: name=Karim, email=karim@... → ✅
Iteration 3: name=Fatema, email=fatema@... → ✅

3 iterations × 6 requests = 18 requests, all passed!
```

---

### Chain Requests — একটার output পরেরটার input

```
Request 1: POST /auth/login
  Body: { "email": "ripon@example.com", "password": "secret" }
  Test Script:
    const token = pm.response.json().token;
    pm.environment.set("authToken", token);      ← token save

Request 2: POST /users
  Header: Authorization: Bearer {{authToken}}    ← token ব্যবহার
  Body: { "name": "New User" }
  Test Script:
    const userId = pm.response.json().data.id;
    pm.environment.set("newUserId", userId);     ← userId save

Request 3: GET /users/{{newUserId}}              ← userId ব্যবহার
  Header: Authorization: Bearer {{authToken}}

→ প্রতিটি request আগেরটার data ব্যবহার করে!
```

---

### Mock Server

Backend ready না হলেও frontend team কাজ শুরু করতে পারে:

```
Mock Server setup:
1. Collection থেকে Mock Server তৈরি করো
2. প্রতিটি request-এ example response দাও
3. Mock URL পাও: https://mock-server-id.mock.pstmn.io

Frontend team:
fetch('https://mock-server-id.mock.pstmn.io/api/users')
→ Example response পায় (আসল backend ছাড়াই!)

Backend ready হলে:
URL বদলে দাও → https://api.example.com/api/users
→ আসল data আসতে শুরু করে
```

---

### Newman — CLI Runner

Postman collections **command line থেকে** চালানো (CI/CD-তে):

```bash
# Install
npm install -g newman

# Run collection
newman run my-collection.json -e development.json

# Run with reporters
newman run my-collection.json \
  -e development.json \
  --reporters cli,html \
  --reporter-html-export report.html
```

```
CI/CD Pipeline:
GitHub Actions / Jenkins:
1. Code deploy
2. newman run api-tests.json    ← API test চালাও
3. All passed? → Deploy to production
4. Failed? → Block deployment ❌
```

---

## Insomnia

Postman-এর **lightweight alternative**। Open-source friendly, clean UI।

### Insomnia Features

```
✅ সব HTTP method support
✅ GraphQL built-in support (Postman-এর চেয়ে ভালো)
✅ Environment variables
✅ Plugin system
✅ gRPC support
✅ WebSocket support
✅ Code generation (cURL, Python, JS, Go...)
✅ Git sync (spec file version control)
✅ OpenAPI import/export
✅ Template tags (dynamic values)
```

### Insomnia-র বিশেষত্ব — GraphQL

```
Insomnia-তে GraphQL query লেখা অনেক সহজ:

1. URL: https://api.example.com/graphql
2. Body type: GraphQL
3. Query:
   query {
     user(id: 42) {
       name
       email
       posts {
         title
       }
     }
   }

→ Auto-complete! Schema থেকে suggestion দেয়
→ Query validation
→ Variables panel আলাদা
```

### Template Tags

Insomnia-র dynamic values:

```
{% timestamp %}           → Unix timestamp
{% uuid %}                → Random UUID
{% now 'YYYY-MM-DD' %}   → "2026-02-18"
{% response 'body', 'req_login', '$.token' %}
    → আগের request-এর response থেকে value নেয়!
```

---

## Postman vs Insomnia তুলনা

| Feature | Postman | Insomnia |
|---------|---------|----------|
| **UI** | Feature-rich, complex | Clean, simple |
| **Speed** | ভারী (Electron) | হালকা |
| **GraphQL** | ⚠️ Basic | ✅ Excellent |
| **gRPC** | ❌ | ✅ |
| **WebSocket** | ✅ | ✅ |
| **Collections** | ✅ Advanced | ✅ Basic |
| **Test Scripts** | ✅ JavaScript | ❌ নেই |
| **Collection Runner** | ✅ | ❌ নেই |
| **Mock Server** | ✅ Built-in | ❌ নেই |
| **Newman (CLI)** | ✅ | ❌ (Inso CLI আছে) |
| **Team Collaboration** | ✅ Cloud sync | ⚠️ Git sync |
| **Environment** | ✅ | ✅ |
| **Code Gen** | ✅ | ✅ |
| **OpenAPI** | ✅ Import | ✅ Import/Design |
| **Price** | Freemium | Freemium |
| **Open Source** | ❌ | ⚠️ Core only |

```
কোনটা বেছে নেবে:

Postman ব্যবহার করো যদি:
✅ Team collaboration দরকার
✅ Automated testing (test scripts, runner)
✅ CI/CD integration (Newman)
✅ Mock server দরকার
✅ বড় team, enterprise

Insomnia ব্যবহার করো যদি:
✅ GraphQL primary
✅ Lightweight tool চাই
✅ gRPC support দরকার
✅ Clean, simple UI prefer করো
✅ Solo developer / ছোট team
```

---

## অন্যান্য API Testing Tools

| Tool | বৈশিষ্ট্য | কখন ব্যবহার |
|------|-----------|-------------|
| **cURL** | Command line, সব জায়গায় আছে | Quick test, scripting |
| **HTTPie** | cURL-এর modern alternative | Developer-friendly CLI |
| **Thunder Client** | VS Code extension | IDE ছাড়তে চাই না |
| **REST Client** | VS Code extension (.http files) | Code-এর পাশে test |
| **Bruno** | Open-source, Git-friendly | Postman alternative |
| **Hoppscotch** | Browser-based, open-source | No install, quick test |

### Thunder Client (VS Code)

```
VS Code-এর ভেতরেই API test:
- Extension install করো
- Sidebar-এ Thunder Client icon
- New Request → URL → Send
- Collections, Environment support

সুবিধা: IDE switch করতে হয় না!
```

### REST Client (VS Code)

`.http` file লিখে সরাসরি VS Code থেকে request পাঠানো:

```http
### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "ripon@example.com",
  "password": "secret123"
}

### Get Users
GET http://localhost:3000/api/users
Authorization: Bearer {{token}}

### Create User
POST http://localhost:3000/api/users
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "New User",
  "email": "new@example.com"
}
```

> `.http` file Git-এ commit করা যায় — team-এ share হয়ে যায়!

### HTTPie (CLI)

cURL-এর চেয়ে readable:

```bash
# cURL
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{"name":"Ripon"}'

# HTTPie (same thing, simpler)
http POST https://api.example.com/users \
  name=Ripon \
  Authorization:"Bearer token123"
```

---

## API Testing Workflow (Best Practice)

```
Development workflow:

1. API বানাও (backend)
2. Postman-এ Collection তৈরি করো
3. প্রতিটি endpoint test করো
4. Test scripts লেখো (automated)
5. Environment setup করো (dev/staging/prod)
6. Collection Runner দিয়ে full test
7. Newman দিয়ে CI/CD-তে integrate
8. Collection export করে team-এ share

Testing checklist per endpoint:
✅ Happy path (সব ঠিক থাকলে)
✅ Missing required fields
✅ Invalid data types
✅ Unauthorized access (no token)
✅ Forbidden access (wrong role)
✅ Not found (invalid ID)
✅ Duplicate data (conflict)
✅ Rate limiting
✅ Response time < threshold
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Postman = Full-featured API platform (test, mock, docs, CI/CD)
Insomnia = Lightweight alternative (GraphQL, gRPC friendly)

Postman key features:
- Collections → organize requests
- Environments → dev/staging/prod switch
- Test Scripts → automated response check
- Collection Runner → bulk test
- Newman → CI/CD integration
- Mock Server → backend ছাড়াই frontend test

Workflow:
Build API → Postman test → Automate → CI/CD → Ship!
```

---

## Interview Golden Lines

> **Postman is not just for sending requests — it's a complete API development platform with testing, mocking, and CI/CD.**

> **Environment variables let you switch between dev, staging, and production with a single click.**

> **Newman brings Postman tests into your CI/CD pipeline — if API tests fail, deployment stops.**

> **Insomnia shines for GraphQL — its auto-complete and schema integration are better than Postman's.**

> **The .http file approach (REST Client) is the most developer-friendly — it lives in your codebase and is version-controlled.**
