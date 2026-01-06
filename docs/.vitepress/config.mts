import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/dev-guides/',
  title: "Python Essential Guide",
  description: "Comprehensive roadmaps for Python, Networking, and more.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Roadmaps', link: '/python/' }
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
