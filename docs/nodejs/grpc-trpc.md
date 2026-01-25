# gRPC & tRPC - Modern RPC Frameworks

## Part 1: gRPC (Google Remote Procedure Call)

### gRPC কী?

gRPC হলো Google এর তৈরি একটি high-performance RPC (Remote Procedure Call) framework যা HTTP/2 এবং Protocol Buffers ব্যবহার করে।

### REST vs gRPC

| Feature         | REST     | gRPC                      |
| --------------- | -------- | ------------------------- |
| Protocol        | HTTP/1.1 | HTTP/2                    |
| Data Format     | JSON     | Protocol Buffers (Binary) |
| Performance     | Slower   | Faster (10x)              |
| Streaming       | Limited  | Full support              |
| Browser Support | Full     | Limited                   |
| Type Safety     | No       | Yes                       |

### gRPC এর সুবিধা:

- ✅ **High Performance**: Binary format, HTTP/2
- ✅ **Streaming**: Server, Client, Bidirectional
- ✅ **Type Safety**: Strong typing with protobuf
- ✅ **Code Generation**: Auto-generate client/server code
- ✅ **Multi-language**: Support for many languages
- ✅ **Microservices**: Perfect for service-to-service communication

## gRPC Setup in Node.js

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

### Define Proto File

```protobuf
// user.proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
  rpc ListUsers (Empty) returns (stream UserResponse);
  rpc CreateUser (CreateUserRequest) returns (UserResponse);
}

message UserRequest {
  int32 id = 1;
}

message UserResponse {
  int32 id = 1;
  string name = 2;
  string email = 3;
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message Empty {}
```

### gRPC Server

```typescript
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.join(__dirname, "user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;

// Mock database
const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

// Implement service methods
const getUser = (call: any, callback: any) => {
  const user = users.find((u) => u.id === call.request.id);
  if (user) {
    callback(null, user);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "User not found",
    });
  }
};

const listUsers = (call: any) => {
  users.forEach((user) => {
    call.write(user);
  });
  call.end();
};

const createUser = (call: any, callback: any) => {
  const newUser = {
    id: users.length + 1,
    name: call.request.name,
    email: call.request.email,
  };
  users.push(newUser);
  callback(null, newUser);
};

// Create and start server
const server = new grpc.Server();

server.addService(userProto.UserService.service, {
  getUser,
  listUsers,
  createUser,
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`gRPC server running on port ${port}`);
    server.start();
  },
);
```

### gRPC Client

```typescript
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = path.join(__dirname, "user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;

const client = new userProto.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure(),
);

// Unary call
client.getUser({ id: 1 }, (error: any, response: any) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("User:", response);
});

// Server streaming
const call = client.listUsers({});
call.on("data", (user: any) => {
  console.log("Received user:", user);
});
call.on("end", () => {
  console.log("Stream ended");
});

// Create user
client.createUser(
  { name: "New User", email: "new@example.com" },
  (error: any, response: any) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("Created user:", response);
  },
);
```

### Streaming Types

#### 1. Server Streaming

```protobuf
rpc ListUsers (Empty) returns (stream UserResponse);
```

#### 2. Client Streaming

```protobuf
rpc CreateUsers (stream CreateUserRequest) returns (UserResponse);
```

#### 3. Bidirectional Streaming

```protobuf
rpc Chat (stream Message) returns (stream Message);
```

---

## Part 2: tRPC (TypeScript RPC)

### tRPC কী?

tRPC হলো একটি TypeScript-first RPC framework যা end-to-end type safety প্রদান করে **without code generation**।

### tRPC এর সুবিধা:

- ✅ **Full Type Safety**: Frontend to Backend
- ✅ **No Code Generation**: Direct TypeScript inference
- ✅ **Auto-completion**: Excellent DX
- ✅ **Small Bundle Size**: Lightweight
- ✅ **Easy to Learn**: Simple API
- ✅ **React Query Integration**: Built-in

## tRPC Setup

```bash
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod
```

### Backend (tRPC Server)

```typescript
// server/trpc.ts
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

```typescript
// server/routers/user.ts
import { router, publicProcedure } from "../trpc";
import { z } from "zod";

const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export const userRouter = router({
  // Get all users
  list: publicProcedure.query(() => {
    return users;
  }),

  // Get user by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const user = users.find((u) => u.id === input.id);
      if (!user) throw new Error("User not found");
      return user;
    }),

  // Create user
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(({ input }) => {
      const newUser = {
        id: users.length + 1,
        ...input,
      };
      users.push(newUser);
      return newUser;
    }),

  // Update user
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
      }),
    )
    .mutation(({ input }) => {
      const user = users.find((u) => u.id === input.id);
      if (!user) throw new Error("User not found");

      if (input.name) user.name = input.name;
      if (input.email) user.email = input.email;

      return user;
    }),

  // Delete user
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const index = users.findIndex((u) => u.id === input.id);
      if (index === -1) throw new Error("User not found");

      users.splice(index, 1);
      return { success: true };
    }),
});
```

```typescript
// server/routers/_app.ts
import { router } from "../trpc";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
```

### Express Integration

```typescript
// server/index.ts
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers/_app";

const app = express();

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  }),
);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

### Frontend (React + tRPC Client)

```typescript
// client/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();
```

```typescript
// client/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';
import { useState } from 'react';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

```typescript
// client/UserList.tsx
import { trpc } from './trpc';

function UserList() {
  // Query
  const { data: users, isLoading } = trpc.user.list.useQuery();

  // Mutation
  const createUser = trpc.user.create.useMutation();

  const handleCreate = async () => {
    await createUser.mutateAsync({
      name: 'New User',
      email: 'new@example.com',
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create User</button>
      <ul>
        {users?.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## When to Use What?

### Use gRPC when:

- Microservices communication
- High performance needed
- Streaming required
- Multi-language support needed
- Internal APIs

### Use tRPC when:

- TypeScript monorepo
- Full-stack TypeScript project
- Need type safety
- React/Next.js frontend
- Rapid development

---

> [!TIP]
> gRPC perfect for microservices, tRPC perfect for full-stack TypeScript apps!
