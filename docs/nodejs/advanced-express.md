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

এই comprehensive guide এ Advanced Express Patterns এর সব গুরুত্বপূর্ণ concepts cover করা হয়েছে। এই patterns ব্যবহার করে আপনি professional, maintainable এবং scalable Node.js applications তৈরি করতে পারবেন! 🚀
