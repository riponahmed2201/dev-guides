# Authorization & Access Control (অথরাইজেশন ও অ্যাক্সেস কন্ট্রোল)

## Authorization কী?

**Authorization** (সংক্ষেপে AuthZ) হলো **"তুমি কী করতে পারো?"** — User authenticated হওয়ার পর তার **permissions ও access rights** যাচাই করা।

```
Authentication → "তুমি কে?"       → Ripon (verified ✅)
Authorization  → "তুমি কী করতে পারো?" → Ripon কি admin panel access করতে পারবে?

Request Flow:
  Request → Auth Middleware (কে?) → Authorization (কী করতে পারে?) → Route Handler
```

> **বাস্তব উদাহরণ:** Office-এ ID card দিয়ে ঢুকলে (Authentication)। কিন্তু সবার সব room-এ access নেই — CEO-র room-এ শুধু CEO ও PA যেতে পারে, Server room-এ শুধু IT team (Authorization)।

---

## Authentication vs Authorization — Recap

```
Feature            Authentication        Authorization
──────────────────────────────────────────────────────
প্রশ্ন              তুমি কে?              তুমি কী করতে পারো?
কখন                 সবার আগে              Authentication-এর পরে
Verify করে          Credentials            Permissions/Roles
Fail হলে            401 Unauthorized       403 Forbidden
Middleware           authenticate()         authorize()
```

---

## Authorization-এর ধরন

```
Model                কীভাবে কাজ করে                    Use Case
──────────────────────────────────────────────────────────────────
RBAC                 Role-based (admin, user, editor)    Most common
ABAC                 Attribute-based (department, time)  Complex policies
ACL                  Resource-specific permission list   File systems
ReBAC                Relationship-based (owner, member)  Social apps
PBAC                 Policy-based (rules engine)         Enterprise
```

---

## RBAC (Role-Based Access Control)

সবচেয়ে common — User-কে **role** assign করো, role-এর **permissions** define করো:

### ধারণা

```
User → Role → Permissions

Ripon  → admin  → [create, read, update, delete, manage_users]
Karim  → editor → [create, read, update]
Jakir  → user   → [read]

Admin panel access?
  Ripon (admin) → ✅ Allowed
  Karim (editor) → ❌ Forbidden (403)
  Jakir (user) → ❌ Forbidden (403)
```

### Basic Role Check Middleware

```javascript
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'You do not have permission to perform this action'
            });
        }

        next();
    };
}

// Usage:
app.get('/api/users', authenticate, authorize('admin'), getUsers);
app.post('/api/posts', authenticate, authorize('admin', 'editor'), createPost);
app.get('/api/posts', authenticate, authorize('admin', 'editor', 'user'), getPosts);
app.delete('/api/users/:id', authenticate, authorize('admin'), deleteUser);
```

### Role Hierarchy

```javascript
const ROLE_HIERARCHY = {
    admin: ['admin', 'moderator', 'editor', 'user'],
    moderator: ['moderator', 'editor', 'user'],
    editor: ['editor', 'user'],
    user: ['user']
};

function authorize(...requiredRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userRoles = ROLE_HIERARCHY[req.user.role] || [];
        const hasAccess = requiredRoles.some(role => userRoles.includes(role));

        if (!hasAccess) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
}

// admin → সব access
// moderator → moderator, editor, user-এর কাজ করতে পারে
// editor → editor, user-এর কাজ করতে পারে
// user → শুধু user-এর কাজ
```

### Permission-Based RBAC

শুধু role check না করে **specific permission** check করো:

```javascript
// Permissions define
const ROLE_PERMISSIONS = {
    admin: [
        'users:read', 'users:create', 'users:update', 'users:delete',
        'posts:read', 'posts:create', 'posts:update', 'posts:delete',
        'comments:read', 'comments:create', 'comments:update', 'comments:delete',
        'settings:read', 'settings:update',
        'analytics:read'
    ],
    editor: [
        'posts:read', 'posts:create', 'posts:update',
        'comments:read', 'comments:create', 'comments:update',
        'analytics:read'
    ],
    moderator: [
        'posts:read', 'posts:update',
        'comments:read', 'comments:update', 'comments:delete',
    ],
    user: [
        'posts:read',
        'comments:read', 'comments:create'
    ]
};

// Permission check middleware
function can(...requiredPermissions) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
        const hasAll = requiredPermissions.every(p => userPermissions.includes(p));

        if (!hasAll) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: requiredPermissions,
                your_role: req.user.role
            });
        }

        next();
    };
}

// Usage — Granular control:
app.get('/api/posts', authenticate, can('posts:read'), getPosts);
app.post('/api/posts', authenticate, can('posts:create'), createPost);
app.put('/api/posts/:id', authenticate, can('posts:update'), updatePost);
app.delete('/api/posts/:id', authenticate, can('posts:delete'), deletePost);

app.get('/api/analytics', authenticate, can('analytics:read'), getAnalytics);
app.put('/api/settings', authenticate, can('settings:update'), updateSettings);
```

### Database-Stored Roles & Permissions

Production-এ roles ও permissions database-এ রাখো (hardcode না করে):

```javascript
// Schemas
const permissionSchema = new Schema({
    name: { type: String, unique: true },    // 'posts:create'
    description: String                       // 'Create new posts'
});

const roleSchema = new Schema({
    name: { type: String, unique: true },     // 'editor'
    description: String,
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
});

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
});
```

```javascript
// Middleware — DB থেকে permissions load করো
async function can(...requiredPermissions) {
    return async (req, res, next) => {
        const user = await User.findById(req.user.userId)
            .populate({
                path: 'roles',
                populate: { path: 'permissions' }
            });

        const userPermissions = new Set();
        for (const role of user.roles) {
            for (const perm of role.permissions) {
                userPermissions.add(perm.name);
            }
        }

        const hasAll = requiredPermissions.every(p => userPermissions.has(p));

        if (!hasAll) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        req.permissions = userPermissions;
        next();
    };
}
```

```
Hardcoded Roles:
  ✅ Simple, fast
  ❌ Change করতে code deploy দরকার

Database Roles:
  ✅ Runtime-এ change করা যায় (admin panel থেকে)
  ✅ New roles/permissions add করা easy
  ❌ DB query per request (cache করো!)
  ❌ More complex

Best: Database-stored + Redis cache (5 min TTL)
```

---

## ABAC (Attribute-Based Access Control)

Role ছাড়াও **attributes** (বৈশিষ্ট্য) দিয়ে decision নেওয়া — যেমন department, location, time, resource owner:

### ধারণা

```
RBAC: "তুমি editor, তাই edit করতে পারবে"
ABAC: "তুমি editor AND এটা তোমার department-এর post AND office hours-এ আছো, তাই edit করতে পারবে"

ABAC Attributes:
  Subject → User-এর attributes (role, department, clearance level)
  Resource → Resource-এর attributes (owner, status, classification)
  Action → কী করতে চায় (read, write, delete)
  Environment → সময়, IP, location
```

### Implementation

```javascript
// Policy engine
class PolicyEngine {
    constructor() {
        this.policies = [];
    }

    addPolicy(policy) {
        this.policies.push(policy);
    }

    evaluate(subject, resource, action, environment) {
        for (const policy of this.policies) {
            const result = policy(subject, resource, action, environment);
            if (result === 'deny') return false;
            if (result === 'allow') return true;
        }
        return false; // Default deny
    }
}

const policyEngine = new PolicyEngine();

// Policy 1: Admin can do anything
policyEngine.addPolicy((subject) => {
    if (subject.role === 'admin') return 'allow';
    return 'continue';
});

// Policy 2: Users can only edit their own posts
policyEngine.addPolicy((subject, resource, action) => {
    if (action === 'update' && resource.type === 'post') {
        if (resource.authorId === subject.id) return 'allow';
        return 'deny';
    }
    return 'continue';
});

// Policy 3: Published posts are readable by everyone
policyEngine.addPolicy((subject, resource, action) => {
    if (action === 'read' && resource.type === 'post' && resource.status === 'published') {
        return 'allow';
    }
    return 'continue';
});

// Policy 4: Draft posts only visible to author and editors
policyEngine.addPolicy((subject, resource, action) => {
    if (action === 'read' && resource.type === 'post' && resource.status === 'draft') {
        if (resource.authorId === subject.id || subject.role === 'editor') return 'allow';
        return 'deny';
    }
    return 'continue';
});

// Policy 5: No modifications outside office hours
policyEngine.addPolicy((subject, resource, action, env) => {
    if (['create', 'update', 'delete'].includes(action)) {
        const hour = new Date(env.timestamp).getHours();
        if (hour < 9 || hour > 18) return 'deny';
    }
    return 'continue';
});
```

