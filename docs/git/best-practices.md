# Git Best Practices

Git শুধুমাত্র একটি টুল নয়, এটি একটি দর্শন। সঠিক প্রাকটিস অনুসরণ করলে আপনার কোডবেস হবে পরিষ্কার, maintainable এবং collaborative। এই সেকশনে আমরা শিখব কিভাবে professional-level Git workflow maintain করতে হয়।

## 1. Commit Message Conventions

### কেন গুরুত্বপূর্ণ?

ভালো commit message:

- **History readable** করে
- **Code review** সহজ করে
- **Debugging** দ্রুত করে
- **Automation** সম্ভব করে (changelog generation, semantic versioning)

### Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type (Required)

| Type       | বর্ণনা                            | উদাহরণ                                     |
| ---------- | --------------------------------- | ------------------------------------------ |
| `feat`     | নতুন feature                      | `feat(auth): add JWT authentication`       |
| `fix`      | Bug fix                           | `fix(api): handle null response`           |
| `docs`     | Documentation only                | `docs(readme): update installation steps`  |
| `style`    | Code formatting (no logic change) | `style: format with prettier`              |
| `refactor` | Code restructuring                | `refactor(db): optimize query performance` |
| `test`     | Test addition/modification        | `test(user): add unit tests for signup`    |
| `chore`    | Build/tool changes                | `chore: update dependencies`               |
| `perf`     | Performance improvement           | `perf(api): reduce response time`          |
| `ci`       | CI/CD changes                     | `ci: add GitHub Actions workflow`          |
| `build`    | Build system changes              | `build: configure webpack`                 |
| `revert`   | Revert previous commit            | `revert: revert "feat: add feature X"`     |

#### Scope (Optional)

কোন module/component এ change হয়েছে:

```bash
feat(auth): add password reset
fix(payment): resolve stripe webhook issue
docs(api): update endpoint documentation
```

#### Subject Line Rules

1. **50 characters বা কম** রাখুন
2. **Imperative mood** ব্যবহার করুন ("add" not "added" or "adds")
3. **Capitalize** করুন প্রথম letter
4. **Period (.) দিয়ে শেষ করবেন না**
5. **What এবং Why** বলুন, How নয়

**✅ Good Examples:**

```bash
feat(user): add email verification
fix(cart): prevent duplicate items
docs: update contributing guidelines
refactor(api): simplify error handling
```

**❌ Bad Examples:**

```bash
fixed bug                          # খুব vague
Added new feature for users.       # Period দিয়ে শেষ
updated files                      # কোন context নেই
WIP                               # meaningless
```

#### Body (Optional but Recommended)

- **72 characters** এ wrap করুন প্রতি line
- **What এবং Why** explain করুন
- **Blank line** দিয়ে subject থেকে আলাদা করুন

```bash
feat(auth): implement OAuth2 login

Add support for Google and GitHub OAuth providers.
This allows users to sign in without creating a new password,
improving user experience and reducing friction.

- Integrated passport.js for OAuth handling
- Added callback routes for each provider
- Updated user model to store OAuth tokens
```

#### Footer (Optional)

Breaking changes এবং issue references:

```bash
fix(api): change response format

BREAKING CHANGE: API now returns data in camelCase instead of snake_case.
Clients need to update their parsers accordingly.

Fixes #123
Closes #456
Refs #789
```

### Tools for Enforcement

#### Commitlint

```bash
# Install
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Configure (commitlint.config.js)
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

#### Husky (Git Hooks)

```bash
# Install
npm install --save-dev husky

# Setup
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

এখন প্রতিটি commit message automatically validate হবে!

---

## 2. Branch Naming Conventions

### Standard Prefixes

```
<type>/<issue-number>-<short-description>
```

#### Common Prefixes

| Prefix      | Purpose               | Example                              |
| ----------- | --------------------- | ------------------------------------ |
| `feature/`  | নতুন feature          | `feature/123-user-authentication`    |
| `bugfix/`   | Bug fix               | `bugfix/456-fix-login-error`         |
| `hotfix/`   | Production urgent fix | `hotfix/789-critical-security-patch` |
| `release/`  | Release preparation   | `release/v2.0.0`                     |
| `docs/`     | Documentation         | `docs/update-api-guide`              |
| `refactor/` | Code refactoring      | `refactor/optimize-database-queries` |
| `test/`     | Test addition         | `test/add-integration-tests`         |
| `chore/`    | Maintenance tasks     | `chore/update-dependencies`          |

