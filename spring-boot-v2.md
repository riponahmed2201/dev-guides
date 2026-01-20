# Spring Boot Complete Learning Guide - Beginner to Expert

তোমার জন্য Spring Boot শেখার একটা সম্পূর্ণ roadmap তৈরি করে দিলাম। ধাপে ধাপে follow করো।

## 📚 Level 1: Foundation (Beginner)

### 1. Prerequisites

- **Java Fundamentals** (Java 11 or higher)
  - OOP concepts
  - Collections Framework
  - Exceptions
  - Generics
  - Streams API
  - Lambda expressions
  - Optional
- **Build Tools** (Maven/Gradle basics)
- **Basic Web Concepts** (HTTP, REST)
- **Database Basics** (SQL)
- **IDE** (IntelliJ IDEA/Eclipse/VS Code)

### 2. Spring Framework Introduction

- Spring Framework কি
- Spring এর history
- Inversion of Control (IoC)
- Dependency Injection (DI)
- Spring modules overview
- Spring vs Spring Boot
- Why Spring Boot?
- Convention over Configuration

### 3. Spring Boot Introduction

- Spring Boot কি এবং benefits
- Auto-configuration
- Starter dependencies
- Embedded servers
- Production-ready features
- Opinionated defaults
- Rapid development
- Microservices friendly

### 4. Development Environment Setup

```bash
# Install Java
java -version  # Java 11+ required

# Install Maven
mvn -version

# Or Gradle
gradle -version

# IDE Setup
# IntelliJ IDEA Community/Ultimate
# Eclipse with STS (Spring Tool Suite)
# VS Code with Spring extensions
```

### 5. Creating First Spring Boot Project

**Using Spring Initializr (start.spring.io):**

```
Project: Maven/Gradle
Language: Java
Spring Boot: 3.2.x (latest stable)
Group: com.example
Artifact: demo
Name: demo
Description: Demo project
Package name: com.example.demo
Packaging: Jar
Java: 17 or 21

Dependencies:
- Spring Web
- Spring Boot DevTools
```

**Project Structure:**

```
demo/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       └── DemoApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
│       └── java/
├── pom.xml (or build.gradle)
└── mvnw (Maven wrapper)
```

### 6. Main Application Class

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

**@SpringBootApplication includes:**

- @SpringBootConfiguration
- @EnableAutoConfiguration
- @ComponentScan

### 7. First REST Controller

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }

    @GetMapping("/greet/{name}")
    public String greet(@PathVariable String name) {
        return "Hello, " + name + "!";
    }

    @GetMapping("/welcome")
    public String welcome(@RequestParam(defaultValue = "Guest") String name) {
        return "Welcome, " + name + "!";
    }
}
```

### 8. Running Application

```bash
# Using Maven
./mvnw spring-boot:run

# Or
mvn spring-boot:run

# Using Gradle
./gradlew bootRun

# Or run JAR
mvn clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar

# Access
# http://localhost:8080/api/hello
```

### 9. Application Properties

```properties
# application.properties

# Server configuration
server.port=8080
server.servlet.context-path=/api

# Application name
spring.application.name=demo-app

# Logging
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
logging.file.name=application.log

# Banner
spring.banner.location=classpath:banner.txt
```

**YAML format (application.yml):**

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: demo-app

logging:
  level:
    root: INFO
    com.example.demo: DEBUG
  file:
    name: application.log
```

### 10. Spring Boot DevTools

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

- Automatic restart
- LiveReload
- Configuration properties
- Remote development

### 11. Dependency Injection Basics

```java
// Service
@Service
public class UserService {
    public String getUser() {
        return "John Doe";
    }
}

// Controller with DI
@RestController
public class UserController {

    private final UserService userService;

    // Constructor injection (recommended)
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public String getUser() {
        return userService.getUser();
    }
}
```

### 12. Component Annotations

```java
@Component      // Generic component
@Service        // Service layer
@Repository     // Data access layer
@Controller     // MVC controller
@RestController // REST controller (@Controller + @ResponseBody)
@Configuration  // Configuration class
```

### 13. REST API Basics

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getAllUsers() {
        // GET /api/users
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        // GET /api/users/1
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        // POST /api/users
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        // PUT /api/users/1
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        // DELETE /api/users/1
    }
}
```

### 14. Request Mapping Annotations

```java
@GetMapping      // HTTP GET
@PostMapping     // HTTP POST
@PutMapping      // HTTP PUT
@DeleteMapping   // HTTP DELETE
@PatchMapping    // HTTP PATCH

