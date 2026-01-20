# Advanced Express Patterns - সম্পূর্ণ গাইড

Professional এবং scalable Express.js applications তৈরি করার জন্য advanced patterns এবং best practices।

## 📑 Table of Contents

### Middleware Patterns
1. [Custom Middleware Development](#custom-middleware-development)
2. [Middleware Chaining](#middleware-chaining)

### Routing Patterns
3. [Advanced Routing Patterns](#advanced-routing-patterns)
4. [Route Grouping](#route-grouping)

### Architecture Patterns
5. [Controller Pattern (MVC)](#controller-pattern-mvc)
6. [Service Layer Pattern](#service-layer-pattern)
7. [Repository Pattern](#repository-pattern)

### Design Patterns
8. [Dependency Injection](#dependency-injection)
9. [Factory Pattern](#factory-pattern)
10. [Singleton Pattern](#singleton-pattern)

### Production Patterns
11. [API Versioning Patterns](#api-versioning-patterns)
12. [Caching Strategies](#caching-strategies)
13. [Request/Response Transformation](#requestresponse-transformation)
14. [Database Transaction Patterns](#database-transaction-patterns)
15. [Testing Patterns](#testing-patterns)

---

## Custom Middleware Development

Custom middleware তৈরি করে আপনার application এর functionality extend করতে পারেন।

### 1. Basic Custom Middleware

```javascript
// middleware/logger.js
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  console.log(`[${timestamp}] ${method} ${url}`);
  
  // Must call next() to pass control
  next();
};

module.exports = logger;

// app.js
const logger = require('./middleware/logger');
app.use(logger);
```

### 2. Middleware with Options

```javascript
// middleware/requestId.js
const { v4: uuidv4 } = require('uuid');

function requestId(options = {}) {
  const {
    headerName = 'X-Request-ID',
    generator = uuidv4,
    setHeader = true
  } = options;
  
  return (req, res, next) => {
    // Check if request already has ID
    let id = req.headers[headerName.toLowerCase()];
    
    if (!id) {
      id = generator();
    }
    
    // Attach to request
    req.id = id;
    
    // Set response header
    if (setHeader) {
      res.setHeader(headerName, id);
    }
    
    next();
  };
}

module.exports = requestId;

// Usage
app.use(requestId({
  headerName: 'X-Request-ID',
  setHeader: true
}));
```

### 3. Async Middleware

```javascript
// middleware/authenticate.js
const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const authenticate = asyncMiddleware(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new Error('Invalid token');
  }
});

module.exports = authenticate;
```

### 4. Conditional Middleware

```javascript
// middleware/conditional.js
function conditionalMiddleware(condition, middleware) {
  return (req, res, next) => {
    if (condition(req)) {
      return middleware(req, res, next);
    }
    next();
  };
}

// Usage
app.use(conditionalMiddleware(
  (req) => req.path.startsWith('/api'),
  authenticate
));

// Or based on environment
app.use(conditionalMiddleware(
  () => process.env.NODE_ENV === 'development',
  morgan('dev')
));
```

### 5. Response Time Middleware

```javascript
// middleware/responseTime.js
function responseTime(options = {}) {
  const { digits = 3, header = 'X-Response-Time', suffix = true } = options;
  
  return (req, res, next) => {
    const start = process.hrtime();
    
    // Listen to finish event
    res.on('finish', () => {
      const diff = process.hrtime(start);
      const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to ms
      const value = time.toFixed(digits);
      
      res.setHeader(header, suffix ? `${value}ms` : value);
    });
    
    next();
  };
}

module.exports = responseTime;

// Usage
app.use(responseTime({ digits: 2 }));
```

### 6. Rate Limiting Middleware

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

// Simple in-memory rate limiter
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100,
    message: options.message || 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: res.getHeader('Retry-After')
      });
    }
  });
};

// Redis-based rate limiter (for multiple servers)
const createRedisRateLimiter = (options = {}) => {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL
  });
  
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    store: new RedisStore({
      client: redisClient,
      prefix: 'rl:'
    })
  });
};

module.exports = { createRateLimiter, createRedisRateLimiter };

// Usage
const { createRateLimiter } = require('./middleware/rateLimiter');

app.use('/api/', createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

### 7. Request Validation Middleware

```javascript
// middleware/validate.js
const { validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }
    
    res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  };
};

module.exports = validate;

// Usage
const { body } = require('express-validator');
const validate = require('./middleware/validate');

app.post('/users',
  validate([
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password too short')
  ]),
  (req, res) => {
    // Request is validated
    res.json({ message: 'User created' });
  }
);
```

---

## Middleware Chaining

Multiple middleware কে chain করে complex logic implement করা যায়।

### 1. Basic Chaining

```javascript
const authenticate = require('./middleware/authenticate');
const authorize = require('./middleware/authorize');
const validate = require('./middleware/validate');

// Chain multiple middleware
app.post('/admin/users',
  authenticate,
  authorize(['admin']),
  validate(userValidationRules),
  createUser
);
```

### 2. Middleware Array

```javascript
// Grouped middleware
const adminMiddleware = [
  authenticate,
  authorize(['admin']),
  auditLog
];

app.use('/admin', adminMiddleware);

// Or for specific routes
app.post('/admin/users', [
  ...adminMiddleware,
  validate(userRules),
  createUser
]);
```

### 3. Dynamic Middleware Chain

```javascript
// middleware/chain.js
class MiddlewareChain {
  constructor() {
    this.middleware = [];
  }
  
  use(fn) {
    this.middleware.push(fn);
    return this; // Enable chaining
  }
  
  when(condition, fn) {
    this.middleware.push((req, res, next) => {
      if (condition(req)) {
        return fn(req, res, next);
      }
      next();
    });
    return this;
  }
  
  build() {
    return this.middleware;
  }
}

// Usage
const { MiddlewareChain } = require('./middleware/chain');

const apiChain = new MiddlewareChain()
  .use(requestId())
  .use(authenticate)
  .when(req => req.user.role === 'admin', authorize(['admin']))
  .use(rateLimiter)
  .build();

app.use('/api', apiChain);
```

### 4. Conditional Middleware Chain

```javascript
// middleware/conditionalChain.js
function conditionalChain(condition, ...middleware) {
  return (req, res, next) => {
    if (condition(req)) {
      // Execute middleware chain
      let index = 0;
      
      const executeNext = (err) => {
        if (err) return next(err);
        
        if (index >= middleware.length) {
          return next();
        }
        
        const mw = middleware[index++];
        mw(req, res, executeNext);
      };
      
      executeNext();
    } else {
      next();
    }
  };
}

// Usage
app.use(conditionalChain(
  req => req.headers['x-api-key'],
  validateApiKey,
  checkRateLimit,
  logRequest
));
```

### 5. Error Handling in Chain

```javascript
// middleware/errorChain.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Chain with error handling
const secureChain = [
  asyncHandler(authenticate),
  asyncHandler(authorize(['user'])),
  asyncHandler(validateInput)
];

app.post('/secure-endpoint', secureChain, asyncHandler(async (req, res) => {
  // All middleware errors are caught
  const result = await processRequest(req.body);
  res.json(result);
}));

// Error handler at the end
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message
  });
});
```

---

## Advanced Routing Patterns

### 1. Router Modules

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes start with /users
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', authenticate, userController.createUser);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

module.exports = router;

// app.js
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);
```

### 2. Nested Routers

```javascript
// routes/api/v1/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;

// routes/api/index.js
const express = require('express');
const router = express.Router();

const v1Routes = require('./v1');
const v2Routes = require('./v2');

router.use('/v1', v1Routes);
router.use('/v2', v2Routes);

module.exports = router;

// app.js
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// URLs:
// /api/v1/users
// /api/v1/posts
// /api/v2/users
```

### 3. Route Parameters

```javascript
// Advanced route parameters
router.param('userId', async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

// Now 'user' is available in all routes with :userId
router.get('/users/:userId', (req, res) => {
  res.json(req.user); // Already loaded
});

router.get('/users/:userId/posts', async (req, res) => {
  const posts = await Post.find({ author: req.user._id });
  res.json(posts);
});
```

### 4. Route Middleware

```javascript
// routes/posts.js
const router = express.Router();

// Middleware for all routes in this router
router.use(authenticate);

// Middleware for specific routes
router.get('/', getPosts);
router.post('/', 
  authorize(['author', 'admin']),
  validatePost,
  createPost
);

// Nested middleware
router.route('/:id')
  .get(getPost)
  .put(authorize(['author']), isOwner, updatePost)
  .delete(authorize(['admin']), deletePost);

module.exports = router;
```

### 5. Dynamic Route Loading

```javascript
// routes/index.js
const fs = require('fs');
const path = require('path');
const express = require('express');

function loadRoutes(app) {
  const routesPath = path.join(__dirname, 'routes');
  
  fs.readdirSync(routesPath).forEach(file => {
    if (file === 'index.js') return;
    
    const routeName = file.replace('.js', '');
    const router = require(path.join(routesPath, file));
    
    app.use(`/${routeName}`, router);
    console.log(`✓ Loaded route: /${routeName}`);
  });
}

// Usage
loadRoutes(app);
```

---

## Route Grouping

### 1. Route Groups by Feature

```javascript
// routes/grouping.js
class RouteGroup {
  constructor(prefix = '') {
    this.prefix = prefix;
    this.router = express.Router();
    this.middleware = [];
  }
  
  use(...middleware) {
    this.middleware.push(...middleware);
    return this;
  }
  
  group(prefix, callback) {
    const group = new RouteGroup(this.prefix + prefix);
    group.middleware = [...this.middleware];
    callback(group);
    this.router.use(prefix, group.router);
    return this;
  }
  
  get(path, ...handlers) {
    this.router.get(path, ...this.middleware, ...handlers);
    return this;
  }
  
  post(path, ...handlers) {
    this.router.post(path, ...this.middleware, ...handlers);
    return this;
  }
  
  put(path, ...handlers) {
    this.router.put(path, ...this.middleware, ...handlers);
    return this;
  }
  
  delete(path, ...handlers) {
    this.router.delete(path, ...this.middleware, ...handlers);
    return this;
  }
  
  getRouter() {
    return this.router;
  }
}

// Usage
const routes = new RouteGroup('/api');

routes
  .use(requestId())
  .use(logger)
  .group('/v1', (v1) => {
    v1.use(authenticate);
    
    v1.group('/users', (users) => {
      users
        .get('/', getAllUsers)
        .post('/', createUser)
        .get('/:id', getUser);
    });
    
    v1.group('/admin', (admin) => {
      admin.use(authorize(['admin']));
      
      admin
        .get('/stats', getStats)
        .post('/settings', updateSettings);
    });
  });

app.use(routes.getRouter());
```

### 2. Resource Routes

```javascript
// routes/resource.js
function resourceRoutes(name, controller, options = {}) {
  const router = express.Router();
  const {
    only = ['index', 'show', 'create', 'update', 'destroy'],
    middleware = {}
  } = options;
  
  const routes = {
    index: () => router.get('/', middleware.index || [], controller.index),
    show: () => router.get('/:id', middleware.show || [], controller.show),
    create: () => router.post('/', middleware.create || [], controller.create),
    update: () => router.put('/:id', middleware.update || [], controller.update),
    destroy: () => router.delete('/:id', middleware.destroy || [], controller.destroy)
  };
  
  only.forEach(action => {
    if (routes[action]) {
      routes[action]();
    }
  });
  
  return router;
}

// Usage
const userController = require('./controllers/userController');

app.use('/users', resourceRoutes('users', userController, {
  only: ['index', 'show', 'create', 'update'],
  middleware: {
    create: [authenticate, validateUser],
    update: [authenticate, authorize(['admin'])]
  }
}));
```

---

## Controller Pattern (MVC)

MVC (Model-View-Controller) pattern ব্যবহার করে code organized রাখা যায়।

### 1. Basic Controller

```javascript
// controllers/userController.js
const User = require('../models/User');

class UserController {
  // GET /users
  async index(req, res, next) {
    try {
      const users = await User.find();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }
  
  // GET /users/:id
  async show(req, res, next) {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
  
  // POST /users
  async create(req, res, next) {
    try {
      const user = await User.create(req.body);
      
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
  
  // PUT /users/:id
  async update(req, res, next) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
  
  // DELETE /users/:id
  async destroy(req, res, next) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      res.json({
        success: true,
        data: {}
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
```

### 2. Base Controller

```javascript
// controllers/BaseController.js
class BaseController {
  constructor(model) {
    this.model = model;
  }
  
  async findAll(query = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      select = '',
      populate = ''
    } = options;
    
    const skip = (page - 1) * limit;
    
    let queryBuilder = this.model.find(query);
    
    if (select) queryBuilder = queryBuilder.select(select);
    if (populate) queryBuilder = queryBuilder.populate(populate);
    if (sort) queryBuilder = queryBuilder.sort(sort);
    
    const [data, total] = await Promise.all([
      queryBuilder.skip(skip).limit(limit),
      this.model.countDocuments(query)
    ]);
    
    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  async findById(id, populate = '') {
    let query = this.model.findById(id);
    
    if (populate) {
      query = query.populate(populate);
    }
    
    return await query;
  }
  
  async create(data) {
    return await this.model.create(data);
  }
  
  async update(id, data) {
    return await this.model.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }
  
  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
  
  // Response helpers
  success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }
  
  error(res, message = 'Error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors })
    });
  }
}

module.exports = BaseController;
```

**Usage:**
```javascript
// controllers/ProductController.js
const BaseController = require('./BaseController');
const Product = require('../models/Product');

class ProductController extends BaseController {
  constructor() {
    super(Product);
  }
  
  async index(req, res, next) {
    try {
      const result = await this.findAll(
        req.query.filter || {},
        req.query
      );
      
      this.success(res, result);
    } catch (error) {
      next(error);
    }
  }
  
  // Custom methods
  async featured(req, res, next) {
    try {
      const products = await Product.find({ featured: true }).limit(10);
      this.success(res, products);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
```

---

## Service Layer Pattern

Business logic কে controllers থেকে আলাদা করে services এ রাখা।

### 1. Basic Service

```javascript
// services/UserService.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  async createUser(userData) {
    // Hash password
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const user = await User.create(userData);
    
    // Don't return password
    user.password = undefined;
    
    return user;
  }
  
  async getUserById(id) {
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  async updateUser(id, updateData) {
    // Don't allow password update through this method
    delete updateData.password;
    
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return { message: 'User deleted successfully' };
  }
  
  async authenticateUser(email, password) {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    user.password = undefined;
    
    return { user, token };
  }
}

module.exports = new UserService();
```

**Controller using Service:**
```javascript
// controllers/UserController.js
const UserService = require('../services/UserService');

class UserController {
  async create(req, res, next) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
  
  async show(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
```

### 2. Complex Service with Dependencies

```javascript
// services/OrderService.js
const Order = require('../models/Order');
const ProductService = require('./ProductService');
const EmailService = require('./EmailService');
const PaymentService = require('./PaymentService');

class OrderService {
  constructor() {
    this.productService = ProductService;
    this.emailService = EmailService;
    this.paymentService = PaymentService;
  }
  
  async createOrder(userId, orderData) {
    // Validate products and calculate total
    const validatedItems = await this.validateItems(orderData.items);
    const total = this.calculateTotal(validatedItems);
    
    // Check inventory
    await this.checkInventory(validatedItems);
    
    // Create order
    const order = await Order.create({
      user: userId,
      items: validatedItems,
      total,
      status: 'pending'
    });
    
    try {
      // Process payment
      const payment = await this.paymentService.processPayment({
        amount: total,
        orderId: order._id
      });
      
      // Update order
      order.paymentId = payment.id;
      order.status = 'paid';
      await order.save();
      
      // Update inventory
      await this.updateInventory(validatedItems);
      
      // Send confirmation email
      await this.emailService.sendOrderConfirmation(userId, order);
      
      return order;
      
    } catch (error) {
      // Rollback order
      order.status = 'failed';
      await order.save();
      
      throw new Error(`Order creation failed: ${error.message}`);
    }
  }
  
  async validateItems(items) {
    const validated = [];
    
    for (const item of items) {
      const product = await this.productService.getById(item.productId);
      
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      
      validated.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    return validated;
  }
  
  calculateTotal(items) {
    return items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }
  
  async checkInventory(items) {
    for (const item of items) {
      const available = await this.productService.checkStock(
        item.product,
        item.quantity
      );
      
      if (!available) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }
  }
  
  async updateInventory(items) {
    for (const item of items) {
      await this.productService.decreaseStock(
        item.product,
        item.quantity
      );
    }
  }
}

module.exports = new OrderService();
```

---

## Repository Pattern

Database operations কে আলাদা repository layer এ রাখা।

### 1. Base Repository

```javascript
// repositories/BaseRepository.js
class BaseRepository {
  constructor(model) {
    this.model = model;
  }
  
  async findAll(filter = {}, options = {}) {
    const {
      sort = {},
      limit = 0,
      skip = 0,
      populate = '',
      select = ''
    } = options;
    
    let query = this.model.find(filter);
    
    if (populate) query = query.populate(populate);
    if (select) query = query.select(select);
    if (Object.keys(sort).length) query = query.sort(sort);
    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);
    
    return await query.exec();
  }
  
  async findById(id, populate = '') {
    let query = this.model.findById(id);
    
    if (populate) {
      query = query.populate(populate);
    }
    
    return await query.exec();
  }
  
  async findOne(filter, populate = '') {
    let query = this.model.findOne(filter);
    
    if (populate) {
      query = query.populate(populate);
    }
    
    return await query.exec();
  }
  
  async create(data) {
    return await this.model.create(data);
  }
  
  async createMany(dataArray) {
    return await this.model.insertMany(dataArray);
  }
  
  async update(id, data) {
    return await this.model.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).exec();
  }
  
  async updateMany(filter, data) {
    return await this.model.updateMany(filter, data).exec();
  }
  
  async delete(id) {
    return await this.model.findByIdAndDelete(id).exec();
  }
  
  async deleteMany(filter) {
    return await this.model.deleteMany(filter).exec();
  }
  
  async count(filter = {}) {
    return await this.model.countDocuments(filter).exec();
  }
  
  async exists(filter) {
    return await this.model.exists(filter);
  }
}

module.exports = BaseRepository;
```

### 2. Specific Repository

```javascript
// repositories/UserRepository.js
const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }
  
  async findByEmail(email) {
    return await this.model.findOne({ email }).exec();
  }
  
  async findByEmailWithPassword(email) {
    return await this.model.findOne({ email }).select('+password').exec();
  }
  
  async findActiveUsers() {
    return await this.findAll({ isActive: true });
  }
  
  async findByRole(role) {
    return await this.findAll({ role });
  }
  
  async updateLastLogin(userId) {
    return await this.update(userId, {
      lastLoginAt: new Date()
    });
  }
  
  async searchUsers(searchTerm) {
    return await this.model.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    }).exec();
  }
}

module.exports = new UserRepository();
```

**Service using Repository:**
```javascript
// services/UserService.js
const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');

class UserService {
  constructor() {
    this.userRepo = UserRepository;
  }
  
  async createUser(userData) {
    // Check if user exists
    const existingUser = await this.userRepo.findByEmail(userData.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    userData.password = await bcrypt.hash(userData.password, 10);
    
    // Create user
    const user = await this.userRepo.create(userData);
    
    user.password = undefined;
    return user;
  }
  
  async getUserById(id) {
    const user = await this.userRepo.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  async searchUsers(query) {
    return await this.userRepo.searchUsers(query);
  }
}

module.exports = new UserService();
```

---

## Dependency Injection

Dependencies manually inject করে testing এবং flexibility improve করা।

### 1. Constructor Injection

```javascript
// services/OrderService.js
class OrderService {
  constructor(dependencies) {
    this.orderRepository = dependencies.orderRepository;
    this.productService = dependencies.productService;
    this.emailService = dependencies.emailService;
    this.paymentService = dependencies.paymentService;
  }
  
  async createOrder(orderData) {
    // Use injected dependencies
    const products = await this.productService.validate(orderData.items);
    const payment = await this.paymentService.process(orderData.payment);
    const order = await this.orderRepository.create({
      ...orderData,
      products,
      payment
    });
    
    await this.emailService.sendConfirmation(order);
    
    return order;
  }
}

module.exports = OrderService;
```

**DI Container:**
```javascript
// container.js
const OrderService = require('./services/OrderService');
const OrderRepository = require('./repositories/OrderRepository');
const ProductService = require('./services/ProductService');
const EmailService = require('./services/EmailService');
const PaymentService = require('./services/PaymentService');

class Container {
  constructor() {
    this.services = {};
  }
  
  register(name, definition) {
    this.services[name] = definition;
  }
  
  get(name) {
    const service = this.services[name];
    
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    
    // If it's a class, instantiate it with dependencies
    if (typeof service === 'function') {
      return new service(this);
    }
    
    return service;
  }
}

// Setup container
const container = new Container();

// Register services
container.register('orderRepository', OrderRepository);
container.register('productService', ProductService);
container.register('emailService', EmailService);
container.register('paymentService', PaymentService);

container.register('orderService', (c) => {
  return new OrderService({
    orderRepository: c.get('orderRepository'),
    productService: c.get('productService'),
    emailService: c.get('emailService'),
    paymentService: c.get('paymentService')
  });
});

module.exports = container;
```

**Usage:**
```javascript
// controllers/OrderController.js
const container = require('../container');

class OrderController {
  constructor() {
    this.orderService = container.get('orderService');
  }
  
  async create(req, res, next) {
    try {
      const order = await this.orderService.createOrder(req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
```

### 2. Using Awilix (DI Library)

```bash
npm install awilix
```

```javascript
// container.js
const awilix = require('awilix');

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY
});

// Register repositories
container.register({
  userRepository: awilix.asClass(UserRepository).singleton(),
  productRepository: awilix.asClass(ProductRepository).singleton()
});

// Register services
container.register({
  userService: awilix.asClass(UserService).singleton(),
  productService: awilix.asClass(ProductService).singleton(),
  orderService: awilix.asClass(OrderService).singleton()
});

// Register controllers
container.register({
  userController: awilix.asClass(UserController).singleton(),
  orderController: awilix.asClass(OrderController).singleton()
});

module.exports = container;
```

---

## Factory Pattern

Objects তৈরি করার logic encapsulate করা।

### 1. Simple Factory

```javascript
// factories/ResponseFactory.js
class ResponseFactory {
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data
    };
  }
  
  static error(message, errors = null, statusCode = 500) {
    return {
      success: false,
      message,
      statusCode,
      ...(errors && { errors })
    };
  }
  
  static paginated(data, pagination) {
    return {
      success: true,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        pages: Math.ceil(pagination.total / pagination.limit)
      }
    };
  }
}

module.exports = ResponseFactory;

// Usage
const ResponseFactory = require('../factories/ResponseFactory');

app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(ResponseFactory.success(users));
});
```

### 2. Database Connection Factory

```javascript
// factories/DatabaseFactory.js
const mongoose = require('mongoose');

class DatabaseFactory {
  static async createConnection(config) {
    const { type, uri, options } = config;
    
    switch (type) {
      case 'mongodb':
        return await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          ...options
        });
      
      case 'postgres':
        // PostgreSQL connection
        const { Client } = require('pg');
        const client = new Client(uri);
        await client.connect();
        return client;
      
      default:
        throw new Error(`Unknown database type: ${type}`);
    }
  }
}

module.exports = DatabaseFactory;

// Usage
const db = await DatabaseFactory.createConnection({
  type: 'mongodb',
  uri: process.env.MONGODB_URI
});
```

### 3. Validation Factory

```javascript
// factories/ValidationFactory.js
const { body, param, query } = require('express-validator');

class ValidationFactory {
  static createUserValidation() {
    return [
      body('email').isEmail().withMessage('Invalid email'),
      body('password').isLength({ min: 6 }).withMessage('Password too short'),
      body('name').notEmpty().withMessage('Name is required')
    ];
  }
  
  static updateUserValidation() {
    return [
      param('id').isMongoId().withMessage('Invalid user ID'),
      body('email').optional().isEmail().withMessage('Invalid email'),
      body('name').optional().notEmpty().withMessage('Name cannot be empty')
    ];
  }
  
  static paginationValidation() {
    return [
      query('page').optional().isInt({ min: 1 }).withMessage('Invalid page'),
      query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid limit')
    ];
  }
}

module.exports = ValidationFactory;
```

---

## Singleton Pattern

শুধুমাত্র একটি instance create করা।

### 1. Database Singleton

```javascript
// config/database.js
const mongoose = require('mongoose');

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.connection = null;
    Database.instance = this;
  }
  
  async connect() {
    if (this.connection) {
      console.log('Using existing database connection');
      return this.connection;
    }
    
    try {
      this.connection = await mongoose.connect(process.env.MONGODB_URI);
      console.log('✓ Database connected');
      return this.connection;
    } catch (error) {
      console.error('✗ Database connection failed:', error);
      throw error;
    }
  }
  
  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      console.log('✓ Database disconnected');
    }
  }
}

// Export single instance
module.exports = new Database();
```

### 2. Logger Singleton

```javascript
// utils/logger.js
const winston = require('winston');

class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
      ]
    });
    
    Logger.instance = this;
  }
  
  info(message, meta = {}) {
    this.logger.info(message, meta);
  }
  
  error(message, meta = {}) {
    this.logger.error(message, meta);
  }
  
  warn(message, meta = {}) {
    this.logger.warn(message, meta);
  }
  
  debug(message, meta = {}) {
    this.logger.debug(message, meta);
  }
}

