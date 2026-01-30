# Git Projects

এই section এ আমরা ৫টি hands-on project এর মাধ্যমে Git এর practical application শিখব। প্রতিটি project আপনাকে real-world scenario তে Git ব্যবহার করতে শেখাবে।

---

## Project 1: Personal Portfolio Repo

### 🎯 Objectives

- Professional portfolio repository setup করা
- Best practices অনুসরণ করে documentation তৈরি করা
- GitHub Pages এ deploy করা
- Open source community standards maintain করা

### 📋 Prerequisites

- Git basic commands জানা
- GitHub account থাকা
- Basic HTML/CSS/JavaScript জানা (optional)

### 🚀 Step-by-Step Guide

#### Step 1: Repository তৈরি করুন

```bash
# Local এ নতুন directory তৈরি করুন
mkdir my-portfolio
cd my-portfolio

# Git initialize করুন
git init

# Initial commit
echo "# My Portfolio" > README.md
git add README.md
git commit -m "chore: initial commit"
```

#### Step 2: Professional README তৈরি করুন

একটি comprehensive README তৈরি করুন:

```markdown
# 👨‍💻 Your Name - Portfolio

![Profile Views](https://komarev.com/ghpvc/?username=yourusername&color=blue)
[![GitHub followers](https://img.shields.io/github/followers/yourusername?label=Follow&style=social)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/yourprofile)

## 🚀 About Me

Full Stack Developer passionate about building scalable web applications.
Currently working with Python, Django, React, and Docker.

## 🛠️ Tech Stack

**Languages:**  
![Python](https://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

**Frameworks:**  
![Django](https://img.shields.io/badge/-Django-092E20?style=flat&logo=django&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)

**Tools & Platforms:**  
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/-Git-F05032?style=flat&logo=git&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)

## 📊 GitHub Stats

![Your GitHub Stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=radical)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=yourusername&layout=compact&theme=radical)

## 🏆 Featured Projects

### [Project Name 1](https://github.com/yourusername/project1)

Brief description of the project and technologies used.

### [Project Name 2](https://github.com/yourusername/project2)

Brief description of the project and technologies used.

## 📫 Contact Me

- Email: your.email@example.com
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

#### Step 3: Project Structure তৈরি করুন

```bash
# Directory structure
mkdir -p {src,assets/{images,css,js},docs}

# Create files
touch index.html
touch assets/css/style.css
touch assets/js/main.js
touch .gitignore
touch LICENSE
```

#### Step 4: .gitignore File তৈরি করুন

```bash
# .gitignore
# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Dependencies
node_modules/
package-lock.json

# Build files
dist/
build/
*.log

# Environment variables
.env
.env.local
```

#### Step 5: License যোগ করুন

```bash
# MIT License তৈরি করুন
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
```

#### Step 6: GitHub এ Push করুন

```bash
# GitHub এ নতুন repository তৈরি করুন (GitHub web interface থেকে)
# তারপর local repository connect করুন

git remote add origin https://github.com/yourusername/my-portfolio.git
git branch -M main
git push -u origin main
```

#### Step 7: GitHub Pages Setup করুন

```bash
# gh-pages branch তৈরি করুন
git checkout -b gh-pages

# index.html তৈরি করুন
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Name - Portfolio</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header>
        <h1>Welcome to My Portfolio</h1>
        <p>Full Stack Developer</p>
    </header>
    <main>
        <section id="about">
            <h2>About Me</h2>
            <p>Your introduction here...</p>
        </section>
        <section id="projects">
            <h2>Projects</h2>
            <!-- Your projects -->
        </section>
        <section id="contact">
            <h2>Contact</h2>
            <!-- Contact form or info -->
        </section>
    </main>
    <script src="assets/js/main.js"></script>
</body>
</html>
EOF

# Commit এবং push করুন
git add .
git commit -m "feat: add portfolio website"
git push origin gh-pages

