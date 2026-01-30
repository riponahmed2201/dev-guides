# Git Interview Preparation

এই section এ আমরা Git সংক্রান্ত common interview questions এবং তাদের detailed answers দেখব। প্রতিটি topic এ practical examples এবং real-world scenarios রয়েছে।

---

## 1. Basic Git Commands Q&A

### Q1: `git init` এবং `git clone` এর মধ্যে পার্থক্য কি?

**Answer:**

**`git init`:**

- নতুন local repository তৈরি করে
- Empty repository initialize করে
- Existing project এ Git tracking শুরু করতে ব্যবহার হয়

```bash
mkdir my-project
cd my-project
git init
# Creates .git directory
```

**`git clone`:**

- Existing remote repository এর copy তৈরি করে
- সম্পূর্ণ history সহ repository download করে
- Automatically remote connection setup করে

```bash
git clone https://github.com/user/repo.git
# Downloads entire repository with history
```

**Key Difference:** `init` নতুন repo তৈরি করে, `clone` existing repo copy করে।

---

### Q2: `git add` এর বিভিন্ন options explain করুন।

**Answer:**

```bash
# Specific file add করা
git add file.txt

# Multiple files add করা
git add file1.txt file2.txt

# All files in directory add করা
git add .

# All modified and new files add করা
git add -A
# or
git add --all

# Only modified files add করা (new files নয়)
git add -u
# or
git add --update

# Interactive staging
git add -p
# or
git add --patch

# Specific directory add করা
git add src/
```

**Interactive Staging (`-p`) Example:**

```bash
git add -p file.txt

# Options:
# y - stage this hunk
# n - don't stage this hunk
# s - split into smaller hunks
# e - manually edit the hunk
# q - quit
```

---

### Q3: `git commit` এর best practices কি কি?

**Answer:**

**1. Meaningful Commit Messages:**

```bash
# ❌ Bad
git commit -m "fix"
git commit -m "update"

# ✅ Good
git commit -m "fix(auth): resolve login timeout issue"
git commit -m "feat(api): add user profile endpoint"
```

**2. Atomic Commits:**

```bash
# প্রতিটি commit একটি logical change represent করবে
git add src/auth/login.js
git commit -m "feat(auth): add login functionality"

git add tests/auth/login.test.js
git commit -m "test(auth): add login tests"
```

**3. Commit Message Structure:**

```bash
git commit -m "type(scope): subject

body (optional)

footer (optional)"
```

**4. Amending Last Commit:**

```bash
# Last commit এ file যোগ করা
git add forgotten-file.js
git commit --amend --no-edit

# Commit message edit করা
git commit --amend -m "new message"
```

---

### Q4: `git status` এবং `git log` এর মধ্যে পার্থক্য কি?

**Answer:**

**`git status`:**

- **Current state** দেখায়
- Working directory এবং staging area এর changes দেখায়
- Untracked files দেখায়

```bash
git status

# Output:
# On branch main
# Changes to be committed:
#   modified: file1.txt
# Changes not staged for commit:
#   modified: file2.txt
# Untracked files:
#   file3.txt
```

**`git log`:**

- **Commit history** দেখায়
- Past commits এর record দেখায়
- Author, date, message দেখায়

```bash
git log

# Useful options:
git log --oneline              # Compact view
git log --graph                # Visual graph
git log --author="John"        # Specific author
git log --since="2 weeks ago"  # Time range
git log -p                     # Show diffs
git log --stat                 # Show statistics
```

---

### Q5: `git fetch` এবং `git pull` এর পার্থক্য explain করুন।

**Answer:**

**`git fetch`:**

- Remote changes **download** করে কিন্তু merge করে না
- Safe operation - local changes affect হয় না
- Review করার সুযোগ দেয়

```bash
git fetch origin

# Remote changes দেখুন
git log origin/main

# Manual merge করুন
git merge origin/main
```

**`git pull`:**

- `fetch` + `merge` একসাথে করে
- Remote changes download এবং merge করে
- Conflicts হতে পারে

```bash
git pull origin main

# Equivalent to:
git fetch origin
git merge origin/main
```

**When to Use:**

| Scenario                   | Command     |
| -------------------------- | ----------- |
| Review করে merge করতে চান  | `git fetch` |
| Immediately merge করতে চান | `git pull`  |
| Safe approach চান          | `git fetch` |
| Quick update চান           | `git pull`  |

---

### Q6: `git reset` এর বিভিন্ন modes explain করুন।

**Answer:**

**1. Soft Reset:**

```bash
git reset --soft HEAD~1

# Effect:
# - Commit undo হয়
# - Changes staging area তে থাকে
# - Working directory unchanged
```

**Use Case:** Commit message ভুল হলে বা commits squash করতে।

**2. Mixed Reset (Default):**

```bash
git reset HEAD~1
# or
git reset --mixed HEAD~1

# Effect:
# - Commit undo হয়
# - Changes unstaged হয়
# - Working directory unchanged
```

**Use Case:** Commit এবং staging undo করতে, কিন্তু changes রাখতে।

**3. Hard Reset:**

```bash
git reset --hard HEAD~1

# Effect:
# - Commit undo হয়
# - Staging area clear হয়
# - Working directory clean হয়
# - ALL CHANGES LOST!
```

