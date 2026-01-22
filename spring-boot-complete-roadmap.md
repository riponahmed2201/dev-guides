# Spring Boot Complete Roadmap: Beginner to Production Expert

A comprehensive guide combining structured learning paths with hands-on implementation from basic concepts to production-ready applications.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Foundation (Beginner)](#phase-1-foundation-beginner)
3. [Phase 2: Core Development (Intermediate)](#phase-2-core-development-intermediate)
4. [Phase 3: Advanced Features](#phase-3-advanced-features)
5. [Phase 4: Production & DevOps](#phase-4-production--devops)
6. [Phase 5: Microservices & Cloud](#phase-5-microservices--cloud)
7. [Phase 6: Expert Level](#phase-6-expert-level)
8. [Learning Strategy](#learning-strategy)
9. [Projects & Practice](#projects--practice)
10. [Resources](#resources)

---

## Prerequisites

### Essential Skills (2-3 weeks)

**Java Fundamentals**
- Core Java (Java 11+, preferably Java 17 or 21)
- OOP concepts (Inheritance, Polymorphism, Encapsulation, Abstraction)
- Collections Framework (List, Set, Map, Queue)
- Java 8+ features:
  - Lambda expressions
  - Stream API
  - Optional
  - Method references
- Exception handling
- Multithreading basics
- Java I/O and NIO

**Build Tools**
- Maven basics
  - pom.xml structure
  - Dependency management
  - Build lifecycle
- Or Gradle basics
  - build.gradle
  - Groovy/Kotlin DSL

**Basic Web Concepts**
- HTTP protocol (GET, POST, PUT, DELETE, PATCH)
- REST API principles
- JSON and XML formats
- Client-server architecture
- Status codes (200, 201, 400, 401, 404, 500)

**Database Basics**
- SQL fundamentals
- Basic queries (SELECT, INSERT, UPDATE, DELETE)
- JOINs and relationships
- Normalization concepts

**Development Environment**
```bash
# Install Java
java -version  # Java 11+ required (17 or 21 recommended)

# Install Maven
mvn -version

# Or Gradle
gradle -version

# IDE Setup
# - IntelliJ IDEA Community/Ultimate (Recommended)
# - Eclipse with STS (Spring Tool Suite)
# - VS Code with Spring extensions
```

---

## Phase 1: Foundation (Beginner)

**Duration:** 3-4 weeks | **Practice Hours:** 60-80 hours

### Week 1: Spring Framework & Boot Introduction

#### 1.1 Understanding Spring Framework

**Core Concepts:**
- What is Spring Framework?
- History and evolution
- Spring ecosystem overview
- Spring modules (Core, Data, Security, Web, etc.)

**Inversion of Control (IoC) & Dependency Injection (DI)**
- Understanding IoC container
- What is Dependency Injection?
- Benefits of DI
- Types of DI:
  - Constructor injection (recommended)
  - Setter injection
  - Field injection

```java
// Constructor Injection (Best Practice)
@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    // Constructor injection
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User getUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
```

**Bean Lifecycle & Scopes**
- Singleton (default)
- Prototype
- Request, Session, Application (web)
- Bean lifecycle callbacks

**Spring Annotations**
```java
@Component      // Generic component
@Service        // Service layer
@Repository     // Data access layer
@Controller     // MVC controller
@RestController // REST controller
@Configuration  // Configuration class
@Bean           // Bean definition
@Autowired      // Dependency injection
@Qualifier      // Bean qualifier
```

#### 1.2 Why Spring Boot?

**Spring vs Spring Boot:**
- Spring Boot = Spring Framework + Auto-configuration + Embedded Server + Starter Dependencies
- Convention over Configuration
- Opinionated defaults
- Production-ready features
- Rapid application development
- Microservices friendly

**Key Features:**
- Auto-configuration
- Starter dependencies
- Embedded servers (Tomcat, Jetty, Undertow)
- Production-ready actuators
- No XML configuration needed
- Simplified deployment (fat JAR)

#### 1.3 Creating Your First Spring Boot Project

**Using Spring Initializr (start.spring.io):**

```
Project: Maven Project
Language: Java
Spring Boot: 3.2.x (latest stable)
Project Metadata:
  Group: com.example
  Artifact: myapp
  Name: myapp
  Description: My Spring Boot Application
  Package name: com.example.myapp
  Packaging: Jar
  Java: 17 or 21

Dependencies:
  - Spring Web
  - Spring Boot DevTools
```

**Project Structure:**
```
myapp/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/myapp/
│   │   │       ├── MyappApplication.java
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       └── model/
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application.yml
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
├── pom.xml (or build.gradle)
└── mvnw (Maven wrapper)
```

**Main Application Class:**
```java
package com.example.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyappApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyappApplication.class, args);
    }
}
```

**@SpringBootApplication includes:**
- `@SpringBootConfiguration` - Configuration class
- `@EnableAutoConfiguration` - Auto-configuration
- `@ComponentScan` - Component scanning

#### 1.4 First REST Controller

```java
package com.example.myapp.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HelloController {
    
    // Simple GET endpoint
    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }
    
    // Path variable
    @GetMapping("/greet/{name}")
    public String greet(@PathVariable String name) {
        return "Hello, " + name + "!";
    }
    
    // Query parameter
    @GetMapping("/welcome")
    public String welcome(@RequestParam(defaultValue = "Guest") String name) {
        return "Welcome, " + name + "!";
    }
}
```

**Running the Application:**
```bash
# Using Maven
./mvnw spring-boot:run

# Or
mvn spring-boot:run

# Using Gradle
./gradlew bootRun

# Build and run JAR
mvn clean package
java -jar target/myapp-0.0.1-SNAPSHOT.jar

# Access endpoints
# http://localhost:8080/api/hello
# http://localhost:8080/api/greet/John
# http://localhost:8080/api/welcome?name=Alice
```

### Week 2: Configuration & REST API Basics

#### 2.1 Application Configuration

**application.properties:**
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Application Name
spring.application.name=myapp

# Logging
logging.level.root=INFO
logging.level.com.example.myapp=DEBUG
logging.file.name=logs/application.log

# Banner
spring.banner.location=classpath:banner.txt
```

**application.yml (YAML format - recommended):**
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: myapp

logging:
  level:
    root: INFO
    com.example.myapp: DEBUG
  file:
    name: logs/application.log
```

**Spring Boot DevTools:**
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

**Features:**
- Automatic restart on code changes
- LiveReload browser integration
- Enhanced development experience
- Property defaults for development

#### 2.2 REST API Mapping

**Request Mapping Annotations:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping              // HTTP GET
    public List<User> getAllUsers() {
        // GET /api/users
        return userService.getAllUsers();
    }
    
    @GetMapping("/{id}")     // Path variable
    public User getUserById(@PathVariable Long id) {
        // GET /api/users/1
        return userService.getUserById(id);
    }
    
    @PostMapping             // HTTP POST
    public User createUser(@RequestBody User user) {
        // POST /api/users
        return userService.createUser(user);
    }
    
    @PutMapping("/{id}")     // HTTP PUT
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        // PUT /api/users/1
        return userService.updateUser(id, user);
    }
    
    @PatchMapping("/{id}")   // HTTP PATCH
    public User partialUpdate(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        // PATCH /api/users/1
        return userService.partialUpdate(id, updates);
    }
    
    @DeleteMapping("/{id}")  // HTTP DELETE
    public void deleteUser(@PathVariable Long id) {
        // DELETE /api/users/1
        userService.deleteUser(id);
    }
}
```

**Request Parameters:**
```java
@RestController
@RequestMapping("/api")
public class SearchController {
    
    // Single parameter
    @GetMapping("/search")
    public List<Product> search(@RequestParam String query) {
        // /api/search?query=laptop
        return productService.search(query);
    }
    
    // Optional parameter with default
    @GetMapping("/products")
    public List<Product> getProducts(
        @RequestParam(required = false, defaultValue = "all") String category
    ) {
        // /api/products?category=electronics
        return productService.getByCategory(category);
    }
    
    // Multiple parameters
    @GetMapping("/filter")
    public List<Product> filter(
        @RequestParam String category,
        @RequestParam(required = false) Double minPrice,
        @RequestParam(required = false) Double maxPrice
    ) {
        // /api/filter?category=electronics&minPrice=100&maxPrice=1000
        return productService.filter(category, minPrice, maxPrice);
    }
}
```

#### 2.3 Request and Response Handling

**Model/DTO Class:**
```java
package com.example.myapp.model;

public class User {
    private Long id;
    private String name;
    private String email;
    private Integer age;
    
    // Constructors
    public User() {}
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
}
```

**ResponseEntity for Better Control:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        
        if (user != null) {
            return ResponseEntity.ok(user);  // 200 OK
        } else {
            return ResponseEntity.notFound().build();  // 404 Not Found
        }
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User created = userService.save(user);
        return ResponseEntity
            .status(HttpStatus.CREATED)  // 201 Created
            .body(created);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();  // 204 No Content
    }
    
    // Custom headers
    @GetMapping("/custom")
    public ResponseEntity<User> customResponse() {
        User user = new User("John", "john@example.com");
        return ResponseEntity
            .status(HttpStatus.OK)
            .header("Custom-Header", "CustomValue")
            .header("X-Total-Count", "100")
            .body(user);
    }
}
```

### Week 3: Spring Data JPA

#### 3.1 Setting Up JPA

**Dependencies:**
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- H2 Database (for development) -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- MySQL (for production) -->
<!-- <dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency> -->

<!-- PostgreSQL -->
<!-- <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency> -->
```

**Database Configuration:**
```yaml
# application.yml

# H2 Database (Development)
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password:
  
  h2:
    console:
      enabled: true
      path: /h2-console
  
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: update  # create, update, validate, none
    show-sql: true
    properties:
      hibernate:
        format_sql: true

# MySQL Configuration
# spring:
#   datasource:
#     url: jdbc:mysql://localhost:3306/mydb
#     username: root
#     password: password
#     driver-class-name: com.mysql.cj.jdbc.Driver
#   jpa:
#     database-platform: org.hibernate.dialect.MySQL8Dialect
#     hibernate:
#       ddl-auto: update

# PostgreSQL Configuration
# spring:
#   datasource:
#     url: jdbc:postgresql://localhost:5432/mydb
#     username: postgres
#     password: password
#   jpa:
#     database-platform: org.hibernate.dialect.PostgreSQLDialect
```

#### 3.2 JPA Entity

```java
package com.example.myapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(name = "age")
    private Integer age;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public User() {}
    
    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }
    
    // Getters and Setters
    // ... (add all getters and setters)
}
```

**Common JPA Annotations:**
```java
@Entity                          // Marks class as JPA entity
@Table(name = "users")          // Table name
@Id                             // Primary key
@GeneratedValue                 // Auto-generation strategy
@Column                         // Column mapping
@Temporal                       // Date/Time mapping
@Enumerated                     // Enum mapping
@Transient                      // Not persisted
@Lob                           // Large object
@PrePersist, @PostPersist      // Lifecycle callbacks
@PreUpdate, @PostUpdate
@PreRemove, @PostRemove
```

#### 3.3 JPA Repository

```java
package com.example.myapp.repository;

import com.example.myapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring Data JPA generates implementation automatically!
    
    // Method name queries (no implementation needed)
    Optional<User> findByEmail(String email);
    List<User> findByName(String name);
    List<User> findByNameContaining(String name);
    List<User> findByNameStartingWith(String prefix);
    List<User> findByNameEndingWith(String suffix);
    List<User> findByAgeGreaterThan(Integer age);
    List<User> findByAgeBetween(Integer minAge, Integer maxAge);
    List<User> findByNameAndEmail(String name, String email);
    List<User> findByNameOrEmail(String name, String email);
    
    // Boolean queries
    boolean existsByEmail(String email);
    
    // Count queries
    long countByName(String name);
    
    // Delete queries
    void deleteByEmail(String email);
    
    // JPQL queries
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> findByEmailJPQL(String email);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %?1%")
    List<User> searchByName(String name);
    
    // Named parameters
    @Query("SELECT u FROM User u WHERE u.name = :name AND u.email = :email")
    Optional<User> findByNameAndEmailJPQL(
        @Param("name") String name,
        @Param("email") String email
    );
    
    // Native SQL query
    @Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true)
    Optional<User> findByEmailNative(String email);
}
```

**Repository Hierarchy:**
- `Repository` - Marker interface
- `CrudRepository` - CRUD operations
- `PagingAndSortingRepository` - Pagination & sorting
- `JpaRepository` - JPA specific (most commonly used)

#### 3.4 Service Layer

```java
package com.example.myapp.service;

import com.example.myapp.entity.User;
import com.example.myapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    // Constructor injection
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User createUser(User user) {
        // Business logic here
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAge(userDetails.getAge());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    public List<User> searchUsers(String query) {
        return userRepository.findByNameContaining(query);
    }
}
```

### Week 4: Complete CRUD Application + Exception Handling

#### 4.1 Complete REST Controller

```java
package com.example.myapp.controller;

import com.example.myapp.entity.User;
import com.example.myapp.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")  // CORS configuration
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User created = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
        @PathVariable Long id,
        @RequestBody User user
    ) {
        try {
            User updated = userService.updateUser(id, user);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

#### 4.2 Exception Handling

**Custom Exceptions:**
```java
// ResourceNotFoundException.java
package com.example.myapp.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s not found with %s: '%s'", resource, field, value));
    }
}

// DuplicateResourceException.java
package com.example.myapp.exception;

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

// BadRequestException.java
package com.example.myapp.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
```

**Error Response DTO:**
```java
package com.example.myapp.dto;

import java.time.LocalDateTime;

public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    
    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    public ErrorResponse(int status, String error, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
    
    // Getters and Setters
}
```

**Global Exception Handler:**
```java
package com.example.myapp.exception;

import com.example.myapp.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex,
        WebRequest request
    ) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(
        DuplicateResourceException ex,
        WebRequest request
    ) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.CONFLICT.value(),
            "Conflict",
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
        BadRequestException ex,
        WebRequest request
    ) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Bad Request",
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
        Exception ex,
        WebRequest request
    ) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            ex.getMessage(),
            request.getDescription(false).replace("uri=", "")
        );
        
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

**Updated Service with Custom Exceptions:**
```java
@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
    
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + user.getEmail());
        }
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);  // Throws ResourceNotFoundException if not found
        
        // Check email uniqueness
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + userDetails.getEmail());
        }
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAge(userDetails.getAge());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = getUserById(id);  // Throws ResourceNotFoundException if not found
        userRepository.delete(user);
    }
}
```

---

## Phase 2: Core Development (Intermediate)

**Duration:** 4-6 weeks | **Practice Hours:** 100-120 hours

### Week 5-6: Validation & DTO Pattern

#### 5.1 Bean Validation

**Add Dependency:**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

**Entity with Validation:**
```java
import jakarta.validation.constraints.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must be less than 100")
    private Integer age;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phone;
    
    // Getters and Setters
}
```

**Common Validation Annotations:**
```java
@NotNull        // Not null
@NotEmpty       // Not null and not empty (for collections/strings)
@NotBlank       // Not null, not empty, not whitespace (for strings)
@Size           // Size constraint
@Min, @Max      // Numeric constraints
@Email          // Email format
@Pattern        // Regex pattern
@Past, @Future  // Date constraints
@Positive       // Positive number
@Negative       // Negative number
@AssertTrue     // Must be true
@AssertFalse    // Must be false
```

**Controller with Validation:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        // @Valid triggers validation
        User created = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody User user
    ) {
        User updated = userService.updateUser(id, user);
        return ResponseEntity.ok(updated);
    }
}
```