# GitHub Settings > Pages এ গিয়ে gh-pages branch select করুন
```

### ✅ Learning Outcomes

- ✓ Professional repository structure তৈরি করতে পারবেন
- ✓ Comprehensive README লিখতে পারবেন
- ✓ Badges এবং shields ব্যবহার করতে পারবেন
- ✓ GitHub Pages এ deploy করতে পারবেন
- ✓ Open source best practices follow করতে পারবেন

---

## Project 2: Implement Gitflow in a Team Project

### 🎯 Objectives

- Gitflow workflow বুঝা এবং implement করা
- Team collaboration এর জন্য branch strategy তৈরি করা
- Release management শেখা
- Hotfix process বুঝা

### 📋 Prerequisites

- Git branching এবং merging জানা
- Team environment এ কাজ করার experience
- Pull request process বুঝা

### 🚀 Step-by-Step Guide

#### Step 1: Gitflow Overview

**Branch Structure:**

```
main (production)
  └── develop (integration)
       ├── feature/user-auth
       ├── feature/payment-gateway
       └── feature/dashboard
  └── release/v1.0.0
  └── hotfix/critical-bug
```

#### Step 2: Repository Setup

```bash
# Repository clone করুন
git clone https://github.com/team/project.git
cd project

# Develop branch তৈরি করুন
git checkout -b develop
git push -u origin develop
```

#### Step 3: Feature Development

```bash
# Feature branch তৈরি করুন develop থেকে
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Development করুন
# ... code changes ...

# Commit করুন (atomic commits)
git add src/auth/
git commit -m "feat(auth): add login functionality"

git add src/auth/
git commit -m "feat(auth): add JWT token generation"

git add tests/auth/
git commit -m "test(auth): add login tests"

# Push করুন
git push -u origin feature/user-authentication
```

#### Step 4: Pull Request তৈরি করুন

GitHub/GitLab এ:

1. Pull Request তৈরি করুন `feature/user-authentication` → `develop`
2. Description লিখুন:

```markdown
## Description

Implements user authentication with JWT tokens

## Changes

- Added login endpoint
- Implemented JWT token generation
- Added password hashing
- Created authentication middleware

## Testing

- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed

## Screenshots

[Add relevant screenshots]

## Related Issues

Closes #123
```

3. Reviewer assign করুন
4. Review এবং merge করুন

#### Step 5: Release Preparation

```bash
# Release branch তৈরি করুন develop থেকে
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# Version bump করুন
# package.json, version files update করুন
echo "1.0.0" > VERSION

git add VERSION
git commit -m "chore(release): bump version to 1.0.0"

# Bug fixes (শুধু critical bugs)
# ... fix bugs ...
git commit -m "fix(release): resolve login redirect issue"

# Push করুন
git push -u origin release/v1.0.0
```

#### Step 6: Release Finalization

```bash
# Main এ merge করুন
git checkout main
git pull origin main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# Develop এ merge করুন (release এর bug fixes নিতে)
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop

# Release branch delete করুন
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

#### Step 7: Hotfix Process

```bash
# Production এ critical bug পাওয়া গেছে!
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-patch

# Fix করুন
# ... security patch ...
git add .
git commit -m "fix(security): patch XSS vulnerability"

# Version bump করুন
echo "1.0.1" > VERSION
git add VERSION
git commit -m "chore(hotfix): bump version to 1.0.1"

# Main এ merge করুন
git checkout main
git merge --no-ff hotfix/critical-security-patch
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main --tags

# Develop এ merge করুন
git checkout develop
git merge --no-ff hotfix/critical-security-patch
git push origin develop

# Hotfix branch delete করুন
git branch -d hotfix/critical-security-patch
git push origin --delete hotfix/critical-security-patch
```

### 📊 Gitflow Diagram

```
main     ─────●─────────────●────────●──────→
              │             │        │
              │         (merge)  (hotfix)
              │             │        │
develop  ─────●─────●───────●────────●──────→
              │     │       │
              │  (merge) (release)
              │     │
feature  ─────●─────●
         (branch) (merge)
```

### ✅ Learning Outcomes

- ✓ Gitflow workflow সম্পূর্ণভাবে বুঝতে পারবেন
- ✓ Feature, release, hotfix branches manage করতে পারবেন
- ✓ Team collaboration এ effective হতে পারবেন
- ✓ Release process automate করতে পারবেন