**Use Case:** সব changes discard করতে (⚠️ Dangerous!)

**Visual Comparison:**

```
Before: A -- B -- C (HEAD)

--soft:   A -- B (HEAD), C's changes in staging
--mixed:  A -- B (HEAD), C's changes unstaged
--hard:   A -- B (HEAD), C's changes deleted
```

---

### Q7: Untracked files কিভাবে remove করবেন?

**Answer:**

```bash
# Dry run (কি delete হবে দেখুন)
git clean -n

# Untracked files delete করুন
git clean -f

# Untracked directories সহ delete করুন
git clean -fd

# .gitignore এ থাকা files ও delete করুন
git clean -fx

# Interactive mode
git clean -i
```

**Safe Approach:**

```bash
# 1. প্রথমে dry run করুন
git clean -n

# 2. Confirm করুন কি delete হবে
# 3. তারপর actual clean করুন
git clean -f
```

---

## 2. Rebase vs Merge Questions

### Q8: Rebase এবং Merge এর মধ্যে পার্থক্য কি?

**Answer:**

**Merge:**

```bash
# Feature branch কে main এ merge করা
git checkout main
git merge feature-branch

# Creates a merge commit
# History: A -- B -- C -- M (merge commit)
#               \       /
#                D -- E (feature)
```

**Characteristics:**

- ✅ History preserve করে
- ✅ Non-destructive
- ✅ Safe for public branches
- ❌ Messy history (merge commits)
- ❌ Graph complex হয়

**Rebase:**

```bash
# Feature branch কে main এর উপর rebase করা
git checkout feature-branch
git rebase main

# Rewrites history
# History: A -- B -- C -- D' -- E' (linear)
```

**Characteristics:**

- ✅ Clean, linear history
- ✅ Easy to follow
- ✅ No merge commits
- ❌ Rewrites history
- ❌ Dangerous for public branches
- ❌ Conflicts হতে পারে multiple times

---

### Q9: কখন Merge এবং কখন Rebase ব্যবহার করবেন?

**Answer:**

**Use Merge When:**

1. **Public/Shared Branches:**

   ```bash
   # main, develop branches
   git checkout main
   git merge feature-branch
   ```

2. **Preserving Complete History:**

   ```bash
   # Important milestones track করতে
   git merge --no-ff release/v1.0.0
   ```

3. **Team Collaboration:**
   ```bash
   # অন্যরা যে branch এ কাজ করছে
   git merge team-feature
   ```

**Use Rebase When:**

1. **Local Branches:**

   ```bash
   # শুধু আপনি যে branch এ কাজ করছেন
   git rebase main
   ```

2. **Cleaning Up Before PR:**

   ```bash
   # PR submit করার আগে
   git rebase -i main
   ```

3. **Keeping Feature Branch Updated:**
   ```bash
   # Feature branch এ main এর latest changes নিতে
   git checkout feature-branch
   git rebase main
   ```

**Golden Rule:**

> **Never rebase public branches!**
>
> ```bash
> # ❌ NEVER DO THIS
> git checkout main
> git rebase feature-branch
>
> # ✅ DO THIS INSTEAD
> git checkout main
> git merge feature-branch
> ```

---

### Q10: Interactive Rebase কিভাবে কাজ করে?

**Answer:**

**Basic Interactive Rebase:**

```bash
# শেষ 5 commits edit করুন
git rebase -i HEAD~5

# Editor opens with:
pick abc1234 feat: add feature A
pick def5678 fix: typo
pick ghi9012 feat: add feature B
pick jkl3456 WIP: temp changes
pick mno7890 fix: bug in feature B
```

**Available Commands:**

| Command  | কাজ                                           |
| -------- | --------------------------------------------- |
| `pick`   | Commit রাখুন যেমন আছে                         |
| `reword` | Commit message edit করুন                      |
| `edit`   | Commit এ changes করুন                         |
| `squash` | Previous commit এর সাথে merge (message রাখুন) |
| `fixup`  | Previous commit এর সাথে merge (message বাদ)   |
| `drop`   | Commit delete করুন                            |
| `exec`   | Shell command run করুন                        |

**Example: Cleaning Up Commits:**

```bash
# Before:
pick abc1234 feat: add feature A
pick def5678 fix: typo
pick ghi9012 feat: add feature B
pick jkl3456 WIP: temp changes
pick mno7890 fix: bug in feature B

# After editing:
pick abc1234 feat: add feature A
reword def5678 fix: correct typo in feature A
pick ghi9012 feat: add feature B
fixup jkl3456 WIP: temp changes
squash mno7890 fix: bug in feature B

# Result: 3 clean commits instead of 5
```

**Practical Use Cases:**

1. **Squashing WIP Commits:**

   ```bash
   pick abc1234 feat: add login
   fixup def5678 WIP
   fixup ghi9012 WIP
   fixup jkl3456 WIP: almost done
   # Result: 1 clean commit
   ```

2. **Reordering Commits:**

   ```bash
   pick abc1234 feat: add feature
   pick def5678 docs: update README
   pick ghi9012 test: add tests

   # Reorder to:
   pick abc1234 feat: add feature
   pick ghi9012 test: add tests
   pick def5678 docs: update README
   ```