### Naming Best Practices

**✅ Good Branch Names:**

```bash
feature/user-profile-page
bugfix/fix-payment-validation
hotfix/security-vulnerability-cve-2024
release/v1.2.0
docs/add-deployment-guide
refactor/simplify-auth-logic
```

**❌ Bad Branch Names:**

```bash
new-feature              # কোন context নেই
fix                      # খুব vague
john-working-branch      # personal, not descriptive
temp                     # meaningless
branch-1                 # no information
```

### Integration with Issue Trackers

```bash
# Jira
feature/PROJ-123-add-user-dashboard

# GitHub Issues
bugfix/456-fix-memory-leak

# GitLab
feature/789-implement-search
```

### Team Conventions

আপনার team এর সাথে agree করুন:

```bash
# Option 1: Prefix with username
ripon/feature/user-auth

# Option 2: Environment-specific
staging/feature/new-api
production/hotfix/critical-bug

# Option 3: Component-based
frontend/feature/dashboard
backend/bugfix/api-error
```

---

## 3. Atomic Commits

### Definition

**Atomic Commit** = একটি commit = একটি logical change

### কেন Atomic Commits?

1. **Easy Code Review:** ছোট, focused changes review করা সহজ
2. **Better Git History:** প্রতিটি commit একটি story বলে
3. **Easy Debugging:** `git bisect` দিয়ে bug খুঁজে পাওয়া সহজ
4. **Safe Revert:** শুধু problematic change revert করা যায়
5. **Cherry-pick Friendly:** নির্দিষ্ট feature অন্য branch এ নেওয়া সহজ

### Examples

**❌ Non-Atomic (Bad):**

```bash
# একটি commit এ অনেক কিছু
git commit -m "Add user auth, fix bug in payment, update docs, refactor database"
```

এই commit এ:

- নতুন feature (auth)
- Bug fix (payment)
- Documentation
- Refactoring

**✅ Atomic (Good):**

```bash
# আলাদা আলাদা commits
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(payment): handle null payment method"
git commit -m "docs: update API documentation"
git commit -m "refactor(db): optimize user queries"
```

### How to Create Atomic Commits

#### 1. Interactive Staging (`git add -p`)

```bash
# File এর specific parts stage করুন
git add -p src/auth.js

# Options:
# y - stage this hunk
# n - don't stage
# s - split into smaller hunks
# e - manually edit the hunk
```

#### 2. Commit Frequently

```bash
# প্রতিটি logical change এ commit করুন
git add src/auth.js
git commit -m "feat(auth): add login function"

git add src/auth.js
git commit -m "feat(auth): add logout function"

git add tests/auth.test.js
git commit -m "test(auth): add login tests"
```

#### 3. Split Large Changes

যদি অনেক changes একসাথে করে ফেলেন:

```bash
# Reset to unstage everything
git reset

# Stage এবং commit করুন একটি একটি করে
git add src/feature1.js
git commit -m "feat: implement feature 1"

git add src/feature2.js
git commit -m "feat: implement feature 2"
```

### Atomic Commit Checklist

প্রতিটি commit এর জন্য নিজেকে জিজ্ঞাসা করুন:

- [ ] এই commit কি **একটি মাত্র** logical change represent করে?
- [ ] Commit message কি **clearly** describe করে কি change হয়েছে?
- [ ] এই commit কি **independently** revert করা যাবে?
- [ ] Code কি এই commit এর পরে **working state** এ আছে?
- [ ] Related tests কি এই commit এ **included** আছে?

---

## 4. Maintaining a Clean Git History

### কেন Clean History?

- **Easy Navigation:** History browse করা সহজ
- **Better Understanding:** নতুন developer দের onboarding সহজ
- **Professional:** Open source project এ contribute করার জন্য essential

### Techniques

#### 1. Interactive Rebase

```bash
# শেষ 5 commits edit করুন
git rebase -i HEAD~5
```

**Options:**