**Validation Error Handling:**
```java
@RestControllerAdvice
public class ValidationExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
        MethodArgumentNotValidException ex
    ) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("errors", errors);
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
```

#### 5.2 DTO Pattern

**Why DTOs?**
- Separate API contracts from domain models
- Hide sensitive data
- Reduce over-fetching/under-fetching
- Validation specific to API
- Versioning support

**DTO Classes:**
```java
// UserDTO.java
package com.example.myapp.dto;

import jakarta.validation.constraints.*;

public class UserDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email
    private String email;
    
    @Min(18)
    @Max(100)
    private Integer age;
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(Long id, String name, String email, Integer age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    // Getters and Setters
}

// UserCreateDTO.java (for creation - no ID)
public class UserCreateDTO {
    @NotBlank
    private String name;
    
    @Email
    private String email;
    
    @Min(18)
    private Integer age;
    
    // Getters and Setters
}

// UserUpdateDTO.java (for updates - all fields optional)
public class UserUpdateDTO {
    @Size(min = 2, max = 100)
    private String name;
    
    @Email
    private String email;
    
    @Min(18)
    private Integer age;
    
    // Getters and Setters
}
```

**Mapper Class:**
```java
package com.example.myapp.mapper;

import com.example.myapp.dto.UserDTO;
import com.example.myapp.dto.UserCreateDTO;
import com.example.myapp.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public UserDTO toDTO(User user) {
        if (user == null) return null;
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        return dto;
    }
    
    public User toEntity(UserDTO dto) {
        if (dto == null) return null;
        
        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());
        return user;
    }
    
    public User toEntity(UserCreateDTO dto) {
        if (dto == null) return null;
        
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());
        return user;
    }
}
```