3. **Splitting a Commit:**

   ```bash
   edit abc1234 feat: add multiple features

   # Git pauses at this commit
   git reset HEAD^
   git add feature1.js
   git commit -m "feat: add feature 1"
   git add feature2.js
   git commit -m "feat: add feature 2"
   git rebase --continue
   ```

---

### Q11: Rebase conflicts কিভাবে resolve করবেন?

**Answer:**

**Step-by-Step Process:**

```bash
# 1. Rebase শুরু করুন
git rebase main

# Conflict হলে:
# CONFLICT (content): Merge conflict in file.txt
# error: could not apply abc1234... commit message

# 2. Conflicted files দেখুন
git status

# 3. Conflicts resolve করুন
# file.txt edit করুন এবং conflict markers remove করুন
<<<<<<< HEAD
main branch এর code
=======
feature branch এর code
>>>>>>> abc1234 (commit message)

# 4. Resolved files stage করুন
git add file.txt

# 5. Rebase continue করুন
git rebase --continue

# যদি আরো conflicts থাকে, repeat steps 3-5
```

**Rebase Abort করা:**

```bash
# যদি rebase cancel করতে চান
git rebase --abort

# Original state এ ফিরে যাবে
```

**Rebase Skip করা:**

```bash
# যদি current commit skip করতে চান
git rebase --skip
```

**Tips for Easier Conflict Resolution:**

```bash
# Rerere enable করুন (Reuse Recorded Resolution)
git config --global rerere.enabled true

# Same conflicts automatically resolve হবে
```

---

## 3. Collaboration Workflow Questions

### Q12: Gitflow workflow explain করুন।

**Answer:**

**Branch Structure:**

```
main (production)
  └── develop (integration)
       ├── feature/* (new features)
       ├── release/* (release preparation)
       └── hotfix/* (production fixes)
```

**1. Feature Development:**

```bash
# Feature branch তৈরি করুন
git checkout develop
git checkout -b feature/user-auth

# Development করুন
git add .
git commit -m "feat(auth): add login"

# Develop এ merge করুন
git checkout develop
git merge --no-ff feature/user-auth
git branch -d feature/user-auth
```

**2. Release Process:**

```bash
# Release branch তৈরি করুন
git checkout develop
git checkout -b release/v1.0.0

# Version bump এবং bug fixes
git commit -m "chore: bump version to 1.0.0"

# Main এ merge করুন
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release 1.0.0"

# Develop এ merge করুন
git checkout develop
git merge --no-ff release/v1.0.0

# Release branch delete করুন
git branch -d release/v1.0.0
```

**3. Hotfix Process:**

```bash
# Hotfix branch তৈরি করুন
git checkout main
git checkout -b hotfix/critical-bug

# Fix করুন
git commit -m "fix: resolve critical bug"

# Main এ merge করুন
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.0.1 -m "Hotfix 1.0.1"

# Develop এ merge করুন
git checkout develop
git merge --no-ff hotfix/critical-bug

# Hotfix branch delete করুন
git branch -d hotfix/critical-bug
```

**Advantages:**

- ✅ Clear separation of concerns
- ✅ Parallel development
- ✅ Production stability
- ✅ Easy rollback

**Disadvantages:**

- ❌ Complex for small teams
- ❌ Many long-lived branches
- ❌ Overhead for simple projects

---

### Q13: Feature Branch Workflow এবং Trunk-Based Development এর পার্থক্য কি?

**Answer:**

**Feature Branch Workflow:**

```bash
# Long-lived feature branches
main
  ├── feature/user-auth (3 days)
  ├── feature/payment (1 week)
  └── feature/dashboard (2 weeks)

# Workflow:
git checkout -b feature/new-feature
# ... develop for days/weeks ...
git push origin feature/new-feature
# Create PR
# Code review
# Merge to main
```

**Characteristics:**

- ✅ Isolated development
- ✅ Thorough code review
- ✅ Feature toggles optional
- ❌ Integration delays
- ❌ Merge conflicts
- ❌ Slower feedback

**Trunk-Based Development:**

```bash
# Short-lived branches (hours/1 day max)
main (trunk)
  ├── feature/quick-fix (2 hours)
  └── feature/small-change (4 hours)

# Workflow:
git checkout -b feature/small-feature
# ... develop for hours ...
git push origin feature/small-feature
# Quick review
# Merge to main immediately
```

**Characteristics:**

- ✅ Continuous integration
- ✅ Fast feedback
- ✅ Fewer merge conflicts
- ✅ Requires feature toggles
- ❌ Requires discipline
- ❌ Needs good CI/CD
- ❌ Incomplete features in main

**Comparison:**

| Aspect                | Feature Branch | Trunk-Based     |
| --------------------- | -------------- | --------------- |
| Branch lifetime       | Days/weeks     | Hours/1 day     |
| Integration frequency | Infrequent     | Continuous      |
| Code review           | Thorough       | Quick           |
| Feature toggles       | Optional       | Required        |
| CI/CD requirement     | Medium         | High            |
| Team size             | Any            | Small to medium |

---

### Q14: Pull Request এর best practices কি কি?