### ABAC Middleware

```javascript
function abac(action, getResource) {
    return async (req, res, next) => {
        const subject = {
            id: req.user.userId,
            role: req.user.role,
            department: req.user.department
        };

        const resource = await getResource(req);
        const environment = {
            timestamp: new Date(),
            ip: req.ip
        };

        const allowed = policyEngine.evaluate(subject, resource, action, environment);

        if (!allowed) {
            return res.status(403).json({ error: 'Access denied by policy' });
        }

        req.resource = resource;
        next();
    };
}

// Usage:
app.put('/api/posts/:id',
    authenticate,
    abac('update', async (req) => {
        const post = await Post.findById(req.params.id);
        return { type: 'post', ...post.toObject() };
    }),
    updatePost
);
```

### RBAC vs ABAC

```
Feature              RBAC                    ABAC
──────────────────────────────────────────────────────
Based on             Roles                   Attributes
Granularity          Coarse (role-level)     Fine (attribute-level)
Complexity           Simple                  Complex
Example              "admin can delete"      "owner in dept X during
                                             office hours can delete"
Dynamic              ❌ Static roles          ✅ Dynamic policies
Best For             Most apps               Enterprise, complex rules
```

---

## Resource Ownership Check

সবচেয়ে common authorization pattern — **"তুমি কি এই resource-এর owner?"**

```javascript
function isOwner(Model, paramName = 'id') {
    return async (req, res, next) => {
        const resource = await Model.findById(req.params[paramName]);

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        const ownerId = resource.userId || resource.authorId || resource.createdBy;

        if (ownerId.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You can only modify your own resources' });
        }

        req.resource = resource;
        next();
    };
}

// Usage:
app.put('/api/posts/:id', authenticate, isOwner(Post), updatePost);
app.delete('/api/posts/:id', authenticate, isOwner(Post), deletePost);
app.put('/api/comments/:id', authenticate, isOwner(Comment), updateComment);

// Admin always has access, owner has access, others get 403
```

### isOwnerOrRole

```javascript
function isOwnerOrRole(Model, ...roles) {
    return async (req, res, next) => {
        // Admin/specified roles → always access
        if (roles.includes(req.user.role)) {
            const resource = await Model.findById(req.params.id);
            if (!resource) return res.status(404).json({ error: 'Not found' });
            req.resource = resource;
            return next();
        }

        // Otherwise → must be owner
        const resource = await Model.findById(req.params.id);
        if (!resource) return res.status(404).json({ error: 'Not found' });

        const ownerId = resource.userId || resource.authorId;
        if (ownerId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        req.resource = resource;
        next();
    };
}

// Editor ও admin সবার post edit করতে পারে, বাকিরা শুধু নিজের
app.put('/api/posts/:id', authenticate, isOwnerOrRole(Post, 'admin', 'editor'), updatePost);
```

---

## Field-Level Authorization

সব user সব field update করতে পারবে না:

```javascript
const ALLOWED_FIELDS = {
    admin: ['name', 'email', 'role', 'isActive', 'department'],
    editor: ['name', 'email'],
    user: ['name']
};

function filterFields(req, res, next) {
    const allowed = ALLOWED_FIELDS[req.user.role] || [];
    const filtered = {};

    for (const [key, value] of Object.entries(req.body)) {
        if (allowed.includes(key)) {
            filtered[key] = value;
        }
    }

    if (Object.keys(filtered).length === 0) {
        return res.status(403).json({
            error: 'No allowed fields to update',
            allowedFields: allowed
        });
    }

    req.body = filtered;
    next();
}

app.patch('/api/users/:id', authenticate, isOwner(User), filterFields, updateUser);

// User role='user' যদি { name: "New", role: "admin" } পাঠায়:
// → শুধু name update হবে, role ignored (admin assign করতে পারবে না!)
```

