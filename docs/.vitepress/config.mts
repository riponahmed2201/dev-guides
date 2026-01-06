import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/dev-guides/',
  title: "Dev Guides Hub",
  description: "Comprehensive roadmaps for Python, Networking, and more.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Python', link: '/python/' },
      { text: 'Networking', link: '/networking/' },
      { text: 'Design Patterns', link: '/design-patterns/' },
      { text: 'Architecture', link: '/solution-architecture/' }
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
            { text: 'Network Components', link: '/networking/components' },
            { text: 'OSI Model', link: '/networking/osi-model' },
            { text: 'TCP/IP Model', link: '/networking/tcp-ip-model' },
            { text: 'IPv4 Addressing', link: '/networking/ipv4' },
            { text: 'Subnetting Basics', link: '/networking/subnetting' },
          ]
        },
        {
          text: 'Level 2: Intermediate',
          collapsed: true,
          items: [
            { text: 'Advanced Subnetting', link: '/networking/adv-subnetting' },
            { text: 'IPv6', link: '/networking/ipv6' },
            { text: 'Switching Concepts', link: '/networking/switching' },
            { text: 'VLANs', link: '/networking/vlans' },
            { text: 'OSPF & Routing', link: '/networking/routing' },
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
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present'
    }
  }
})