```bash
pick abc1234 feat: add feature A
reword def5678 fix: typo in commit message
edit ghi9012 feat: add feature B
squash jkl3456 feat: improve feature B
fixup mno7890 fix: minor bug in feature B
drop pqr1234 WIP: temporary changes
```

| Command  | কাজ                                                  |
| -------- | ---------------------------------------------------- |
| `pick`   | Commit রাখুন যেমন আছে                                |
| `reword` | Commit message edit করুন                             |
| `edit`   | Commit এ changes করুন                                |
| `squash` | Previous commit এর সাথে merge করুন (message রাখুন)   |
| `fixup`  | Previous commit এর সাথে merge করুন (message বাদ দিন) |
| `drop`   | Commit delete করুন                                   |

#### 2. Squashing Commits

Multiple WIP commits কে একটি meaningful commit এ convert করুন:

```bash
# Before
abc1234 WIP: working on auth
def5678 WIP: still working
ghi9012 WIP: almost done
jkl3456 WIP: final changes

# Squash করুন
git rebase -i HEAD~4
# সব commits কে 'squash' করুন প্রথমটি ছাড়া

# After
abc1234 feat(auth): implement user authentication
```

#### 3. Amending Commits

সর্বশেষ commit modify করুন:

```bash
# File add করতে ভুলে গেছেন?
git add forgotten-file.js
git commit --amend --no-edit

# Commit message ঠিক করুন
git commit --amend -m "feat(auth): add proper authentication"
```

#### 4. Cleaning Before Merge

Feature branch merge করার আগে cleanup করুন:

```bash
# Feature branch এ
git checkout feature/user-auth

# Cleanup করুন
git rebase -i main

# Squash, reword, drop করুন যেমন দরকার

# এখন merge করুন
git checkout main
git merge feature/user-auth
```

### When to Rewrite History

**✅ Safe to Rewrite:**

- **Local commits** যা push করেননি
- **Feature branches** যা শুধু আপনি ব্যবহার করছেন
- **Before Pull Request** merge

**❌ Never Rewrite:**

- **Public branches** (main, develop, release)
- **Shared branches** যেখানে অন্যরা কাজ করছে
- **Already merged commits**

### Force Push Safely

```bash
# ❌ Dangerous
git push --force

# ✅ Safer (rejects if remote has new commits)
git push --force-with-lease

# ✅ Safest (with remote tracking)
git push --force-with-lease origin feature/my-branch
```

---

## 5. Code Ownership & Blame

### Git Blame

কোন line কে, কখন, কেন change করেছে তা জানুন:

```bash
# Basic blame
git blame src/auth.js

# Output:
# abc12345 (John Doe 2024-01-15 10:30:45 +0600  1) function login(user) {
# def67890 (Jane Smith 2024-01-20 14:22:10 +0600  2)   return authenticateUser(user);
# ghi13579 (John Doe 2024-01-15 10:31:02 +0600  3) }
```

#### Useful Blame Options

```bash
# Specific line range দেখুন
git blame -L 10,20 src/auth.js

# Email address সহ
git blame -e src/auth.js

# Ignore whitespace changes
git blame -w src/auth.js

# Show original commit (ignore moves/copies)
git blame -C src/auth.js

# Commit message সহ
git log -p -S "function login" src/auth.js
```

#### IDE Integration

**VS Code:**

- GitLens extension install করুন
- Inline blame annotations দেখুন
- Hover করে full commit details দেখুন

**IntelliJ/PyCharm:**

- Right-click → Git → Annotate
- Line-by-line authorship দেখুন

### CODEOWNERS File

Automatically assign reviewers এবং ownership define করুন:

```bash
# .github/CODEOWNERS (GitHub)
# or .gitlab/CODEOWNERS (GitLab)

# Default owner
* @team-lead

# Frontend team
/frontend/** @frontend-team
*.js @javascript-experts
*.css @design-team

# Backend team
/backend/** @backend-team
/api/** @api-team

# DevOps
/docker/** @devops-team
/.github/workflows/** @devops-team
Dockerfile @devops-team

# Documentation
/docs/** @tech-writers
*.md @tech-writers

# Specific files
package.json @team-lead @senior-dev
.env.example @security-team
```

#### CODEOWNERS Benefits