---

## Row-Level Security (Data Filtering)

User শুধু নিজের data দেখবে, অন্যেরটা না:

```javascript
// Middleware — query-তে user filter add করো
function scopeToUser(req, res, next) {
    if (req.user.role === 'admin') {
        req.dataScope = {};  // Admin সব দেখবে
    } else {
        req.dataScope = { userId: req.user.userId };  // শুধু নিজের data
    }
    next();
}

app.get('/api/orders', authenticate, scopeToUser, async (req, res) => {
    const orders = await Order.find(req.dataScope)
        .sort({ createdAt: -1 })
        .limit(20);
    res.json(orders);
});

// User → শুধু নিজের orders দেখবে
// Admin → সবার orders দেখবে
```

### Multi-Tenant Data Isolation

```javascript
function tenantScope(req, res, next) {
    if (!req.user.tenantId) {
        return res.status(403).json({ error: 'No tenant associated' });
    }
    req.tenantFilter = { tenantId: req.user.tenantId };
    next();
}

app.get('/api/projects', authenticate, tenantScope, async (req, res) => {
    const projects = await Project.find(req.tenantFilter);
    res.json(projects);
});

// Company A-র user শুধু Company A-র data দেখবে
// Company B-র data access করার চেষ্টা → empty result
```

---

## CASL (Node.js Authorization Library)

Complex authorization logic-এর জন্য CASL library popular:

```bash
npm install @casl/ability
```

```javascript
const { AbilityBuilder, createMongoAbility } = require('@casl/ability');

function defineAbilityFor(user) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === 'admin') {
        can('manage', 'all');  // Admin সব কিছু করতে পারে
    }

    if (user.role === 'editor') {
        can('read', 'Post');
        can('create', 'Post');
        can('update', 'Post', { authorId: user.id });   // শুধু নিজের post
        can('read', 'Comment');
        can('create', 'Comment');
        can('update', 'Comment', { authorId: user.id });
        cannot('delete', 'Post');  // Delete করতে পারবে না
    }

    if (user.role === 'user') {
        can('read', 'Post', { status: 'published' });  // শুধু published post
        can('read', 'Comment');
        can('create', 'Comment');
        can('update', 'Comment', { authorId: user.id });
        can('delete', 'Comment', { authorId: user.id });
    }

    return build();
}
```

### CASL Middleware

```javascript
const { ForbiddenError } = require('@casl/ability');

function authorize(action, subject) {
    return (req, res, next) => {
        const ability = defineAbilityFor(req.user);

        try {
            if (typeof subject === 'function') {
                ForbiddenError.from(ability).throwUnlessCan(action, subject(req));
            } else {
                ForbiddenError.from(ability).throwUnlessCan(action, subject);
            }
            req.ability = ability;
            next();
        } catch (error) {
            res.status(403).json({ error: error.message });
        }
    };
}

// Usage:
app.get('/api/posts', authenticate, authorize('read', 'Post'), getPosts);

app.put('/api/posts/:id', authenticate, async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    const ability = defineAbilityFor(req.user);

    if (ability.cannot('update', post)) {
        return res.status(403).json({ error: 'Cannot update this post' });
    }

    // ... update post
});
```

---

## Python — Authorization

### FastAPI Dependencies

```python
from fastapi import Depends, HTTPException, status

def require_role(*roles):
    def checker(current_user = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return checker

def require_permission(*permissions):
    def checker(current_user = Depends(get_current_user)):
        user_perms = get_permissions_for_role(current_user.role)
        if not all(p in user_perms for p in permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return checker

# Usage:
@app.get("/api/users")
async def get_users(user = Depends(require_role("admin"))):
    return await db.get_all_users()

@app.post("/api/posts")
async def create_post(user = Depends(require_permission("posts:create"))):
    pass

@app.delete("/api/posts/{post_id}")
async def delete_post(post_id: str, user = Depends(require_role("admin", "editor"))):
    pass
```

