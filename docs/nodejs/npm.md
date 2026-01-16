# NPM & Package Management - Complete Guide

Node.js এর অন্যতম বড় শক্তি হলো এর বিশাল প্যাকেজ ইকোসিস্টেম। **NPM (Node Package Manager)** দিয়ে লাখ লাখ ready-made packages ব্যবহার করা যায়, যা development অনেক সহজ এবং দ্রুত করে।

## Table of Contents

1. **What is NPM?** - Introduction & Overview
2. **NPM Installation** - Setup & Verification
3. **package.json** - Project configuration
4. **Installing Packages** - Local & Global
5. **Dependencies** - Types & Management
6. **NPM Commands** - Complete reference
7. **Semantic Versioning** - Version management
8. **package-lock.json** - Lock file importance
9. **NPM Scripts** - Custom commands
10. **NPX** - Execute packages
11. **Publishing Packages** - Create & publish
12. **NPM Security** - Audits & best practices
13. **Alternative Package Managers** - Yarn, pnpm
14. **Monorepos & Workspaces**
15. **Best Practices** - Tips & tricks

---

## ১. What is NPM? - Introduction & Overview

### NPM মূলত তিনটি জিনিস:

1. **Registry** - World's largest software registry (2+ million packages)
2. **CLI Tool** - Command line interface for package management
3. **Website** - [npmjs.com](https://www.npmjs.com/) for browsing packages

### Why NPM is Important?

```
Without NPM:
❌ Write everything from scratch
❌ Reinvent the wheel
❌ More bugs & maintenance
❌ Slower development

With NPM:
✅ Reuse tested code
✅ Faster development
✅ Community support
✅ Automatic updates
✅ Dependency management
```

### NPM Statistics (2026)

- **2.5+ million** packages available
- **40+ billion** downloads per week
- **17+ million** developers worldwide
- **Largest** software registry in the world

### Common Use Cases

```javascript
// Date/Time manipulation
const dayjs = require('dayjs');

// HTTP requests
const axios = require('axios');

// Database ORM
const mongoose = require('mongoose');

// Web framework
const express = require('express');

// Testing
const jest = require('jest');
```

---

## ২. NPM Installation - Setup & Verification

### Check if Node.js & NPM are Installed

```bash
# Check Node.js version
node -v
# Output: v20.10.0

# Check NPM version
npm -v
# Output: 10.2.4
```

### Update NPM

```bash
# Update to latest version
npm install -g npm@latest

# Update to specific version
npm install -g npm@10.2.0
```

### NPM Configuration

```bash
# View all config settings
npm config list

# View specific setting
npm config get registry

# Set config
npm config set registry https://registry.npmjs.org/

# Set default author
npm config set init-author-name "Your Name"
npm config set init-author-email "you@example.com"

# Set default license
npm config set init-license "MIT"
```

---

## ৩. package.json - Project Configuration (Complete Guide)

### Creating package.json

```bash
# Interactive mode (asks questions)
npm init

# Quick mode (default values)
npm init -y

# Custom init
npm init --scope=@username
```

### Complete package.json Anatomy

```json
{
  // Basic Information
  "name": "my-awesome-app",
  "version": "1.0.0",
  "description": "An awesome Node.js application",
  "main": "index.js",
  "author": "Your Name <you@example.com>",
  "license": "MIT",
  
  // Keywords for NPM search
  "keywords": ["nodejs", "api", "rest"],
  
  // Repository information
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  },
  
  // Bug tracking
  "bugs": {
    "url": "https://github.com/username/repo/issues"
  },
  
  // Homepage
  "homepage": "https://github.com/username/repo#readme",
  
  // Entry points
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "bin": {
    "my-cli": "./bin/cli.js"
  },
  
  // Scripts
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "webpack --mode production",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  
  // Dependencies
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0"
  },
  
  // Development Dependencies
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "eslint": "^8.55.0"
  },
  
  // Peer Dependencies (for libraries)
  "peerDependencies": {
    "react": ">=16.8.0"
  },
  
  // Optional Dependencies
  "optionalDependencies": {
    "fsevents": "^2.3.3"
  },
  
  // Engines (specify required versions)
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  
  // OS restrictions
  "os": ["linux", "darwin"],
  
  // CPU restrictions
  "cpu": ["x64", "arm64"],
  
  // Private package (won't publish)
  "private": true,
  
  // Package bundling
  "bundledDependencies": ["package1"],
  
  // Files to include when publishing
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  
  // Directories
  "directories": {
    "lib": "src",
    "test": "tests"
  }
}
```

### Important Fields Explained

#### name
```json
"name": "my-package"

// Scoped package (for organizations)
"name": "@username/my-package"

// Rules:
// - Lowercase only
// - No spaces (use - or _)
// - URL-safe characters
// - Max 214 characters
```

#### version
```json
"version": "1.0.0"

// Format: MAJOR.MINOR.PATCH
// - MAJOR: Breaking changes
// - MINOR: New features (backward compatible)
// - PATCH: Bug fixes
```

#### scripts
```json
"scripts": {
  "start": "node index.js",           // npm start
  "dev": "nodemon index.js",          // npm run dev
  "test": "jest",                     // npm test
  "build": "webpack",                 // npm run build
  "lint": "eslint .",                 // npm run lint
  
  // Pre/Post hooks
  "prestart": "echo 'Starting...'",   // Runs before start
  "poststart": "echo 'Started!'",     // Runs after start
  
  // Lifecycle hooks
  "prepare": "npm run build",         // Before pack/publish
  "prepublishOnly": "npm test"       // Before publish
}
```

---

## ৪. Installing Packages - Complete Guide

### Local Installation (Default)

```bash
# Install single package
npm install express
npm i express              # Short form

# Install specific version
npm install express@4.18.0

# Install version range
npm install express@^4.18.0    # Compatible with 4.x
npm install express@~4.18.0    # Compatible with 4.18.x
npm install express@latest     # Latest version

# Install multiple packages
npm install express mongoose dotenv

# Install from GitHub
npm install username/repo
npm install username/repo#branch
npm install github:username/repo

# Install from URL
npm install https://github.com/user/repo/tarball/master

# Install local package (for testing)
npm install ../my-local-package
```

### Global Installation

```bash
# Install globally
npm install -g nodemon
npm i -g typescript

# List global packages
npm list -g --depth=0

# Update global package
npm update -g nodemon

# Uninstall global package
npm uninstall -g nodemon

# Global install location
npm root -g
# Output: /usr/local/lib/node_modules (Mac/Linux)
# Output: C:\Users\<user>\AppData\Roaming\npm\node_modules (Windows)
```

### When to Install Globally?

```
✅ Install Globally:
- Command-line tools (nodemon, typescript, eslint)
- Generators (create-react-app, vue-cli)
- Build tools you use across projects

❌ Don't Install Globally:
- Project dependencies
- Libraries used in your code
- Framework packages
```

---

## ৫. Dependencies - Types & Management

### 1. dependencies (Production)

যেসব packages production এ লাগে।

```bash
npm install express
npm i mongoose
```

```json
"dependencies": {
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "dotenv": "^16.3.1"
}
```

### 2. devDependencies (Development Only)

শুধু development/testing এ লাগে।

```bash
npm install --save-dev nodemon
npm i -D jest eslint prettier
```

```json
"devDependencies": {
  "nodemon": "^3.0.2",
  "jest": "^29.7.0",
  "eslint": "^8.55.0"
}
```

### 3. peerDependencies (For Libraries)

Library authors এর জন্য - যে packages user কে install করতে হবে।

```json
"peerDependencies": {
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0"
}
```

### 4. optionalDependencies

Optional packages - install না হলেও চলবে।

```json
"optionalDependencies": {
  "fsevents": "^2.3.3"  // Mac-only package
}
```

### 5. bundledDependencies

Package এর সাথে bundle করা হবে।

```json
"bundledDependencies": [
  "my-internal-package"
]
```

### Installing Based on Environment

```bash
# Install only production dependencies
npm install --production
npm install --omit=dev

# Install only devDependencies
npm install --only=dev

# Install all dependencies
npm install
```

---

## ৬. NPM Commands - Complete Reference

### Package Installation

```bash
# Install all dependencies from package.json
npm install
npm i

# Install and save to dependencies
npm install express
npm i express

# Install and save to devDependencies
npm install -D jest
npm i --save-dev jest

# Install globally
npm install -g nodemon
npm i -g typescript

# Install specific version
npm install express@4.18.0

# Install from git
npm install username/repo
```

### Package Removal

```bash
# Uninstall package
npm uninstall express
npm rm express              # Short form
npm un express              # Shorter

# Uninstall devDependency
npm uninstall -D jest

# Uninstall global package
npm uninstall -g nodemon
```

### Package Updates

```bash
# Check outdated packages
npm outdated

# Update all packages (respecting version ranges)
npm update

# Update specific package
npm update express

# Update to latest (ignoring version ranges)
npm install express@latest

# Interactive update (use npm-check-updates)
npx npm-check-updates -i
```

### Package Information

```bash
# List installed packages
npm list
npm ls

# List top-level packages only
npm list --depth=0

# List global packages
npm list -g --depth=0

# Show package details
npm view express
npm info express

# Show specific field
npm view express version
npm view express dependencies

# Show all versions
npm view express versions
```

### Package Search

```bash
# Search packages
npm search express
npm search "web framework"

# Find package maintainer
npm owner ls express
```

### Cache Management

```bash
# View cache location
npm cache dir

# Verify cache
npm cache verify

# Clean cache
npm cache clean --force
```

### NPM Configuration

```bash
# List all configs
npm config list
npm config ls

# Get specific config
npm config get registry

# Set config
npm config set registry https://registry.npmjs.org/

# Delete config
npm config delete key

# Edit config file
npm config edit
```

### NPM Scripts

```bash
# Run script
npm run script-name

# Special scripts (no 'run' needed)
npm start        # npm run start
npm test         # npm run test
npm stop         # npm run stop
npm restart      # npm run restart

# List available scripts
npm run

# Run multiple scripts
npm run build && npm run test

# Pass arguments to script
npm run test -- --coverage
```

### Package Publishing

```bash
# Login to NPM
npm login

# Check who you are
npm whoami

# Publish package
npm publish

# Publish scoped package
npm publish --access public

# Unpublish package (within 72 hours)
npm unpublish package-name@version

# Deprecate package version
npm deprecate package@version "Reason"
```

### Audit & Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force

# View detailed report
npm audit --json
```

### Miscellaneous

```bash
# Initialize package.json
npm init
npm init -y

# Run package binary
npm exec package-name
npx package-name

# Install with exact version (no ^ or ~)
npm install --save-exact express

# Rebuild native modules
npm rebuild

# Prune extraneous packages
npm prune

# Deduplicate dependencies
npm dedupe

# Create tarball
npm pack

# Install from tarball
npm install ./package.tgz
```

---

## ৭. Semantic Versioning (SemVer) - Complete Guide

### Version Format: MAJOR.MINOR.PATCH

```
Version: 4.18.2
         │  │  │
         │  │  └─ PATCH: Bug fixes
         │  └──── MINOR: New features (backward compatible)
         └─────── MAJOR: Breaking changes
```

### Version Examples

```
1.0.0 → 1.0.1   PATCH (bug fix)
1.0.0 → 1.1.0   MINOR (new feature)
1.0.0 → 2.0.0   MAJOR (breaking change)
```

### Version Ranges

```json
{
  "dependencies": {
    // Exact version
    "package1": "1.2.3",
    
    // Caret (^) - Compatible versions (default)
    // ^1.2.3 → >=1.2.3 <2.0.0
    "package2": "^1.2.3",
    
    // Tilde (~) - Patch updates only
    // ~1.2.3 → >=1.2.3 <1.3.0
    "package3": "~1.2.3",
    
    // Wildcard (*) - Any version
    "package4": "*",
    "package5": "1.x",      // 1.0.0 to 1.9.9
    "package6": "1.2.x",    // 1.2.0 to 1.2.9
    
    // Greater than
    "package7": ">1.2.3",
    "package8": ">=1.2.3",
    
    // Less than
    "package9": "<2.0.0",
    "package10": "<=2.0.0",
    
    // Range
    "package11": "1.2.3 - 2.3.4",
    "package12": ">=1.2.3 <2.0.0",
    
    // OR operator
    "package13": "1.0.0 || >=2.0.0",
    
    // Latest
    "package14": "latest",
    "package15": "next"
  }
}
```

### Understanding ^ (Caret) vs ~ (Tilde)

```
^1.2.3  allows:  1.2.3, 1.2.4, 1.3.0, 1.9.9
         blocks:  2.0.0, 0.2.3

~1.2.3  allows:  1.2.3, 1.2.4, 1.2.9
         blocks:  1.3.0, 2.0.0

Recommendation: Use ^ (caret) - it's the default
```

### Pre-release Versions

```
1.0.0-alpha      Alpha release
1.0.0-beta       Beta release
1.0.0-rc.1       Release candidate
1.0.0-next       Next version
```

### Best Practices

```json
{
  "dependencies": {
    // ✅ Good: Use ^ for flexibility
    "express": "^4.18.2",
    
    // ✅ Good: Use ~ for stability
    "mongoose": "~8.0.0",
    
    // ✅ Good: Exact version for critical packages
    "react": "18.2.0",
    
    // ❌ Bad: Don't use * or latest
    "bad-package": "*"
  }
}
```

---

## ৮. package-lock.json - Lock File Importance

### What is package-lock.json?

`package-lock.json` ঠিক **exact versions** এবং সম্পূর্ণ **dependency tree** lock করে রাখে।

### Why is it Important?

```
Without package-lock.json:
❌ Different versions installed on different machines
❌ "Works on my machine" problem
❌ Unexpected bugs in production

With package-lock.json:
✅ Exact same versions everywhere
✅ Reproducible builds
✅ Faster installs
✅ Same dependency tree
```

### Example

```json
// package.json
{
  "dependencies": {
    "express": "^4.18.0"  // Could install 4.18.0, 4.18.1, 4.18.2, etc.
  }
}

// package-lock.json
{
  "dependencies": {
    "express": {
      "version": "4.18.2",  // Exact version locked
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",
      "requires": {
        "body-parser": "1.20.1",  // Nested dependencies locked too
        "cookie": "0.5.0"
      }
    }
  }
}
```

### Best Practices

```bash
# ✅ Always commit package-lock.json to git
git add package-lock.json
git commit -m "Update dependencies"

# ✅ Use npm ci for clean installs (CI/CD)
npm ci  # Uses package-lock.json, faster & more reliable

# ❌ Never manually edit package-lock.json

# ❌ Don't delete package-lock.json
# (If you do, run npm install to regenerate)
```

### npm install vs npm ci

```bash
# npm install
- Updates package-lock.json if needed
- Installs packages
- Slower
- Use in development

# npm ci (Clean Install)
- Requires package-lock.json
- Deletes node_modules first
- Installs exact versions from lock file
- Faster
- Use in CI/CD
```

---

## ৯. NPM Scripts - Custom Commands (Advanced)

### Basic Scripts

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode production"
  }
}
```

```bash
# Run scripts
npm start          # Special: no 'run' needed
npm test           # Special: no 'run' needed
npm run dev
npm run build
```

### Pre & Post Hooks

```json
{
  "scripts": {
    "prestart": "echo 'Starting...'",
    "start": "node index.js",
    "poststart": "echo 'Started!'",
    
    "prebuild": "rm -rf dist",
    "build": "webpack",
    "postbuild": "echo 'Build complete!'"
  }
}
```

```bash
# When you run: npm start
# Executes in order:
# 1. prestart
# 2. start
# 3. poststart
```

### Passing Arguments

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

```bash
# Pass arguments after --
npm run test -- --coverage --watch

# Equivalent to:
jest --coverage --watch
```

### Environment Variables

```json
{
  "scripts": {
    "dev": "NODE_ENV=development nodemon index.js",
    "prod": "NODE_ENV=production node index.js",
    
    // Cross-platform (Windows compatible)
    "dev:cross": "cross-env NODE_ENV=development nodemon index.js"
  }
}
```

### Running Multiple Scripts

```json
{
  "scripts": {
    // Sequential (one after another)
    "build:all": "npm run build:css && npm run build:js",
    
    // Parallel (at the same time)
    "watch": "npm run watch:css & npm run watch:js",
    
    // Using npm-run-all
    "build": "npm-run-all build:*",
    "watch": "npm-run-all --parallel watch:*"
  }
}
```

### Advanced Examples

```json
{
  "scripts": {
    // Development
    "dev": "nodemon -r dotenv/config index.js",
    "dev:debug": "nodemon --inspect index.js",
    
    // Building
    "build": "npm run clean && npm run build:ts && npm run build:copy",
    "build:ts": "tsc",
    "build:copy": "cp package.json dist/",
    "clean": "rm -rf dist",
    
    // Testing
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage",
    
    // Linting & Formatting
    "lint": "eslint . --ext .js,.ts",
    "lint:fix": "eslint . --ext .js,.ts --fix",
    "format": "prettier --write \"**/*.{js,ts,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,ts,json,md}\"",
    
    // Type checking
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    
    // Pre-commit
    "precommit": "npm run lint && npm run test",
    
    // Deployment
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    
    // Database
    "db:migrate": "sequelize-cli db:migrate",
    "db:seed": "sequelize-cli db:seed:all",
    "db:reset": "sequelize-cli db:drop && sequelize-cli db:create && npm run db:migrate",
    
    // Docker
    "docker:build": "docker build -t myapp .",
    "docker:run": "docker run -p 3000:3000 myapp",
    
    // Utilities
    "version": "npm version patch",
    "postversion": "git push && git push --tags"
  }
}
```

---

Due to length, I'll continue with the remaining sections (NPX, Publishing, Security, etc.) in the final version. Should I complete the file with all remaining sections?