**Answer:**

**1. Small, Focused PRs:**

```bash
# ❌ Bad: Large PR
- 50 files changed
- Multiple features
- Hard to review

# ✅ Good: Small PR
- 5-10 files changed
- One feature/fix
- Easy to review
```

**2. Descriptive Title and Description:**

```markdown
## ❌ Bad PR Title

"Update files"

## ✅ Good PR Title

"feat(auth): implement JWT authentication"

## ✅ Good PR Description

### Description

Implements JWT-based authentication for API endpoints.

### Changes

- Added JWT token generation
- Implemented middleware for token validation
- Added refresh token mechanism

### Testing

- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed

### Related Issues

Closes #123
```

**3. Self-Review Before Submitting:**

```bash
# PR submit করার আগে:
# 1. Diff review করুন
git diff main...feature-branch

# 2. Tests run করুন
npm test

# 3. Linting check করুন
npm run lint

# 4. Build verify করুন
npm run build
```

**4. Respond to Feedback Promptly:**

```bash
# Feedback পাওয়ার পরে:
# 1. Changes করুন
git add .
git commit -m "refactor: apply review feedback"

# 2. Push করুন (PR automatically update হবে)
git push origin feature-branch

# 3. Comment করুন কি change করেছেন
```

**5. Keep PR Updated:**

```bash
# Main branch এর সাথে sync রাখুন
git fetch origin
git rebase origin/main

# অথবা
git merge origin/main

# Force push (if rebased)
git push --force-with-lease origin feature-branch
```

---

## 4. Branching & Merging Scenarios

### Q15: Fast-forward merge এবং 3-way merge এর পার্থক্য কি?

**Answer:**

**Fast-Forward Merge:**

```bash
# Scenario:
main:    A -- B -- C
feature:           D -- E

# Merge:
git checkout main
git merge feature

# Result:
main: A -- B -- C -- D -- E (no merge commit)
```

**Conditions:**

- Feature branch main থেকে diverge করেনি
- Linear history possible
- No conflicts

**3-Way Merge:**

```bash
# Scenario:
main:    A -- B -- C -- F
              \
feature:       D -- E

# Merge:
git checkout main
git merge feature

# Result:
main: A -- B -- C -- F -- M
              \         /
feature:       D ----- E
# M = merge commit
```

**Conditions:**

- Branches diverged
- Creates merge commit
- Preserves both histories

**Forcing Merge Commit:**

```bash
# Fast-forward possible কিন্তু merge commit চান
git merge --no-ff feature-branch

# Always creates merge commit
```

---

### Q16: Merge conflict এর একটি practical scenario solve করুন।

**Answer:**

**Scenario:**

```bash
# main branch:
# file.txt: "Hello World"

# feature-branch:
# file.txt: "Hello Git"

# Merge করলে conflict হবে
```

**Step-by-Step Resolution:**

```bash
# 1. Feature branch merge করুন
git checkout main
git merge feature-branch

# Output:
# Auto-merging file.txt
# CONFLICT (content): Merge conflict in file.txt
# Automatic merge failed; fix conflicts and then commit the result.

# 2. Conflicted files দেখুন
git status
# On branch main
# You have unmerged paths.
#   (fix conflicts and run "git commit")
#
# Unmerged paths:
#   (use "git add <file>..." to mark resolution)
#         both modified:   file.txt

# 3. file.txt open করুন
<<<<<<< HEAD
Hello World
=======
Hello Git
>>>>>>> feature-branch

# 4. Conflict resolve করুন
# Option A: Keep main version
Hello World

# Option B: Keep feature version
Hello Git

# Option C: Combine both
Hello World and Git

# Option D: Write new version
Hello from Git World

# 5. Conflict markers remove করুন এবং save করুন
Hello from Git World

# 6. File stage করুন
git add file.txt

# 7. Merge commit complete করুন
git commit -m "merge: resolve conflict in file.txt"

# 8. Verify করুন
git log --graph --oneline
```

**Using Merge Tools:**

```bash
# Visual merge tool ব্যবহার করুন
git mergetool

# Configure merge tool:
git config --global merge.tool vimdiff
# or
git config --global merge.tool meld
# or
git config --global merge.tool kdiff3
```

---

### Q17: Detached HEAD state কি এবং কিভাবে recover করবেন?

**Answer:**

**Detached HEAD কি:**

```bash
# Specific commit checkout করলে
git checkout abc1234

# Output:
# You are in 'detached HEAD' state.
# HEAD is now at abc1234

# Visualization:
main: A -- B -- C -- D (main)
                 ↑
              HEAD (detached at C)
```

**Why It Happens:**

- Specific commit checkout করলে
- Tag checkout করলে
- Remote branch directly checkout করলে

**Recovery Options:**

**Option 1: Create New Branch:**

```bash
# Detached HEAD state এ
git branch new-branch-name
git checkout new-branch-name

# অথবা একসাথে:
git checkout -b new-branch-name
```

**Option 2: Return to Branch:**

```bash
# Simply checkout a branch
git checkout main

# Changes হারিয়ে যাবে (যদি commit না করে থাকেন)
```

**Option 3: Save Changes:**