module.exports = new Logger();
```

### 3. Configuration Singleton

```javascript
// config/config.js
class Config {
  constructor() {
    if (Config.instance) {
      return Config.instance;
    }
    
    this.settings = {
      app: {
        name: process.env.APP_NAME || 'My App',
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
      },
      database: {
        uri: process.env.MONGODB_URI,
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      },
      jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE || '7d'
      },
      email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    };
    
    Config.instance = this;
  }
  
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.settings);
  }
  
  set(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const obj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.settings);
    obj[last] = value;
  }
}

module.exports = new Config();

// Usage
const config = require('./config/config');
const port = config.get('app.port');
const jwtSecret = config.get('jwt.secret');
```

---

## API Versioning Patterns

Production APIs এর জন্য versioning অত্যন্ত গুরুত্বপূর্ণ। Breaking changes handle করার জন্য multiple versioning strategies।

### 1. URL Path Versioning (Most Common)

```javascript
// routes/v1/users.js
const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/v1/UserController');

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', UserController.create);

module.exports = router;

// routes/v2/users.js
const express = require('express');
const router = express.Router();
const UserControllerV2 = require('../../controllers/v2/UserController');

router.get('/', UserControllerV2.getAll);
router.get('/:id', UserControllerV2.getById);
router.post('/', UserControllerV2.create);
// v2 এ নতুন features
router.patch('/:id', UserControllerV2.update);
router.delete('/:id', UserControllerV2.delete);

