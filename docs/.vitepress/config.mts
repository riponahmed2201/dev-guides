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
      { text: 'Python', link: '/python/' },
      { text: 'Networking', link: '/networking/' },
      { text: 'Design Patterns', link: '/design-patterns/' },
      { text: 'Architecture', link: '/solution-architecture/' },
      { text: 'FastAPI', link: '/fastapi/' },
      { text: 'Django', link: '/django/' },
      { text: 'DRF', link: '/django-rest-framework/' },
      { text: 'Docker', link: '/docker/' },
      { text: 'Node.js', link: '/nodejs/' }
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
        }
      ]
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