```bash
# যদি detached HEAD এ changes করে থাকেন
git commit -m "changes in detached HEAD"

# Commit hash note করুন
# abc1234

# Branch এ ফিরে যান
git checkout main

# Changes merge করুন
git merge abc1234
```

**Preventing Data Loss:**

```bash
# Detached HEAD এ থাকলে সবসময় branch তৈরি করুন
git checkout -b temp-branch

# তারপর কাজ করুন
```

---

## 5. Debugging with Git

### Q18: `git reflog` কি এবং কিভাবে ব্যবহার করবেন?

**Answer:**

**Git Reflog কি:**

`reflog` হলো Git এর "safety net" - এটি HEAD এর সব movements track করে, এমনকি deleted commits ও।

**Basic Usage:**

```bash
# Reflog দেখুন
git reflog

# Output:
abc1234 HEAD@{0}: commit: add feature
def5678 HEAD@{1}: checkout: moving from main to feature
ghi9012 HEAD@{2}: reset: moving to HEAD~1
jkl3456 HEAD@{3}: commit: deleted commit
```

**Common Use Cases:**

**1. Recovering Deleted Commits:**

```bash
# Accidentally hard reset করেছেন
git reset --hard HEAD~3

# Commits lost! কিন্তু reflog এ আছে
git reflog

# Output:
abc1234 HEAD@{0}: reset: moving to HEAD~3
def5678 HEAD@{1}: commit: important work
ghi9012 HEAD@{2}: commit: more work
jkl3456 HEAD@{3}: commit: even more work

# Recover করুন
git reset --hard HEAD@{1}
# অথবা
git reset --hard def5678
```

**2. Recovering Deleted Branch:**

```bash
# Branch delete করেছেন
git branch -D feature-branch

# Reflog দেখুন
git reflog

# Output:
abc1234 HEAD@{0}: checkout: moving from feature-branch to main
def5678 HEAD@{1}: commit: last commit on feature-branch

# Branch recreate করুন
git checkout -b feature-branch def5678
```

**3. Finding Lost Stash:**

```bash
# Stash drop করে ফেলেছেন
git stash drop

# Reflog দেখুন
git reflog

# Output:
abc1234 HEAD@{0}: WIP on main: stashed changes

# Stash recover করুন
git stash apply abc1234
```

**4. Undoing Rebase:**

```bash
# Rebase করেছেন কিন্তু undo করতে চান
git reflog

# Output:
abc1234 HEAD@{0}: rebase finished
def5678 HEAD@{1}: checkout: moving from main to feature

# Rebase আগের state এ ফিরে যান
git reset --hard HEAD@{1}
```

**Reflog Expiry:**

```bash
# Reflog entries 90 days পর expire হয়
# Configure করুন:
git config --global gc.reflogExpire 180.days
git config --global gc.reflogExpireUnreachable 90.days
```

---

### Q19: `git bisect` দিয়ে bug কিভাবে খুঁজবেন?

**Answer:**

**Git Bisect কি:**

Binary search ব্যবহার করে bug introduce করা commit খুঁজে বের করে।

**Basic Workflow:**

```bash
# 1. Bisect শুরু করুন
git bisect start

# 2. Current commit কে bad mark করুন
git bisect bad

# 3. Known good commit mark করুন
git bisect good abc1234

# Git automatically middle commit checkout করবে
# Bisecting: 5 revisions left to test after this

# 4. Test করুন
# যদি bug আছে:
git bisect bad

# যদি bug নেই:
git bisect good

# 5. Repeat করুন যতক্ষণ না bug commit পাওয়া যায়

# Output:
# abc1234 is the first bad commit
# commit abc1234
# Author: John Doe
# Date: Mon Jan 1 12:00:00 2024
#     feat: add new feature (this introduced the bug)

# 6. Bisect শেষ করুন
git bisect reset
```

**Automated Bisect:**

```bash
# Test script তৈরি করুন (test.sh)
#!/bin/bash
npm test
exit $?

# Automated bisect run করুন
git bisect start
git bisect bad
git bisect good abc1234
git bisect run ./test.sh

# Git automatically bug commit খুঁজে বের করবে
```

**Practical Example:**

```bash
# Scenario: Login feature broken, was working 10 commits ago

# 1. Start bisect
git bisect start

# 2. Current state is bad
git bisect bad

# 3. 10 commits ago was good
git log --oneline -10
# abc1234 (10 commits ago)
git bisect good abc1234

# 4. Git checks out middle commit (5 commits ago)
# Test manually: npm start, try login

# 5. Login works!
git bisect good

# 6. Git checks out commit between 5 and 10 (7-8 commits ago)
# Test: Login broken!
git bisect bad

# 7. Continue until found:
# def5678 is the first bad commit
# commit def5678
# feat(auth): refactor login logic

# 8. Reset
git bisect reset

# 9. Fix the bug in def5678
git show def5678
```

**Bisect with Skip:**

```bash
# যদি কোনো commit test করা যায় না (build fails)
git bisect skip

# Git পরের commit check করবে
```

**Visualizing Bisect:**

```bash
# Bisect চলাকালীন log দেখুন
git bisect log

# Bisect visualization
git bisect visualize
# অথবা
git bisect view
```

---