---

## Project 3: Automating Workflows with Git Hooks

### 🎯 Objectives

- Git hooks বুঝা এবং ব্যবহার করা
- Code quality automate করা
- Commit message validation করা
- Pre-push testing setup করা

### 📋 Prerequisites

- Git basic commands জানা
- Node.js এবং npm installed থাকা
- Basic shell scripting জানা

### 🚀 Step-by-Step Guide

#### Step 1: Husky Setup

```bash
# Project initialize করুন
npm init -y

# Husky install করুন
npm install --save-dev husky
npx husky install

# package.json এ script যোগ করুন
npm pkg set scripts.prepare="husky install"
```

#### Step 2: Pre-commit Hook (Code Formatting)

```bash
# Prettier install করুন
npm install --save-dev prettier

# Prettier config তৈরি করুন
cat > .prettierrc.json << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
EOF

# Pre-commit hook তৈরি করুন
npx husky add .husky/pre-commit "npx prettier --write ."
npx husky add .husky/pre-commit "git add -u"
```

#### Step 3: Pre-commit Hook (Linting)

```bash
# ESLint install করুন
npm install --save-dev eslint

# ESLint initialize করুন
npx eslint --init

# Pre-commit hook update করুন
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🎨 Running Prettier..."
npx prettier --write .

echo "🔍 Running ESLint..."
npx eslint . --fix

echo "✅ Adding formatted files..."
git add -u

echo "✨ Pre-commit checks passed!"
EOF

chmod +x .husky/pre-commit
```

#### Step 4: Commit-msg Hook (Message Validation)

```bash
# Commitlint install করুন
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Commitlint config তৈরি করুন
cat > commitlint.config.js << 'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'build',
        'revert'
      ]
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72]
  }
};
EOF

# Commit-msg hook তৈরি করুন
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

#### Step 5: Pre-push Hook (Testing)

```bash
# Jest install করুন (example)
npm install --save-dev jest

# package.json এ test script যোগ করুন
npm pkg set scripts.test="jest"

# Pre-push hook তৈরি করুন
cat > .husky/pre-push << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Push aborted."
  exit 1
fi

echo "✅ All tests passed! Proceeding with push..."
EOF

chmod +x .husky/pre-push
```

#### Step 6: Custom Hook - Branch Name Validation

```bash
# Pre-commit hook এ branch name validation যোগ করুন
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Get current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Valid branch name pattern
PATTERN="^(feature|bugfix|hotfix|release|docs|refactor|test|chore)\/[a-z0-9._-]+$"

if ! echo "$BRANCH" | grep -qE "$PATTERN"; then
  echo "❌ Invalid branch name: $BRANCH"
  echo "Branch name must follow pattern: type/description"
  echo "Valid types: feature, bugfix, hotfix, release, docs, refactor, test, chore"
  echo "Example: feature/user-authentication"
  exit 1
fi

echo "🎨 Running Prettier..."
npx prettier --write .

echo "🔍 Running ESLint..."
npx eslint . --fix

git add -u

echo "✅ Pre-commit checks passed!"
EOF
```

#### Step 7: Custom Hook - Prevent Commits to Main

```bash
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Prevent direct commits to main/master
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  echo "❌ Direct commits to $BRANCH are not allowed!"
  echo "Please create a feature branch and submit a pull request."
  exit 1
fi

# Rest of pre-commit checks...
echo "🎨 Running Prettier..."
npx prettier --write .

echo "🔍 Running ESLint..."
npx eslint . --fix

git add -u

echo "✅ Pre-commit checks passed!"
EOF
```

#### Step 8: Testing Hooks

```bash
# Test commit-msg hook
git commit -m "invalid message"  # Should fail

git commit -m "feat: add user authentication"  # Should pass

# Test pre-commit hook
# Make some changes
echo "console.log('test')" > test.js
git add test.js
git commit -m "feat: add test file"  # Should format and lint