module.exports = router;

// app.js
const v1Routes = require('./routes/v1/users');
const v2Routes = require('./routes/v2/users');

app.use('/api/v1/users', v1Routes);
app.use('/api/v2/users', v2Routes);
```

### 2. Header Versioning

```javascript
// middleware/apiVersion.js
const apiVersion = (req, res, next) => {
  // Header থেকে version পড়া
  const version = req.headers['api-version'] || req.headers['x-api-version'] || '1';
  
  req.apiVersion = parseInt(version);
  next();
};

module.exports = apiVersion;

// routes/users.js
const express = require('express');
const router = express.Router();
const apiVersion = require('../middleware/apiVersion');

router.use(apiVersion);

router.get('/', (req, res) => {
  if (req.apiVersion === 1) {
    return res.json({
      users: [
        { id: 1, name: 'John' }
      ]
    });
  }
  
  if (req.apiVersion === 2) {
    return res.json({
      data: {
        users: [
          { 
            id: 1, 
            name: 'John',
            email: 'john@example.com', // v2 এ extra field
            createdAt: new Date()
          }
        ]
      },
      meta: {
        version: 2,
        total: 1
      }
    });
  }
  
  res.status(400).json({ error: 'Unsupported API version' });
});

module.exports = router;

// Usage with fetch
fetch('/api/users', {
  headers: {
    'api-version': '2'
  }
});
```

### 3. Query Parameter Versioning

```javascript
// routes/users.js
router.get('/', (req, res) => {
  const version = req.query.version || '1';
  
  switch(version) {
    case '1':
      return UserControllerV1.getAll(req, res);
    case '2':
      return UserControllerV2.getAll(req, res);
    default:
      return res.status(400).json({ error: 'Invalid version' });
  }
});