### Q20: Lost commits কিভাবে recover করবেন?

**Answer:**

**Method 1: Using Reflog (Easiest):**

```bash
# Reflog check করুন
git reflog

# Output:
abc1234 HEAD@{0}: reset: moving to HEAD~5
def5678 HEAD@{5}: commit: lost commit

# Recover করুন
git cherry-pick def5678
# অথবা
git reset --hard def5678
```

**Method 2: Using fsck (Reflog expired হলে):**

```bash
# Dangling commits খুঁজুন
git fsck --lost-found

# Output:
# dangling commit abc1234
# dangling commit def5678
# dangling blob ghi9012

# Commits inspect করুন
git show abc1234
git show def5678

# Recover করুন
git cherry-pick abc1234
# অথবা
git merge abc1234
```

**Method 3: Recovering from Deleted Branch:**

```bash
# Branch delete করার পরে
git branch -D feature-branch

# Reflog দেখুন
git reflog

# Output:
abc1234 HEAD@{1}: commit: last commit on feature-branch

# Branch recreate করুন
git checkout -b feature-branch abc1234
```

**Method 4: Recovering Stashed Changes:**

```bash
# Stash list দেখুন
git stash list

# যদি stash drop করে থাকেন
git fsck --unreachable | grep commit

# Stash commits খুঁজুন
git show abc1234

# Apply করুন
git stash apply abc1234
```

**Prevention Tips:**

```bash
# 1. Regular backups
git push origin --all

# 2. Use branches instead of detached HEAD
git checkout -b temp-branch

# 3. Don't use --hard reset unless sure
git reset --soft HEAD~1  # Safer

# 4. Enable rerere
git config --global rerere.enabled true
```

---

## 6. Additional Git Topics Q&A

### Q21: Git internals - Objects, Blobs, Trees, Commits explain করুন।

**Answer:**

**Git Object Model:**

```
Commit
  ├── Tree (directory structure)
  │    ├── Blob (file content)
  │    ├── Blob (file content)
  │    └── Tree (subdirectory)
  │         └── Blob (file content)
  └── Parent commit(s)
```

**1. Blob (Binary Large Object):**

```bash
# File content store করে
# File name নেই, শুধু content

# Example:
echo "Hello World" | git hash-object --stdin
# Output: 557db03de997c86a4a028e1ebd3a1ceb225be238

# Blob দেখুন
git cat-file -p 557db03
# Output: Hello World
```

**2. Tree:**

```bash
# Directory structure store করে
# File names এবং permissions রাখে

# Tree দেখুন
git cat-file -p main^{tree}

# Output:
# 100644 blob 557db03... file1.txt
# 100644 blob 8ab686e... file2.txt
# 040000 tree 9c3f7a2... src/
```

**3. Commit:**

```bash
# Metadata store করে
# - Tree reference
# - Parent commit(s)
# - Author, committer
# - Commit message

# Commit দেখুন
git cat-file -p HEAD

# Output:
# tree 9c3f7a2...
# parent abc1234...
# author John Doe <john@example.com> 1234567890 +0000
# committer John Doe <john@example.com> 1234567890 +0000
#
# feat: add new feature
```

**4. Tag:**

```bash
# Commit এ reference
# Annotated tags additional metadata রাখে

# Tag দেখুন
git cat-file -p v1.0.0

# Output:
# object abc1234...
# type commit
# tag v1.0.0
# tagger John Doe <john@example.com>
#
# Release version 1.0.0
```

**Object Storage:**

```bash
# Objects .git/objects/ এ store হয়
ls .git/objects/

# Object hash এর first 2 characters = directory
# Remaining characters = filename

# Example:
# 557db03de997c86a4a028e1ebd3a1ceb225be238
# Stored at: .git/objects/55/7db03de997c86a4a028e1ebd3a1ceb225be238
```

---

### Q22: `git stash` এর advanced usage explain করুন।

**Answer:**

**Basic Stashing:**

```bash
# Current changes stash করুন
git stash

# অথবা message সহ
git stash save "WIP: working on feature"

# Stash list দেখুন
git stash list
# Output:
# stash@{0}: WIP on main: abc1234 commit message
# stash@{1}: WIP on feature: def5678 another commit
```

**Advanced Stash Operations:**

**1. Partial Stashing:**

```bash
# Interactive stashing
git stash -p

# Options:
# y - stash this hunk
# n - don't stash
# s - split into smaller hunks
# e - manually edit
```

**2. Stash Untracked Files:**

```bash
# Untracked files সহ stash করুন
git stash -u
# অথবা
git stash --include-untracked

# Ignored files সহও stash করুন
git stash -a
# অথবা
git stash --all
```

**3. Stash Specific Files:**

```bash
# শুধু specific files stash করুন
git stash push -m "stash specific files" file1.txt file2.txt

# Path pattern ব্যবহার করুন
git stash push -m "stash all JS files" "*.js"
```

**4. Apply vs Pop:**

```bash
# Apply করুন (stash রাখুন)
git stash apply

# Specific stash apply করুন
git stash apply stash@{1}

# Pop করুন (stash remove করুন)
git stash pop

# Specific stash pop করুন
git stash pop stash@{1}
```

**5. Stash Branch:**