// Older style (still valid)
@RequestMapping(value = "/users", method = RequestMethod.GET)
```

### 15. Request Parameters

```java
@RestController
public class ParamController {

    // Path variable
    @GetMapping("/users/{id}")
    public String getById(@PathVariable Long id) {
        return "User ID: " + id;
    }

    // Query parameter
    @GetMapping("/search")
    public String search(@RequestParam String query) {
        // /search?query=spring
        return "Searching for: " + query;
    }

    // Optional parameter
    @GetMapping("/filter")
    public String filter(
        @RequestParam(required = false, defaultValue = "all") String type
    ) {
        return "Filter: " + type;
    }

    // Multiple parameters
    @GetMapping("/users")
    public String getUsers(
        @RequestParam int page,
        @RequestParam int size
    ) {
        return "Page: " + page + ", Size: " + size;
    }
}
```

### 16. Request Body

```java
// DTO/Model class
public class User {
    private Long id;
    private String name;
    private String email;

    // Constructors, getters, setters
}

@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping
    public User createUser(@RequestBody User user) {
        // Request body automatically mapped to User object
        return user;
    }
}
```

### 17. Response Entity

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User created = userService.save(user);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(created);
    }

    // Custom response
    @GetMapping("/custom")
    public ResponseEntity<String> custom() {
        return ResponseEntity
            .status(HttpStatus.OK)
            .header("Custom-Header", "Value")
            .body("Custom response");
    }
}
```

## 📚 Level 2: Intermediate

### 18. Spring Data JPA - Introduction

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 19. JPA Entity

```java
package com.example.demo.entity;

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

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors, getters, setters
    public User() {}

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // Getters and setters
}
```

### 20. JPA Repository

```java
package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA generates implementation automatically

    // Custom query methods (method name query)
    Optional<User> findByEmail(String email);
    List<User> findByNameContaining(String name);
    List<User> findByNameStartingWith(String prefix);
    boolean existsByEmail(String email);

    // Count
    long countByName(String name);

    // Delete
    void deleteByEmail(String email);
}
```

### 21. Database Configuration

```properties
# application.properties

# H2 Database (in-memory)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# MySQL Configuration
# spring.datasource.url=jdbc:mysql://localhost:3306/mydb
# spring.datasource.username=root
# spring.datasource.password=password
# spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# PostgreSQL Configuration
# spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
# spring.datasource.username=postgres
# spring.datasource.password=password
# spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

### 22. Service Layer

```java
package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
```

### 23. Complete CRUD Controller

```java
package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
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
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 24. Exception Handling

```java
// Custom exception
package com.example.demo.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

// Global exception handler
package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
        ResourceNotFoundException ex
    ) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("status", HttpStatus.NOT_FOUND.value());

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
        Exception ex
    ) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "Internal server error");
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### 25. Validation

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

```java
// Entity with validation
import jakarta.validation.constraints.*;

@Entity
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

    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must be less than 100")
    private Integer age;

    // Getters, setters
}

// Controller with validation
@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        // @Valid triggers validation
        User created = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}

// Validation error handler
@RestControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
        MethodArgumentNotValidException ex
    ) {
        Map<String, Object> body = new HashMap<>();
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.toList());

        body.put("timestamp", LocalDateTime.now());
        body.put("errors", errors);
        body.put("status", HttpStatus.BAD_REQUEST.value());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}
```

### 26. DTO (Data Transfer Object)

```java
// DTO
package com.example.demo.dto;

import jakarta.validation.constraints.*;

public class UserDTO {
    private Long id;

    @NotBlank
    private String name;

    @Email
    private String email;

    // Constructors, getters, setters
}

// Mapper
package com.example.demo.mapper;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public User toEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        return user;
    }
}

// Using ModelMapper (alternative)
<dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>3.1.1</version>
</dependency>

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}

// In service
private final ModelMapper modelMapper;

public UserDTO getUserDTO(Long id) {
    User user = userRepository.findById(id).orElseThrow();
    return modelMapper.map(user, UserDTO.class);
}
```

### 27. Relationships in JPA

**One-to-Many:**

```java
@Entity
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Book> books = new ArrayList<>();

    // Helper methods
    public void addBook(Book book) {
        books.add(book);
        book.setAuthor(this);
    }
}

