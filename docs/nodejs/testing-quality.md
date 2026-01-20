# Testing & Quality Assurance - সম্পূর্ণ Advanced Guide

Professional Node.js applications এর জন্য comprehensive testing এবং quality assurance essential। এই guide এ testing এর সব aspects শিখবেন - theory থেকে practice পর্যন্ত।

## 📑 Table of Contents

### Core Concepts & Theory
1. [Software Testing কি এবং কেন](#software-testing-কি-এবং-কেন)
2. [Testing এর মনোবিজ্ঞান](#testing-এর-মনোবিজ্ঞান)
3. [Bug এর Cost Analysis](#bug-এর-cost-analysis)
4. [Testing Principles & Philosophy](#testing-principles--philosophy)

### Testing Fundamentals
5. [কেন Testing দরকার](#কেন-testing-দরকার)
6. [Testing Pyramid](#testing-pyramid)
7. [Testing Types তুলনা](#testing-types-তুলনা)

### Unit Testing
4. [Unit Testing Fundamentals](#unit-testing-fundamentals)
5. [Jest Framework Complete](#jest-framework-complete)
6. [Mocha & Chai](#mocha--chai)

### Integration Testing
7. [Integration Testing Basics](#integration-testing-basics)
8. [API Testing with Supertest](#api-testing-with-supertest)
9. [Database Testing](#database-testing)

### Advanced Testing
10. [Mocking & Stubbing Deep Dive](#mocking--stubbing-deep-dive)
11. [Test-Driven Development (TDD)](#test-driven-development-tdd)
12. [Code Coverage](#code-coverage)
13. [E2E Testing](#e2e-testing)

### Production Testing
14. [Testing Best Practices](#testing-best-practices)
15. [CI/CD Integration](#cicd-integration)
16. [Performance Testing](#performance-testing)
17. [Security Testing](#security-testing)

---

## Software Testing কি এবং কেন

### 1. Software Testing এর সংজ্ঞা

```javascript
/*
Software Testing হলো একটি systematic process যা verify করে:
1. Software কি expected ভাবে কাজ করছে?
2. Software কি unexpected ভাবে fail করছে না?
3. Requirements পূরণ হয়েছে কিনা?
4. Quality standards মেনে চলছে কিনা?

মূল উদ্দেশ্য:
- Bugs খুঁজে বের করা
- Quality নিশ্চিত করা
- Confidence তৈরি করা
- Risk কমানো
*/

// Simple Example
function add(a, b) {
  return a + b;
}

/*
Testing Questions:
1. Does it work? → add(2, 3) === 5 ✅
2. Edge cases? → add(0, 0) === 0 ✅
3. Invalid input? → add("2", 3) === "23" ❌ Bug found!
4. Extreme values? → add(Infinity, 1) === Infinity ✅
*/
```

### 2. Testing এর Evolution

```javascript
/*
┌─────────────────────────────────────────────────────┐
│ 1950s-1960s: Manual Testing Era                    │
├─────────────────────────────────────────────────────┤
│ - Humans manually test software                    │
│ - Write test cases on paper                        │
│ - Very slow and error-prone                        │
│ - No automation                                    │
│                                                     │
│ Problem: Can't keep up with development speed!     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 1970s-1980s: Automated Testing Birth               │
├─────────────────────────────────────────────────────┤
│ - First test automation tools                      │
│ - Scripts to run tests                             │
│ - Still limited                                    │
│                                                     │
│ Breakthrough: Tests can run automatically!         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 1990s-2000s: Unit Testing Revolution               │
├─────────────────────────────────────────────────────┤
│ - xUnit framework family (JUnit, NUnit)            │
│ - TDD (Test-Driven Development) emerges            │
│ - Developers write their own tests                 │
│                                                     │
│ Revolution: Testing becomes part of development!   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 2010s-Present: Modern Testing Era                  │
├─────────────────────────────────────────────────────┤
│ - CI/CD Integration                                │
│ - Test automation everywhere                       │
│ - BDD, E2E, Visual testing                         │
│ - AI-powered testing                               │
│                                                     │
│ Current: Testing is mandatory for quality!         │
└─────────────────────────────────────────────────────┘
*/
```

### 3. Testing কেন এত Important?

```javascript
/*
┌─────────────────────────────────────────────────────┐
│ Reason 1: Software Complexity বাড়ছে                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 1990s Website:                                     │
│   - Static HTML pages                              │
│   - No database                                    │
│   - Simple form                                    │
│   Lines of Code: ~1,000                            │
│   Possible States: ~100                            │
│   Manual Testing: ✅ Possible                      │
│                                                     │
│ 2026 Modern App:                                   │
│   - Microservices architecture                     │
│   - Multiple databases                             │
│   - Real-time features                             │
│   - 3rd party integrations                         │
│   Lines of Code: ~100,000+                         │
│   Possible States: ~1 Million+                     │
│   Manual Testing: ❌ IMPOSSIBLE!                   │
│                                                     │
│ Conclusion: Automation is MANDATORY!               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Reason 2: Development Speed বাড়ছে                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Waterfall Era (1990s):                             │
│   Development: 6 months                            │
│   Testing: 2 months                                │
│   Deployment: Quarterly                            │
│   Manual testing was enough                        │
│                                                     │
│ Agile Era (2010s):                                 │
│   Development: 2 weeks sprint                      │
│   Testing: Continuous                              │
│   Deployment: Weekly/Daily                         │
│   Automated testing needed                         │
│                                                     │
│ DevOps Era (2020s):                                │
│   Development: Continuous                          │
│   Testing: Real-time                               │
│   Deployment: Multiple times per day               │
│   Automated testing CRITICAL!                      │
│                                                     │
│ Conclusion: Speed impossible without automation!   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Reason 3: User Expectations বাড়ছে                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 1990s Users:                                       │
│   Expectation: Software works "most of the time"   │
│   Bug Tolerance: High                              │
│   Response: "Just restart the computer"            │
│                                                     │
│ 2026 Users:                                        │
│   Expectation: 99.99% uptime (52 min downtime/year)│
│   Bug Tolerance: ZERO                              │
│   Response: "Switch to competitor in 1 click"      │
│                                                     │
│ Real Stats:                                        │
│   - 88% users won't return after bad experience    │
│   - 1 second delay = 7% conversion loss            │
│   - 1 bug = 100+ negative reviews                  │
│                                                     │
│ Conclusion: Quality is BUSINESS CRITICAL!          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Reason 4: Cost of Failure বাড়ছে                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Historical Software Failures:                      │
│                                                     │
│ 1. Mars Climate Orbiter (1999):                   │
│    Bug: Unit conversion error (metric vs imperial) │
│    Cost: $327 Million USD loss! 🚀💥               │
│                                                     │
│ 2. Knight Capital (2012):                         │
│    Bug: Trading algorithm error                    │
│    Cost: $440 Million loss in 45 minutes! 💸       │
│                                                     │
│ 3. British Airways (2017):                        │
│    Bug: Power supply failure                       │
│    Cost: 75,000 passengers stranded, $100M loss    │
│                                                     │
│ 4. Facebook Outage (2021):                        │
│    Bug: BGP routing configuration                  │
│    Cost: $60 Million per hour! ⏰                   │
│                                                     │
│ Conclusion: One bug can BANKRUPT a company!        │
└─────────────────────────────────────────────────────┘
*/
```

### 4. Testing এর Scientific Foundation

```javascript
/*
Software Testing is based on:

┌─────────────────────────────────────────────────────┐
│ 1. Mathematical Logic                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Formal Verification Theory:                        │
│   P(x) = Property we want to prove                 │
│   F(x) = Our function                              │
│   Test: Does F(x) satisfy P(x)?                    │
│                                                     │
│ Example:                                           │
│   P(x) = "Result is positive"                      │
│   F(x) = abs(x)  // Absolute value                 │
│   Test: abs(-5) > 0  ✅                            │
│         abs(5) > 0   ✅                            │
│                                                     │
│ Complete Testing = Proving theorem ∀x: P(F(x))     │
│ (Impossible for complex software!)                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 2. Statistical Sampling                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Since we can't test ALL inputs:                    │
│                                                     │
│ Population: All possible inputs (infinite)         │
│ Sample: Test cases we run (finite)                 │
│ Confidence: Statistical likelihood of correctness  │
│                                                     │
│ Example:                                           │
│   function add(a, b) { return a + b; }             │
│                                                     │
│ Possible inputs: Infinite                          │
│ Test sample:                                       │
│   - add(0, 0)      → Edge case                     │
│   - add(1, 1)      → Simple case                   │
│   - add(999, 1)    → Boundary                      │
│   - add(-5, 5)     → Negative                      │
│   - add(0.1, 0.2)  → Decimal                       │
│                                                     │
│ Confidence: ~95% (based on sample coverage)        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 3. Empirical Observation                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Scientific Method Applied:                         │
│                                                     │
│ 1. Hypothesis:                                     │
│    "This function should return sum of two numbers"│
│                                                     │
│ 2. Experiment:                                     │
│    Run test: add(2, 3)                             │
│                                                     │
│ 3. Observation:                                    │
│    Result = 5                                      │
│                                                     │
│ 4. Conclusion:                                     │
│    Hypothesis confirmed ✅                         │
│    OR                                              │
│    Hypothesis rejected ❌ (Bug found!)             │
│                                                     │
│ 5. Repeat with more experiments (tests)            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 4. Fault Injection Theory                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Concept: Deliberately introduce errors to verify   │
│          system can detect and handle them         │
│                                                     │
│ Example:                                           │
│   Original: function divide(a, b) { return a/b; }  │
│   Inject: What if b = 0?                           │
│   Test: Does it handle this fault?                 │
│                                                     │
│ Types of faults to inject:                         │
│   - Invalid inputs                                 │
│   - Null/undefined values                          │
│   - Network failures                               │
│   - Database errors                                │
│   - Memory limits                                  │
│                                                     │
│ Chaos Engineering: Netflix's approach              │
│   Randomly kill servers to test resilience!        │
└─────────────────────────────────────────────────────┘
*/
```

---

## Testing এর মনোবিজ্ঞান

Testing শুধু technical skill নয়, এটি একটি mindset এবং psychology!

### 1. Developer vs Tester Mindset

```javascript
/*
┌─────────────────────────────────────────────────────┐
│ DEVELOPER MINDSET                                   │
├─────────────────────────────────────────────────────┤
│ Goal: Make it work                                  │
│ Thinking: "How can I build this?"                   │
│ Approach: Constructive                              │
│ Focus: Happy path (normal scenarios)                │
│ Bias: "My code is correct" 😊                       │
│                                                     │
│ Example thought process:                           │
│   "User will enter valid email"                    │
│   "Database will always be available"              │
│   "Network won't fail"                             │
│                                                     │
│ Danger: Optimism bias!                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ TESTER MINDSET                                      │
├─────────────────────────────────────────────────────┤
│ Goal: Make it break                                 │
│ Thinking: "How can I break this?"                   │
│ Approach: Destructive (in good way!)                │
│ Focus: Edge cases & failure scenarios               │
│ Bias: "Everything can fail" 🤔                      │
│                                                     │
│ Example thought process:                           │
│   "What if user enters emoji as email? 😈"         │
│   "What if database crashes mid-transaction?"      │
│   "What if network is slow?"                       │
│   "What if user clicks 1000 times?"                │
│                                                     │
│ Benefit: Find bugs before users do!                │
└─────────────────────────────────────────────────────┘

Solution: Developer must wear BOTH hats! 🎩🎩
*/
```

### 2. Psychological Barriers to Testing

```javascript
/*
┌─────────────────────────────────────────────────────┐
│ Barrier 1: "আমার Code এ Bug নেই" Syndrome          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Cognitive Bias: Overconfidence                     │
│                                                     │
│ Developer writes:                                  │
│   function calculateAge(birthYear) {               │
│     return 2026 - birthYear;                       │
│   }                                                │
│                                                     │
│ Developer thinks: "So simple! No bugs possible!"   │
│                                                     │
│ Reality - Hidden bugs:                             │
│   calculateAge(2030) → -4 (future birth? 👶)       │
│   calculateAge(-500) → 2526 (time traveler? 🚀)    │
│   calculateAge("1990") → "20361990" (string bug!)  │
│   calculateAge(null) → NaN (crash!)                │
│   calculateAge() → NaN (undefined!)                │
│                                                     │
│ Lesson: Even "simple" code needs testing!          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Barrier 2: "Testing Waste of Time" Myth            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Short-term thinking:                               │
│   Writing code: 2 hours                            │
│   Writing tests: 1 hour                            │
│   Total: 3 hours                                   │
│   Thought: "Testing wasted 1 hour!" ❌             │
│                                                     │
│ Long-term reality:                                 │
│                                                     │
│ WITHOUT tests:                                     │
│   Writing code: 2 hours                            │
│   Bug in production: Found after 1 month           │
│   Context switching: 30 min to remember code       │
│   Debugging: 2 hours                               │
│   Emergency hotfix: 1 hour                         │
│   Regression bugs: 3 more hours                    │
│   Customer complaints: Priceless stress 😰         │
│   Total: 8+ hours + reputation damage              │
│                                                     │
│ WITH tests:                                        │
│   Writing code: 2 hours                            │
│   Writing tests: 1 hour                            │
│   Bug found immediately: 10 minutes to fix         │
│   Total: 3.17 hours ✅                             │
│                                                     │
│ Savings: 5 hours + peace of mind! 😊               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Barrier 3: "Tests Slow Me Down" Feeling            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Initial perception:                                │
│   Week 1: "Tests take extra time!" 😤              │
│   Week 2: "So much to write!" 😓                   │
│                                                     │
│ After 1 month:                                     │
│   "Tests caught 15 bugs before deployment!" 😮     │
│   "Refactoring is safe now!" 😊                    │
│   "I can change code confidently!" 💪              │
│                                                     │
│ After 3 months:                                    │
│   "Can't imagine coding without tests!" 🚀         │
│   "Tests saved me 20+ hours this month!" ⏰        │
│   "Zero production bugs!" 🎉                        │
│                                                     │
│ Reality: Tests are SPEED BOOSTERS in long run!    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Barrier 4: "Don't Know How to Test" Fear           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Common fears:                                      │
│   ❓ "What should I test?"                         │
│   ❓ "How many tests are enough?"                  │
│   ❓ "Am I testing wrong?"                         │
│   ❓ "What if my tests have bugs?"                 │
│                                                     │
│ Solution: Start simple!                            │
│                                                     │
│ Level 1: Test happy path                           │
│   test('adds numbers', () => {                     │
│     expect(add(2, 3)).toBe(5);                     │
│   });                                              │
│                                                     │
│ Level 2: Add edge cases                            │
│   test('handles zero', () => {                     │
│     expect(add(0, 0)).toBe(0);                     │
│   });                                              │
│                                                     │
│ Level 3: Test error cases                          │
│   test('rejects strings', () => {                  │
│     expect(() => add("a", 2)).toThrow();           │
│   });                                              │
│                                                     │
│ Mastery: Comes with practice! 🎯                   │
└─────────────────────────────────────────────────────┘
*/
```

### 3. The Testing Mindset Shift

```javascript
/*
Transform your thinking:

From: "I hope this works" 🤞
To:   "I KNOW this works" ✅

From: "Let me try in browser" 🖱️
To:   "Let me run my tests" 🧪

From: "User found a bug" 😱
To:   "Test caught the bug" 😊

From: "Scared to refactor" 😰
To:   "Tests give confidence" 💪

From: "Code might break" 🤔
To:   "Tests will tell me" 🔍

This shift takes:
- Week 1-2: Uncomfortable 😅
- Week 3-4: Getting used to it 🤓
- Month 2: Natural habit 😊
- Month 3+: Can't live without it! 🚀
*/
```

---

## Bug এর Cost Analysis

Bug কত expensive হতে পারে - stage by stage বিশ্লেষণ।

### 1. The Cost Escalation Principle

```javascript
/*
Rule: Bug fix cost INCREASES exponentially with time!

┌─────────────────────────────────────────────────────┐
│ STAGE 1: Development (During Coding)               │
├─────────────────────────────────────────────────────┤
│ When: Developer writing code                       │
│ Detection: Immediate (syntax error, test failure)  │
│ Cost: $1 (baseline)                                │
│ Time to fix: 1 minute                              │
│                                                     │
│ Example:                                           │
│   function add(a, b) {                             │
│     return a + b;                                  │
│   }                                                │
│                                                     │
│   test('adds', () => {                             │
│     expect(add(2, 3)).toBe(5); // Pass ✅          │
│   });                                              │
│                                                     │
│ Fix: Instant feedback, fresh in mind               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ STAGE 2: Testing (QA Phase)                        │
├─────────────────────────────────────────────────────┤
│ When: After feature complete, QA testing           │
│ Detection: Manual testing, integration tests       │
│ Cost: $10 (10x more expensive!)                    │
│ Time to fix: 1 hour                                │
│                                                     │
│ Why more expensive?                                │
│   - Context switch (what was I doing?)             │
│   - Need to understand code again                  │
│   - Multiple files to check                        │
│   - QA has to re-test                              │
│                                                     │
│ Example:                                           │
│   Bug: Login fails with special characters         │
│   Developer: "Oh, I wrote this 2 weeks ago..."     │
│   Need to: Re-read code, setup, debug, fix, retest │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ STAGE 3: Staging (Pre-Production)                  │
├─────────────────────────────────────────────────────┤
│ When: In staging environment                       │
│ Detection: User acceptance testing                 │
│ Cost: $100 (100x more expensive!)                  │
│ Time to fix: 1 day                                 │
│                                                     │
│ Why even more expensive?                           │
│   - Deployment pipeline involved                   │
│   - Multiple teams affected                        │
│   - Database migrations might be needed            │
│   - Rollback considerations                        │
│   - Stakeholder communication                      │
│                                                     │
│ Example:                                           │
│   Bug: Payment gateway returns wrong response      │
│   Impact: Entire release blocked                   │
│   Team: Emergency meeting                          │
│   Process: Fix → Test → Deploy → Retest            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ STAGE 4: Production (Live Users)                   │
├─────────────────────────────────────────────────────┤
│ When: Deployed to real users                       │
│ Detection: Customer complaints, monitoring alerts  │
│ Cost: $1,000 - $1,000,000+ (1000x - 1 million x!)  │
│ Time to fix: Days to weeks                         │
│                                                     │
│ Why MASSIVELY expensive?                           │
│   ✗ Real users affected                            │
│   ✗ Revenue loss                                   │
│   ✗ Reputation damage                              │
│   ✗ Emergency hotfix needed                        │
│   ✗ All hands on deck                              │
│   ✗ Customer support overwhelmed                   │
│   ✗ Potential legal issues                         │
│   ✗ Media coverage (if big company)                │
│                                                     │
│ Real Examples:                                     │
│   Knight Capital: $440M loss (45 minutes)          │
│   Amazon outage: $66,240 per minute!               │
│   British Airways: $100M in one day                │
└─────────────────────────────────────────────────────┘

Visual Representation:

Cost
  │
  │                                    ╱
  │                                 ╱
  │                             ╱
  │                         ╱
  │                    ╱
  │              ╱
  │         ╱
  │    ╱
  │──────────────────────────────────────> Time
  Dev   Testing  Staging  Production

Conclusion: CATCH BUGS EARLY! ⏰
*/
```

### 2. Real-World Cost Breakdown

```javascript
/*
Scenario: E-commerce checkout bug

┌─────────────────────────────────────────────────────┐
│ Bug: "Apply Discount" button applies discount twice │
│ (100$ item with 10% off becomes $81 instead of $90) │
└─────────────────────────────────────────────────────┘

IF CAUGHT IN DEVELOPMENT:
├─ Developer time: 5 minutes
├─ Cost: $2 (developer salary)
└─ Impact: Zero

IF CAUGHT IN TESTING:
├─ QA finds bug: 30 minutes
├─ Developer fixes: 1 hour
├─ QA retests: 30 minutes
├─ Total time: 2 hours
├─ Cost: $100
└─ Impact: Delayed release by 1 day

IF CAUGHT IN STAGING:
├─ Stakeholder finds bug: 1 hour
├─ Team meeting: 1 hour (5 people)
├─ Developer investigates: 2 hours
├─ Database check: 1 hour
├─ Fix & test: 2 hours
├─ Redeploy staging: 1 hour
├─ Retest everything: 4 hours
├─ Total time: 12 hours
├─ Cost: $1,500
└─ Impact: Release delayed 1 week

IF REACHED PRODUCTION:

Day 1:
├─ 1,000 customers exploit bug
├─ Loss: $9,000 ($9 per order)
├─ Monitoring alerts: 2am
├─ Emergency team call: 3am
├─ Investigation: 4 hours
├─ Hotfix: 3 hours
├─ Emergency deployment: 2 hours
├─ Cost so far: $9,000 + $2,000 (labor)

Day 2:
├─ Customer support tickets: 500+
├─ Support team overtime: $5,000
├─ Refund processing: $3,000
├─ Database cleanup: $1,000

Week 1:
├─ Lost customer trust: 200 customers leave
├─ Revenue impact: $50,000 (over time)
├─ Negative reviews: 100+ (brand damage)
├─ Marketing to recover: $20,000

Total Cost: $90,000+

ROI of testing:
├─ Test cost: $100
├─ Bug prevented loss: $90,000
└─ ROI: 90,000% !!! 🚀

Lesson: $100 in testing saves $90,000 in production!
*/
```

---

## Testing Principles & Philosophy

Software testing এর fundamental principles যা সব ধরনের testing এ apply হয়।

### 1. Seven Principles of Software Testing

```javascript
/*
ISTQB (International Software Testing Qualifications Board)
এর ৭টি মূলনীতি:

┌─────────────────────────────────────────────────────┐
│ Principle 1: Testing Shows Presence of Defects     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Testing can prove bugs EXIST                       │
│ Testing CANNOT prove bugs DON'T exist              │
│                                                     │
│ Example:                                           │
│   ✅ Test fails → Bug exists (proven!)             │
│   ✅ All tests pass → ??? (maybe no bugs, maybe     │
│                            tests are incomplete)   │
│                                                     │
│ Analogy:                                           │
│   Finding one cockroach proves infestation         │
│   Not finding cockroaches ≠ no cockroaches         │
│                                                     │
│ Implication:                                       │
│   - Don't say "Bug-free software"                  │
│   - Say "No known bugs" or "Well-tested"           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Principle 2: Exhaustive Testing is Impossible      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Can't test ALL combinations!                      │
│                                                     │
│ Example:                                           │
│   function login(email, password) { ... }          │
│                                                     │
│ Possible inputs:                                   │
│   Email: Infinite strings                          │
│   Password: Infinite strings                       │
│   Combinations: Infinity × Infinity = ∞            │
│                                                     │
│ Even simple calculator:                            │
│   add(a, b)                                        │
│   Possible numbers: -Infinity to +Infinity         │
│   Test all: Impossible! ♾️                         │
│                                                     │
│ Solution: Risk-based testing                       │
│   - Test most likely scenarios                     │
│   - Test most critical features                    │
│   - Test known edge cases                          │
│                                                     │
│ Use: Equivalence Partitioning                      │
│   Age input (0-150):                               │
│   Don't test all 151 values!                       │
│   Test: -1 (invalid), 0 (boundary), 25 (valid),   │
│         150 (boundary), 151 (invalid)              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Principle 3: Early Testing Saves Time and Money    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ "Shift Left" Testing                               │
│                                                     │
│ Traditional (Waterfall):                           │
│   Requirements → Design → Code → TEST ← Here!      │
│   Problem: Bugs found too late!                    │
│                                                     │
│ Modern (Shift Left):                               │
│   Requirements (test requirements!) →              │
│   Design (test design!) →                          │
│   Code (test code!) →                              │
│   Integration (test integration!)                  │
│                                                     │
│ Benefits:                                          │
│   ✅ Catch bugs in requirements (cheapest!)        │
│   ✅ Prevent bugs instead of fixing them           │
│   ✅ Better design (testable code)                 │
│                                                     │
│ Example:                                           │
│   Requirement: "User can pay"                      │
│   Early testing question:                          │
│     - What if payment fails?                       │
│     - What if network drops?                       │
│     - What if user clicks twice?                   │
│   → Fixed in DESIGN phase!                         │
│   → Not discovered in PRODUCTION!                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Principle 4: Defects Cluster Together              │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Pareto Principle (80/20 Rule):                     │
│   80% of bugs are in 20% of code!                  │
│                                                     │
│ Why?                                               │
│   - Complex modules have more bugs                 │
│   - Frequently changed code has more bugs          │
│   - Legacy code has accumulated bugs               │
│   - One bug often indicates more bugs nearby       │
│                                                     │
│ Real Project Example:                              │
│   ├─ auth/                 ← 50 bugs (complex!)    │
│   ├─ payment/              ← 40 bugs (critical!)   │
│   ├─ dashboard/            ← 5 bugs                │
│   ├─ about-page/           ← 1 bug                 │
│   └─ footer/               ← 0 bugs                │
│                                                     │
│ Strategy:                                          │
│   - Focus testing on complex areas                 │
│   - More tests for critical features               │
│   - If you find 1 bug, look for more nearby!       │
│                                                     │
│ Code Smell Detection:                              │
│   ⚠️ File >500 lines → Likely more bugs            │
│   ⚠️ Function >50 lines → Likely more bugs         │
│   ⚠️ Cyclomatic complexity >10 → Test more!        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Principle 5: Pesticide Paradox                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Analogy: Insects develop immunity to pesticides    │
│ Similarly: Running same tests repeatedly finds     │
│            fewer new bugs over time!               │
│                                                     │
│ Problem:                                           │
│   Week 1: 10 new tests → Found 10 bugs ✅          │
│   Week 2: Same tests → Found 3 bugs ✅             │
│   Week 3: Same tests → Found 0 bugs ✅             │
│   Week 4: Same tests → Found 0 bugs ✅             │
│                                                     │
│   Conclusion: Tests become "immune"                │
│   Reality: There ARE more bugs, tests miss them!   │
│                                                     │
│ Solution: Evolve your tests!                       │
│   ✅ Add new test cases regularly                  │
│   ✅ Update existing tests                         │
│   ✅ Test from different angles                    │
│   ✅ Use mutation testing                          │
│   ✅ Rotate test scenarios                         │
│                                                     │
│ Example:                                           │
│   Initial test:                                    │
│     test('login works', () => {                    │
│       login('user@test.com', 'pass123');           │
│     });                                            │
│                                                     │
│   Evolved tests (Week 2):                          │
│     - Try SQL injection                            │
│     - Try XSS attacks                              │
│     - Try rate limiting                            │
│     - Try concurrent logins                        │
│     - Try wrong passwords 10 times                 │
│                                                     │
│ Keep tests fresh! 🌱                               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Principle 6: Testing is Context Dependent          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Different apps need different testing strategies!  │
│                                                     │
│ ┌──────────────────────────────────────────────┐   │
│ │ E-commerce App                               │   │
│ ├──────────────────────────────────────────────┤   │
│ │ Critical: Payment, Checkout, Inventory       │   │
│ │ Testing Focus:                               │   │
│ │   - 90% tests on payment flow                │   │
│ │   - Security testing mandatory               │   │
│ │   - Load testing for sales                   │   │
│ │   - Transaction consistency                  │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ ┌──────────────────────────────────────────────┐   │
│ │ Social Media App                             │   │
│ ├──────────────────────────────────────────────┤   │
│ │ Critical: Real-time, Feeds, Notifications    │   │
│ │ Testing Focus:                               │   │
│ │   - 90% tests on real-time features          │   │
│ │   - Performance testing                      │   │
│ │   - Scalability testing                      │   │
│ │   - UI/UX testing                            │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ ┌──────────────────────────────────────────────┐   │
│ │ Banking App                                  │   │
│ ├──────────────────────────────────────────────┤   │
│ │ Critical: Security, Accuracy, Compliance     │   │
│ │ Testing Focus:                               │   │
│ │   - 100% code coverage required              │   │
│ │   - Penetration testing                      │   │
│ │   - Regulatory compliance testing            │   │
│ │   - Disaster recovery testing                │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ ┌──────────────────────────────────────────────┐   │
│ │ Gaming App                                   │   │
│ ├──────────────────────────────────────────────┤   │
│ │ Critical: Performance, Graphics, Physics     │   │
│ │ Testing Focus:                               │   │
│ │   - FPS testing                              │   │
│ │   - Memory leak testing                      │   │
│ │   - Multi-device testing                     │   │
│ │   - Gameplay testing                         │   │
│ └──────────────────────────────────────────────┘   │
│                                                     │
│ Lesson: One size does NOT fit all!                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Principle 7: Absence-of-Errors Fallacy             │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Mistake: "No bugs = Good software" ❌               │
│ Reality: "No bugs ≠ Good software" ✅               │
│                                                     │
│ Example 1: Perfectly Bug-Free... But Wrong!        │
│                                                     │
│   Requirement: "Calculate tax at 10%"              │
│                                                     │
│   Code:                                            │
│     function calculateTax(amount) {                │
│       return amount * 0.15; // 15%!                │
│     }                                              │
│                                                     │
│   Tests:                                           │
│     expect(calculateTax(100)).toBe(15); ✅         │
│     expect(calculateTax(200)).toBe(30); ✅         │
│                                                     │
│   All tests pass! No bugs! But...                  │
│   It's calculating WRONG percentage! 😱            │
│                                                     │
│ Example 2: Bug-Free... But Useless!                │
│                                                     │
│   Social media app:                                │
│     ✅ 100% test coverage                          │
│     ✅ Zero bugs                                    │
│     ✅ Perfect code quality                        │
│     ❌ But takes 10 seconds to load feed!          │
│     ❌ Users hate it and leave!                    │
│                                                     │
│   Lesson: Technical perfection ≠ User satisfaction │
│                                                     │
│ What matters:                                      │
│   1. Meets user needs ✅                           │
│   2. Solves real problems ✅                       │
│   3. Good user experience ✅                       │
│   4. AND has no bugs ✅                            │
│                                                     │
│ Testing should verify:                             │
│   - Functional correctness (no bugs)               │
│   - Business value (solves problem)                │
│   - User satisfaction (good UX)                    │
│   - Performance (fast enough)                      │
│   - Security (safe enough)                         │
│                                                     │
│ "Build the right thing, and build it right!" 🎯   │
└─────────────────────────────────────────────────────┘
*/
```

### 2. Testing as Documentation

```javascript
/*
Good tests serve as:
1. Executable documentation
2. Usage examples
3. Specification
4. Safety net

Example: Understanding code through tests
*/

// ❓ Looking at code - What does this do?
function calculateShipping(weight, distance, express) {
  const base = weight * 0.5;
  const dist = distance * 0.1;
  const multiplier = express ? 2 : 1;
  return (base + dist) * multiplier;
}
// Hard to understand! 🤔

// ✅ Looking at tests - Now it's CLEAR!
describe('calculateShipping', () => {
  test('charges $0.50 per kg', () => {
    expect(calculateShipping(10, 0, false)).toBe(5);
    // 10kg × $0.50 = $5
  });
  
  test('charges $0.10 per km', () => {
    expect(calculateShipping(0, 10, false)).toBe(1);
    // 10km × $0.10 = $1
  });
  
  test('doubles price for express', () => {
    expect(calculateShipping(10, 10, true)).toBe(12);
    // (10×0.5 + 10×0.1) × 2 = 12
  });
  
  test('combines weight and distance', () => {
    expect(calculateShipping(20, 50, false)).toBe(15);
    // 20×0.5 + 50×0.1 = 15
  });
});
// Now I understand perfectly! ✅

/*
Benefits:
- New developers learn from tests
- Tests never lie (unlike comments)
- Tests show actual usage
- Tests stay up-to-date (must run!)
*/
```

### 3. Test Doubles - টেস্ট এর বিভিন্ন প্রকার

```javascript
/*
Real world analogy:
  Movie shooting → Stunt double replaces actor
  Similarly → Test double replaces real dependency

Types of Test Doubles:
*/

┌─────────────────────────────────────────────────────┐
│ 1. DUMMY                                            │
├─────────────────────────────────────────────────────┤
│ Purpose: Fill parameter, never used                 │
│ Analogy: Dummy/mannequin in a car crash test        │
│                                                     │
│ Example:                                           │
│   function sendEmail(to, subject, body, logger) {  │
│     // logger not used in test                     │
│   }                                                │
│                                                     │
│   test('sends email', () => {                      │
│     const dummyLogger = null; // Just a placeholder│
│     sendEmail('test@test.com', 'Hi', 'Body',       │
│                dummyLogger);                        │
│   });                                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 2. STUB                                             │
├─────────────────────────────────────────────────────┤
│ Purpose: Provide canned answers                     │
│ Analogy: Pre-recorded answering machine             │
│                                                     │
│ Example:                                           │
│   // Real DB call (expensive!)                     │
│   const realDB = {                                 │
│     getUser(id) {                                  │
│       return database.query(...); // Real DB       │
│     }                                              │
│   };                                               │
│                                                     │
│   // Stub (returns fixed data)                     │
│   const stubDB = {                                 │
│     getUser(id) {                                  │
│       return { id, name: 'Test User' }; // Fake!   │
│     }                                              │
│   };                                               │
│                                                     │
│   test('displays user name', () => {               │
│     const user = stubDB.getUser(123);              │
│     expect(user.name).toBe('Test User');           │
│   });                                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 3. SPY                                              │
├─────────────────────────────────────────────────────┤
│ Purpose: Record information about calls             │
│ Analogy: Security camera recording everything       │
│                                                     │
│ Example:                                           │
│   const emailSpy = {                               │
│     calls: [],                                     │
│     send(to, subject) {                            │
│       this.calls.push({ to, subject });            │
│       return true;                                 │
│     }                                              │
│   };                                               │
│                                                     │
│   test('sends welcome email', () => {              │
│     sendWelcomeEmail(emailSpy, 'new@user.com');    │
│                                                     │
│     expect(emailSpy.calls).toHaveLength(1);        │
│     expect(emailSpy.calls[0].to).toBe('new@...');  │
│     expect(emailSpy.calls[0].subject)              │
│       .toContain('Welcome');                       │
│   });                                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 4. MOCK                                             │
├─────────────────────────────────────────────────────┤
│ Purpose: Pre-programmed with expectations           │
│ Analogy: Actor following a script exactly           │
│                                                     │
│ Example:                                           │
│   const mockDB = jest.fn();                        │
│   mockDB.mockReturnValue({ id: 1, name: 'John' });│
│                                                     │
│   test('fetches user', () => {                     │
│     const user = mockDB(123);                      │
│                                                     │
│     expect(mockDB).toHaveBeenCalledWith(123);      │
│     expect(mockDB).toHaveBeenCalledTimes(1);       │
│     expect(user.name).toBe('John');                │
│   });                                              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 5. FAKE                                             │
├─────────────────────────────────────────────────────┤
│ Purpose: Working implementation, but simplified     │
│ Analogy: Toy car vs real car (works, but simpler)  │
│                                                     │
│ Example:                                           │
│   // Real database (complex!)                      │
│   class RealDatabase {                             │
│     async save(data) {                             │
│       // Connect to MySQL                          │
│       // Run transaction                           │
│       // Handle errors                             │
│     }                                              │
│   }                                                │
│                                                     │
│   // Fake database (simple in-memory)              │
│   class FakeDatabase {                             │
│     constructor() {                                │
│       this.data = {};                              │
│     }                                              │
│     async save(key, value) {                       │
│       this.data[key] = value; // Just use object!  │
│     }                                              │
│     async get(key) {                               │
│       return this.data[key];                       │
│     }                                              │
│   }                                                │
│                                                     │
│   test('saves and retrieves data', () => {         │
│     const db = new FakeDatabase();                 │
│     db.save('user:1', { name: 'John' });           │
│     expect(db.get('user:1').name).toBe('John');    │
│   });                                              │
└─────────────────────────────────────────────────────┘

/*
When to use what?

Dummy:    Parameter needed but not used
Stub:     Need to return specific data
Spy:      Need to verify calls were made
Mock:     Need to verify exact behavior
Fake:     Need working but simple implementation
*/
```

---

## কেন Testing দরকার

Testing কেন essential এবং এর benefits কি।

Testing কেন essential এবং এর benefits কি।

### 1. Without Testing vs With Testing

```javascript
/*
❌ Without Testing:

Developer writes code
        ↓
Deploy to production
        ↓
Bug discovered by users 😱
        ↓
Emergency fix
        ↓
Deploy hotfix
        ↓
New bug introduced 😭
        ↓
[Repeat cycle...]

Result:
- User frustration
- Lost revenue
- Developer stress
- Technical debt
- Reputation damage
*/

/*
✅ With Testing:

Developer writes code
        ↓
Write tests
        ↓
Run tests locally
        ↓
Bug found (before deployment!) ✅
        ↓
Fix bug
        ↓
Tests pass ✅
        ↓
Deploy confidently
        ↓
Users happy 😊

Result:
- Fewer production bugs
- Confident deployments
- Better code quality
- Easy refactoring
- Documentation through tests
*/
```

### 2. Real-world Example

```javascript
// ❌ Code without tests - Looks fine but has bugs!

function calculateDiscount(price, discountPercent) {
  return price - (price * discountPercent / 100);
}

// Deployed to production...
console.log(calculateDiscount(100, 10));  // 90 ✅
console.log(calculateDiscount(100, 0));   // 100 ✅
console.log(calculateDiscount(100, -10)); // 110 ❌ Bug! Negative discount!
console.log(calculateDiscount(100, 150)); // -50 ❌ Bug! Over 100% discount!
console.log(calculateDiscount("100", 10)); // "10090" ❌ Bug! String concatenation!

/*
Users found these bugs in production! 😱
- Negative prices
- Free products
- Calculation errors
*/
```

```javascript
// ✅ Code with tests - Bugs caught before deployment!

function calculateDiscount(price, discountPercent) {
  // Validation
  if (typeof price !== 'number' || typeof discountPercent !== 'number') {
    throw new Error('Price and discount must be numbers');
  }
  
  if (price < 0) {
    throw new Error('Price cannot be negative');
  }
  
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount must be between 0 and 100');
  }
  
  return price - (price * discountPercent / 100);
}

// Tests
describe('calculateDiscount', () => {
  test('should calculate discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });
  
  test('should handle 0% discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });
  
  test('should throw error for negative discount', () => {
    expect(() => calculateDiscount(100, -10)).toThrow('Discount must be between 0 and 100');
  });
  
  test('should throw error for discount > 100', () => {
    expect(() => calculateDiscount(100, 150)).toThrow('Discount must be between 0 and 100');
  });
  
  test('should throw error for string price', () => {
    expect(() => calculateDiscount("100", 10)).toThrow('Price and discount must be numbers');
  });
  
  test('should throw error for negative price', () => {
    expect(() => calculateDiscount(-100, 10)).toThrow('Price cannot be negative');
  });
});

/*
All bugs caught by tests! ✅
Deployed with confidence!
*/
```

### 3. Testing Benefits মাপুন

```javascript
/*
Metrics to track:

1. Bug Detection Rate:
   Before Testing: 80% bugs found in production
   After Testing: 5% bugs found in production
   Improvement: 94% ✅

2. Deployment Confidence:
   Before: Fear every deployment 😰
   After: Deploy 10x per day confidently 😎

3. Development Speed:
   Before: Slow (fear of breaking things)
   After: Fast (tests catch regressions)

4. Code Quality:
   Before: Spaghetti code
   After: Clean, testable code

5. Developer Happiness:
   Before: Stressful debugging
   After: Peaceful refactoring
*/
```

### 📝 **Hands-on Example: See Testing Impact**

```javascript
// ✅ Example: Shopping Cart (Without Tests vs With Tests)

// WITHOUT TESTS - Bug-prone code
class ShoppingCartBuggy {
  constructor() {
    this.items = [];
  }
  
  addItem(item) {
    this.items.push(item);
  }
  
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
  
  applyDiscount(percent) {
    const total = this.getTotal();
    return total - (total * percent / 100);
  }
}

// Usage
const cart = new ShoppingCartBuggy();
cart.addItem({ name: 'Book', price: 10 });
cart.addItem({ name: 'Pen' }); // ❌ Bug! No price property
console.log(cart.getTotal()); // NaN ❌

cart.addItem({ name: 'Eraser', price: '5' }); // ❌ Bug! String price
console.log(cart.getTotal()); // "105" ❌ String concatenation!

// These bugs will reach production! 😱
```

```javascript
// WITH TESTS - Robust code

class ShoppingCart {
  constructor() {
    this.items = [];
  }
  
  addItem(item) {
    // Validation added because of tests!
    if (!item || typeof item !== 'object') {
      throw new Error('Item must be an object');
    }
    
    if (!item.name || typeof item.name !== 'string') {
      throw new Error('Item must have a name');
    }
    
    if (typeof item.price !== 'number' || item.price < 0) {
      throw new Error('Item must have a valid price');
    }
    
    this.items.push(item);
  }
  
  removeItem(itemName) {
    const index = this.items.findIndex(item => item.name === itemName);
    if (index === -1) {
      throw new Error('Item not found');
    }
    this.items.splice(index, 1);
  }
  
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
  
  applyDiscount(percent) {
    if (typeof percent !== 'number' || percent < 0 || percent > 100) {
      throw new Error('Discount must be between 0 and 100');
    }
    
    const total = this.getTotal();
    return total - (total * percent / 100);
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  clear() {
    this.items = [];
  }
}

// Comprehensive tests
describe('ShoppingCart', () => {
  let cart;
  
  beforeEach(() => {
    cart = new ShoppingCart();
  });
  
  describe('addItem', () => {
    test('should add valid item', () => {
      cart.addItem({ name: 'Book', price: 10 });
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].name).toBe('Book');
    });
    
    test('should reject item without price', () => {
      expect(() => {
        cart.addItem({ name: 'Pen' });
      }).toThrow('Item must have a valid price');
    });
    
    test('should reject item with string price', () => {
      expect(() => {
        cart.addItem({ name: 'Eraser', price: '5' });
      }).toThrow('Item must have a valid price');
    });
    
    test('should reject item with negative price', () => {
      expect(() => {
        cart.addItem({ name: 'Gift', price: -10 });
      }).toThrow('Item must have a valid price');
    });
    
    test('should reject non-object item', () => {
      expect(() => {
        cart.addItem('Book');
      }).toThrow('Item must be an object');
    });
  });
  
  describe('getTotal', () => {
    test('should return 0 for empty cart', () => {
      expect(cart.getTotal()).toBe(0);
    });
    
    test('should calculate total correctly', () => {
      cart.addItem({ name: 'Book', price: 10 });
      cart.addItem({ name: 'Pen', price: 5 });
      expect(cart.getTotal()).toBe(15);
    });
  });
  
  describe('applyDiscount', () => {
    beforeEach(() => {
      cart.addItem({ name: 'Book', price: 100 });
    });
    
    test('should apply discount correctly', () => {
      expect(cart.applyDiscount(10)).toBe(90);
    });
    
    test('should handle 0% discount', () => {
      expect(cart.applyDiscount(0)).toBe(100);
    });
    
    test('should reject negative discount', () => {
      expect(() => cart.applyDiscount(-10)).toThrow();
    });
    
    test('should reject discount > 100', () => {
      expect(() => cart.applyDiscount(150)).toThrow();
    });
  });
  
  describe('removeItem', () => {
    test('should remove existing item', () => {
      cart.addItem({ name: 'Book', price: 10 });
      cart.removeItem('Book');
      expect(cart.isEmpty()).toBe(true);
    });
    
    test('should throw error for non-existent item', () => {
      expect(() => cart.removeItem('Book')).toThrow('Item not found');
    });
  });
});

/*
Running tests:
$ npm test

PASS  ./ShoppingCart.test.js
  ShoppingCart
    addItem
      ✓ should add valid item (3ms)
      ✓ should reject item without price (2ms)
      ✓ should reject item with string price (1ms)
      ✓ should reject item with negative price (1ms)
      ✓ should reject non-object item (1ms)
    getTotal
      ✓ should return 0 for empty cart (1ms)
      ✓ should calculate total correctly (1ms)
    applyDiscount
      ✓ should apply discount correctly (1ms)
      ✓ should handle 0% discount (1ms)
      ✓ should reject negative discount (1ms)
      ✓ should reject discount > 100 (1ms)
    removeItem
      ✓ should remove existing item (1ms)
      ✓ should throw error for non-existent item (1ms)

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total

All bugs caught before production! ✅
*/
```

---

## Testing Pyramid

Testing strategy এবং different levels of testing।

### 1. Testing Pyramid এর Origin & Theory

```javascript
/*
History: Mike Cohn (2009) introduced the Test Pyramid concept
Book: "Succeeding with Agile"

Problem it solved:
  Traditional testing (2000s):
    - Manual testing heavy
    - Slow feedback loops
    - Expensive QA teams
    - Late bug discovery

  Ice Cream Cone Anti-pattern:
    ┌─────────────────┐
    │                 │
    │  Manual Testing │  ← Most tests (slow!)
    │                 │
    ├─────────────────┤
    │  E2E Automation │  ← Some
    ├─────────────────┤
    │  Integration    │  ← Few
    ├───┐
    │ U │  ← Almost none!
    └───┘
    
    Problems:
    - Slow test execution (hours!)
    - Flaky tests
    - Expensive maintenance
    - Late feedback

Solution: FLIP IT! → Test Pyramid
    
    ┌───┐
    │ E │  ← Few (fast feedback from unit tests!)
    ├─────┤
    │ Int │  ← Some
    ├───────────┤
    │           │
    │   Unit    │  ← Most
    │           │
    └───────────┘
    
    Benefits:
    ✅ Fast feedback (seconds not hours)
    ✅ Cheaper to maintain
    ✅ More stable tests
    ✅ Better ROI
*/
```

### 2. The Science Behind The Pyramid

```javascript
/*
Why this specific distribution (70-20-10)?

┌─────────────────────────────────────────────────────┐
│ Mathematical Analysis: ROI Optimization             │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Variables to optimize:                             │
│   C = Cost (time + money)                          │
│   S = Speed (feedback time)                        │
│   R = Reliability (flakiness)                      │
│   B = Bugs found                                   │
│                                                     │
│ Goal: Maximize B, Minimize C, S, minimize R flakes │
│                                                     │
│ Unit Tests:                                        │
│   Cost: $1                                         │
│   Speed: 10ms                                      │
│   Reliability: 99%                                 │
│   Bugs found: 60%                                  │
│   ROI: (0.60 bugs / $1) / 10ms = HIGH! ✅          │
│                                                     │
│ Integration Tests:                                 │
│   Cost: $10                                        │
│   Speed: 1000ms                                    │
│   Reliability: 95%                                 │
│   Bugs found: 30%                                  │
│   ROI: (0.30 bugs / $10) / 1000ms = MEDIUM         │
│                                                     │
│ E2E Tests:                                         │
│   Cost: $100                                       │
│   Speed: 10000ms                                   │
│   Reliability: 85%                                 │
│   Bugs found: 10%                                  │
│   ROI: (0.10 bugs / $100) / 10000ms = LOW          │
│                                                     │
│ Optimal distribution:                              │
│   Unit: 70% (best ROI)                             │
│   Integration: 20% (catch integration bugs)        │
│   E2E: 10% (critical user journeys)                │
│                                                     │
│ Result: Maximum coverage at minimum cost! 🎯       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Feedback Loop Theory                                │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Developer productivity depends on feedback speed:  │
│                                                     │
│ Immediate feedback (<1 second):                    │
│   ├─ Developer in "flow state"                     │
│   ├─ Context fully loaded in brain                 │
│   ├─ Can fix immediately                           │
│   └─ Productivity: 100% ✅                         │
│                                                     │
│ Fast feedback (1-10 seconds):                      │
│   ├─ Still in context                              │
│   ├─ Can remember what was changed                 │
│   └─ Productivity: 80% ✅                          │
│                                                     │
│ Slow feedback (1-10 minutes):                      │
│   ├─ Context partially lost                        │
│   ├─ Need to re-read code                          │
│   └─ Productivity: 40% ⚠️                          │
│                                                     │
│ Very slow feedback (>1 hour):                      │
│   ├─ Complete context loss                         │
│   ├─ "What was I doing?" syndrome                  │
│   ├─ Need full debugging session                   │
│   └─ Productivity: 10% ❌                          │
│                                                     │
│ Pyramid ensures FAST feedback:                     │
│   70% Unit tests → Run in <1 second                │
│   20% Integration → Run in <1 minute               │
│   10% E2E → Run in <10 minutes                     │
│                                                     │
│ Total test suite: ~2 minutes ✅                    │
│ vs Ice Cream Cone: ~2 hours ❌                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Test Stability Theory                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Flakiness increases with dependencies:             │
│                                                     │
│ Unit Test (0 external dependencies):               │
│   Flakiness: 1%                                    │
│   Reason: Pure functions, deterministic            │
│                                                     │
│ Integration Test (2-3 dependencies):               │
│   DB + API + File system                           │
│   Flakiness: 5%                                    │
│   Reasons:                                         │
│     - DB connection issues                         │
│     - Network timeouts                             │
│     - File locks                                   │
│                                                     │
│ E2E Test (10+ dependencies):                       │
│   Browser + DB + APIs + Network + Server + ...     │
│   Flakiness: 15%                                   │
│   Reasons:                                         │
│     - Browser rendering timing                     │
│     - Network delays                               │
│     - Animation timing                             │
│     - Resource loading                             │
│     - Race conditions                              │
│     - Environment differences                      │
│                                                     │
│ Formula: Flakiness = 1 - ∏(Reliability of each dep)│
│                                                     │
│ Example E2E:                                       │
│   Browser: 99% × DB: 99% × API: 99% × Network: 99%│
│   = 0.99⁴ = 96% reliability = 4% flakiness        │
│                                                     │
│ Pyramid minimizes flakiness:                       │
│   More stable tests (Unit) → More tests            │
│   Less stable tests (E2E) → Fewer tests            │
└─────────────────────────────────────────────────────┘
*/
```

### 3. Alternative Test Shapes (When Pyramid Doesn't Fit)

```javascript
/*
┌─────────────────────────────────────────────────────┐
│ Testing Trophy (Kent C. Dodds)                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│         ┌───┐                                       │
│        │ E2E │  ← Few (critical flows)              │
│       ┌───────┐                                     │
│      │        │                                     │
│      │  Int   │  ← MOST (50-60%)                    │
│      │        │                                     │
│     ┌──────────┐                                    │
│    │   Unit    │  ← Some (30-40%)                   │
│    └──────────┘                                     │
│   │  Static   │  ← TypeScript, Linting              │
│   └───────────┘                                     │
│                                                     │
│ Best for: Frontend apps, UI-heavy                  │
│                                                     │
│ Reasoning:                                         │
│   - UI components work together                    │
│   - Integration bugs more common                   │
│   - User interactions cross components             │
│   - Unit tests too isolated for UI                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Testing Diamond (Microservices)                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│      ┌───┐                                          │
│     │ E2E │  ← Few (critical flows)                 │
│    ┌───────┐                                        │
│   │        │                                        │
│   │  Cont  │  ← Many (contract tests)              │
│   │        │  Service-to-service                    │
│    ┌───────┐                                        │
│   │  Int   │  ← Some (within service)              │
│    ┌───────┐                                        │
│   │  Unit  │  ← Many (business logic)              │
│   └────────┘                                        │
│                                                     │
│ Best for: Microservices architecture               │
│                                                     │
│ Reasoning:                                         │
│   - Service boundaries critical                    │
│   - Contract testing prevents breaks               │
│   - E2E across services expensive                  │
│   - Focus on integration between services          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Inverted Pyramid (Legacy Code)                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌───────────┐                                     │
│  │            │                                     │
│  │    E2E     │  ← Most (protect critical flows)   │
│  │            │                                     │
│   ┌──────────┐                                      │
│    │  Int   │  ← Some                              │
│     ┌──────┐                                        │
│      │Unit│  ← Few (gradually increase)            │
│      └────┘                                         │
│                                                     │
│ When: Legacy codebase, no tests                    │
│                                                     │
│ Strategy:                                          │
│   1. Add E2E tests first (protect what works)      │
│   2. Gradually add integration tests               │
│   3. Refactor code to be testable                  │
│   4. Add unit tests as you refactor                │
│   5. Eventually reach pyramid shape                │
│                                                     │
│ Transition: Inverted → Diamond → Pyramid           │
└─────────────────────────────────────────────────────┘
*/
```

### 4. The Testing Pyramid

```javascript
/*
        ┌───────────┐
       │    E2E    │  ← Few (10%)
       │  Testing  │     Slow, Expensive
      └─────────────┘
     ┌───────────────┐
    │  Integration   │  ← Some (20%)
    │    Testing     │     Medium speed
   └─────────────────┘
  ┌───────────────────┐
 │   Unit Testing     │  ← Many (70%)
 │                    │     Fast, Cheap
└─────────────────────┘

Distribution:
- 70% Unit Tests (Fast, isolated)
- 20% Integration Tests (Medium, combined)
- 10% E2E Tests (Slow, full system)

Why this shape?
- Unit tests are cheap & fast → Write many
- E2E tests are expensive & slow → Write few
- Find bugs early (at unit level) → Cheaper to fix
*/
```

### 2. Testing Levels Explained

```javascript
/*
┌─────────────────────────────────────────────────┐
│ UNIT TESTING (70% of tests)                     │
├─────────────────────────────────────────────────┤
│ Test: Individual functions/classes              │
│ Scope: Single unit in isolation                 │
│ Speed: Very fast (milliseconds)                 │
│ Cost: Low (easy to write)                       │
│ Examples:                                       │
│  - Function returns correct value               │
│  - Class method works properly                  │
│  - Utility validates input                      │
│                                                 │
│ function add(a, b) { return a + b; }            │
│ test('adds 2+3 to equal 5', () => {             │
│   expect(add(2, 3)).toBe(5);                    │
│ });                                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ INTEGRATION TESTING (20% of tests)              │
├─────────────────────────────────────────────────┤
│ Test: Multiple units working together           │
│ Scope: API routes, database queries             │
│ Speed: Medium (seconds)                         │
│ Cost: Medium (need setup)                       │
│ Examples:                                       │
│  - API endpoint returns correct data            │
│  - Database save & retrieve works               │
│  - Service layer integrates correctly           │
│                                                 │
│ test('POST /users creates user', async () => {  │
│   const res = await request(app)                │
│     .post('/users')                             │
│     .send({ name: 'John' });                    │
│   expect(res.status).toBe(201);                 │
│ });                                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ E2E TESTING (10% of tests)                      │
├─────────────────────────────────────────────────┤
│ Test: Complete user flows                       │
│ Scope: Entire application                       │
│ Speed: Slow (minutes)                           │
│ Cost: High (complex setup)                      │
│ Examples:                                       │
│  - User can signup → login → buy product        │
│  - Complete checkout flow                       │
│  - Full user journey                            │
│                                                 │
│ test('User can complete purchase', async () => {│
│   await browser.goto('/signup');                │
│   await fillForm({ email, password });          │
│   await clickButton('Sign Up');                 │
│   await goto('/products');                      │
│   await addToCart('iPhone');                    │
│   await checkout();                             │
│   expect(orderConfirmation).toBeVisible();      │
│ });                                             │
└─────────────────────────────────────────────────┘
*/
```

### 📝 **Hands-on Example: All Three Levels**

```javascript
// ✅ Complete example showing all 3 levels

// ====================
// CODE TO TEST
// ====================

// utils/validator.js
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// models/User.js
class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }
  
  async save() {
    // Save to database
    return db.users.insert(this);
  }
}

// services/UserService.js
class UserService {
  async createUser(userData) {
    if (!validateEmail(userData.email)) {
      throw new Error('Invalid email');
    }
    
    const user = new User(userData);
    await user.save();
    return user;
  }
}

// routes/users.js
router.post('/users', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ====================
// LEVEL 1: UNIT TESTS (70%)
// ====================

// tests/unit/validator.test.js
describe('validateEmail', () => {
  test('should accept valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
  
  test('should reject email without @', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });
  
  test('should reject email without domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });
  
  test('should reject email with spaces', () => {
    expect(validateEmail('test @example.com')).toBe(false);
  });
});

// tests/unit/User.test.js
describe('User', () => {
  test('should create user with correct data', () => {
    const user = new User({
      name: 'John',
      email: 'john@example.com',
      password: 'secret'
    });
    
    expect(user.name).toBe('John');
    expect(user.email).toBe('john@example.com');
  });
});

// tests/unit/UserService.test.js (with mocks)
describe('UserService', () => {
  test('should create user with valid data', async () => {
    const userData = {
      name: 'John',
      email: 'john@example.com',
      password: 'secret'
    };
    
    const user = await userService.createUser(userData);
    expect(user.email).toBe('john@example.com');
  });
  
  test('should reject invalid email', async () => {
    const userData = {
      name: 'John',
      email: 'invalid-email',
      password: 'secret'
    };
    
    await expect(userService.createUser(userData))
      .rejects.toThrow('Invalid email');
  });
});

/*
Unit Test Results:
✓ 10 tests run
✓ All passed
✓ Time: 45ms
✓ Coverage: Functions 100%, Lines 95%
*/

// ====================
// LEVEL 2: INTEGRATION TESTS (20%)
// ====================

// tests/integration/users.test.js
const request = require('supertest');
const app = require('../app');
const db = require('../database');

describe('User API Integration', () => {
  beforeEach(async () => {
    await db.users.clear(); // Clean database
  });
  
  test('POST /users should create user in database', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret123'
    };
    
    const res = await request(app)
      .post('/users')
      .send(userData)
      .expect(201);
    
    expect(res.body.name).toBe('John Doe');
    expect(res.body.email).toBe('john@example.com');
    
    // Verify in database
    const userInDb = await db.users.findOne({ email: 'john@example.com' });
    expect(userInDb).toBeTruthy();
    expect(userInDb.name).toBe('John Doe');
  });
  
  test('POST /users should reject invalid email', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'John',
        email: 'invalid',
        password: 'secret'
      })
      .expect(400);
    
    expect(res.body.error).toBe('Invalid email');
    
    // Verify NOT in database
    const count = await db.users.count();
    expect(count).toBe(0);
  });
});

/*
Integration Test Results:
✓ 5 tests run
✓ All passed
✓ Time: 2.3s (includes DB operations)
✓ Database integration verified
*/

// ====================
// LEVEL 3: E2E TESTS (10%)
// ====================

// tests/e2e/userJourney.test.js
const puppeteer = require('puppeteer');

describe('User Registration Flow E2E', () => {
  let browser, page;
  
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  test('Complete user signup and login flow', async () => {
    // 1. Go to signup page
    await page.goto('http://localhost:3000/signup');
    
    // 2. Fill signup form
    await page.type('#name', 'John Doe');
    await page.type('#email', 'john@example.com');
    await page.type('#password', 'secret123');
    
    // 3. Submit
    await page.click('#signup-button');
    
    // 4. Wait for redirect to login
    await page.waitForNavigation();
    expect(page.url()).toContain('/login');
    
    // 5. Fill login form
    await page.type('#email', 'john@example.com');
    await page.type('#password', 'secret123');
    
    // 6. Submit login
    await page.click('#login-button');
    
    // 7. Wait for dashboard
    await page.waitForNavigation();
    expect(page.url()).toContain('/dashboard');
    
    // 8. Verify user is logged in
    const welcomeText = await page.$eval('#welcome', el => el.textContent);
    expect(welcomeText).toContain('Welcome, John Doe');
  }, 30000); // 30 second timeout for E2E
});

/*
E2E Test Results:
✓ 2 tests run
✓ All passed
✓ Time: 15.8s (browser automation)
✓ Full user journey verified
*/

// ====================
// SUMMARY
// ====================

/*
Test Suite Results:

Unit Tests:
  ✓ 10 passed
  ⏱ 45ms
  📊 70% of total tests

Integration Tests:
  ✓ 5 passed
  ⏱ 2.3s
  📊 20% of total tests

E2E Tests:
  ✓ 2 passed
  ⏱ 15.8s
  📊 10% of total tests

Total: 17 tests, 18.145s

Perfect pyramid! ✅

Cost Analysis:
- Unit test failure: Fix in 2 minutes
- Integration test failure: Fix in 10 minutes
- E2E test failure: Fix in 30 minutes
- Production bug: Fix in 2 hours + reputation damage

Catching bugs early saves time and money!
*/
```

---

## Testing Types তুলনা

বিভিন্ন testing types এর detailed comparison।

### 1. Comparison Table

```javascript
/*
┌──────────────┬──────────┬─────────┬────────┬──────────┬─────────┐
│ Type         │ Speed    │ Cost    │ Scope  │ Isolation│ When    │
├──────────────┼──────────┼─────────┼────────┼──────────┼─────────┤
│ Unit         │ Fastest  │ Lowest  │ Small  │ High     │ Always  │
│              │ <1ms     │ $       │ Func   │ Mocked   │ 70%     │
├──────────────┼──────────┼─────────┼────────┼──────────┼─────────┤
│ Integration  │ Medium   │ Medium  │ Medium │ Medium   │ Often   │
│              │ 1s-10s   │ $$      │ API    │ Real DB  │ 20%     │
├──────────────┼──────────┼─────────┼────────┼──────────┼─────────┤
│ E2E          │ Slowest  │ Highest │ Large  │ Low      │ Critical│
│              │ 10s-60s  │ $$$     │ Full   │ Real All │ 10%     │
└──────────────┴──────────┴─────────┴────────┴──────────┴─────────┘
*/
```

### 2. When to Use Each Type

```javascript
/*
┌─────────────────────────────────────────────────────┐
│ UNIT TESTS - Use when:                              │
├─────────────────────────────────────────────────────┤
│ ✅ Testing business logic                           │
│ ✅ Testing utility functions                        │
│ ✅ Testing class methods                            │
│ ✅ Testing edge cases                               │
│ ✅ Fast feedback needed                             │
│                                                     │
│ Examples:                                           │
│  - validateEmail('test@example.com')                │
│  - calculateDiscount(100, 10)                       │
│  - formatDate(new Date())                           │
│  - User.validatePassword('secret123')               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ INTEGRATION TESTS - Use when:                       │
├─────────────────────────────────────────────────────┤
│ ✅ Testing API endpoints                            │
│ ✅ Testing database operations                      │
│ ✅ Testing service integrations                     │
│ ✅ Testing authentication flow                      │
│ ✅ Multiple components interact                     │
│                                                     │
│ Examples:                                           │
│  - POST /api/users creates user in DB               │
│  - GET /api/products returns products               │
│  - UserService saves to database                    │
│  - JWT authentication works                         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ E2E TESTS - Use when:                               │
├─────────────────────────────────────────────────────┤
│ ✅ Testing critical user journeys                   │
│ ✅ Testing checkout flow                            │
│ ✅ Testing signup/login flow                        │
│ ✅ Testing payment integration                      │
│ ✅ End-to-end verification needed                   │
│                                                     │
│ Examples:                                           │
│  - User can sign up and buy product                 │
│  - Admin can manage inventory                       │
│  - Customer can track order                         │
│  - Payment flow works completely                    │
└─────────────────────────────────────────────────────┘
*/
```

### 📝 **Hands-on Example: Choosing Right Test Type**

```javascript
// ✅ Scenario: E-commerce Add to Cart Feature

// ====================
// FEATURE CODE
// ====================

// utils/validation.js
function validateQuantity(qty) {
  return Number.isInteger(qty) && qty > 0 && qty <= 99;
}

// models/Cart.js
class Cart {
  constructor(userId) {
    this.userId = userId;
    this.items = [];
  }
  
  addItem(productId, quantity) {
    if (!validateQuantity(quantity)) {
      throw new Error('Invalid quantity');
    }
    
    const existing = this.items.find(item => item.productId === productId);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ productId, quantity });
    }
  }
  
  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

// services/CartService.js
class CartService {
  async addToCart(userId, productId, quantity) {
    // Get or create cart
    let cart = await db.carts.findOne({ userId });
    
    if (!cart) {
      cart = new Cart(userId);
    }
    
    // Verify product exists
    const product = await db.products.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Verify stock
    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    
    // Add to cart
    cart.addItem(productId, quantity);
    
    // Save
    await db.carts.save(cart);
    
    return cart;
  }
}

// routes/cart.js
router.post('/cart/add', authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user.id, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ====================
// UNIT TESTS (70%)
// ====================

describe('validateQuantity (Unit)', () => {
  test('should accept valid quantity', () => {
    expect(validateQuantity(1)).toBe(true);
    expect(validateQuantity(50)).toBe(true);
  });
  
  test('should reject zero', () => {
    expect(validateQuantity(0)).toBe(false);
  });
  
  test('should reject negative', () => {
    expect(validateQuantity(-1)).toBe(false);
  });
  
  test('should reject over 99', () => {
    expect(validateQuantity(100)).toBe(false);
  });
  
  test('should reject decimal', () => {
    expect(validateQuantity(1.5)).toBe(false);
  });
  
  test('should reject string', () => {
    expect(validateQuantity('5')).toBe(false);
  });
});

describe('Cart (Unit)', () => {
  let cart;
  
  beforeEach(() => {
    cart = new Cart('user123');
  });
  
  test('should add new item', () => {
    cart.addItem('prod1', 2);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toEqual({ productId: 'prod1', quantity: 2 });
  });
  
  test('should increase quantity for existing item', () => {
    cart.addItem('prod1', 2);
    cart.addItem('prod1', 3);
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(5);
  });
  
  test('should calculate total items', () => {
    cart.addItem('prod1', 2);
    cart.addItem('prod2', 3);
    expect(cart.getTotalItems()).toBe(5);
  });
  
  test('should throw error for invalid quantity', () => {
    expect(() => cart.addItem('prod1', 0)).toThrow('Invalid quantity');
    expect(() => cart.addItem('prod1', -1)).toThrow('Invalid quantity');
  });
});

// ====================
// INTEGRATION TESTS (20%)
// ====================

describe('POST /cart/add (Integration)', () => {
  let token;
  
  beforeEach(async () => {
    await db.clear();
    
    // Create test user
    const user = await db.users.create({ name: 'John', email: 'john@test.com' });
    token = generateToken(user);
    
    // Create test product
    await db.products.create({
      _id: 'prod1',
      name: 'iPhone',
      price: 999,
      stock: 10
    });
  });
  
  test('should add product to cart', async () => {
    const res = await request(app)
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'prod1', quantity: 2 })
      .expect(200);
    
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].quantity).toBe(2);
    
    // Verify in database
    const cartInDb = await db.carts.findOne({ userId: user._id });
    expect(cartInDb.items).toHaveLength(1);
  });
  
  test('should reject non-existent product', async () => {
    const res = await request(app)
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'invalid', quantity: 1 })
      .expect(400);
    
    expect(res.body.error).toBe('Product not found');
  });
  
  test('should reject insufficient stock', async () => {
    const res = await request(app)
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 'prod1', quantity: 20 })
      .expect(400);
    
    expect(res.body.error).toBe('Insufficient stock');
  });
  
  test('should require authentication', async () => {
    await request(app)
      .post('/cart/add')
      .send({ productId: 'prod1', quantity: 1 })
      .expect(401);
  });
});

// ====================
// E2E TESTS (10%)
// ====================

describe('Add to Cart User Journey (E2E)', () => {
  test('User can browse and add product to cart', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    try {
      // 1. User logs in
      await page.goto('http://localhost:3000/login');
      await page.type('#email', 'john@example.com');
      await page.type('#password', 'secret123');
      await page.click('#login-button');
      await page.waitForNavigation();
      
      // 2. User browses products
      await page.goto('http://localhost:3000/products');
      await page.waitForSelector('.product-card');
      
      // 3. User views product details
      await page.click('.product-card[data-id="prod1"]');
      await page.waitForSelector('#product-details');
      
      // 4. User selects quantity
      await page.select('#quantity', '2');
      
      // 5. User adds to cart
      await page.click('#add-to-cart');
      
      // 6. Verify success message
      await page.waitForSelector('.success-message');
      const message = await page.$eval('.success-message', el => el.textContent);
      expect(message).toContain('Added to cart');
      
      // 7. Verify cart count updated
      const cartCount = await page.$eval('#cart-count', el => el.textContent);
      expect(cartCount).toBe('2');
      
      // 8. Go to cart
      await page.click('#cart-link');
      await page.waitForSelector('#cart-page');
      
      // 9. Verify product in cart
      const cartItems = await page.$$('.cart-item');
      expect(cartItems).toHaveLength(1);
      
      const productName = await page.$eval('.cart-item .product-name', el => el.textContent);
      expect(productName).toBe('iPhone');
      
      const quantity = await page.$eval('.cart-item .quantity', el => el.textContent);
      expect(quantity).toBe('2');
      
    } finally {
      await browser.close();
    }
  }, 30000);
});

// ====================
// TEST RESULTS
// ====================

/*
Unit Tests (validation + Cart):
  ✓ 14 tests
  ⏱ 85ms
  Cost: $0.01

Integration Tests (API):
  ✓ 4 tests
  ⏱ 3.2s
  Cost: $0.10

E2E Tests (User Journey):
  ✓ 1 test
  ⏱ 18.5s
  Cost: $1.00

Total: 19 tests, 21.785s, $1.11

Coverage:
- Unit: Catches 60% of bugs
- Integration: Catches 30% of bugs
- E2E: Catches 10% of bugs

Pyramid maintained: ✅
  Unit: 74% (14/19)
  Integration: 21% (4/19)
  E2E: 5% (1/19)
*/
```

---

---

## Unit Testing Fundamentals

Unit testing এর core concepts এবং best practices।

### 1. What is a Unit?

```javascript
/*
Unit = Smallest testable part of code

Examples of Units:
✅ A function
✅ A class method
✅ A module export

NOT a Unit:
❌ An API endpoint (that's integration)
❌ A database query (that's integration)
❌ Multiple functions together (that's integration)

Rule: If it depends on external resources (DB, API, File),
      it's NOT a unit test!
*/

// ✅ Unit (Pure function)
function add(a, b) {
  return a + b;
}

// ✅ Unit (Class method)
class Calculator {
  multiply(a, b) {
    return a * b;
  }
}

// ❌ NOT Unit (Depends on database)
async function getUser(id) {
  return await database.users.findById(id);
}

// ❌ NOT Unit (Depends on API)
async function fetchData() {
  return await fetch('https://api.example.com/data');
}
```

### 2. Anatomy of a Test

```javascript
/*
Test Structure (AAA Pattern):

1. Arrange - Setup
2. Act - Execute
3. Assert - Verify
*/

test('calculator adds two numbers', () => {
  // 1. ARRANGE - Setup test data
  const calculator = new Calculator();
  const num1 = 5;
  const num2 = 3;
  
  // 2. ACT - Execute the function
  const result = calculator.add(num1, num2);
  
  // 3. ASSERT - Verify the result
  expect(result).toBe(8);
});

/*
Alternative pattern (Given-When-Then):
*/

test('user can update profile', () => {
  // GIVEN - Initial state
  const user = new User({ name: 'John' });
  
  // WHEN - Action occurs
  user.updateName('Jane');
  
  // THEN - Expected outcome
  expect(user.name).toBe('Jane');
});
```

### 📝 **Hands-on Example: Writing First Unit Test**

```javascript
// ✅ Complete beginner example

// ====================
// CODE TO TEST
// ====================

// calculator.js
class Calculator {
  add(a, b) {
    return a + b;
  }
  
  subtract(a, b) {
    return a - b;
  }
  
  multiply(a, b) {
    return a * b;
  }
  
  divide(a, b) {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
  
  percentage(value, percent) {
    return (value * percent) / 100;
  }
}

module.exports = Calculator;

// ====================
// TESTS
// ====================

// calculator.test.js
const Calculator = require('./calculator');

describe('Calculator', () => {
  let calc;
  
  // Setup: Create fresh calculator before each test
  beforeEach(() => {
    calc = new Calculator();
  });
  
  // Group related tests
  describe('add', () => {
    test('should add positive numbers', () => {
      // Arrange
      const a = 5;
      const b = 3;
      
      // Act
      const result = calc.add(a, b);
      
      // Assert
      expect(result).toBe(8);
    });
    
    test('should add negative numbers', () => {
      expect(calc.add(-5, -3)).toBe(-8);
    });
    
    test('should add positive and negative', () => {
      expect(calc.add(5, -3)).toBe(2);
    });
    
    test('should add zero', () => {
      expect(calc.add(5, 0)).toBe(5);
    });
    
    test('should add decimals', () => {
      expect(calc.add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });
  
  describe('subtract', () => {
    test('should subtract numbers', () => {
      expect(calc.subtract(5, 3)).toBe(2);
    });
    
    test('should handle negative result', () => {
      expect(calc.subtract(3, 5)).toBe(-2);
    });
  });
  
  describe('multiply', () => {
    test('should multiply numbers', () => {
      expect(calc.multiply(5, 3)).toBe(15);
    });
    
    test('should multiply by zero', () => {
      expect(calc.multiply(5, 0)).toBe(0);
    });
    
    test('should multiply negative numbers', () => {
      expect(calc.multiply(-5, -3)).toBe(15);
    });
  });
  
  describe('divide', () => {
    test('should divide numbers', () => {
      expect(calc.divide(6, 3)).toBe(2);
    });
    
    test('should handle decimal result', () => {
      expect(calc.divide(5, 2)).toBe(2.5);
    });
    
    test('should throw error for division by zero', () => {
      expect(() => {
        calc.divide(5, 0);
      }).toThrow('Cannot divide by zero');
    });
    
    test('should throw specific error message', () => {
      expect(() => calc.divide(10, 0))
        .toThrow(Error);
    });
  });
  
  describe('percentage', () => {
    test('should calculate percentage', () => {
      expect(calc.percentage(200, 10)).toBe(20);
    });
    
    test('should handle 0 percent', () => {
      expect(calc.percentage(100, 0)).toBe(0);
    });
    
    test('should handle 100 percent', () => {
      expect(calc.percentage(50, 100)).toBe(50);
    });
  });
});

/*
Running tests:
$ npm test

PASS  ./calculator.test.js
  Calculator
    add
      ✓ should add positive numbers (3ms)
      ✓ should add negative numbers (1ms)
      ✓ should add positive and negative (1ms)
      ✓ should add zero (1ms)
      ✓ should add decimals (1ms)
    subtract
      ✓ should subtract numbers (1ms)
      ✓ should handle negative result (1ms)
    multiply
      ✓ should multiply numbers (1ms)
      ✓ should multiply by zero (1ms)
      ✓ should multiply negative numbers (1ms)
    divide
      ✓ should divide numbers (1ms)
      ✓ should handle decimal result (1ms)
      ✓ should throw error for division by zero (2ms)
      ✓ should throw specific error message (1ms)
    percentage
      ✓ should calculate percentage (1ms)
      ✓ should handle 0 percent (1ms)
      ✓ should handle 100 percent (1ms)

Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        0.234 s
*/
```

---

## Jest Framework Complete

Jest - সবচেয়ে জনপ্রিয় JavaScript testing framework।

### 1. Jest Setup

```bash
# Install Jest
npm install --save-dev jest

# Install types (for TypeScript/autocomplete)
npm install --save-dev @types/jest
```

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/index.js"
    ]
  }
}
```

```javascript
// jest.config.js (advanced configuration)
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  
  // Coverage
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup/Teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Timeout
  testTimeout: 5000,
  
  // Verbose output
  verbose: true
};
```

### 2. Jest Matchers (Assertions)

```javascript
// ✅ All Jest matchers with examples

describe('Jest Matchers', () => {
  // === Equality ===
  test('toBe - strict equality', () => {
    expect(2 + 2).toBe(4);
    expect('hello').toBe('hello');
  });
  
  test('toEqual - deep equality', () => {
    const obj1 = { name: 'John', age: 30 };
    const obj2 = { name: 'John', age: 30 };
    expect(obj1).toEqual(obj2);
  });
  
  test('toStrictEqual - strict deep equality', () => {
    expect({ a: undefined }).not.toEqual({ a: undefined });
    expect({ a: undefined }).toStrictEqual({ a: undefined });
  });
  
  // === Truthiness ===
  test('toBeTruthy/toBeFalsy', () => {
    expect(true).toBeTruthy();
    expect(1).toBeTruthy();
    expect('hello').toBeTruthy();
    
    expect(false).toBeFalsy();
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
  });
  
  test('toBeNull/toBeUndefined/toBeDefined', () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect('value').toBeDefined();
  });
  
  // === Numbers ===
  test('number comparisons', () => {
    expect(5).toBeGreaterThan(3);
    expect(5).toBeGreaterThanOrEqual(5);
    expect(3).toBeLessThan(5);
    expect(3).toBeLessThanOrEqual(3);
  });
  
  test('toBeCloseTo - for floating point', () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3);
    expect(0.1 + 0.2).not.toBe(0.3); // Floating point issue
  });
  
  // === Strings ===
  test('toMatch - regex matching', () => {
    expect('Hello World').toMatch(/World/);
    expect('test@example.com').toMatch(/^[^\s@]+@[^\s@]+$/);
  });
  
  test('toContain - substring', () => {
    expect('Hello World').toContain('World');
  });
  
  // === Arrays/Iterables ===
  test('toContain - array item', () => {
    const fruits = ['apple', 'banana', 'orange'];
    expect(fruits).toContain('banana');
  });
  
  test('toHaveLength', () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect('hello').toHaveLength(5);
  });
  
  test('toContainEqual - array object', () => {
    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ];
    expect(users).toContainEqual({ id: 1, name: 'John' });
  });
  
  // === Objects ===
  test('toHaveProperty', () => {
    const user = { name: 'John', age: 30 };
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('age', 30);
  });
  
  test('toMatchObject - partial match', () => {
    const user = { id: 1, name: 'John', email: 'john@test.com' };
    expect(user).toMatchObject({ name: 'John' });
  });
  
  // === Exceptions ===
  test('toThrow - error throwing', () => {
    function throwError() {
      throw new Error('Something went wrong');
    }
    
    expect(throwError).toThrow();
    expect(throwError).toThrow(Error);
    expect(throwError).toThrow('Something went wrong');
    expect(throwError).toThrow(/went wrong/);
  });
  
  // === Async ===
  test('resolves - promise resolves', async () => {
    await expect(Promise.resolve('success')).resolves.toBe('success');
  });
  
  test('rejects - promise rejects', async () => {
    await expect(Promise.reject(new Error('fail')))
      .rejects.toThrow('fail');
  });
  
  // === Mock Functions ===
  test('mock function matchers', () => {
    const mockFn = jest.fn();
    mockFn('hello');
    mockFn('world');
    
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('hello');
    expect(mockFn).toHaveBeenLastCalledWith('world');
  });
  
  // === Negation ===
  test('not - negate any matcher', () => {
    expect(2 + 2).not.toBe(5);
    expect('hello').not.toContain('world');
  });
});
```

### 📝 **Hands-on Example: Jest Full Features**

চলবে... (file টা অনেক বড় হচ্ছে, এখানে pause করছি update করার জন্য)

---

**এখন পর্যন্ত Complete:**
✅ Testing Importance (theory + examples)
✅ Testing Pyramid (concept + hands-on)  
✅ Testing Types Comparison
✅ Unit Testing Fundamentals
✅ Jest Setup & Matchers

**Next আসছে:**
- Jest Mocking
- Mocha & Chai
- Supertest  
- TDD
- Code Coverage
- CI/CD

Continue করছি... 🚀