**Using ModelMapper (Alternative):**
```xml
<dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>3.1.1</version>
</dependency>
```

```java
@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}

// In Service
@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    
    public UserService(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        return modelMapper.map(user, UserDTO.class);
    }
    
    public UserDTO createUser(UserCreateDTO createDTO) {
        User user = modelMapper.map(createDTO, User.class);
        User saved = userRepository.save(user);
        return modelMapper.map(saved, UserDTO.class);
    }
}
```

**Controller with DTOs:**
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO createDTO) {
        UserDTO created = userService.createUser(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UserUpdateDTO updateDTO
    ) {
        UserDTO updated = userService.updateUser(id, updateDTO);
        return ResponseEntity.ok(updated);
    }
}
```

*[Continue in next file due to length...]*

---

**📌 Week 7-8 Topics:**
- JPA Relationships (One-to-Many, Many-to-Many, One-to-One)
- Pagination and Sorting
- Custom Queries (JPQL, Native SQL)
- Transaction Management
- Configuration Properties

**📌 Week 9-10 Topics:**
- Database Migrations (Flyway/Liquibase)
- Multiple Data Sources
- Query Optimization
- N+1 Problem Solutions
- First Major Project: E-commerce API

*This roadmap continues with Phases 3-6 covering Security, Testing, Microservices, Cloud Deployment, and Expert-level topics. The complete file is structured to take you from beginner to production-ready expert systematically.*

---