@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;
}
```

**Many-to-Many:**

```java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}

@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
}
```

**One-to-One:**

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile profile;
}

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bio;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

### 28. Custom Queries

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // JPQL queries
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> findByEmailJPQL(String email);

    @Query("SELECT u FROM User u WHERE u.name LIKE %?1%")
    List<User> searchByName(String name);

    // Named parameters
    @Query("SELECT u FROM User u WHERE u.name = :name AND u.email = :email")
    Optional<User> findByNameAndEmail(
        @Param("name") String name,
        @Param("email") String email
    );

    // Native SQL query
    @Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true)
    Optional<User> findByEmailNative(String email);

    // Update query
    @Modifying
    @Query("UPDATE User u SET u.name = ?1 WHERE u.id = ?2")
    int updateUserName(String name, Long id);

    // Delete query
    @Modifying
    @Query("DELETE FROM User u WHERE u.email = ?1")
    void deleteByEmailQuery(String email);
}
```

### 29. Pagination and Sorting

```java
// Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByNameContaining(String name, Pageable pageable);
}

// Service
@Service
public class UserService {

    public Page<User> getUsers(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return userRepository.findAll(pageable);
    }

    public Page<User> searchUsers(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findByNameContaining(name, pageable);
    }
}

// Controller
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public ResponseEntity<Page<User>> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy
    ) {
        Page<User> users = userService.getUsers(page, size, sortBy);
        return ResponseEntity.ok(users);
    }
}
```

### 30. Configuration Properties

```java
// application.properties
app.name=My Application
app.version=1.0.0
app.email=admin@example.com
app.features.enabled=true
app.max-upload-size=10MB

// Configuration class
package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String name;
    private String version;
    private String email;
    private Features features;
    private String maxUploadSize;

    // Getters and setters

    public static class Features {
        private boolean enabled;

        // Getter and setter
    }
}

// Using in service
@Service
public class AppService {

    private final AppProperties appProperties;

    public AppService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public String getAppInfo() {
        return appProperties.getName() + " v" + appProperties.getVersion();
    }
}
```

## 📚 Level 3: Advanced

### 31. Spring Security - Basic Setup

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

```java
// Security Configuration
package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic();

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### 32. User Details Service

```java
// User Entity
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;

    private String role; // ROLE_USER, ROLE_ADMIN

    private boolean enabled = true;

    // Getters, setters
}

// Custom UserDetailsService
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() ->
                new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRole())
            .disabled(!user.isEnabled())
            .build();
    }
}
```

### 33. JWT Authentication

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

```java
// JWT Utility
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}

// JWT Filter
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil,
                                   UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        username = jwtUtil.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext()
                .getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}

// Security Config with JWT
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

// Auth Controller
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(), request.getPassword()));

        String token = jwtUtil.generateToken(request.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
```

### 34. Method Security

```java
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
}

// In Controller/Service
@Service
public class UserService {

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    @PreAuthorize("#username == authentication.name")
    public User updateProfile(String username, UserProfile profile) {
        // Only user can update their own profile
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public User getUserProfile(Long id) {
        // Return only if user owns the profile
    }
}
```

### 35. File Upload

```java
// application.properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

// File upload controller
@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${upload.path}")
    private String uploadPath;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
        @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file");
        }

        try {
            // Create upload directory if not exists
            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Save file
            String filename = System.currentTimeMillis() + "_" +
                             file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath,
                      StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok("File uploaded: " + filename);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to upload file");
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadPath).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                           "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
```

### 36. Email Sending

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

```properties
# application.properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

```java
// Email Service
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("noreply@example.com");

        mailSender.send(message);
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true = HTML
        helper.setFrom("noreply@example.com");

        mailSender.send(message);
    }

    public void sendEmailWithAttachment(String to, String subject,
                                        String text, String pathToAttachment)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text);

        FileSystemResource file = new FileSystemResource(new File(pathToAttachment));
        helper.addAttachment(file.getFilename(), file);

        mailSender.send(message);
    }
}
```

### 37. Caching

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

```java
// Enable caching
@SpringBootApplication
@EnableCaching
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// Using cache
@Service
public class UserService {

    @Cacheable(value = "users", key = "#id")
    public User getUserById(Long id) {
        // This method will be cached
        return userRepository.findById(id).orElseThrow();
    }

    @CachePut(value = "users", key = "#user.id")
    public User updateUser(User user) {
        // Update cache
        return userRepository.save(user);
    }

    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        // Remove from cache
        userRepository.deleteById(id);
    }

    @CacheEvict(value = "users", allEntries = true)
    public void clearCache() {
        // Clear all cache entries
    }
}

// Redis cache configuration
@Configuration
public class CacheConfig {

    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(60))
            .disableCachingNullValues()
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
}
```