# Test pre-push hook
git push origin feature/test-hooks  # Should run tests first
```

### 📁 Final Project Structure

```
project/
├── .husky/
│   ├── _/
│   ├── pre-commit
│   ├── commit-msg
│   └── pre-push
├── .prettierrc.json
├── .eslintrc.json
├── commitlint.config.js
├── package.json
└── src/
```

### ✅ Learning Outcomes

- ✓ Git hooks setup এবং customize করতে পারবেন
- ✓ Code quality automation করতে পারবেন
- ✓ Commit message validation করতে পারবেন
- ✓ Pre-push testing setup করতে পারবেন
- ✓ Custom hooks লিখতে পারবেন

---

## Project 4: Collaborative Open Source Contribution

### 🎯 Objectives

- Open source project এ contribute করা
- Fork এবং Pull Request workflow শেখা
- Code review process বুঝা
- Community guidelines follow করা

### 📋 Prerequisites

- Git এবং GitHub ভালো করে জানা
- একটি programming language এ comfortable থাকা
- Code review process বুঝা

### 🚀 Step-by-Step Guide

#### Step 1: Project খুঁজুন

**Good First Issue খুঁজুন:**

```bash
# GitHub এ search করুন
# label:good-first-issue language:python

# Popular repositories:
# - https://github.com/topics/good-first-issue
# - https://goodfirstissue.dev/
# - https://firstcontributions.github.io/
```

**Project Evaluation Checklist:**

- [ ] Active maintenance (recent commits)
- [ ] Clear CONTRIBUTING.md file
- [ ] Welcoming community
- [ ] Good documentation
- [ ] CI/CD setup
- [ ] Code of Conduct

#### Step 2: Fork এবং Clone

```bash
# GitHub এ repository fork করুন (web interface)

# Fork clone করুন
git clone https://github.com/YOUR_USERNAME/project-name.git
cd project-name

# Upstream remote যোগ করুন
git remote add upstream https://github.com/ORIGINAL_OWNER/project-name.git

# Verify remotes
git remote -v
# origin    https://github.com/YOUR_USERNAME/project-name.git (fetch)
# origin    https://github.com/YOUR_USERNAME/project-name.git (push)
# upstream  https://github.com/ORIGINAL_OWNER/project-name.git (fetch)
# upstream  https://github.com/ORIGINAL_OWNER/project-name.git (push)
```

#### Step 3: Development Environment Setup

```bash
# CONTRIBUTING.md পড়ুন
cat CONTRIBUTING.md

# Dependencies install করুন
# Python example:
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Tests run করুন
pytest

# Linting check করুন
flake8 .
black --check .
```

#### Step 4: Issue Select করুন এবং Claim করুন

```bash
# Issue তে comment করুন:
# "Hi! I'd like to work on this issue. Could you assign it to me?"

# Issue বুঝুন:
# - Problem কি?
# - Expected behavior কি?
# - কোন files change করতে হবে?
```

#### Step 5: Feature Branch তৈরি করুন

```bash
# Upstream থেকে latest changes নিন
git fetch upstream
git checkout main
git merge upstream/main

# Feature branch তৈরি করুন
git checkout -b fix/issue-123-button-alignment

# অথবা project এর convention অনুযায়ী
git checkout -b 123-fix-button-alignment
```

#### Step 6: Changes করুন

```bash
# Code change করুন
# ... make changes ...

# Tests লিখুন
# ... write tests ...

# Local এ test করুন
pytest tests/test_button.py

# Linting করুন
black .
flake8 .

# Commit করুন (atomic commits)
git add src/components/button.py
git commit -m "fix(ui): correct button alignment in header

- Adjusted padding to match design specs
- Fixed responsive behavior on mobile
- Added CSS flexbox for better alignment

Fixes #123"
```

#### Step 7: Push এবং Pull Request

```bash
# Push করুন
git push origin fix/issue-123-button-alignment

# GitHub এ Pull Request তৈরি করুন
```

**Pull Request Template:**

```markdown
## Description

Fixes button alignment issue in the header component.

## Related Issue

Fixes #123

## Changes Made

- Adjusted button padding to match design specifications
- Fixed responsive behavior on mobile devices
- Added flexbox for better alignment
- Updated relevant tests

## Screenshots

### Before

