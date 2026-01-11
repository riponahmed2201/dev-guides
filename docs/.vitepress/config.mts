import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/dev-guides/',
  title: "Dev Guides Hub",
  description: "Comprehensive roadmaps for Python, Networking, and more.",
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Python', link: '/python/' },
      { text: 'Networking', link: '/networking/' },
      { text: 'Design Patterns', link: '/design-patterns/' },
      { text: 'Architecture', link: '/solution-architecture/' },
      { text: 'FastAPI', link: '/fastapi/' },
      { text: 'Django', link: '/django/' },
      { text: 'DRF', link: '/django-rest-framework/' }
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
            { text: 'Introduction', link: '/django/introduction' },
            { text: 'Environment Setup', link: '/django/basics' },
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