### 38. Scheduled Tasks

```java
@SpringBootApplication
@EnableScheduling
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Component
public class ScheduledTasks {

    private static final Logger log = LoggerFactory.getLogger(ScheduledTasks.class);

    // Fixed rate (every 5 seconds)
    @Scheduled(fixedRate = 5000)
    public void reportCurrentTime() {
        log.info("Current time: {}", LocalDateTime.now());
    }

    // Fixed delay (5 seconds after previous execution completes)
    @Scheduled(fixedDelay = 5000)
    public void delayedTask() {
        log.info("Fixed delay task executed");
    }

    // Cron expression (every day at midnight)
    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduledTask() {
        log.info("Daily task executed");
    }

    // Every Monday at 9 AM
    @Scheduled(cron = "0 0 9 * * MON")
    public void weeklyTask() {
        log.info("Weekly task executed");
    }
}
```

### 39. Async Processing

```java
@SpringBootApplication
@EnableAsync
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// Async configuration
@Configuration
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(2);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("Async-");
        executor.initialize();
        return executor;
    }
}

// Async service
@Service
public class AsyncService {

    private static final Logger log = LoggerFactory.getLogger(AsyncService.class);

    @Async
    public void asyncMethod() {
        log.info("Async method started - " + Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        log.info("Async method completed");
    }

    @Async
    public CompletableFuture<String> asyncMethodWithReturn() {
        log.info("Async method with return started");
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return CompletableFuture.completedFuture("Async result");
    }
}
```

### 40. Events

```java
// Custom event
public class UserRegisteredEvent extends ApplicationEvent {
    private final String username;
    private final String email;

    public UserRegisteredEvent(Object source, String username, String email) {
        super(source);
        this.username = username;
        this.email = email;
    }

    // Getters
}

// Event publisher
@Service
public class UserService {

    private final ApplicationEventPublisher eventPublisher;

    public UserService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public User registerUser(User user) {
        User savedUser = userRepository.save(user);

        // Publish event
        UserRegisteredEvent event = new UserRegisteredEvent(
            this, savedUser.getUsername(), savedUser.getEmail());
        eventPublisher.publishEvent(event);

        return savedUser;
    }
}

// Event listener
@Component
public class UserEventListener {

    private static final Logger log = LoggerFactory.getLogger(UserEventListener.class);
    private final EmailService emailService;

    public UserEventListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @EventListener
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info("User registered: {}", event.getUsername());
        emailService.sendWelcomeEmail(event.getEmail());
    }

    @Async
    @EventListener
    public void handleUserRegisteredAsync(UserRegisteredEvent event) {
        // Async event handling
        log.info("Async processing for user: {}", event.getUsername());
    }
}
```

## 📚 Level 4: Expert

### 41. Profiles

```properties
# application.properties
spring.profiles.active=dev

# application-dev.properties
spring.datasource.url=jdbc:h2:mem:devdb
server.port=8080
logging.level.root=DEBUG

# application-prod.properties
spring.datasource.url=jdbc:mysql://prod-db:3306/proddb
server.port=80
logging.level.root=WARN
```

```java
// Profile-specific beans
@Configuration
public class DataSourceConfig {

    @Bean
    @Profile("dev")
    public DataSource devDataSource() {
        // Development datasource
    }

    @Bean
    @Profile("prod")
    public DataSource prodDataSource() {
        // Production datasource
    }
}

// Profile-specific component
@Component
@Profile("dev")
public class DevService {
    // Only loaded in dev profile
}
```

### 42. Actuator

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

```properties
# application.properties
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always
management.endpoint.shutdown.enabled=true

# Or selectively
management.endpoints.web.exposure.include=health,info,metrics,loggers
```

**Endpoints:**

- `/actuator/health` - Health status
- `/actuator/info` - Application info
- `/actuator/metrics` - Metrics
- `/actuator/env` - Environment properties
- `/actuator/loggers` - Logging configuration
- `/actuator/beans` - All beans
- `/actuator/mappings` - Request mappings