[Add screenshot]

### After

[Add screenshot]

## Testing

- [x] All existing tests pass
- [x] Added new tests for the changes
- [x] Tested on Chrome, Firefox, Safari
- [x] Tested on mobile devices
- [x] Linting passes

## Checklist

- [x] My code follows the project's style guidelines
- [x] I have performed a self-review of my code
- [x] I have commented my code where necessary
- [x] I have updated the documentation
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective
- [x] New and existing unit tests pass locally
```

#### Step 8: Code Review Process

**Review feedback পাওয়ার পর:**

```bash
# Feedback অনুযায়ী changes করুন
# ... make requested changes ...

# Commit করুন
git add .
git commit -m "refactor: apply code review suggestions

- Renamed variable for clarity
- Extracted magic numbers to constants
- Improved error handling"

# Push করুন (same branch এ)
git push origin fix/issue-123-button-alignment
# Pull Request automatically update হবে
```

**Common Review Feedback:**

- Code style issues
- Missing tests
- Documentation updates needed
- Performance concerns
- Edge cases not handled

#### Step 9: Sync with Upstream

```bash
# Upstream এ নতুন changes এসেছে
git fetch upstream
git checkout main
git merge upstream/main

# Feature branch এ rebase করুন
git checkout fix/issue-123-button-alignment
git rebase main

# Conflicts resolve করুন (যদি থাকে)
# ... resolve conflicts ...
git add .
git rebase --continue

# Force push করুন (rebase এর পরে)
git push --force-with-lease origin fix/issue-123-button-alignment
```

#### Step 10: Merge এবং Cleanup

```bash
# PR merge হওয়ার পরে

# Main branch update করুন
git checkout main
git pull upstream main
git push origin main

# Feature branch delete করুন
git branch -d fix/issue-123-button-alignment
git push origin --delete fix/issue-123-button-alignment
```

### 🎯 Contribution Tips

**DO's:**

- ✅ CONTRIBUTING.md পড়ুন
- ✅ Issue তে comment করে claim করুন
- ✅ Small, focused changes করুন
- ✅ Tests লিখুন
- ✅ Documentation update করুন
- ✅ Respectful এবং patient থাকুন

**DON'Ts:**

- ❌ বড় changes একসাথে করবেন না
- ❌ Tests ছাড়া PR submit করবেন না
- ❌ Style guide ignore করবেন না
- ❌ Review feedback এ defensive হবেন না

### ✅ Learning Outcomes

- ✓ Open source contribution process বুঝতে পারবেন
- ✓ Fork এবং PR workflow master করতে পারবেন
- ✓ Code review handle করতে পারবেন
- ✓ Community guidelines follow করতে পারবেন
- ✓ Professional collaboration skills develop করতে পারবেন

---

## Project 5: Set Up CI/CD with GitHub Actions

### 🎯 Objectives

- GitHub Actions দিয়ে CI/CD pipeline তৈরি করা
- Automated testing setup করা
- Build এবং deployment automate করা
- Workflow badges যোগ করা

### 📋 Prerequisites

- Git এবং GitHub ভালো করে জানা
- YAML syntax বুঝা
- Basic DevOps concepts জানা

### 🚀 Step-by-Step Guide

#### Step 1: Basic Workflow Setup

```bash
# Workflow directory তৈরি করুন
mkdir -p .github/workflows

# Basic CI workflow তৈরি করুন
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install -r requirements-dev.txt

    - name: Run linting
      run: |
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        black --check .

    - name: Run tests
      run: |
        pytest --cov=src --cov-report=xml

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml
EOF
```

#### Step 2: Multi-version Testing

<div v-pre>

```yaml
name: Test Multiple Versions

on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: ["3.9", "3.10", "3.11", "3.12"]

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest

      - name: Run tests
        run: pytest
```

</div>

#### Step 3: Build and Deploy Workflow

<div v-pre>

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'release'

    steps:
      - uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: dist/

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

</div>

#### Step 4: Docker Build and Push

<div v-pre>

```yaml
name: Docker Build and Push

on:
  push:
    branches: [main]
    tags: ["v*"]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

