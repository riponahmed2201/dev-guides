import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/dev-guides/',
  title: "Dev Guides Hub",
  description: "Comprehensive roadmaps for Python, Networking, and more.",
  ignoreDeadLinks: true,
  markdown: {
    attrs: {
      disable: true
    }
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Languages',
        items: [
          { text: 'Python', link: '/python/' },
          { text: 'Node.js', link: '/nodejs/' }
        ]
      },
      {
        text: 'Backend Frameworks',
        items: [
          { text: 'Django', link: '/django/' },
          { text: 'FastAPI', link: '/fastapi/' },
          { text: 'DRF', link: '/django-rest-framework/' }
        ]
      },
      {
        text: 'DevOps & Tools',
        items: [
          { text: 'Git', link: '/git/' },
          { text: 'Docker', link: '/docker/' },
          { text: 'Kafka', link: '/kafka/' },
          { text: 'RabbitMQ', link: '/rabbitmq/' }
        ]
      },
      {
        text: 'Architecture & Design',
        items: [
          { text: 'System Design', link: '/system-design/' },
          { text: 'Architecture', link: '/solution-architecture/' },
          { text: 'Design Patterns', link: '/design-patterns/' }
        ]
      },
      {
        text: 'CS Fundamentals',
        items: [
          { text: 'Operating System', link: '/os/' },
          { text: 'Networking', link: '/networking/' }
        ]
      }
    ],
    sidebar: {
      '/python/': [
        {
          text: 'Level 1: Beginner',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/python/' },
            { text: 'Basics & Setup', link: '/python/basics' },
            { text: 'Variables & Data Types', link: '/python/variables' },
            { text: 'Operators', link: '/python/operators' },
            { text: 'Strings', link: '/python/strings' },
            { text: 'Input/Output', link: '/python/io' },
            { text: 'Control Flow', link: '/python/control-flow' },
            { text: 'Loops', link: '/python/loops' },
            { text: 'Lists', link: '/python/lists' },
            { text: 'Tuples', link: '/python/tuples' },
            { text: 'Dictionaries', link: '/python/dictionaries' },
            { text: 'Sets', link: '/python/sets' },
            { text: 'Functions', link: '/python/functions' },
          ]
        },
        {
          text: 'Level 2: Intermediate',
          collapsed: true,
          items: [
            { text: 'Advanced Functions', link: '/python/advanced-functions' },
            { text: 'Modules & Packages', link: '/python/modules-packages' },
            { text: 'File Handling', link: '/python/file-handling' },
            { text: 'Exception Handling', link: '/python/exceptions' },
            { text: 'OOP Basics', link: '/python/oop-basics' },
            { text: 'OOP Intermediate', link: '/python/oop-intermediate' },
            { text: 'OOP Advanced', link: '/python/oop-advanced' },
            { text: 'Magic Methods', link: '/python/magic-methods' },
            { text: 'Iterators & Generators', link: '/python/iter-gen' },
            { text: 'Comprehensions', link: '/python/comprehensions' },
            { text: 'Regular Expressions', link: '/python/regex' },
          ]
        },
        {
          text: 'Level 3: Advanced',
          collapsed: true,
          items: [
            { text: 'Advanced Decorators', link: '/python/adv-decorators' },
            { text: 'Context Managers', link: '/python/context-managers' },
            { text: 'Dates & Time', link: '/python/datetime' },
            { text: 'Collections Module', link: '/python/collections' },
            { text: 'Functional Programming', link: '/python/functional' },
            { text: 'Type Hints', link: '/python/type-hints' },
            { text: 'Testing', link: '/python/testing' },
            { text: 'Logging', link: '/python/logging' },
            { text: 'Virtual Environments', link: '/python/venv' },
            { text: 'Package Management', link: '/python/packaging' },
          ]
        },
        {
          text: 'Level 4: Expert',
          collapsed: true,
          items: [
            { text: 'Concurrency', link: '/python/concurrency' },
            { text: 'Async Programming', link: '/python/async' },
            { text: 'Memory Management', link: '/python/memory' },
            { text: 'Metaclasses', link: '/python/metaclasses' },
            { text: 'Descriptors', link: '/python/descriptors' },
            { text: 'Performance Optimization', link: '/python/performance' },
            { text: 'Working with APIs', link: '/python/apis' },
            { text: 'Web Scraping', link: '/python/scraping' },
            { text: 'Databases', link: '/python/databases' },
            { text: 'Data Processing', link: '/python/data-processing' },
            { text: 'Networking', link: '/python/networking' },
            { text: 'System Programming', link: '/python/system' },
            { text: 'Security', link: '/python/security' },
            { text: 'Design Patterns', link: '/python/design-patterns' },
            { text: 'Code Quality', link: '/python/code-quality' },
            { text: 'Debugging', link: '/python/debugging' },
            { text: 'Advanced Topics', link: '/python/adv-topics' },
          ]
        }
      ],
      '/networking/': [
        {
          text: 'Level 1: Beginner',
          items: [
            { text: 'Networking Introduction', link: '/networking/' },
            { text: 'Networking Basics', link: '/networking/basics' },
            { text: 'Cables & Standards', link: '/networking/cables' },
            { text: 'OSI Model Deep-Dive', link: '/networking/osi-model' },
            { text: 'TCP/IP Model', link: '/networking/tcp-ip-model' },
            { text: 'IPv4 Addressing', link: '/networking/ipv4' },
            { text: 'Subnetting Basics', link: '/networking/subnetting' },
            { text: 'MAC Addressing', link: '/networking/mac-addressing' },
            { text: 'Network Commands', link: '/networking/commands' },
            { text: 'Network Ports', link: '/networking/ports' },
            { text: 'DNS Basics', link: '/networking/dns-basics' },
            { text: 'DHCP Basics', link: '/networking/dhcp-basics' },
            { text: 'Network Components', link: '/networking/components' },
          ]
        },
        {
          text: 'Level 2: Intermediate',
          collapsed: false,
          items: [
            { text: 'Advanced Subnetting', link: '/networking/advanced-subnetting' },
            { text: 'IPv6 Deep-Dive', link: '/networking/ipv6' },
            { text: 'Switching Concepts', link: '/networking/switching' },
            { text: 'VLANs & Trunking', link: '/networking/vlans' },
            { text: 'Spanning Tree (STP)', link: '/networking/stp' },
            { text: 'Link Aggregation (LACP)', link: '/networking/etherchannel' },
            { text: 'Routing Fundamentals', link: '/networking/routing-basics' },
            { text: 'Distance Vector (RIP/EIGRP)', link: '/networking/routing-distance-vector' },
            { text: 'Link-State (OSPF)', link: '/networking/routing-link-state' },
            { text: 'Path Vector (BGP)', link: '/networking/bgp-basics' },
            { text: 'Access Control Lists (ACL)', link: '/networking/acls' },
          ]
        }
      ],
      '/design-patterns/': [
        {
          text: 'Level 1: Foundation',
          items: [
            { text: 'Introduction', link: '/design-patterns/' },
            { text: 'OOP Fundamentals', link: '/design-patterns/oop-basics' },
            { text: 'SOLID Principles', link: '/design-patterns/solid' },
            { text: 'DRY, KISS, YAGNI', link: '/design-patterns/core-principles' },
          ]
        },
        {
          text: 'Level 2: Creational',
          collapsed: true,
          items: [
            { text: 'Singleton', link: '/design-patterns/singleton' },
            { text: 'Factory Method', link: '/design-patterns/factory' },
            { text: 'Builder', link: '/design-patterns/builder' },
          ]
        }
      ],
      '/solution-architecture/': [
        {
          text: 'Level 1: Foundation',
          items: [
            { text: 'Architecture Intro', link: '/solution-architecture/' },
            { text: 'SDLC & Agile', link: '/solution-architecture/sdlc' },
            { text: 'System Design Basics', link: '/solution-architecture/system-design' },
            { text: 'Cloud Intro', link: '/solution-architecture/cloud-intro' },
          ]
        }
      ],
      '/fastapi/': [
        {
          text: 'Level 1: Beginner',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/fastapi/' },
            { text: 'Routing & Endpoints', link: '/fastapi/routing' },
            { text: 'Pydantic Models', link: '/fastapi/pydantic' },
            { text: 'Response Handling', link: '/fastapi/response-handling' },
            { text: 'Request Data (Body/Query/Path)', link: '/fastapi/request-data' },
          ]
        },
        {
          text: 'Level 2: Intermediate',
          collapsed: true,
          items: [
            { text: 'Path Configuration', link: '/fastapi/path-configuration' },
            { text: 'Dependency Injection', link: '/fastapi/dependencies' },
            { text: 'Security & Auth', link: '/fastapi/security' },
            { text: 'Database (SQLAlchemy)', link: '/fastapi/database' },
            { text: 'Middlewares', link: '/fastapi/middleware' },
            { text: 'Error Handling', link: '/fastapi/error-handling' },
          ]
        },
        {
          text: 'Level 3: Advanced',
          collapsed: true,
          items: [
            { text: 'Advanced Pydantic', link: '/fastapi/pydantic-advanced' },
            { text: 'Testing (Pytest)', link: '/fastapi/testing' },
            { text: 'Performance & Scalability', link: '/fastapi/performance' },
            { text: 'WebSockets', link: '/fastapi/websockets' },
          ]
        },
        {
          text: 'Level 4: Expert',
          collapsed: true,
          items: [
            { text: 'App Architecture', link: '/fastapi/architecture' },
            { text: 'Deployment & DevOps', link: '/fastapi/deployment' },
            { text: 'API Best Practices', link: '/fastapi/best-practices' },
          ]
        },
        {
          text: 'Practical Projects',
          collapsed: false,
          items: [
            { text: 'Project 1: Task Manager API', link: '/fastapi/project-task-manager' },
            { text: 'Project 2: Contact App', link: '/fastapi/project-contact-app' },
            { text: 'Project 3: Blog Engine', link: '/fastapi/project-blog-engine' },
            { text: 'Project 4: Library System', link: '/fastapi/project-library-system' },
            { text: 'Project 5: Real-time Chat', link: '/fastapi/project-chat-app' },
          ]
        }
      ],
      '/django/': [
        {
          text: 'Level 1: Foundation',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/django/' },
            { text: 'Basics & Setup', link: '/django/basics' },
            { text: 'First Django Project', link: '/django/first-project' },
            { text: 'Django Apps', link: '/django/apps' },
            { text: 'URLs and Routing', link: '/django/routing' },
            { text: 'Views (FBV)', link: '/django/views' },
            { text: 'Templates Basics', link: '/django/templates' },
            { text: 'Models & ORM Basics', link: '/django/models-intro' },
            { text: 'Django Admin', link: '/django/admin' },
            { text: 'Forms Basics', link: '/django/forms' },
            { text: 'Static Files', link: '/django/static-files' },
          ]
        },
        {
          text: 'Level 2: Intermediate',
          collapsed: true,
          items: [
            { text: 'Models - Advanced Fields', link: '/django/models-advanced' },
            { text: 'Model Methods & Properties', link: '/django/model-methods' },
            { text: 'QuerySets & Database Queries', link: '/django/querysets' },
            { text: 'Advanced Queries & Optimization', link: '/django/advanced-queries' },
            { text: 'Model Relationships Deep Dive', link: '/django/model-relationships' },
            { text: 'Class Based Views (CBV)', link: '/django/views-cbv' },
            { text: 'Generic Views (CRUD)', link: '/django/views-generic' },
            { text: 'Forms Advanced & Formsets', link: '/django/forms-advanced' },
            { text: 'User Authentication & Login', link: '/django/authentication' },
            { text: 'User Registration & Custom Model', link: '/django/registration' },
            { text: 'Permissions & Authorization', link: '/django/permissions' },
            { text: 'Sessions Framework', link: '/django/sessions' },
            { text: 'Messages Framework', link: '/django/messages' },
            { text: 'Middleware', link: '/django/middleware' },
            { text: 'Django Signals', link: '/django/signals' },
            { text: 'Templates Advanced', link: '/django/templates-advanced' },
            { text: 'Email Sending', link: '/django/email-sending' },
            { text: 'Pagination', link: '/django/pagination' },
          ]
        },
        {
          text: 'Level 3: Advanced',
          collapsed: true,
          items: [
            { text: 'Custom User Model', link: '/django/custom-user-model' },
            { text: 'Introduction to DRF', link: '/django/drf-intro' },
            { text: 'DRF Serializers', link: '/django/drf-serializers' },
            { text: 'DRF Views & ViewSets', link: '/django/drf-views' },
            { text: 'DRF Authentication', link: '/django/drf-authentication' },
            { text: 'DRF Permissions', link: '/django/drf-permissions' },
            { text: 'DRF Advanced Topics', link: '/django/drf-advanced' },
            { text: 'Advanced File Uploads', link: '/django/file-uploads-advanced' },
            { text: 'Caching', link: '/django/caching' },
            { text: 'Database Optimization', link: '/django/database-optimization' },
            { text: 'Testing', link: '/django/testing' },
            { text: 'Advanced Testing', link: '/django/advanced-testing' },
            { text: 'Custom Management Commands', link: '/django/custom-commands' },
            { text: 'Celery Integration', link: '/django/celery-integration' },
            { text: 'WebSockets & Channels', link: '/django/websockets-channels' },
            { text: 'Full-Text Search', link: '/django/full-text-search' },
            { text: 'API Documentation', link: '/django/api-documentation' },
            { text: 'Background Jobs (RQ)', link: '/django/background-jobs' },
            { text: 'Multi-tenancy', link: '/django/multi-tenancy' },
            { text: 'Internationalization (i18n)', link: '/django/internationalization' },
            { text: 'Localization (l10n)', link: '/django/localization' },
          ]
        },
        {
          text: 'Level 4: Expert',
          collapsed: true,
          items: [
            { text: 'Security Best Practices', link: '/django/security-best-practices' },
            { text: 'Django Security Features', link: '/django/security-features' },
            { text: 'Database Transactions', link: '/django/database-transactions' },
            { text: 'Database Migrations Advanced', link: '/django/migrations-advanced' },
            { text: 'Custom Model Fields', link: '/django/custom-model-fields' },
            { text: 'Django Admin Customization', link: '/django/admin-customization' },
            { text: 'Performance Optimization', link: '/django/performance-optimization' },
            { text: 'Deployment Preparation', link: '/django/deployment-preparation' },
            { text: 'Deployment - Traditional', link: '/django/deployment-traditional' },
            { text: 'Deployment - Docker', link: '/django/deployment-docker' },
            { text: 'Deployment - Cloud Platforms', link: '/django/deployment-cloud' },
            { text: 'Scalability', link: '/django/scalability' },
            { text: 'GraphQL with Django', link: '/django/graphql' },
            { text: 'Django and Microservices', link: '/django/microservices' },
            { text: 'Logging and Monitoring', link: '/django/logging-monitoring' },
            { text: 'Content Management', link: '/django/content-management' },
            { text: 'E-commerce with Django', link: '/django/ecommerce' },
            { text: 'Django Packages Ecosystem', link: '/django/packages-ecosystem' },
            { text: 'Custom Middlewares Advanced', link: '/django/middleware-advanced' },
            { text: 'Database Routers', link: '/django/database-routers' },
            { text: 'Django Channels Advanced', link: '/django/channels-advanced' },
            { text: 'DRF Advanced', link: '/django/drf-advanced' },
            { text: 'Custom Template Backends', link: '/django/template-backends' },
            { text: 'Django Optimization Techniques', link: '/django/optimization-techniques' },
          ]
        }
      ],
      '/django-rest-framework/': [
        {
          text: 'Level 1: Foundation',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/django-rest-framework/' },
          ]
        },
        {
          text: 'Level 2: Intermediate',
          collapsed: true,
          items: []
        },
        {
          text: 'Level 3: Advanced',
          collapsed: true,
          items: []
        },
        {
          text: 'Level 4: Expert',
          collapsed: true,
          items: []
        }
      ],
      '/docker/': [
        {
          text: 'Level 1: Foundation',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/docker/' },
            { text: 'Containerization Fundamentals', link: '/docker/basics' },
            { text: 'Docker Introduction', link: '/docker/intro' },
            { text: 'Docker Architecture', link: '/docker/architecture' },
            { text: 'Docker Installation', link: '/docker/installation' },
            { text: 'Docker CLI Basics', link: '/docker/cli-basics' },
            { text: 'Working with Docker Images', link: '/docker/images' },
            { text: 'Docker Image Commands', link: '/docker/image-commands' },
            { text: 'Running Containers', link: '/docker/containers' },
            { text: 'Container Lifecycle', link: '/docker/lifecycle' },
            { text: 'Container Management', link: '/docker/container-management' },
            { text: 'Container Interaction', link: '/docker/interaction' },
            { text: 'Port Mapping', link: '/docker/ports' },
            { text: 'Environment Variables', link: '/docker/env-vars' },
            { text: 'Docker Hub', link: '/docker/hub' },
          ]
        },
        {
          text: 'Level 2: Intermediate',
          collapsed: true,
          items: [
            { text: 'Dockerfile Basics', link: '/docker/dockerfile-basics' },
            { text: 'Dockerfile Instructions 1', link: '/docker/dockerfile-instructions-p1' },
            { text: 'Dockerfile Instructions 2', link: '/docker/dockerfile-instructions-p2' },
            { text: 'Building Images', link: '/docker/build-images' },
            { text: 'Multi-Stage Builds', link: '/docker/multi-stage-builds' },
            { text: 'Docker Volumes', link: '/docker/volumes' },
            { text: 'Volume Commands', link: '/docker/volume-commands' },
            { text: 'Bind Mounts', link: '/docker/bind-mounts' },
            { text: 'Docker Networks', link: '/docker/networks' },
            { text: 'Network Commands', link: '/docker/network-commands' },
            { text: 'Container Networking', link: '/docker/container-networking' },
            { text: 'Docker Compose Intro', link: '/docker/compose-intro' },
            { text: 'Compose File Structure', link: '/docker/compose-structure' },
            { text: 'Compose Commands', link: '/docker/compose-commands' },
            { text: 'Compose Services', link: '/docker/compose-services' },
            { text: 'Compose Networks & Volumes', link: '/docker/compose-networks-volumes' },
            { text: 'Compose Advanced', link: '/docker/compose-advanced' },
            { text: 'Container Logs', link: '/docker/container-logs' },
            { text: 'Resource Management', link: '/docker/resource-management' },
          ]
        },
        {
          text: 'Level 3: Advanced',
          collapsed: true,
          items: [
            { text: 'Dockerfile Best Practices', link: '/docker/dockerfile-best-practices' },
            { text: '.dockerignore File', link: '/docker/dockerignore' },
            { text: 'Image Optimization', link: '/docker/image-optimization' },
            { text: 'Alpine Linux Images', link: '/docker/alpine' },
            { text: 'Distroless Images', link: '/docker/distroless' },
            { text: 'Security Basics', link: '/docker/security-basics' },
            { text: 'USER Instruction', link: '/docker/user-instruction' },
            { text: 'Security Scanning', link: '/docker/security-scanning' },
            { text: 'Docker Secrets', link: '/docker/secrets' },
            { text: 'Health Checks', link: '/docker/healthchecks' },
            { text: 'Docker Registry', link: '/docker/registry' },
            { text: 'Harbor Registry', link: '/docker/harbor' },
            { text: 'Tagging Strategy', link: '/docker/tagging-strategy' },
            { text: 'Docker Context', link: '/docker/context' },
            { text: 'Docker BuildKit', link: '/docker/buildkit' },
            { text: 'Cache Optimization', link: '/docker/cache-optimization' },
            { text: 'Docker Plugins', link: '/docker/plugins' },
            { text: 'Docker APIs', link: '/docker/apis' },
            { text: 'Monitoring Containers', link: '/docker/monitoring' },
            { text: 'Orchestration Intro', link: '/docker/orchestration-intro' },
          ]
        },
        {
          text: 'Level 4: Expert',
          collapsed: true,
          items: [
            { text: 'Docker Swarm Basics', link: '/docker/swarm-basics' },
            { text: 'Swarm Cluster Setup', link: '/docker/swarm-setup' },
            { text: 'Swarm Services', link: '/docker/swarm-services' },
            { text: 'Service Deployment', link: '/docker/swarm-deployment' },
            { text: 'Swarm Networks', link: '/docker/swarm-networks' },
            { text: 'Swarm Volumes', link: '/docker/swarm-volumes' },
            { text: 'Stack Deployment', link: '/docker/swarm-stack' },
            { text: 'Updates & Rollbacks', link: '/docker/swarm-updates' },
            { text: 'Secrets in Swarm', link: '/docker/swarm-secrets' },
            { text: 'Configs in Swarm', link: '/docker/swarm-configs' },
            { text: 'Service Constraints', link: '/docker/swarm-constraints' },
            { text: 'Docker vs Kubernetes', link: '/docker/docker-vs-k8s' },
            { text: 'Desktop Kubernetes', link: '/docker/desktop-k8s' },
            { text: 'Compose to Kubernetes', link: '/docker/compose-to-k8s' },
            { text: 'CI/CD with Docker', link: '/docker/cicd' },
            { text: 'Docker in Production', link: '/docker/production' },
            { text: 'Performance Tuning', link: '/docker/performance' },
          ]
        }
      ],
      '/nodejs/': [
        {
          text: 'Level 1: Foundation (Beginner)',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/nodejs/' },
            { text: 'Prerequisites & Setup', link: '/nodejs/prerequisites' },
            { text: 'JavaScript Fundamentals', link: '/nodejs/js-fundamentals' },
            { text: 'ES6+ Advanced JS', link: '/nodejs/es6-advanced' },
            { text: 'Core Concepts', link: '/nodejs/core-concepts' },
            { text: 'NPM & Packages', link: '/nodejs/npm' },
            { text: 'Built-in Modules', link: '/nodejs/built-in-modules' },
            { text: 'Beginner Projects', link: '/nodejs/beginner-projects' },
          ]
        },
        {
          text: 'Level 2: Intermediate',
          collapsed: true,
          items: [
            { text: 'Express.js Framework', link: '/nodejs/express' },
            { text: 'RESTful API Development', link: '/nodejs/rest-api' },
            { text: 'Database Integration', link: '/nodejs/database' },
            { text: 'Authentication & Security', link: '/nodejs/auth' },
            { text: 'Security Best Practices', link: '/nodejs/security' },
            { text: 'File Handling', link: '/nodejs/file-handling' },
            { text: 'Error Handling & Debugging', link: '/nodejs/error-handling' },
            { text: 'Intermediate Projects', link: '/nodejs/intermediate-projects' },
          ]
        },
        {
          text: 'Level 3: Advanced',
          collapsed: true,
          items: [
            { text: 'Advanced Express Patterns', link: '/nodejs/advanced-express' },
            { text: 'NestJS Framework', link: '/nodejs/nestjs' },
            { text: 'Prisma ORM', link: '/nodejs/prisma' },
            { text: 'Asynchronous Programming', link: '/nodejs/async-programming' },
            { text: 'Streams & Buffers', link: '/nodejs/streams-buffers' },
            { text: 'Real-time Communication', link: '/nodejs/realtime-communication' },
            { text: 'Testing & Quality Assurance', link: '/nodejs/testing-quality' },
            { text: 'API Documentation', link: '/nodejs/api-docs' },
            { text: 'Logging & Monitoring', link: '/nodejs/logging' },
            { text: 'Caching (Redis)', link: '/nodejs/caching' },
            { text: 'Background Jobs & Queues', link: '/nodejs/background-jobs' },
            { text: 'GraphQL', link: '/nodejs/graphql' },
          ]
        },
        {
          text: 'Level 4: Expert',
          collapsed: true,
          items: [
            { text: 'Microservices Architecture', link: '/nodejs/microservices' },
            { text: 'gRPC & tRPC', link: '/nodejs/grpc-trpc' },
            { text: 'Message Queues (RabbitMQ, Kafka)', link: '/nodejs/message-queues' },
            { text: 'Docker & Kubernetes', link: '/nodejs/docker-k8s' },
            { text: 'CI/CD & DevOps', link: '/nodejs/cicd' },
            { text: 'Cloud Platforms (AWS, Azure)', link: '/nodejs/cloud' },
            { text: 'Performance Optimization', link: '/nodejs/performance' },
            { text: 'Security Advanced', link: '/nodejs/security-advanced' },
            { text: 'TypeScript with Node.js', link: '/nodejs/typescript' },
            { text: 'System Design', link: '/nodejs/system-design' },
          ]
        }
      ],
      '/system-design/': [
        {
          text: 'HLD: Fundamentals',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/system-design/' },
            { text: 'Serverless vs Serverfull', link: '/system-design/step-1-fundamentals/serverless-serverfull' },
            { text: 'Scaling (Horizontal vs Vertical)', link: '/system-design/step-1-fundamentals/scaling' },
            { text: 'Threads & Pages', link: '/system-design/step-1-fundamentals/threads-pages' },
            { text: 'How the Web Works', link: '/system-design/step-1-fundamentals/how-web-works' },
          ]
        },
        {
          text: 'HLD: Databases',
          collapsed: false,
          items: [
            { text: 'SQL vs NoSQL Databases', link: '/system-design/step-2-databases/sql-nosql' },
            { text: 'In-Memory Databases (Redis)', link: '/system-design/step-2-databases/in-memory-dbs' },
            { text: 'Data Replication & Migration', link: '/system-design/step-2-databases/replication-migration' },
            { text: 'Data Partitioning & Sharding', link: '/system-design/step-2-databases/partitioning-sharding' },
          ]
        },
        {
          text: 'HLD: Consistency & Availability',
          collapsed: false,
          items: [
            { text: 'Consistency & its Levels', link: '/system-design/step-3-consistency-availability/consistency-levels' },
            { text: 'Isolation & its Levels (ACID)', link: '/system-design/step-3-consistency-availability/isolation-levels' },
            { text: 'CAP Theorem Deep-Dive', link: '/system-design/step-3-consistency-availability/cap-theorem' },
          ]
        },
        {
          text: 'HLD: Cache & CDNs',
          collapsed: false,
          items: [
            { text: 'What is Cache?', link: '/system-design/step-4-cache/cache-basics' },
            { text: 'Cache Write Policies', link: '/system-design/step-4-cache/write-policies' },
            { text: 'Cache Replacement Policies', link: '/system-design/step-4-cache/replacement-policies' },
            { text: 'Content Delivery Network (CDNs)', link: '/system-design/step-4-cache/cdn' },
          ]
        },
        {
          text: 'HLD: Networking',
          collapsed: false,
          items: [
            { text: 'TCP vs UDP', link: '/system-design/step-5-networking/tcp-udp' },
            { text: 'HTTP (1/2/3) & HTTPS', link: '/system-design/step-5-networking/http-https' },
            { text: 'Web Sockets', link: '/system-design/step-5-networking/websockets' },
            { text: 'WebRTC & Video Streaming', link: '/system-design/step-5-networking/webrtc-streaming' },
          ]
        },
        {
          text: 'HLD: Load Balancers & Proxies',
          collapsed: false,
          items: [
            { text: 'Load Balancing Algorithms', link: '/system-design/step-6-load-balancers/load-balancers' },
            { text: 'Consistent Hashing', link: '/system-design/step-6-load-balancers/consistent-hashing' },
            { text: 'Proxy & Reverse Proxy', link: '/system-design/step-6-load-balancers/proxies' },
            { text: 'Rate Limiting', link: '/system-design/step-6-load-balancers/rate-limiting' },
          ]
        },
        {
          text: 'HLD: Message Queues',
          collapsed: false,
          items: [
            { text: 'Asynchronous processing', link: '/system-design/step-7-message-queues/kafka-rabbitmq' },
            { text: 'Publishers - Subscriber Model', link: '/system-design/step-7-message-queues/pub-sub' },
          ]
        },
        {
          text: 'HLD: Microservices',
          collapsed: false,
          items: [
            { text: 'Why microservices?', link: '/system-design/step-8-microservices/monoliths-microservices' },
            { text: 'Failure Management', link: '/system-design/step-8-microservices/failure-management' },
            { text: 'Containerization (Docker)', link: '/system-design/step-8-microservices/containerization-docker' },
            { text: 'Migrating to Microservices', link: '/system-design/step-8-microservices/migration-strategy' },
          ]
        },
        {
          text: 'HLD: Monitoring & Logging',
          collapsed: false,
          items: [
            { text: 'Logging & Metrics', link: '/system-design/step-9-monitoring/logging-metrics' },
            { text: 'Anomaly Detection', link: '/system-design/step-9-monitoring/anomaly-detection' },
          ]
        },
        {
          text: 'HLD: Security',
          collapsed: false,
          items: [
            { text: 'Auth Tokens', link: '/system-design/step-10-security/auth-tokens' },
            { text: 'SSO & OAuth', link: '/system-design/step-10-security/sso-oauth' },
            { text: 'Access Control Lists', link: '/system-design/step-10-security/access-control' },
            { text: 'Encryption', link: '/system-design/step-10-security/encryption' },
          ]
        },
        {
          text: 'HLD: Tradeoffs',
          collapsed: false,
          items: [
            { text: 'Push vs Pull Architecture', link: '/system-design/step-11-tradeoffs/push-pull' },
            { text: 'Consistency vs Availability', link: '/system-design/step-11-tradeoffs/consistency-availability' },
            { text: 'SQL vs NoSQL Tradeoffs', link: '/system-design/step-11-tradeoffs/sql-nosql-tradeoff' },
            { text: 'Performance Tradeoffs', link: '/system-design/step-11-tradeoffs/latency-tradeoffs' },
          ]
        },
        {
          text: 'LLD: Low Level Design',
          collapsed: false,
          items: [
            { text: 'LLD Introduction', link: '/system-design/lld/' },
            { text: 'OOP & SOLID', link: '/system-design/lld/oop-solid' },
            { text: 'Design Patterns', link: '/system-design/lld/design-patterns' },
            { text: 'Concurrency & Thread Safety', link: '/system-design/lld/concurrency' },
            { text: 'UML Diagrams', link: '/system-design/lld/uml' },
            { text: 'API Design & Clean Code', link: '/system-design/lld/api-design' },
            { text: 'Practical LLD Problems', link: '/system-design/lld/problems/' },
          ]
        },
        {
          text: 'HLD: Practice',
          collapsed: false,
          items: [
            { text: 'Designing YouTube', link: '/system-design/step-12-practice/youtube' },
            { text: 'Designing Twitter', link: '/system-design/step-12-practice/twitter' },
            { text: 'Designing WhatsApp', link: '/system-design/step-12-practice/whatsapp' },
            { text: 'Designing Uber', link: '/system-design/step-12-practice/uber' },
          ]
        },
        {
          text: 'System Design Interview',
          collapsed: false,
          items: [
            { text: 'Interview Guide', link: '/system-design/interview/' },
            { text: 'Core Concepts Q&A', link: '/system-design/interview/core-concepts' },
            { text: 'Database & Storage', link: '/system-design/interview/database-storage' },
            { text: 'Database Scaling', link: '/system-design/interview/database-scaling' },
            { text: 'Caching & CDN', link: '/system-design/interview/caching' },
            { text: 'Networking', link: '/system-design/interview/networking' },
            { text: 'API Architecture & Design', link: '/system-design/interview/api-design' },
            { text: 'Asynchronous Systems', link: '/system-design/interview/asynchronous' },
            { text: 'System Design Tradeoffs', link: '/system-design/interview/tradeoffs' },
            { text: 'Distributed System Concepts', link: '/system-design/interview/distributed-systems' },
            { text: 'Microservices Patterns', link: '/system-design/interview/microservices' },
            { text: 'Big Data Processing', link: '/system-design/interview/big-data' },
            { text: 'Architectural Patterns', link: '/system-design/interview/architectural-patterns' },
            { text: 'Observability', link: '/system-design/interview/observability' },
            { text: 'System Security', link: '/system-design/interview/security' },
            { text: 'Interview Tips', link: '/system-design/interview/tips' },
          ]
        },
        {
          text: 'ডিজাইন প্রবলেমস (Design Problems)',
          collapsed: true,
          items: [
            { text: 'URL Shortener', link: '/system-design/interview/problems/url-shortener' },
            { text: 'WhatsApp', link: '/system-design/interview/problems/whatsapp' },
            { text: 'Instagram', link: '/system-design/interview/problems/instagram' },
            { text: 'Spotify', link: '/system-design/interview/problems/spotify' },
            { text: 'Youtube', link: '/system-design/interview/problems/youtube' },
            { text: 'Uber', link: '/system-design/interview/problems/uber' },
            { text: 'Twitter', link: '/system-design/interview/problems/twitter' },
            { text: 'Google Docs', link: '/system-design/interview/problems/google-docs' },
            { text: 'Proximity Service (Yelp)', link: '/system-design/interview/problems/proximity-service' },
            { text: 'Distributed Rate Limiter', link: '/system-design/interview/problems/rate-limiter' },
            { text: 'Web Crawler', link: '/system-design/interview/problems/web-crawler' },
            { text: 'Notification Service', link: '/system-design/interview/problems/notification-service' },
            { text: 'Distributed Key-Value Store', link: '/system-design/interview/problems/key-value-store' },
            { text: 'Distributed Job Scheduler', link: '/system-design/interview/problems/job-scheduler' },
            { text: 'Unique ID Generator', link: '/system-design/interview/problems/unique-id-generator' },
          ]
        }
      ],
      '/kafka/': [
        {
          text: 'Apache Kafka',
          collapsed: false,
          items: [
            { text: 'Kafka Roadmap', link: '/kafka/' },
            { text: 'Module 1: Introduction', link: '/kafka/introduction' },
            { text: 'Module 2: Components', link: '/kafka/components' },
            { text: 'Module 3: Installation', link: '/kafka/installation' },
            { text: 'Module 4: CLI', link: '/kafka/cli' },
            { text: 'Module 5: Configurations', link: '/kafka/configurations' },
            { text: 'Module 6: Architecture', link: '/kafka/architecture' },
            { text: 'Module 7: Performance', link: '/kafka/performance' },
            { text: 'Module 8: GUI Tools', link: '/kafka/gui-tools' },
            { text: 'Module 9: Security', link: '/kafka/security' },
            { text: 'Module 10: Multi-node Setup', link: '/kafka/multi-node-cluster' },
          ]
        }
      ],
      '/rabbitmq/': [
        {
          text: 'RabbitMQ',
          collapsed: false,
          items: [
            { text: 'RabbitMQ Roadmap', link: '/rabbitmq/' },
            { text: 'Module 1: Introduction', link: '/rabbitmq/introduction' },
            { text: 'Module 2: Installation', link: '/rabbitmq/installation' },
            { text: 'Module 3: Core Concepts', link: '/rabbitmq/core-concepts' },
            { text: 'Module 4: Exchanges & Routing', link: '/rabbitmq/exchanges-routing' },
            { text: 'Module 5: Message Patterns', link: '/rabbitmq/message-patterns' },
            { text: 'Module 6: Clustering', link: '/rabbitmq/clustering' },
            { text: 'Module 7: Management', link: '/rabbitmq/management-monitoring' },
            { text: 'Module 8: Security', link: '/rabbitmq/security' },
            { text: 'Module 9: Performance', link: '/rabbitmq/performance' },
            { text: 'Module 10: Best Practices', link: '/rabbitmq/best-practices' },
          ]
        }
      ],
      '/os/': [
        {
          text: 'Foundations',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/os/' },
            { text: 'Foundations', link: '/os/foundations' },
            { text: 'Processes & Threads', link: '/os/processes-threads' },
            { text: 'Concurrency & Synchronization', link: '/os/concurrency-sync' },
            { text: 'Memory Management', link: '/os/memory-management' },
            { text: 'File Systems & Storage', link: '/os/file-systems' },
            { text: 'I/O & Device Management', link: '/os/io-device-management' },
            { text: 'Security & Protection', link: '/os/security-protection' },
            { text: 'Distributed OS Concepts', link: '/os/distributed-concepts' },
            { text: 'Advanced Topics', link: '/os/advanced-topics' },
          ]
        },
        {
          text: 'Projects',
          collapsed: false,
          items: [
            { text: 'Write a Simple Shell', link: '/os/project-simple-shell' },
            { text: 'Implement a Virtual Memory Manager', link: '/os/project-vm-manager' },
            { text: 'Mini OS Kernel (Educational)', link: '/os/project-mini-kernel' },
            { text: 'Build a Process Scheduler Simulator', link: '/os/project-process-scheduler' },
            { text: 'File System Simulation Project', link: '/os/project-file-system' },
          ]
        },
        {
          text: 'Interview Preparation',
          collapsed: false,
          items: [
            { text: 'OS Fundamentals Q&A', link: '/os/interview-qa' },
            { text: 'Processes & Threads Q&A', link: '/os/interview-processes-threads' },
            { text: 'Deadlocks & Synchronization Q&A', link: '/os/interview-deadlocks' },
            { text: 'File System & Disk Q&A', link: '/os/interview-filesystem' },
            { text: 'Scheduling Case Studies', link: '/os/interview-scheduling-case-studies' },
          ]
        }
      ],
      '/git/': [
        {
          text: 'Level 1: Foundations',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/git/' },
            { text: 'Foundations', link: '/git/foundations' },
          ]
        },
        {
          text: 'Level 2: Core Concepts',
          collapsed: false,
          items: [
            { text: 'Branching & Merging', link: '/git/branching-merging' },
            { text: 'Remote Repositories', link: '/git/remote-repositories' },
          ]
        },
        {
          text: 'Level 3: Advanced Workflows',
          collapsed: false,
          items: [
            { text: 'Collaboration & Workflows', link: '/git/collaboration-workflows' },
          ]
        },
        {
          text: 'Level 4: Tips & Utilities',
          collapsed: false,
          items: [
            { text: 'Undoing & Cleaning', link: '/git/undoing-cleaning' },
          ]
        },
        {
          text: 'Level 5: Advanced Topics',
          collapsed: false,
          items: [
            { text: 'Advanced Git', link: '/git/advanced' },
          ]
        }
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/riponahmed2201' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/md-ripon-mia1' },
      { icon: 'youtube', link: 'https://youtube.com/@riponahmed2201' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Md. Ripon Mia'
    }
  }
})