```java
// Custom health indicator
@Component
public class CustomHealthIndicator implements HealthIndicator {

    @Override
    public Health health() {
        boolean isHealthy = checkHealth();

        if (isHealthy) {
            return Health.up()
                .withDetail("status", "Service is running")
                .withDetail("version", "1.0")
                .build();
        } else {
            return Health.down()
                .withDetail("error", "Service is down")
                .build();
        }
    }

    private boolean checkHealth() {
        // Custom health check logic
        return true;
    }
}

// Custom info contributor
@Component
public class CustomInfoContributor implements InfoContributor {

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("app", "My Application")
               .withDetail("version", "1.0.0")
               .withDetail("author", "John Doe");
    }
}
```

### 43. Testing

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

**Unit Test:**

```java
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testGetUserById() {
        // Arrange
        User user = new User(1L, "John", "john@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        Optional<User> result = userService.getUserById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("John", result.get().getName());
        verify(userRepository, times(1)).findById(1L);
    }
}
```

**Integration Test:**

```java
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    public void testCreateUser() throws Exception {
        User user = new User(null, "John", "john@example.com");

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("John"))
            .andExpect(jsonPath("$.email").value("john@example.com"));
    }
}
```

**Repository Test:**

```java
@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindByEmail() {
        // Arrange
        User user = new User(null, "John", "john@example.com");
        entityManager.persist(user);
        entityManager.flush();

        // Act
        Optional<User> found = userRepository.findByEmail("john@example.com");

        // Assert
        assertTrue(found.isPresent());
        assertEquals("John", found.get().getName());
    }
}
```

**WebTestClient:**

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerWebTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    public void testGetAllUsers() {
        webTestClient.get()
            .uri("/api/users")
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(User.class)
            .hasSize(3);
    }
}
```

### 44. Logging

```properties
# application.properties
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Log file
logging.file.name=application.log
logging.file.path=/var/logs
logging.file.max-size=10MB
logging.file.max-history=10

# Log pattern
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    public User createUser(User user) {
        log.debug("Creating user: {}", user.getName());

        try {
            User saved = userRepository.save(user);
            log.info("User created successfully: {}", saved.getId());
            return saved;
        } catch (Exception e) {
            log.error("Error creating user", e);
            throw e;
        }
    }
}
```

**Logback Configuration (logback-spring.xml):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>

    <logger name="com.example.demo" level="DEBUG"/>
</configuration>
```

### 45. API Documentation - OpenAPI/Swagger

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

```java
// Configuration
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("User API")
                .version("1.0")
                .description("User management REST API")
                .contact(new Contact()
                    .name("John Doe")
                    .email("john@example.com"))
                .license(new License()
                    .name("Apache 2.0")
                    .url("http://springdoc.org")));
    }
}

// Controller with documentation
@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "User management APIs")
public class UserController {

    @Operation(
        summary = "Get all users",
        description = "Returns list of all users"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successful operation"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
        @Parameter(description = "User ID") @PathVariable Long id
    ) {
        return userService.getUserById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create new user")
    @PostMapping
    public ResponseEntity<User> createUser(
        @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "User object to be created"
        )
        @RequestBody @Valid User user
    ) {
        User created = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}

// Access Swagger UI
// http://localhost:8080/swagger-ui.html
// http://localhost:8080/v3/api-docs
```

### 46. Externalized Configuration

```java
// Configuration class
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    private String name;
    private String version;
    private Security security = new Security();
    private Database database = new Database();

    public static class Security {
        private String secretKey;
        private long tokenExpiration;
        // Getters, setters
    }

    public static class Database {
        private String url;
        private String username;
        private String password;
        // Getters, setters
    }

    // Getters, setters
}

// application.yml
app:
  name: My Application
  version: 1.0.0
  security:
    secret-key: mySecretKey123
    token-expiration: 86400000
  database:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: password

// Using configuration
@Service
public class AppService {
    private final AppConfig appConfig;

    public AppService(AppConfig appConfig) {
        this.appConfig = appConfig;
    }

    public String getAppInfo() {
        return appConfig.getName() + " v" + appConfig.getVersion();
    }
}
```

### 47. Custom Starter

```
my-spring-boot-starter/
├── src/main/java/
│   └── com/example/starter/
│       ├── MyAutoConfiguration.java
│       ├── MyProperties.java
│       └── MyService.java
└── src/main/resources/
    └── META-INF/
        └── spring.factories
```

