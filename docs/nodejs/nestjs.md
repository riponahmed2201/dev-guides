# NestJS Framework - Enterprise Node.js Development

NestJS হলো একটি progressive Node.js framework যা TypeScript-first এবং enterprise-level applications তৈরির জন্য ডিজাইন করা।

## কেন NestJS?

### Express এর সমস্যা:

- কোনো standard structure নেই
- TypeScript support limited
- Dependency injection নেই
- Testing করা কঠিন
- Large applications এ messy হয়ে যায়

### NestJS এর সুবিধা:

- ✅ TypeScript-first (built with TypeScript)
- ✅ Angular-inspired architecture
- ✅ Built-in Dependency Injection
- ✅ Modular architecture
- ✅ Powerful CLI
- ✅ Built-in testing support
- ✅ Microservices ready
- ✅ GraphQL, WebSockets support
- ✅ Excellent documentation

## Installation & Setup

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create new project
nest new my-project

# Navigate to project
cd my-project

# Start development server
npm run start:dev
```

## Project Structure

```
src/
├── app.controller.ts       # Controller
├── app.service.ts          # Service (Business logic)
├── app.module.ts           # Root module
└── main.ts                 # Entry point
```

## Core Concepts

### 1. Controllers

Controllers handle incoming requests এবং responses return করে।

```typescript
// cats.controller.ts
import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { CatsService } from "./cats.service";
import { CreateCatDto } from "./dto/create-cat.dto";

@Controller("cats")
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.catsService.findOne(+id);
  }
}
```

### 2. Services (Providers)

Services contain business logic।

```typescript
// cats.service.ts
import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
    return cat;
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findOne(id: number): Cat {
    return this.cats.find((cat) => cat.id === id);
  }
}
```

### 3. Modules

Modules organize code into cohesive blocks।

```typescript
// cats.module.ts
import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // Export to use in other modules
})
export class CatsModule {}
```

### 4. DTOs (Data Transfer Objects)

```typescript
// dto/create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

## Dependency Injection

NestJS এর সবচেয়ে powerful feature।

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  findAll() {
    return ["user1", "user2"];
  }
}

// auth.service.ts
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {} // Automatic injection

  validateUser(username: string) {
    const users = this.usersService.findAll();
    return users.includes(username);
  }
}
```

## Validation with Pipes

```bash
npm install class-validator class-transformer
```

```typescript
// dto/create-user.dto.ts
import { IsString, IsInt, IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  age: number;
}
```

```typescript
// main.ts
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Enable validation globally
  await app.listen(3000);
}
```

## Guards (Authentication)

```typescript
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any): boolean {
    // Your authentication logic
    return request.headers.authorization !== undefined;
  }
}
```

```typescript
// Using guard
@Controller("cats")
@UseGuards(AuthGuard)
export class CatsController {
  // All routes protected
}
```

## Interceptors

Request/Response transformation এর জন্য।

```typescript
// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Before...");
    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

## Database Integration (TypeORM)

```bash
npm install @nestjs/typeorm typeorm mysql2
```

```typescript
// app.module.ts
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "password",
      database: "test",
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

```typescript
// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
```

```typescript
// users.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async create(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }
}
```

## Prisma Integration

```bash
npm install @prisma/client
npm install -D prisma
npx prisma init
```

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## Configuration

```bash
npm install @nestjs/config
```

```typescript
// app.module.ts
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

```typescript
// Using config
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>("DATABASE_HOST");
  }
}
```

## Testing

```typescript
// cats.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { CatsService } from "./cats.service";

describe("CatsService", () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all cats", () => {
    const result = service.findAll();
    expect(result).toEqual([]);
  });
});
```

## CLI Commands

```bash
# Generate module
nest generate module cats

# Generate controller
nest generate controller cats

# Generate service
nest generate service cats

# Generate complete resource (CRUD)
nest generate resource cats

# Build
npm run build

# Start production
npm run start:prod
```

## Best Practices

1. **Module Organization**: Feature-based modules
2. **DTOs**: Always use DTOs for validation
3. **Services**: Keep business logic in services
4. **Guards**: Use for authentication/authorization
5. **Interceptors**: For logging, transformation
6. **Pipes**: For validation and transformation
7. **Exception Filters**: For custom error handling

---

> [!TIP]
> NestJS শেখার সবচেয়ে ভালো উপায় হলো official documentation follow করা এবং একটা complete CRUD application তৈরি করা।