// Usage: GET /api/users?version=2
```

### 4. Content Negotiation (Accept Header)

```javascript
// middleware/contentNegotiation.js
const contentNegotiation = (req, res, next) => {
  const acceptHeader = req.headers['accept'];
  
  // Parse version from Accept header
  // Example: Accept: application/vnd.myapi.v2+json
  const versionMatch = acceptHeader?.match(/vnd\.myapi\.v(\d+)/);
  
  req.apiVersion = versionMatch ? parseInt(versionMatch[1]) : 1;
  next();
};

module.exports = contentNegotiation;

// routes/users.js
router.use(contentNegotiation);

router.get('/', (req, res) => {
  const controller = req.apiVersion === 2 ? UserControllerV2 : UserControllerV1;
  controller.getAll(req, res);
});

// Usage with fetch
fetch('/api/users', {
  headers: {
    'Accept': 'application/vnd.myapi.v2+json'
  }
});
```

### 5. Version Router Factory

```javascript
// utils/versionRouter.js
class VersionRouter {
  constructor() {
    this.versions = new Map();
  }
  
  addVersion(version, router) {
    this.versions.set(version.toString(), router);
    return this;
  }
  
  getRouter() {
    return (req, res, next) => {
      const version = this.extractVersion(req);
      const router = this.versions.get(version);
      
      if (!router) {
        return res.status(400).json({
          error: 'Unsupported API version',
          supportedVersions: Array.from(this.versions.keys())
        });
      }
      
      router(req, res, next);
    };
  }
  
  extractVersion(req) {
    // Try different sources
    return req.headers['api-version'] ||
           req.query.version ||
           req.params.version ||
           '1';
  }
}

module.exports = VersionRouter;

// Usage
const VersionRouter = require('./utils/versionRouter');
const v1Users = require('./routes/v1/users');
const v2Users = require('./routes/v2/users');

const userRouter = new VersionRouter()
  .addVersion('1', v1Users)
  .addVersion('2', v2Users)
  .getRouter();

app.use('/api/users', userRouter);
```

### 6. Deprecation Warnings

```javascript
// middleware/deprecationWarning.js
const deprecationWarning = (version, deprecatedAt, sunsetAt) => {
  return (req, res, next) => {
    const now = new Date();
    const deprecated = new Date(deprecatedAt);
    const sunset = new Date(sunsetAt);
    
    if (now >= deprecated) {
      res.set('Warning', `299 - "API version ${version} is deprecated. It will be removed on ${sunsetAt}"`);
      res.set('Sunset', sunsetAt);
      res.set('Link', '</api/v2>; rel="successor-version"');
    }
    
    if (now >= sunset) {
      return res.status(410).json({
        error: 'API version no longer supported',
        message: `Version ${version} was removed on ${sunsetAt}`,
        upgradeUrl: '/api/v2'
      });
    }
    
    next();
  };
};

module.exports = deprecationWarning;

// Usage
const deprecationWarning = require('./middleware/deprecationWarning');

app.use('/api/v1', deprecationWarning(
  'v1',
  '2026-01-01', // Deprecated date
  '2026-06-01'  // Sunset date
));
app.use('/api/v1', v1Routes);
```

### 7. Version Migration Helper

```javascript
// utils/versionMigration.js
class VersionMigration {
  constructor() {
    this.transformers = new Map();
  }
  
  // Define transformation from one version to another
  addTransformer(fromVersion, toVersion, transformer) {
    const key = `${fromVersion}->${toVersion}`;
    this.transformers.set(key, transformer);
    return this;
  }
  