```java
// MyProperties.java
@ConfigurationProperties(prefix = "my.starter")
public class MyProperties {
    private String message = "Hello from Starter";
    // Getters, setters
}

// MyService.java
public class MyService {
    private final MyProperties properties;

    public MyService(MyProperties properties) {
        this.properties = properties;
    }

    public String getMessage() {
        return properties.getMessage();
    }
}

// MyAutoConfiguration.java
@Configuration
@EnableConfigurationProperties(MyProperties.class)
@ConditionalOnClass(MyService.class)
public class MyAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public MyService myService(MyProperties properties) {
        return new MyService(properties);
    }
}
```

```properties
# src/main/resources/META-INF/spring.factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.starter.MyAutoConfiguration
```

### 48. Reactive Programming (WebFlux)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

```java
// Reactive repository
public interface UserRepository extends ReactiveMongoRepository<User, String> {
    Flux<User> findByName(String name);
    Mono<User> findByEmail(String email);
}

// Reactive service
@Service
public class UserService {
    private final UserRepository userRepository;

    public Mono<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Flux<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Mono<User> createUser(User user) {
        return userRepository.save(user);
    }
}

// Reactive controller
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public Flux<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<User>> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<User> createUser(@RequestBody User user) {
        return userService.createUser(user);
    }
}
```

### 49. GraphQL

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-graphql</artifactId>
</dependency>
```

```graphql
# schema.graphqls
type User {
    id: ID!
    name: String!
    email: String!
}

type Query {
    users: [User]
    user(id: ID!): User
}

type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
```

deleteUser(id: ID!): Boolean
}

````

```java
// GraphQL Controller
@Controller
public class UserGraphQLController {

    private final UserService userService;

    @QueryMapping
    public List<User> users() {
        return userService.getAllUsers();
    }

    @QueryMapping
    public User user(@Argument Long id) {
        return userService.getUserById(id).orElse(null);
    }

    @MutationMapping
    public User createUser(@Argument String name, @Argument String email) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        return userService.createUser(user);
    }
}
````

### 50. Microservices Architecture

**Service Discovery (Eureka):**

```xml
<!-- Eureka Server -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

```properties
# Eureka Server
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

**Eureka Client:**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

```properties
# Eureka Client
spring.application.name=user-service
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

**Feign Client:**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

```java
@SpringBootApplication
@EnableFeignClients
public class Application {
}

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/users/{id}")
    User getUserById(@PathVariable Long id);

    @PostMapping("/api/users")
    User createUser(@RequestBody User user);
}
```

**API Gateway (Spring Cloud Gateway):**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/users/**
        - id: order-service
          uri: lb://ORDER-SERVICE
          predicates:
            - Path=/api/orders/**
```

**Circuit Breaker (Resilience4j):**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```

```java
@Service
public class UserService {

    private final UserClient userClient;
    private final CircuitBreakerFactory circuitBreakerFactory;

    public User getUserWithFallback(Long id) {
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("user-service");

        return circuitBreaker.run(
            () -> userClient.getUserById(id),
            throwable -> getFallbackUser(id)
        );
    }