```bash
# Stash থেকে নতুন branch তৈরি করুন
git stash branch new-branch-name

# অথবা specific stash থেকে
git stash branch new-branch stash@{1}
```

**6. Stash Show:**

```bash
# Stash changes দেখুন
git stash show

# Detailed diff দেখুন
git stash show -p

# Specific stash দেখুন
git stash show stash@{1} -p
```

**7. Stash Drop and Clear:**

```bash
# Specific stash delete করুন
git stash drop stash@{1}

# All stashes clear করুন
git stash clear
```

**Practical Scenarios:**

```bash
# Scenario 1: Quick context switch
git stash
git checkout hotfix-branch
# ... fix bug ...
git checkout main
git stash pop

# Scenario 2: Try experimental changes
git stash
# ... experiment ...
git stash  # Stash experiments
git stash pop stash@{1}  # Restore original work

# Scenario 3: Clean working directory for pull
git stash
git pull
git stash pop
```

---

### Q23: `git cherry-pick` কিভাবে কাজ করে?

**Answer:**

**Cherry-Pick কি:**

Specific commit(s) অন্য branch এ apply করা।

**Basic Usage:**

```bash
# Single commit cherry-pick করুন
git cherry-pick abc1234

# Multiple commits cherry-pick করুন
git cherry-pick abc1234 def5678 ghi9012

# Commit range cherry-pick করুন
git cherry-pick abc1234..def5678
```

**Practical Scenarios:**

**Scenario 1: Hotfix to Multiple Branches:**

```bash
# main এ hotfix করেছেন
git checkout main
git commit -m "fix: critical bug"  # abc1234

# develop এ same fix চান
git checkout develop
git cherry-pick abc1234

# release branch এও চান
git checkout release/v1.0
git cherry-pick abc1234
```

**Scenario 2: Selective Feature Migration:**

```bash
# feature-branch এ multiple commits
# শুধু specific commits main এ চান

git log feature-branch --oneline
# abc1234 feat: add login
# def5678 feat: add signup
# ghi9012 WIP: incomplete feature
# jkl3456 feat: add logout

# শুধু login এবং logout চান
git checkout main
git cherry-pick abc1234 jkl3456
```

**Cherry-Pick Options:**

```bash
# Commit করবেন না, শুধু apply করুন
git cherry-pick -n abc1234
# অথবা
git cherry-pick --no-commit abc1234

# Edit commit message
git cherry-pick -e abc1234
# অথবা
git cherry-pick --edit abc1234

# Sign-off যোগ করুন
git cherry-pick -s abc1234
# অথবা
git cherry-pick --signoff abc1234
```

**Handling Conflicts:**

```bash
# Cherry-pick করলে conflict হলে
git cherry-pick abc1234

# CONFLICT (content): Merge conflict in file.txt

# Conflicts resolve করুন
# ... edit file.txt ...

git add file.txt
git cherry-pick --continue

# অথবা abort করুন
git cherry-pick --abort
```

**Cherry-Pick vs Merge:**

| Aspect    | Cherry-Pick         | Merge                |
| --------- | ------------------- | -------------------- |
| Scope     | Specific commits    | Entire branch        |
| History   | Creates new commits | Preserves history    |
| Use case  | Selective changes   | Complete integration |
| Conflicts | Per commit          | Once                 |

---

### Q24: Git Hooks এর practical examples দিন।

**Answer:**

**Git Hooks Location:**

```bash
# Hooks .git/hooks/ directory তে থাকে
ls .git/hooks/

# Sample hooks:
# pre-commit.sample
# commit-msg.sample
# pre-push.sample
```

**1. Pre-Commit Hook (Linting):**

```bash
# .git/hooks/pre-commit
#!/bin/sh

echo "Running linter..."
npm run lint

if [ $? -ne 0 ]; then
  echo "❌ Linting failed! Fix errors before committing."
  exit 1
fi

echo "✅ Linting passed!"
```

**2. Commit-Msg Hook (Message Validation):**

```bash
# .git/hooks/commit-msg
#!/bin/sh

commit_msg=$(cat "$1")

# Check for conventional commit format
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"; then
  echo "❌ Invalid commit message format!"
  echo "Use: type(scope): subject"
  echo "Example: feat(auth): add login"
  exit 1
fi

echo "✅ Commit message valid!"
```

**3. Pre-Push Hook (Testing):**

```bash
# .git/hooks/pre-push
#!/bin/sh

echo "Running tests..."
npm test

if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Fix tests before pushing."
  exit 1
fi

echo "✅ Tests passed!"
```

**4. Post-Commit Hook (Notification):**

```bash
# .git/hooks/post-commit
#!/bin/sh

# Get commit info
commit_hash=$(git rev-parse HEAD)
commit_msg=$(git log -1 --pretty=%B)
author=$(git log -1 --pretty=%an)

# Send notification (example)
echo "New commit by $author: $commit_msg" >> commit-log.txt
```

**5. Pre-Rebase Hook (Protection):**

```bash
# .git/hooks/pre-rebase
#!/bin/sh

# Prevent rebasing main branch
if [ "$2" = "main" ]; then
  echo "❌ Cannot rebase main branch!"
  exit 1
fi
```