  // Transform data from one version to another
  transform(data, fromVersion, toVersion) {
    if (fromVersion === toVersion) {
      return data;
    }
    
    const key = `${fromVersion}->${toVersion}`;
    const transformer = this.transformers.get(key);
    
    if (!transformer) {
      throw new Error(`No transformer found for ${key}`);
    }
    
    return transformer(data);
  }
}

// Define transformers
const migration = new VersionMigration();

// v1 to v2: Add email field
migration.addTransformer('1', '2', (data) => {
  return {
    ...data,
    email: data.email || `${data.name.toLowerCase()}@example.com`,
    createdAt: data.createdAt || new Date()
  };
});

// v2 to v1: Remove new fields
migration.addTransformer('2', '1', (data) => {
  const { email, createdAt, ...v1Data } = data;
  return v1Data;
});

module.exports = migration;

// Usage in controller
const migration = require('../utils/versionMigration');

class UserController {
  async getById(req, res) {
    const user = await User.findById(req.params.id);
    const requestedVersion = req.apiVersion.toString();
    const dataVersion = '2'; // Data is stored in v2 format
    
    // Transform if needed
    const transformedUser = migration.transform(
      user.toJSON(),
      dataVersion,
      requestedVersion
    );
    
    res.json(transformedUser);
  }
}
```

---

## Caching Strategies

Performance optimization এর জন্য caching strategies implement করা essential।

### 1. In-Memory Caching

```javascript
// utils/MemoryCache.js
class MemoryCache {
  constructor(defaultTTL = 3600) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL * 1000; // Convert to ms
  }
  
  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    
    this.cache.set(key, {
      value,
      expiresAt
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  has(key) {
    return this.get(key) !== null;
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  // Cleanup expired items periodically
  startCleanup(interval = 60000) {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiresAt) {
          this.cache.delete(key);
        }
      }
    }, interval);
  }
  
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

module.exports = new MemoryCache();

// Usage
const cache = require('./utils/MemoryCache');
cache.startCleanup();

app.get('/api/users/:id', async (req, res) => {
  const cacheKey = `user:${req.params.id}`;
  
  // Try cache first
  const cachedUser = cache.get(cacheKey);
  if (cachedUser) {
    return res.json({ 
      ...cachedUser,
      cached: true 
    });
  }
  
  // Fetch from database
  const user = await User.findById(req.params.id);
  
  // Store in cache (5 minutes)
  cache.set(cacheKey, user, 300000);
  
  res.json(user);
});
```

### 2. Redis Caching

```javascript
// config/redis.js
const redis = require('redis');

class RedisCache {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD
    });
    
    this.client.on('error', (err) => {
      console.error('Redis Error:', err);
    });
    
    this.client.on('connect', () => {
      console.log('Redis connected');
    });
  }
  
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data) => {
        if (err) reject(err);
        resolve(data ? JSON.parse(data) : null);
      });
    });
  }
  
  async set(key, value, ttl = 3600) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(value);
      
      this.client.setex(key, ttl, data, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
  
  async delete(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
  
  async deletePattern(pattern) {
    return new Promise((resolve, reject) => {
      this.client.keys(pattern, (err, keys) => {
        if (err) reject(err);
        
        if (keys.length === 0) {
          resolve(0);
          return;
        }
        
        this.client.del(...keys, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    });
  }
}

module.exports = new RedisCache();

// Usage
const cache = require('./config/redis');

app.get('/api/products', async (req, res) => {
  const cacheKey = 'products:all';
  
  // Try Redis cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    return res.json({
      data: cached,
      cached: true
    });
  }
  
  // Fetch from database
  const products = await Product.find();
  
  // Store in Redis (1 hour)
  await cache.set(cacheKey, products, 3600);
  
  res.json({
    data: products,
    cached: false
  });
});

// Invalidate cache on update
app.put('/api/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  
  // Invalidate related caches
  await cache.delete('products:all');
  await cache.delete(`product:${req.params.id}`);
  
  res.json(product);
});
```

### 3. Cache Middleware

```javascript
// middleware/cache.js
const cache = require('../config/redis');

const cacheMiddleware = (options = {}) => {
  const {
    ttl = 300, // 5 minutes default
    keyGenerator = (req) => req.originalUrl,
    condition = () => true
  } = options;
  
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Check condition
    if (!condition(req)) {
      return next();
    }
    
    const cacheKey = keyGenerator(req);
    
    try {
      // Try to get from cache
      const cachedResponse = await cache.get(cacheKey);
      
      if (cachedResponse) {
        res.set('X-Cache', 'HIT');
        return res.json(cachedResponse);
      }
      
      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      
      res.json = (data) => {
        // Cache the response
        cache.set(cacheKey, data, ttl).catch(err => {
          console.error('Cache set error:', err);
        });
        
        res.set('X-Cache', 'MISS');
        return originalJson(data);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = cacheMiddleware;

// Usage
const cacheMiddleware = require('./middleware/cache');

// Cache for 10 minutes
app.get('/api/users', 
  cacheMiddleware({ ttl: 600 }),
  UserController.getAll
);

// Custom key generator
app.get('/api/search',
  cacheMiddleware({
    ttl: 300,
    keyGenerator: (req) => `search:${req.query.q}:${req.query.page || 1}`
  }),
  SearchController.search
);

// Conditional caching (only for anonymous users)
app.get('/api/posts',
  cacheMiddleware({
    ttl: 600,
    condition: (req) => !req.user // Only cache if not authenticated
  }),
  PostController.getAll
);
```

### 4. Cache-Aside Pattern

```javascript
// services/UserService.js
const cache = require('../config/redis');
const User = require('../models/User');

class UserService {
  async getById(id) {
    const cacheKey = `user:${id}`;
    
    // 1. Try cache first
    let user = await cache.get(cacheKey);
    
    if (user) {
      console.log('Cache hit');
      return user;
    }
    
    // 2. Cache miss - load from database
    console.log('Cache miss');
    user = await User.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // 3. Store in cache
    await cache.set(cacheKey, user, 3600);
    
    return user;
  }
  
  async update(id, data) {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    
    // Invalidate cache
    await cache.delete(`user:${id}`);
    
    return user;
  }
  
  async delete(id) {
    await User.findByIdAndDelete(id);
    
    // Invalidate cache
    await cache.delete(`user:${id}`);
  }
}

module.exports = new UserService();
```

### 5. HTTP Caching Headers

```javascript
// middleware/httpCache.js
const httpCache = (options = {}) => {
  const {
    maxAge = 300, // 5 minutes
    private = false,
    immutable = false,
    revalidate = false
  } = options;
  
  return (req, res, next) => {
    // Set Cache-Control header
    const directives = [];
    
    directives.push(private ? 'private' : 'public');
    directives.push(`max-age=${maxAge}`);
    
    if (immutable) {
      directives.push('immutable');
    }
    
    if (revalidate) {
      directives.push('must-revalidate');
    }
    
    res.set('Cache-Control', directives.join(', '));
    
    // Set Expires header
    const expires = new Date(Date.now() + maxAge * 1000);
    res.set('Expires', expires.toUTCString());
    
    next();
  };
};

module.exports = httpCache;

// Usage
const httpCache = require('./middleware/httpCache');

// Public content, cache for 1 hour
app.get('/api/public/posts',
  httpCache({ maxAge: 3600, private: false }),
  PostController.getPublic
);

// User-specific content, cache for 5 minutes
app.get('/api/user/dashboard',
  authenticate,
  httpCache({ maxAge: 300, private: true }),
  DashboardController.get
);

// Static assets, cache forever
app.use('/static',
  httpCache({ maxAge: 31536000, immutable: true }),
  express.static('public')
);
```

### 6. ETag Support

```javascript
// middleware/etag.js
const crypto = require('crypto');

const etagMiddleware = (req, res, next) => {
  const originalJson = res.json.bind(res);
  
  res.json = (data) => {
    // Generate ETag from response data
    const etag = crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
    
    res.set('ETag', `"${etag}"`);
    
    // Check If-None-Match header
    const clientEtag = req.headers['if-none-match'];
    
    if (clientEtag === `"${etag}"`) {
      // Content hasn't changed
      return res.status(304).end();
    }
    
    return originalJson(data);
  };
  
  next();
};

module.exports = etagMiddleware;

// Usage
app.use(etagMiddleware);

app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
  // ETag automatically generated and 304 returned if not modified
});
```

### 7. Cache Invalidation Strategy

```javascript
// utils/cacheInvalidation.js
const cache = require('../config/redis');

class CacheInvalidation {
  // Invalidate all caches related to a user
  async invalidateUser(userId) {
    await Promise.all([
      cache.delete(`user:${userId}`),
      cache.deletePattern(`user:${userId}:*`),
      cache.delete('users:all')
    ]);
  }
  
  // Invalidate all caches related to a post
  async invalidatePost(postId) {
    await Promise.all([
      cache.delete(`post:${postId}`),
      cache.deletePattern(`post:${postId}:*`),
      cache.delete('posts:all'),
      cache.deletePattern('posts:page:*')
    ]);
  }
  
  // Tag-based invalidation
  async invalidateByTag(tag) {
    await cache.deletePattern(`*:tag:${tag}:*`);
  }
  
  // Time-based invalidation
  scheduleInvalidation(key, delay) {
    setTimeout(async () => {
      await cache.delete(key);
    }, delay);
  }
}

module.exports = new CacheInvalidation();

// Usage in controller
const cacheInvalidation = require('../utils/cacheInvalidation');

class PostController {
  async update(req, res) {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    // Invalidate related caches
    await cacheInvalidation.invalidatePost(post._id);
    
    res.json(post);
  }
  
  async delete(req, res) {
    await Post.findByIdAndDelete(req.params.id);
    
    // Invalidate caches
    await cacheInvalidation.invalidatePost(req.params.id);
    
    res.json({ message: 'Post deleted' });
  }
}
```

---

## Request/Response Transformation

API responses কে standardize এবং transform করার patterns।

### 1. Response Wrapper Middleware

```javascript
// middleware/responseWrapper.js
const responseWrapper = (req, res, next) => {
  // Store original methods
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  
  // Override res.json
  res.json = (data) => {
    // Wrap successful responses
    const wrapped = {
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
      path: req.path
    };
    
    return originalJson(wrapped);
  };
  
  // Override res.send for consistency
  res.send = (data) => {
    if (typeof data === 'object') {
      return res.json(data);
    }
    return originalSend(data);
  };
  
  next();
};

module.exports = responseWrapper;

// Usage
app.use(responseWrapper);

app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Response:
// {
//   "success": true,
//   "data": { "id": 1, "name": "John" },
//   "timestamp": "2026-01-18T10:30:00.000Z",
//   "path": "/api/users/1"
// }
```

### 2. Response Builder

```javascript
// utils/ResponseBuilder.js
class ResponseBuilder {
  constructor() {
    this.response = {
      success: true,
      data: null,
      meta: {},
      errors: []
    };
  }
  
  setData(data) {
    this.response.data = data;
    return this;
  }
  
  setMeta(meta) {
    this.response.meta = { ...this.response.meta, ...meta };
    return this;
  }
  
  addMeta(key, value) {
    this.response.meta[key] = value;
    return this;
  }
  
  setPagination(page, limit, total) {
    this.response.meta.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    };
    return this;
  }
  
  addLink(rel, href) {
    if (!this.response.links) {
      this.response.links = [];
    }
    
    this.response.links.push({ rel, href });
    return this;
  }
  
  addError(error) {
    this.response.success = false;
    this.response.errors.push(error);
    return this;
  }
  
  build() {
    // Remove empty arrays
    if (this.response.errors.length === 0) {
      delete this.response.errors;
    }
    
    return this.response;
  }
}