</div>

#### Step 5: Automated Release

<div v-pre>

```yaml
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Generate changelog
        id: changelog
        uses: metcalfc/changelog-generator@v4.0.1
        with:
          myToken: ${{ secrets.GITHUB_TOKEN }}

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: false

      - name: Build package
        run: |
          python -m pip install build
          python -m build

      - name: Publish to PyPI
        uses: pypa/gh-action-pypi-publish@release/v1
        with:
          password: ${{ secrets.PYPI_API_TOKEN }}
```

</div>

#### Step 6: Scheduled Workflows

<div v-pre>

```yaml
name: Nightly Tests

on:
  schedule:
    # Runs at 00:00 UTC every day
    - cron: "0 0 * * *"
  workflow_dispatch: # Manual trigger

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest

      - name: Run comprehensive tests
        run: pytest --slow --integration

      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Nightly tests failed',
              body: 'The nightly test run has failed. Please investigate.',
              labels: ['bug', 'automated']
            })
```

</div>

#### Step 7: Environment Variables and Secrets

<div v-pre>

```yaml
name: Deploy with Secrets

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to server
        env:
          API_KEY: ${{ secrets.API_KEY }}
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          echo "Deploying with API key: ${API_KEY:0:5}..."
          ./deploy.sh
```

</div>

**Secrets Setup:**

1. GitHub Repository → Settings → Secrets and variables → Actions
2. New repository secret যোগ করুন
3. Workflow এ <span v-pre>`${{ secrets.SECRET_NAME }}`</span> দিয়ে access করুন

#### Step 8: Status Badges

README.md এ badges যোগ করুন:

```markdown
# Project Name

![CI](https://github.com/username/repo/workflows/CI/badge.svg)
![Build](https://github.com/username/repo/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
[![License](https://img.shields.io/github/license/username/repo)](LICENSE)
[![Release](https://img.shields.io/github/v/release/username/repo)](https://github.com/username/repo/releases)
```

#### Step 9: Workflow Testing

```bash
# Commit এবং push করুন
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows"
git push origin main

# GitHub Actions tab এ check করুন
# https://github.com/username/repo/actions

# Workflow manually trigger করুন (যদি workflow_dispatch থাকে)
# Actions tab → Select workflow → Run workflow
```

#### Step 10: Advanced Workflow Features

**Conditional Jobs:**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production"
```

**Reusable Workflows:**

```yaml
# .github/workflows/reusable-test.yml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      python-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: ${{ inputs.python-version }}
      - run: pytest
```

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test-python-3-11:
    uses: ./.github/workflows/reusable-test.yml
    with:
      python-version: "3.11"
```

### 📁 Final Workflow Structure

```
.github/
└── workflows/
    ├── ci.yml                 # Continuous Integration
    ├── cd.yml                 # Continuous Deployment
    ├── docker.yml             # Docker build and push
    ├── release.yml            # Automated releases
    ├── nightly.yml            # Scheduled tests
    └── reusable-test.yml      # Reusable workflow
```

### ✅ Learning Outcomes

- ✓ GitHub Actions workflows তৈরি করতে পারবেন
- ✓ CI/CD pipeline setup করতে পারবেন
- ✓ Automated testing এবং deployment করতে পারবেন
- ✓ Secrets এবং environment variables manage করতে পারবেন
- ✓ Matrix builds এবং conditional jobs ব্যবহার করতে পারবেন
- ✓ Status badges integrate করতে পারবেন

---

## 🎓 Summary

এই ৫টি project complete করার পরে আপনি:

✅ **Professional portfolio** তৈরি করতে পারবেন  
✅ **Team workflows** (Gitflow) implement করতে পারবেন  
✅ **Automation** (Git Hooks) setup করতে পারবেন  
✅ **Open source** এ contribute করতে পারবেন  
✅ **CI/CD pipelines** তৈরি করতে পারবেন

এই skills আপনাকে একজন **professional developer** হিসেবে establish করতে সাহায্য করবে! 🚀

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Husky Documentation](https://typicode.github.io/husky/)
- [First Contributions](https://firstcontributions.github.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