**Making Hooks Executable:**

```bash
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg
chmod +x .git/hooks/pre-push
```

**Sharing Hooks with Team (using Husky):**

```bash
# Install Husky
npm install --save-dev husky
npx husky install

# Add hooks
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/commit-msg "npx commitlint --edit $1"
npx husky add .husky/pre-push "npm test"

# Hooks এখন version control এ আছে
# Team members automatically পাবে
```

---

### Q25: Git Submodules কি এবং কখন ব্যবহার করবেন?

**Answer:**

**Submodules কি:**

অন্য Git repository কে আপনার repository এর মধ্যে include করা।

**Adding Submodule:**

```bash
# Submodule add করুন
git submodule add https://github.com/user/library.git libs/library

# .gitmodules file তৈরি হবে
cat .gitmodules
# [submodule "libs/library"]
#     path = libs/library
#     url = https://github.com/user/library.git

# Commit করুন
git add .gitmodules libs/library
git commit -m "chore: add library submodule"
```

**Cloning Repository with Submodules:**

```bash
# Repository clone করুন
git clone https://github.com/user/main-repo.git

# Submodules initialize এবং update করুন
git submodule init
git submodule update

# অথবা একসাথে:
git clone --recurse-submodules https://github.com/user/main-repo.git
```

**Updating Submodules:**

```bash
# Submodule directory তে যান
cd libs/library

# Latest changes pull করুন
git pull origin main

# Parent repository তে ফিরে যান
cd ../..

# Submodule update commit করুন
git add libs/library
git commit -m "chore: update library submodule"
```

**Removing Submodule:**

```bash
# 1. Deinitialize submodule
git submodule deinit libs/library

# 2. Remove from .git/modules
rm -rf .git/modules/libs/library

# 3. Remove from working tree
git rm libs/library

# 4. Commit
git commit -m "chore: remove library submodule"
```

**When to Use Submodules:**

**✅ Use Cases:**

- Shared libraries across projects
- Third-party dependencies
- Monorepo alternative
- Versioned dependencies

**❌ Avoid When:**

- Simple dependencies (use package manager)
- Frequently changing code
- Team unfamiliar with submodules
- Need automatic updates

**Alternatives:**

```bash
# Git Subtree (simpler alternative)
git subtree add --prefix libs/library https://github.com/user/library.git main

# Package managers (npm, pip, etc.)
npm install library
```

---

### Q26: Large files Git এ কিভাবে handle করবেন?

**Answer:**

**Problem:**

```bash
# Large files commit করলে:
# - Repository size বড় হয়
# - Clone slow হয়
# - History bloated হয়
```

**Solution 1: Git LFS (Large File Storage):**

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.psd"
git lfs track "*.mp4"
git lfs track "*.zip"

# .gitattributes file তৈরি হবে
cat .gitattributes
# *.psd filter=lfs diff=lfs merge=lfs -text
# *.mp4 filter=lfs diff=lfs merge=lfs -text

# Commit করুন
git add .gitattributes
git commit -m "chore: configure Git LFS"

# Large files add করুন
git add large-file.psd
git commit -m "feat: add design file"
git push
```

**Solution 2: .gitignore:**

```bash
# Large files ignore করুন
echo "*.psd" >> .gitignore
echo "*.mp4" >> .gitignore
echo "node_modules/" >> .gitignore

# Alternative storage ব্যবহার করুন
# - Cloud storage (S3, Google Drive)
# - CDN
# - Artifact repository
```

**Solution 3: BFG Repo-Cleaner (Already committed large files):**

```bash
# Install BFG
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Remove large files from history
java -jar bfg.jar --strip-blobs-bigger-than 100M my-repo.git

# Clean up
cd my-repo
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

**Best Practices:**

```bash
# 1. Check file sizes before committing
git ls-files -s | awk '{print $4, $2}' | sort -n

# 2. Use .gitignore proactively
# 3. Use Git LFS for binary files
# 4. Keep repository lean
# 5. Regular cleanup
```

---

## Summary

এই interview preparation guide এ আমরা cover করেছি:

✅ **Basic Commands** - init, clone, add, commit, status, log, fetch, pull, reset  
✅ **Rebase vs Merge** - Differences, use cases, interactive rebase, conflict resolution  
✅ **Collaboration Workflows** - Gitflow, feature branch, trunk-based, PR best practices  
✅ **Branching & Merging** - Fast-forward, 3-way merge, conflict scenarios, detached HEAD  
✅ **Debugging** - reflog, bisect, recovering lost commits  
✅ **Additional Topics** - Internals, stash, cherry-pick, hooks, submodules, large files

এই Q&A গুলো practice করলে আপনি Git interview এ confident থাকতে পারবেন! 🚀

---

## Tips for Interview Success

1. **Hands-on Practice:** শুধু theory পড়বেন না, commands practice করুন
2. **Understand Concepts:** Commands মুখস্থ না করে concepts বুঝুন
3. **Real-world Examples:** নিজের projects এ apply করুন
4. **Explain Clearly:** Technical terms সহজভাবে explain করতে পারুন
5. **Ask Questions:** Interviewer কে clarifying questions জিজ্ঞাসা করুন

**Good Luck! 🎯**