module.exports = ResponseBuilder;

// Usage
const ResponseBuilder = require('../utils/ResponseBuilder');

class UserController {
  async getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments()
    ]);
    
    const response = new ResponseBuilder()
      .setData(users)
      .setPagination(page, limit, total)
      .addMeta('timestamp', new Date().toISOString())
      .addLink('self', `/api/users?page=${page}&limit=${limit}`)
      .addLink('next', `/api/users?page=${page + 1}&limit=${limit}`)
      .build();
    
    res.json(response);
  }
}

// Response:
// {
//   "success": true,
//   "data": [...],
//   "meta": {
//     "pagination": {
//       "page": 1,
//       "limit": 10,
//       "total": 100,
//       "totalPages": 10,
//       "hasNext": true,
//       "hasPrev": false
//     },
//     "timestamp": "2026-01-18T10:30:00.000Z"
//   },
//   "links": [
//     { "rel": "self", "href": "/api/users?page=1&limit=10" },
//     { "rel": "next", "href": "/api/users?page=2&limit=10" }
//   ]
// }
```

### 3. Data Serializer

```javascript
// serializers/UserSerializer.js
class UserSerializer {
  // Public profile (limited fields)
  static public(user) {
    return {
      id: user._id,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt
    };
  }
  
  // Private profile (more fields for authenticated user)
  static private(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
  
  // Admin view (all fields)
  static admin(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
  
  // Serialize array
  static collection(users, type = 'public') {
    return users.map(user => this[type](user));
  }
}

module.exports = UserSerializer;

// Usage
const UserSerializer = require('../serializers/UserSerializer');

class UserController {
  async getById(req, res) {
    const user = await User.findById(req.params.id);
    
    let serialized;
    
    // Different views based on context
    if (req.user && req.user._id.equals(user._id)) {
      // Own profile - private view
      serialized = UserSerializer.private(user);
    } else if (req.user && req.user.role === 'admin') {
      // Admin view
      serialized = UserSerializer.admin(user);
    } else {
      // Public view
      serialized = UserSerializer.public(user);
    }
    
    res.json(serialized);
  }
}
```

### 4. HATEOAS Implementation

```javascript
// utils/hateoas.js
class HATEOAS {
  static addLinks(resource, resourceType, id) {
    const links = {
      self: { href: `/${resourceType}/${id}` }
    };
    
    switch(resourceType) {
      case 'users':
        links.posts = { href: `/users/${id}/posts` };
        links.comments = { href: `/users/${id}/comments` };
        links.followers = { href: `/users/${id}/followers` };
        break;
        
      case 'posts':
        links.author = { href: `/users/${resource.authorId}` };
        links.comments = { href: `/posts/${id}/comments` };
        links.likes = { href: `/posts/${id}/likes` };
        break;
        
      case 'comments':
        links.post = { href: `/posts/${resource.postId}` };
        links.author = { href: `/users/${resource.authorId}` };
        break;
    }
    
    return {
      ...resource,
      _links: links
    };
  }
  
  static addActions(resource, resourceType, permissions = {}) {
    const actions = [];
    
    if (permissions.canEdit) {
      actions.push({
        name: 'update',
        method: 'PUT',
        href: `/${resourceType}/${resource.id}`
      });
    }
    
    if (permissions.canDelete) {
      actions.push({
        name: 'delete',
        method: 'DELETE',
        href: `/${resourceType}/${resource.id}`
      });
    }
    
    if (actions.length > 0) {
      resource._actions = actions;
    }
    
    return resource;
  }
}

module.exports = HATEOAS;

// Usage
const HATEOAS = require('../utils/hateoas');

app.get('/api/posts/:id', async (req, res) => {
  let post = await Post.findById(req.params.id);
  post = post.toJSON();
  
  // Add HATEOAS links
  post = HATEOAS.addLinks(post, 'posts', post.id);
  
  // Add actions based on permissions
  const permissions = {
    canEdit: req.user && req.user._id.equals(post.authorId),
    canDelete: req.user && (req.user._id.equals(post.authorId) || req.user.role === 'admin')
  };
  
  post = HATEOAS.addActions(post, 'posts', permissions);
  
  res.json(post);
});

// Response:
// {
//   "id": "123",
//   "title": "My Post",
//   "content": "...",
//   "_links": {
//     "self": { "href": "/posts/123" },
//     "author": { "href": "/users/456" },
//     "comments": { "href": "/posts/123/comments" }
//   },
//   "_actions": [
//     { "name": "update", "method": "PUT", "href": "/posts/123" },
//     { "name": "delete", "method": "DELETE", "href": "/posts/123" }
//   ]
// }
```

### 5. Pagination Transformer

```javascript
// utils/pagination.js
class Pagination {
  static async paginate(model, options = {}) {
    const {
      page = 1,
      limit = 10,
      query = {},
      select = '',
      populate = '',
      sort = '-createdAt'
    } = options;
    
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      model
        .find(query)
        .select(select)
        .populate(populate)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      model.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: docs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null
      }
    };
  }
  