1. **Auto PR Assignment:** Pull request automatically সঠিক reviewer এর কাছে যায়
2. **Required Reviews:** Specific files এর জন্য approval mandatory করা যায়
3. **Clear Responsibility:** কে কোন code এর দায়িত্বে আছে তা clear
4. **Onboarding:** নতুন developer রা জানে কার কাছে যেতে হবে

### Best Practices for Code Ownership

#### 1. Shared Ownership

```bash
# ❌ Single owner (risky)
/critical-module/** @single-developer

# ✅ Team ownership
/critical-module/** @team-name @backup-developer
```

#### 2. Granular Ownership

```bash
# Specific ownership
/src/auth/login.js @auth-expert
/src/auth/oauth.js @oauth-specialist
/src/payment/** @payment-team @security-team
```

#### 3. Documentation Ownership

```bash
# README এবং docs
README.md @team-lead @tech-writer
/docs/architecture/** @senior-architect
/docs/api/** @api-team @tech-writer
```

### Tracking Code Changes

#### Find Who Changed What

```bash
# কে কোন function change করেছে
git log -p -S "functionName" -- path/to/file.js

# Specific author এর changes
git log --author="John Doe" --oneline

# File এর complete history
git log --follow -p -- path/to/file.js

# Renamed files track করুন
git log --follow --find-renames -- path/to/file.js
```

#### Analyze Contributions

```bash
# Author statistics
git shortlog -sn

# Specific time range
git shortlog -sn --since="2024-01-01" --until="2024-12-31"

# File-specific contributions
git shortlog -sn -- path/to/directory/
```

### Code Review Best Practices

1. **Blame দিয়ে Context বুঝুন:**

   ```bash
   git blame -L 50,60 src/auth.js
   git show abc1234  # Original commit দেখুন
   ```

2. **History Respect করুন:**
   - অন্যের code change করার আগে context বুঝুন
   - Commit message পড়ুন কেন change করা হয়েছিল

3. **Ownership Communicate করুন:**
   - CODEOWNERS file maintain করুন
   - Team এর সাথে share করুন responsibility

---

## Summary: Best Practices Checklist

### Commit Messages

- [ ] Conventional Commits format follow করছি
- [ ] Subject line 50 characters এর মধ্যে
- [ ] Imperative mood ব্যবহার করছি
- [ ] Body তে context explain করছি
- [ ] Breaking changes footer এ mention করছি

### Branch Naming

- [ ] Standard prefix ব্যবহার করছি (feature/, bugfix/, etc.)
- [ ] Descriptive name দিয়েছি
- [ ] Issue number include করেছি (যদি applicable)
- [ ] Lowercase এবং hyphen ব্যবহার করছি

### Atomic Commits

- [ ] প্রতিটি commit একটি logical change
- [ ] `git add -p` ব্যবহার করে selective staging
- [ ] Commit frequently করছি
- [ ] প্রতিটি commit working state এ রাখছি

### Clean History

- [ ] Merge করার আগে interactive rebase করছি
- [ ] WIP commits squash করছি
- [ ] Meaningful commit messages রাখছি
- [ ] Public branches rewrite করছি না
- [ ] `--force-with-lease` ব্যবহার করছি

### Code Ownership

- [ ] CODEOWNERS file maintain করছি
- [ ] `git blame` দিয়ে context বুঝছি
- [ ] Team ownership promote করছি
- [ ] Code changes এর responsibility নিচ্ছি

---

## Tools & Resources

### Commit Message Tools

- **Commitlint:** Commit message validation
- **Husky:** Git hooks automation
- **Commitizen:** Interactive commit message builder

### Git Aliases

```bash
# ~/.gitconfig এ add করুন

[alias]
  # Better log
  lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

  # Interactive rebase
  rb = rebase -i

  # Amend last commit
  amend = commit --amend --no-edit

  # Show blame with commit messages
  praise = blame -w -C -C -C

  # Squash all commits on branch
  squash-all = "!f(){ git reset $(git merge-base main $(git branch --show-current)) && git add -A && git commit; };f"
```

### Further Reading

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Git Best Practices - Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [GitHub CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

---

**মনে রাখবেন:** Best practices শেখা একটি continuous process। প্রথমে কঠিন মনে হতে পারে, কিন্তু practice করলে এগুলো habit হয়ে যাবে। এবং আপনার team এর productivity এবং code quality significantly improve হবে! 🚀