    private User getFallbackUser(Long id) {
        // Return cached or default user
        return new User(id, "Fallback User", "fallback@example.com");
    }
}
```

## 🎯 Real-World Projects

### Beginner Projects:

1. **TODO API**: CRUD operations with Spring Data JPA
2. **Blog API**: Posts, comments, authentication
3. **Contact Manager**: User contacts CRUD
4. **URL Shortener**: Short URL generation
5. **Book Library**: Book management system

### Intermediate Projects:

6. **E-commerce API**: Products, cart, orders
7. **Social Media API**: Posts, likes, comments, followers
8. **Banking API**: Accounts, transactions
9. **Hotel Booking**: Rooms, reservations
10. **Task Management**: Projects, tasks, teams
11. **Recipe API**: Recipes, ingredients, ratings
12. **Weather API**: Weather data integration

### Advanced Projects:

13. **Microservices E-commerce**: Multiple services with Eureka
14. **Real-time Chat**: WebSocket + messaging
15. **Payment Gateway Integration**: Stripe/PayPal
16. **File Storage Service**: AWS S3 integration
17. **Notification Service**: Email, SMS, Push
18. **Analytics Dashboard**: Real-time metrics
19. **CMS Platform**: Content management
20. **Learning Management System**: Courses, lessons, progress

### Expert Projects:

21. **Multi-tenant SaaS Platform**: Complete isolation
22. **Event-Driven Architecture**: Kafka integration
23. **API Gateway with Rate Limiting**: Custom gateway
24. **Distributed Transaction System**: Saga pattern
25. **Cloud-Native Application**: Kubernetes deployment

## 📖 Learning Resources

### Official Documentation:

- Spring Boot Documentation (spring.io/projects/spring-boot)
- Spring Framework Documentation
- Spring Data JPA Documentation
- Spring Security Documentation
- Spring Cloud Documentation

### Books:

- **"Spring Boot in Action"** - Craig Walls
- **"Spring in Action"** - Craig Walls (6th Edition)
- **"Pro Spring Boot 2"** - Felipe Gutierrez
- **"Spring Boot: Up and Running"** - Mark Heckler
- **"Mastering Spring Boot 2.0"** - Dinesh Rajput

### Video Courses:

- **Spring Framework** by Chad Darby (Udemy)
- **Spring Boot Microservices** - Daily Code Buffer (YouTube)
- **Java Brains** - Spring Boot playlist (YouTube)
- **Amigoscode** - Spring Boot tutorials (YouTube)
- **Dan Vega** - Spring Boot content (YouTube)

### YouTube Channels:

- Java Brains
- Amigoscode
- Dan Vega
- Daily Code Buffer
- Telusko
- in28minutes

### Practice Platforms:

- Spring Academy (spring.academy)
- Baeldung tutorials
- GitHub spring-projects
- Spring Guides (spring.io/guides)

### Blogs & Websites:

- Baeldung (baeldung.com)
- Spring Blog (spring.io/blog)
- DZone Spring Zone
- Medium - Spring Boot articles
- Dev.to - Spring Boot content

### Communities:

- Spring Community Forum
- Stack Overflow (#spring-boot)
- Reddit (r/java, r/springframework)
- Discord - Java/Spring servers
- LinkedIn Spring Boot groups

## 📝 Learning Strategy

### Phase 1: Foundation (3-4 weeks)

**Week 1: Spring Core & Boot Basics**

- Spring IoC and DI
- Spring Boot project setup
- Basic REST API
- Configuration
- **Practice**: 15-20 hours

**Week 2: Spring Data JPA**

- Entity mapping
- Repositories
- Queries
- Relationships
- **Practice**: 15-20 hours

**Week 3: REST API Development**

- CRUD operations
- Validation
- Exception handling
- DTO mapping
- **Practice**: 20-25 hours

**Week 4: Project**

- Build complete REST API
- Testing
- Documentation
- **Practice**: 25-30 hours

### Phase 2: Intermediate (4-6 weeks)

**Weeks 1-2: Security**

- Spring Security
- JWT authentication
- Method security
- OAuth2
- **Practice**: 30-40 hours

**Weeks 3-4: Advanced Features**

- File upload
- Email sending
- Caching
- Scheduling
- Async processing
- **Practice**: 30-40 hours

**Weeks 5-6: Production Features**

- Actuator
- Logging
- Testing
- API documentation
- **Practice**: 40-50 hours

### Phase 3: Advanced (6-8 weeks)

**Weeks 1-3: Microservices**

- Service discovery
- API Gateway
- Feign clients
- Circuit breaker
- **Practice**: 50-60 hours

**Weeks 4-6: Advanced Topics**

- Reactive programming
- GraphQL
- Event-driven architecture
- Messaging (Kafka/RabbitMQ)
- **Practice**: 50-60 hours

**Weeks 7-8: Cloud & Deployment**

- Docker
- Kubernetes
- Cloud platforms (AWS/Azure/GCP)
- CI/CD
- **Practice**: 40-50 hours

### Phase 4: Expert (Ongoing)

- Production experience
- Performance tuning
- Architecture design
- Contributing to Spring ecosystem
- Teaching others
- Staying updated

এই comprehensive roadmap follow করে তুমি Spring Boot এ beginner থেকে expert level এ পৌঁছাতে পারবে। মনে রাখবে, Spring Boot একটা vast ecosystem - ধৈর্য এবং consistent practice সবচেয়ে গুরুত্বপূর্ণ।

**Key Takeaway:** প্রতিদিন code করো, projects বানাও, documentation পড়ো। Spring Boot শিখতে হলে hands-on practice এবং real-world projects essential।

যেকোনো specific Spring Boot topic নিয়ে বিস্তারিত জানতে চাইলে বা code examples দেখতে চাইলে বলো! 🚀☕