  static buildLinks(baseUrl, page, totalPages, limit) {
    const links = {
      self: `${baseUrl}?page=${page}&limit=${limit}`,
      first: `${baseUrl}?page=1&limit=${limit}`,
      last: `${baseUrl}?page=${totalPages}&limit=${limit}`
    };
    
    if (page > 1) {
      links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
    }
    
    if (page < totalPages) {
      links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
    }
    
    return links;
  }
}

module.exports = Pagination;

// Usage
const Pagination = require('../utils/pagination');

class PostController {
  async getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Pagination.paginate(Post, {
      page,
      limit,
      query: { published: true },
      populate: 'author',
      sort: '-createdAt'
    });
    
    const links = Pagination.buildLinks(
      '/api/posts',
      page,
      result.pagination.totalPages,
      limit
    );
    
    res.json({
      ...result,
      links
    });
  }
}
```

---

## Database Transaction Patterns

Database operations এ data integrity maintain করার patterns।

### 1. MongoDB Transaction Wrapper

```javascript
// utils/transaction.js
const mongoose = require('mongoose');

class Transaction {
  static async withTransaction(callback) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = Transaction;

// Usage
const Transaction = require('../utils/transaction');

class OrderService {
  async createOrder(userId, items) {
    return await Transaction.withTransaction(async (session) => {
      // 1. Create order
      const order = await Order.create([{
        userId,
        items,
        total: items.reduce((sum, item) => sum + item.price, 0)
      }], { session });
      
      // 2. Update inventory
      for (const item of items) {
        const product = await Product.findById(item.productId).session(session);
        
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        
        product.stock -= item.quantity;
        await product.save({ session });
      }
      
      // 3. Create invoice
      await Invoice.create([{
        orderId: order[0]._id,
        amount: order[0].total
      }], { session });
      
      return order[0];
    });
  }
}
```

### 2. PostgreSQL Transaction (Sequelize)

```javascript
// utils/transaction.js
const { sequelize } = require('../config/database');

class Transaction {
  static async withTransaction(callback) {
    const transaction = await sequelize.transaction();
    
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = Transaction;

// Usage
const Transaction = require('../utils/transaction');
const { User, Account, AuditLog } = require('../models');

class UserService {
  async transferMoney(fromUserId, toUserId, amount) {
    return await Transaction.withTransaction(async (t) => {
      // 1. Debit from sender
      const sender = await Account.findOne({
        where: { userId: fromUserId },
        transaction: t,
        lock: t.LOCK.UPDATE // Row-level lock
      });
      
      if (sender.balance < amount) {
        throw new Error('Insufficient balance');
      }
      
      sender.balance -= amount;
      await sender.save({ transaction: t });
      
      // 2. Credit to receiver
      const receiver = await Account.findOne({
        where: { userId: toUserId },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      
      receiver.balance += amount;
      await receiver.save({ transaction: t });
      
      // 3. Create audit log
      await AuditLog.create({
        action: 'TRANSFER',
        fromUserId,
        toUserId,
        amount,
        timestamp: new Date()
      }, { transaction: t });
      
      return {
        senderBalance: sender.balance,
        receiverBalance: receiver.balance
      };
    });
  }
}
```

### 3. Transaction Middleware

```javascript
// middleware/transaction.js
const mongoose = require('mongoose');

const transactionMiddleware = (req, res, next) => {
  // Start transaction
  req.startTransaction = async () => {
    req.session = await mongoose.startSession();
    req.session.startTransaction();
  };
  
  // Commit transaction
  req.commitTransaction = async () => {
    if (req.session) {
      await req.session.commitTransaction();
      req.session.endSession();
    }
  };
  
  // Rollback transaction
  req.rollbackTransaction = async () => {
    if (req.session) {
      await req.session.abortTransaction();
      req.session.endSession();
    }
  };
  
  // Auto-rollback on error
  const originalJson = res.json.bind(res);
  res.json = async (data) => {
    if (res.statusCode >= 400 && req.session) {
      await req.rollbackTransaction();
    } else if (req.session) {
      await req.commitTransaction();
    }
    return originalJson(data);
  };
  
  next();
};

module.exports = transactionMiddleware;

// Usage
app.use(transactionMiddleware);

app.post('/api/orders', async (req, res) => {
  try {
    await req.startTransaction();
    
    // All operations use req.session
    const order = await Order.create([req.body], { session: req.session });
    
    for (const item of req.body.items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { stock: -item.quantity } },
        { session: req.session }
      );
    }
    
    res.json(order[0]);
    // Auto-commit on success
  } catch (error) {
    res.status(400).json({ error: error.message });
    // Auto-rollback on error
  }
});
```

### 4. Unit of Work Pattern

```javascript
// utils/UnitOfWork.js
class UnitOfWork {
  constructor() {
    this.newRecords = [];
    this.dirtyRecords = [];
    this.removedRecords = [];
  }
  
  registerNew(record) {
    this.newRecords.push(record);
  }
  
  registerDirty(record) {
    if (!this.dirtyRecords.includes(record)) {
      this.dirtyRecords.push(record);
    }
  }
  
  registerRemoved(record) {
    this.removedRecords.push(record);
  }
  
  async commit(session) {
    try {
      // Insert new records
      for (const record of this.newRecords) {
        await record.save({ session });
      }
      
      // Update dirty records
      for (const record of this.dirtyRecords) {
        await record.save({ session });
      }
      
      // Delete removed records
      for (const record of this.removedRecords) {
        await record.model.deleteOne({ _id: record._id }, { session });
      }
      
      // Clear all
      this.newRecords = [];
      this.dirtyRecords = [];
      this.removedRecords = [];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UnitOfWork;

// Usage
const UnitOfWork = require('../utils/UnitOfWork');
const Transaction = require('../utils/transaction');

class OrderService {
  async processOrder(orderData) {
    return await Transaction.withTransaction(async (session) => {
      const uow = new UnitOfWork();
      
      // Register operations
      const order = new Order(orderData);
      uow.registerNew(order);
      
      for (const item of orderData.items) {
        const product = await Product.findById(item.productId).session(session);
        product.stock -= item.quantity;
        uow.registerDirty(product);
      }
      
      // Commit all at once
      await uow.commit(session);
      
      return order;
    });
  }
}
```

### 5. Saga Pattern (Distributed Transactions)

```javascript
// utils/Saga.js
class Saga {
  constructor() {
    this.steps = [];
    this.compensations = [];
  }
  
  addStep(action, compensation) {
    this.steps.push(action);
    this.compensations.push(compensation);
    return this;
  }
  
  async execute() {
    const results = [];
    let currentStep = 0;
    
    try {
      for (const step of this.steps) {
        const result = await step();
        results.push(result);
        currentStep++;
      }
      
      return results;
    } catch (error) {
      // Rollback: execute compensations in reverse order
      console.error('Saga failed, rolling back...', error);
      
      for (let i = currentStep - 1; i >= 0; i--) {
        try {
          await this.compensations[i](results[i]);
        } catch (compensationError) {
          console.error('Compensation failed:', compensationError);
        }
      }
      
      throw error;
    }
  }
}

module.exports = Saga;

// Usage: E-commerce order with payment and shipping
const Saga = require('../utils/Saga');

class OrderService {
  async createOrderWithPayment(orderData) {
    const saga = new Saga();
    
    let order, payment, shipment;
    
    // Step 1: Create order
    saga.addStep(
      async () => {
        order = await Order.create(orderData);
        return order;
      },
      async () => {
        await Order.deleteOne({ _id: order._id });
      }
    );
    
    // Step 2: Process payment
    saga.addStep(
      async () => {
        payment = await PaymentService.charge({
          orderId: order._id,
          amount: order.total
        });
        return payment;
      },
      async () => {
        await PaymentService.refund(payment.id);
      }
    );
    
    // Step 3: Create shipment
    saga.addStep(
      async () => {
        shipment = await ShippingService.createShipment({
          orderId: order._id,
          address: orderData.shippingAddress
        });
        return shipment;
      },
      async () => {
        await ShippingService.cancelShipment(shipment.id);
      }
    );
    
    // Step 4: Update inventory
    saga.addStep(
      async () => {
        await InventoryService.reserve(orderData.items);
      },
      async () => {
        await InventoryService.release(orderData.items);
      }
    );
    
    // Execute saga
    await saga.execute();
    
    return { order, payment, shipment };
  }
}
```

---

## Testing Patterns

Express applications এর জন্য comprehensive testing strategies।

### 1. Controller Unit Testing

```javascript
// tests/unit/UserController.test.js
const UserController = require('../../controllers/UserController');
const UserService = require('../../services/UserService');

// Mock the service
jest.mock('../../services/UserService');

describe('UserController', () => {
  let req, res;
  
  beforeEach(() => {
    // Mock request and response
    req = {
      params: {},
      body: {},
      query: {},
      user: null
    };
    
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, name: 'John' };
      UserService.getById.mockResolvedValue(mockUser);
      
      req.params.id = '1';
      
      await UserController.getById(req, res);
      
      expect(UserService.getById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
    
    it('should return 404 when user not found', async () => {
      UserService.getById.mockResolvedValue(null);
      
      req.params.id = '999';
      
      await UserController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });
    
    it('should handle errors', async () => {
      const error = new Error('Database error');
      UserService.getById.mockRejectedValue(error);
      
      req.params.id = '1';
      
      await UserController.getById(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });
  });
});
```

### 2. Integration Testing with Supertest

```javascript
// tests/integration/users.test.js
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const { connectDB, closeDB, clearDB } = require('../helpers/db');

describe('User API Integration Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });
  
  afterAll(async () => {
    await closeDB();
  });
  
  beforeEach(async () => {
    await clearDB();
  });
  
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      // Setup: Create test data
      await User.create([
        { name: 'John', email: 'john@example.com' },
        { name: 'Jane', email: 'jane@example.com' }
      ]);
      
      // Execute
      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);
      
      // Assert
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('name', 'John');
    });
    
    it('should support pagination', async () => {
      // Create 15 users
      const users = Array.from({ length: 15 }, (_, i) => ({
        name: `User ${i}`,
        email: `user${i}@example.com`
      }));
      await User.create(users);
      
      const response = await request(app)
        .get('/api/users?page=2&limit=10')
        .expect(200);
      
      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination).toMatchObject({
        page: 2,
        limit: 10,
        total: 15,
        totalPages: 2
      });
    });
  });
  
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
      
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data).not.toHaveProperty('password');
      