### Resource Ownership

```python
async def require_owner(post_id: str, current_user = Depends(get_current_user)):
    post = await db.get_post(post_id)
    if not post:
        raise HTTPException(404, "Post not found")
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(403, "Not authorized")
    return post

@app.put("/api/posts/{post_id}")
async def update_post(post = Depends(require_owner)):
    pass
```

---

## Authorization Best Practices

### 1. Default Deny

```javascript
// ❌ Default allow — ভুলে permission check miss করলে open!
app.get('/api/admin', authenticate, adminHandler);
// authorize() ভুলে ফেলেছি → সব authenticated user access পাবে!

// ✅ Default deny — explicitly allow দিতে হবে
app.get('/api/admin', authenticate, authorize('admin'), adminHandler);
```

### 2. Check Authorization at Every Layer

```
Route Level  → authorize('admin')        → Role/permission check
Service Level → if (user.id !== post.authorId) throw ... → Business logic
Database Level → WHERE userId = ?         → Row-level security
```

### 3. Never Trust Client-Side Authorization

```javascript
// ❌ Client-side-এ "admin" button hide করলেই যথেষ্ট না
// User Postman/curl দিয়ে directly API call করতে পারে!

// ✅ Server-side-এ ALWAYS check
app.delete('/api/users/:id', authenticate, authorize('admin'), deleteUser);
```

### 4. Audit Logging

```javascript
function auditLog(action) {
    return (req, res, next) => {
        const original = res.json.bind(res);
        res.json = (data) => {
            logger.info({
                action,
                userId: req.user?.userId,
                role: req.user?.role,
                resource: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                ip: req.ip,
                timestamp: new Date()
            });
            return original(data);
        };
        next();
    };
}

app.delete('/api/users/:id',
    authenticate,
    authorize('admin'),
    auditLog('DELETE_USER'),
    deleteUser
);

// Log: { action: "DELETE_USER", userId: "u_001", role: "admin",
//        resource: "/api/users/u_789", method: "DELETE", ... }
```

---

## সংক্ষেপে মনে রাখার সূত্র

```
Authorization = "তুমি কী করতে পারো?" → 403 if fail

Models:
  RBAC → Role-based (admin, editor, user) → Most common
  ABAC → Attribute-based (department, time, owner) → Complex rules
  ACL  → Per-resource permissions → File systems

RBAC Levels:
  Basic     → authorize('admin', 'editor')
  Permission → can('posts:create')
  DB-stored  → Runtime-এ change করা যায়

Common Patterns:
  Role Check       → authorize(...roles)
  Permission Check → can(...permissions)
  Ownership Check  → isOwner(Model)
  Field-Level      → role অনুযায়ী allowed fields
  Row-Level        → user শুধু নিজের data দেখে

Libraries:
  Node.js → CASL (feature-rich)
  Python  → FastAPI Depends

Best Practices:
  ✅ Default deny
  ✅ Server-side check (client trust করো না)
  ✅ Every layer-এ check (route, service, DB)
  ✅ Audit log (কে কখন কী করলো)
  ✅ Cache permissions (Redis)
```

---

## Interview Golden Lines

> **Authorization determines what an authenticated user can do — it returns 403 Forbidden, not 401 Unauthorized.**

> **RBAC assigns permissions through roles (admin, editor, user). Permission-based RBAC (like 'posts:create') is more granular than simple role checks.**

> **ABAC evaluates multiple attributes (subject, resource, action, environment) — it can enforce rules like "only the author can edit during office hours."**

> **Always implement resource ownership checks — users should only modify their own data unless they have an elevated role.**

> **Default deny is the safest approach — require explicit authorization for every route. Missing a check means open access.**

> **CASL provides declarative, condition-based abilities — 'can update Post where authorId equals user.id' — making complex authorization readable and maintainable.**
