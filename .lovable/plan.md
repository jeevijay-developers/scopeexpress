

# Mock Test Page for Competitive Exams

## Overview
Add a new `/mock-test` page where users can take full mock tests for competitive exams like SSC CGL, Army GD, MPPSC, SSC CHSL, Patwari, and more. The flow: select exam -> see available mock tests -> take a timed test with questions.

---

## Database Changes

### New Table: `mock_tests`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| exam_name | text | e.g., "SSC CGL", "Army GD" |
| test_name | text | e.g., "Mock Test 1", "Practice Set 3" |
| duration_minutes | integer | Total time for the test (e.g., 60) |
| total_questions | integer | Number of questions |
| is_active | boolean | Whether test is visible to users |
| created_at | timestamp | Creation timestamp |

### New Table: `mock_test_questions`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| mock_test_id | uuid | FK to mock_tests |
| question | text | Question text |
| options | jsonb | Array of 4 options |
| correct_answer | integer | Index of correct option (0-3) |
| question_number | integer | Order in the test |
| created_at | timestamp | Creation timestamp |

### New Table: `mock_test_sessions`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| mock_test_id | uuid | FK to mock_tests |
| lead_id | uuid | FK to leads (nullable) |
| name | text | Student name |
| mobile | text | Student mobile |
| answers | jsonb | Map of question index to selected answer |
| score | integer | Final score |
| total_attempted | integer | Questions attempted |
| completed | boolean | Whether test was submitted |
| started_at | timestamp | When the test started |
| completed_at | timestamp | When submitted |
| created_at | timestamp | Creation timestamp |

### RLS Policies
- **mock_tests**: Anyone can SELECT active tests; only admins can manage
- **mock_test_questions**: Anyone can SELECT; only admins can manage
- **mock_test_sessions**: Anyone can INSERT and UPDATE their own; only admins can SELECT all

---

## Competitive Exams List

The following exams will be available for mock tests:
- SSC CGL
- SSC CHSL
- SSC MTS
- SSC GD Constable
- Army GD
- Army Clerk
- Navy AA/SSR
- Air Force X/Y Group
- MPPSC
- UPPSC
- Railway Group D
- Railway NTPC
- Patwari
- Police Constable
- Bank PO/Clerk
- CTET/TET

---

## New Pages and Components

### 1. `src/pages/MockTest.tsx` -- Main Page
**Flow:**
1. User sees grid of competitive exam cards (SSC CGL, Army GD, etc.)
2. Clicks on an exam to see available mock tests
3. Fills a quick registration form (name, mobile) if not already registered
4. Starts the mock test with full timer
5. Can navigate between questions (mark for review, skip)
6. Submits and sees score/result

### 2. `src/components/mocktest/ExamSelector.tsx`
- Grid of exam cards with icons/badges
- Search/filter functionality
- Shows count of available tests per exam

### 3. `src/components/mocktest/MockTestCard.tsx`
- Displays test name, duration, total questions
- "Start Test" button

### 4. `src/components/mocktest/MockTestPlayer.tsx`
- Full-screen test interface with:
  - Timer countdown (top bar)
  - Question display with 4 options
  - Question navigation panel (numbered buttons showing answered/unanswered/marked)
  - "Mark for Review" button
  - "Previous" and "Next" navigation
  - "Submit Test" button with confirmation
- Result screen after submission showing score, correct/incorrect breakdown

### 5. Admin Panel: `src/components/admin/MockTestManager.tsx`
- Add/edit/delete mock tests
- Add questions to a mock test (manual entry)
- View test sessions/results
- Add new tab "Mock Tests" in admin sidebar

---

## Route Changes

Add `/mock-test` route in `App.tsx` and add navigation link in Navbar.

---

## User Experience Flow

```text
User visits /mock-test
        |
        v
+------------------------+
|  Select Your Exam      |
|  [SSC CGL] [Army GD]   |
|  [MPPSC]  [Patwari]    |
|  [SSC CHSL] [Railway]  |
+------------------------+
        |
        v (clicks SSC CGL)
+------------------------+
|  SSC CGL Mock Tests    |
|  +------------------+  |
|  | Mock Test 1      |  |
|  | 100 Qs | 60 min  |  |
|  | [Start Test]     |  |
|  +------------------+  |
|  +------------------+  |
|  | Mock Test 2      |  |
|  | 100 Qs | 60 min  |  |
|  | [Start Test]     |  |
|  +------------------+  |
+------------------------+
        |
        v (clicks Start)
+------------------------+
|  Name: ____            |
|  Mobile: ____          |
|  [Begin Test]          |
+------------------------+
        |
        v
+------------------------+
| Timer: 59:45           |
| Q1. What is...?        |
|  O Option A            |
|  O Option B            |
|  O Option C            |
|  O Option D            |
|                        |
| [Prev] [Mark] [Next]   |
|                        |
| 1  2  3  4  5  6  ... |
| [Submit Test]          |
+------------------------+
        |
        v (submits)
+------------------------+
|  Result                |
|  Score: 72/100         |
|  Correct: 72           |
|  Incorrect: 20         |
|  Unanswered: 8         |
|  [Try Another Test]    |
+------------------------+
```

---

## Technical Details

### Files to Create
1. `src/pages/MockTest.tsx` -- Main mock test page
2. `src/components/mocktest/ExamSelector.tsx` -- Exam selection grid
3. `src/components/mocktest/MockTestCard.tsx` -- Individual test card
4. `src/components/mocktest/MockTestPlayer.tsx` -- Test-taking interface
5. `src/components/admin/MockTestManager.tsx` -- Admin management

### Files to Modify
1. `src/App.tsx` -- Add `/mock-test` route
2. `src/components/layout/Navbar.tsx` -- Add Mock Test nav link
3. `src/pages/admin/AdminDashboard.tsx` -- Add Mock Tests tab in admin sidebar
4. `src/contexts/LanguageContext.tsx` -- Add translations for mock test strings

### Database Migration
- Create `mock_tests`, `mock_test_questions`, `mock_test_sessions` tables with RLS policies