      // Verify in database
      const user = await User.findById(response.body.data.id);
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });
    
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({})
        .expect(400);
      
      expect(response.body.errors).toBeDefined();
    });
    
    it('should prevent duplicate emails', async () => {
      const userData = {
        name: 'User',
        email: 'duplicate@example.com',
        password: 'password123'
      };
      
      // Create first user
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
      
      // Try to create duplicate
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);
      
      expect(response.body.error).toMatch(/email already exists/i);
    });
  });
  
  describe('Authentication', () => {
    it('should require authentication for protected routes', async () => {
      await request(app)
        .get('/api/users/me')
        .expect(401);
    });
    
    it('should allow access with valid token', async () => {
      // Create user and get token
      const user = await User.create({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      });
      
      const token = user.generateAuthToken();
      
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body.data.email).toBe(user.email);
    });
  });
});
```

### 3. Mock Factories

```javascript
// tests/factories/UserFactory.js
const { faker } = require('@faker-js/faker');
const User = require('../../models/User');

class UserFactory {
  static make(overrides = {}) {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
      avatar: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
      ...overrides
    };
  }
  
  static async create(overrides = {}) {
    const userData = this.make(overrides);
    return await User.create(userData);
  }
  
  static async createMany(count, overrides = {}) {
    const users = [];
    
    for (let i = 0; i < count; i++) {
      users.push(await this.create(overrides));
    }
    
    return users;
  }
  
  static admin(overrides = {}) {
    return this.make({
      role: 'admin',
      ...overrides
    });
  }
  
  static async createAdmin(overrides = {}) {
    return await this.create(this.admin(overrides));
  }
}

module.exports = UserFactory;

// Usage in tests
const UserFactory = require('../factories/UserFactory');

describe('User permissions', () => {
  it('should allow admin to delete users', async () => {
    const admin = await UserFactory.createAdmin();
    const user = await UserFactory.create();
    
    const token = admin.generateAuthToken();
    
    await request(app)
      .delete(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
```

### 4. Test Helpers

```javascript
// tests/helpers/db.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

const clearDB = async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

module.exports = { connectDB, closeDB, clearDB };

// tests/helpers/request.js
const request = require('supertest');
const app = require('../../app');

class TestRequest {
  static async authenticatedRequest(user) {
    const token = user.generateAuthToken();
    
    return {
      get: (url) => request(app).get(url).set('Authorization', `Bearer ${token}`),
      post: (url) => request(app).post(url).set('Authorization', `Bearer ${token}`),
      put: (url) => request(app).put(url).set('Authorization', `Bearer ${token}`),
      delete: (url) => request(app).delete(url).set('Authorization', `Bearer ${token}`)
    };
  }
}

module.exports = TestRequest;

// Usage
const TestRequest = require('../helpers/request');
const UserFactory = require('../factories/UserFactory');

it('should update own profile', async () => {
  const user = await UserFactory.create();
  const req = await TestRequest.authenticatedRequest(user);
  
  const response = await req
    .put('/api/users/me')
    .send({ name: 'Updated Name' })
    .expect(200);
  
  expect(response.body.data.name).toBe('Updated Name');
});
```

### 5. Middleware Testing

```javascript
// tests/unit/middleware/auth.test.js
const authMiddleware = require('../../../middleware/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      headers: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    next = jest.fn();
  });
  
  it('should pass with valid token', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    jwt.verify.mockReturnValue(mockUser);
    
    req.headers.authorization = 'Bearer valid-token';
    
    authMiddleware(req, res, next);
    
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });
  
  it('should reject without token', () => {
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No token provided'
    });
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should reject with invalid token', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    req.headers.authorization = 'Bearer invalid-token';
    
    authMiddleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid token'
    });
  });
});
```

### 6. E2E Testing Setup

```javascript
// tests/e2e/userJourney.test.js
const request = require('supertest');
const app = require('../../app');
const { connectDB, closeDB, clearDB } = require('../helpers/db');

describe('User Journey E2E', () => {
  beforeAll(async () => {
    await connectDB();
  });
  
  afterAll(async () => {
    await closeDB();
  });
  
  beforeEach(async () => {
    await clearDB();
  });
  
  it('complete user signup and post creation flow', async () => {
    let token;
    let userId;
    
    // 1. Register
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(201);
    
    token = registerResponse.body.token;
    userId = registerResponse.body.user.id;
    
    // 2. Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(200);
    
    expect(loginResponse.body.token).toBeTruthy();
    
    // 3. Get Profile
    await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    // 4. Create Post
    const postResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My First Post',
        content: 'This is my first post!'
      })
      .expect(201);
    
    const postId = postResponse.body.data.id;
    
    // 5. Get My Posts
    const myPostsResponse = await request(app)
      .get(`/api/users/${userId}/posts`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    expect(myPostsResponse.body.data).toHaveLength(1);
    expect(myPostsResponse.body.data[0].title).toBe('My First Post');
    
    // 6. Update Post
    await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title'
      })
      .expect(200);
    
    // 7. Delete Post
    await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    // 8. Verify Deleted
    await request(app)
      .get(`/api/posts/${postId}`)
      .expect(404);
  });
});
```

---

এই comprehensive production-ready guide এ Advanced Express Patterns এর সব গুরুত্বপূর্ণ concepts এবং best practices cover করা হয়েছে। এই patterns ব্যবহার করে আপনি professional, maintainable, scalable এবং testable Node.js applications তৈরি করতে পারবেন! 🚀
