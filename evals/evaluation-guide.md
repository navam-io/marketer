# Navam Marketer - Browser Evaluation Guide

**Version:** 0.11.2
**Test Environment:** Assumes app is running at `http://localhost:3000`
**Purpose:** Automated browser testing with Playwright

---

## Assumptions

- ✅ App is running at `http://localhost:3000`
- ✅ Database is initialized and empty (clean state)
- ✅ Environment variables are configured (including `ANTHROPIC_API_KEY`)
- ✅ All dependencies are installed

---

## Test URLs for Source Ingestion

Use these reliable URLs for testing:

```
https://www.paulgraham.com/startupideas.html
https://blog.samaltman.com/
https://a16z.com/
```

---

## Feature 1: Source Ingestion (v0.1.0)

### Test Case 1.1: Navigate to Home Page

**URL:** `http://localhost:3000`

**Expected Elements:**
- Page title contains "Navam Marketer"
- Input field with placeholder or label for URL
- Button labeled "Fetch Content" or "Fetch"
- Source ingestion section visible

**Assertions:**
- [ ] Page loads successfully (status 200)
- [ ] URL input field is visible
- [ ] Fetch button is visible and enabled

---

### Test Case 1.2: Fetch Content from URL

**Steps:**
1. Navigate to `http://localhost:3000`
2. Locate URL input field
3. Enter test URL: `https://www.paulgraham.com/startupideas.html`
4. Click "Fetch Content" button
5. Wait for loading state to complete

**Expected Results:**
- [ ] Loading indicator appears during fetch
- [ ] Content preview area appears after fetch
- [ ] Title is displayed (should contain "Startup Ideas")
- [ ] Cleaned content is displayed (multiple paragraphs)
- [ ] No HTML tags visible in content
- [ ] Success message appears (e.g., "Source saved successfully")

**Selectors to Use:**
- URL Input: `input[type="url"]` or `input` in source section
- Fetch Button: `button` containing "Fetch"
- Loading State: Look for spinner, "Loading", or disabled button
- Content Preview: Container showing extracted content
- Title: Element showing extracted title
- Success Message: Toast notification or success alert

**Timing:**
- Fetch operation: 2-5 seconds
- Wait for content to appear: max 10 seconds

---

### Test Case 1.3: Verify Multiple Sources

**Steps:**
1. Fetch first URL: `https://www.paulgraham.com/startupideas.html`
2. Wait for success
3. Fetch second URL: `https://blog.samaltman.com/`
4. Wait for success

**Expected Results:**
- [ ] Both sources fetch successfully
- [ ] Each shows different content
- [ ] No conflicts between sources
- [ ] Success message for each fetch

---

## Feature 2: Campaign & Task Management (v0.2.0)

### Test Case 2.1: Navigate to Campaigns Page

**Steps:**
1. From home page, click "Go to Campaigns" button or link
2. Or directly navigate to `http://localhost:3000/campaigns`

**Expected Elements:**
- [ ] Kanban board with 4 columns visible:
  - Column 1: "To Do" or "📝 To Do"
  - Column 2: "Draft" or "✍️ Draft"
  - Column 3: "Scheduled" or "📅 Scheduled"
  - Column 4: "Posted" or "✅ Posted"
- [ ] "New Campaign" button (top area)
- [ ] "New Task" button (top area)
- [ ] Campaign selector dropdown (may show "Select a campaign" if empty)

**Selectors:**
- Campaigns Link: `a[href="/campaigns"]` or button with "Campaigns"
- New Campaign Button: `button` containing "New Campaign"
- New Task Button: `button` containing "New Task"
- Kanban Columns: Look for 4 column containers
- Column Headers: Text containing "To Do", "Draft", "Scheduled", "Posted"

---

### Test Case 2.2: Create Campaign

**Steps:**
1. Navigate to `/campaigns`
2. Click "New Campaign" button
3. Wait for dialog to open
4. Fill campaign name: `Product Launch Q1`
5. Fill campaign description: `Social media campaign for our new product release`
6. Click "Create Campaign" or "Create" button
7. Wait for dialog to close

**Expected Results:**
- [ ] Dialog opens with title "Create Campaign" or similar
- [ ] Name input field visible
- [ ] Description textarea visible
- [ ] Create button visible
- [ ] After creation:
  - [ ] Dialog closes
  - [ ] Campaign appears in dropdown selector
  - [ ] Campaign is automatically selected
  - [ ] Success message appears

**Selectors:**
- Dialog: `[role="dialog"]` or `.dialog`
- Name Input: `input[name="name"]` or first input in dialog
- Description Input: `textarea[name="description"]` or textarea in dialog
- Create Button: `button` containing "Create"
- Success Message: Toast or alert containing "success" or "created"
- Campaign Dropdown: `select` or button that opens campaign selector

**Timing:**
- Dialog animation: 200-300ms
- Campaign creation: < 1 second

---

### Test Case 2.3: Create Task Manually

**Steps:**
1. Ensure a campaign is selected
2. Click "New Task" button
3. Wait for dialog to open
4. Select platform: "LinkedIn"
5. Select status: "To Do" (may be default)
6. Enter content: `Excited to announce our new product launch! This will revolutionize how you work. #ProductLaunch #Innovation`
7. Click "Create Task" or "Create" button
8. Wait for dialog to close

**Expected Results:**
- [ ] Dialog opens with title "Create Task" or similar
- [ ] Platform selector visible (dropdown or radio buttons)
- [ ] Status selector visible
- [ ] Content textarea visible
- [ ] Optional: Scheduled date picker
- [ ] Create button visible
- [ ] After creation:
  - [ ] Dialog closes
  - [ ] Task card appears in "To Do" column
  - [ ] Task shows LinkedIn badge/icon (blue color)
  - [ ] Task shows content preview
  - [ ] Task card is clickable/hoverable

**Selectors:**
- New Task Button: `button` containing "New Task"
- Dialog: `[role="dialog"]`
- Platform Selector: `select[name="platform"]` or radio group
- Status Selector: `select[name="status"]` or radio group
- Content Input: `textarea[name="content"]`
- Create Button: `button` containing "Create"
- Task Card: `.task-card` or similar in kanban column
- Platform Badge: Badge or icon showing "LinkedIn" or "LI"

**Timing:**
- Task creation: < 500ms

---

### Test Case 2.4: Create Multiple Tasks

**Task 1 - LinkedIn (To Do):**
```
Platform: LinkedIn
Status: To Do
Content: Excited to announce our new product launch! This will revolutionize how you work. #ProductLaunch #Innovation
```

**Task 2 - Twitter (Draft):**
```
Platform: Twitter
Status: Draft
Content: 🚀 Big news coming! Our new product drops next week. #ProductLaunch
```

**Task 3 - Blog (Scheduled):**
```
Platform: Blog
Status: Scheduled
Content: Introducing our revolutionary new product that will change the way teams collaborate...
Scheduled Date: (tomorrow's date)
```

**Expected Results:**
- [ ] Task 1 appears in "To Do" column with LinkedIn badge
- [ ] Task 2 appears in "Draft" column with Twitter badge
- [ ] Task 3 appears in "Scheduled" column with Blog badge
- [ ] Each task shows correct content preview
- [ ] Task 3 shows scheduled date

---

### Test Case 2.5: Drag and Drop Tasks

**Steps:**
1. Locate Task 1 (LinkedIn) in "To Do" column
2. Drag Task 1 from "To Do" to "Draft" column
3. Release
4. Wait for update to complete

**Expected Results:**
- [ ] Task card moves smoothly during drag
- [ ] Visual feedback during drag (opacity, shadow, or highlight)
- [ ] Task appears in "Draft" column after drop
- [ ] Task removed from "To Do" column
- [ ] Position persists after page refresh

**Second Drag:**
5. Drag Task 2 (Twitter) from "Draft" to "Scheduled"
6. Release

**Expected Results:**
- [ ] Task moves to "Scheduled" column
- [ ] Status updated

**Selectors:**
- Task Card: Draggable element (look for `draggable` attribute or drag handle)
- Column Drop Zone: Column container that accepts drops
- Drag Indicator: Visual feedback element during drag

**Timing:**
- Drag animation: Smooth (60fps)
- Status update: < 500ms

---

### Test Case 2.6: Edit Task Content Inline

**Steps:**
1. Locate any task card in any column
2. Click on the content area of the task
3. Content should become editable
4. Change text to: `Updated content for testing`
5. Press Enter or click outside to save
6. Wait for update

**Expected Results:**
- [ ] Content becomes editable (input or textarea appears)
- [ ] Can type new text
- [ ] Save occurs on Enter or blur
- [ ] Updated content displays immediately
- [ ] Content persists after page refresh

**Selectors:**
- Task Content: Text area in task card
- Editable Input: `input` or `textarea` that appears on click
- Task Card: Container with content

---

### Test Case 2.7: Delete Task

**Steps:**
1. Locate any task card
2. Find and click delete button (usually trash icon)
3. Wait for confirmation dialog
4. Click "Delete" or "Confirm" in dialog
5. Wait for task to be removed

**Expected Results:**
- [ ] Delete button visible on task card (hover or always visible)
- [ ] Confirmation dialog appears asking for confirmation
- [ ] Dialog has "Delete" and "Cancel" buttons
- [ ] After confirming:
  - [ ] Task card removed from column
  - [ ] Task no longer visible on page
  - [ ] Column updates smoothly

**Selectors:**
- Delete Button: `button` with trash icon or "Delete" text
- Confirmation Dialog: `[role="dialog"]` or `.dialog`
- Confirm Button: `button` containing "Delete" in dialog
- Cancel Button: `button` containing "Cancel"

---

### Test Case 2.8: Create Multiple Campaigns and Switch

**Campaign 2:**
```
Name: Blog Series 2025
Description: Educational content series
```

**Campaign 3:**
```
Name: Weekly Social Updates
Description: Regular social media posts
```

**Steps:**
1. Create Campaign 2 (follow Test Case 2.2)
2. Create Campaign 3
3. Use campaign dropdown to switch between campaigns
4. Verify tasks filter by selected campaign

**Expected Results:**
- [ ] All 3 campaigns appear in dropdown
- [ ] Dropdown shows task count for each (e.g., "Product Launch Q1 (3 tasks)")
- [ ] Switching campaigns filters displayed tasks
- [ ] Only tasks for selected campaign show on board
- [ ] Can create tasks specific to selected campaign

**Selectors:**
- Campaign Dropdown: `select` or custom dropdown button
- Campaign Options: `option` elements or dropdown items
- Task Count: Text showing count next to campaign name

---

## Feature 3: Content Generation with Claude AI (v0.3.0/v0.3.1)

### Test Case 3.1: Verify Prerequisites

**Checks:**
- [ ] At least one source exists (from Feature 1)
- [ ] At least one campaign exists (from Feature 2)
- [ ] "Generate from Source" button is visible on campaigns page

**If not ready:**
1. Create a source using Test Case 1.2
2. Create a campaign using Test Case 2.2

---

### Test Case 3.2: Open Content Generation Dialog

**Steps:**
1. Navigate to `/campaigns`
2. Ensure a campaign is selected
3. Click "Generate from Source" button
4. Wait for dialog to open

**Expected Elements:**
- [ ] Dialog opens with title "Generate Content from Source" or similar
- [ ] Source dropdown/selector visible
- [ ] Platform checkboxes visible (LinkedIn, Twitter, Blog)
- [ ] Tone selector visible (Professional, Casual, Technical)
- [ ] Call to Action input field visible (optional)
- [ ] "Generate Posts" or "Generate" button visible

**Selectors:**
- Generate Button: `button` containing "Generate from Source"
- Dialog: `[role="dialog"]`
- Source Selector: `select[name="sourceId"]` or dropdown
- Platform Checkboxes: `input[type="checkbox"]` for each platform
- Tone Selector: `select[name="tone"]` or radio group
- CTA Input: `input[name="cta"]` or textarea
- Generate Button: `button` containing "Generate"

---

### Test Case 3.3: Generate Content - Single Platform

**Steps:**
1. Open generation dialog (Test Case 3.2)
2. Select first available source from dropdown
3. Check ONLY "LinkedIn" checkbox
4. Select tone: "Professional"
5. Enter CTA: `Learn more at example.com`
6. Click "Generate Posts" button
7. Wait for generation to complete

**Expected Results:**
- [ ] Loading state appears (spinner, "Generating...", disabled button)
- [ ] Process takes 5-15 seconds
- [ ] Dialog closes after completion
- [ ] NEW: 1 task appears in "Draft" column
- [ ] Task has LinkedIn badge (blue)
- [ ] Task content is relevant to source material
- [ ] Content includes hashtags (3-5 for LinkedIn)
- [ ] Content includes CTA: "Learn more at example.com"
- [ ] Content is professional tone
- [ ] Content is longer form (multiple paragraphs)

**Selectors:**
- Loading Indicator: Spinner element or "Generating" text
- New Task Card: Task card in Draft column (check timestamp or ID)
- Platform Badge: Badge showing "LinkedIn"
- Task Content: Text content area of task card

**Timing:**
- Generation: 5-15 seconds
- Dialog close: < 500ms after completion

---

### Test Case 3.4: Generate Content - Multiple Platforms

**Steps:**
1. Open generation dialog
2. Select first available source
3. Check ALL platform checkboxes: LinkedIn, Twitter, Blog
4. Select tone: "Casual"
5. Leave CTA empty
6. Click "Generate Posts" button
7. Wait for generation to complete

**Expected Results:**
- [ ] Loading state appears
- [ ] Process takes 10-20 seconds (longer for multiple)
- [ ] Dialog closes after completion
- [ ] NEW: 3 tasks appear in "Draft" column
- [ ] Task 1: LinkedIn badge, longer content, 3-5 hashtags
- [ ] Task 2: Twitter badge, short content (< 280 chars), 1-2 hashtags
- [ ] Task 3: Blog badge, intro paragraph, educational tone
- [ ] All tasks have casual tone
- [ ] All tasks reference source material

**Platform-Specific Validation:**

**LinkedIn:**
- [ ] Content has 2-3 paragraphs
- [ ] Uses line breaks for readability
- [ ] Has 3-5 hashtags
- [ ] Professional storytelling style

**Twitter:**
- [ ] Content under 280 characters
- [ ] Single impactful message
- [ ] 1-2 hashtags
- [ ] Punchy, engaging language

**Blog:**
- [ ] Opening paragraph (intro)
- [ ] Hook to capture readers
- [ ] Educational tone
- [ ] Minimal or no hashtags

**Timing:**
- Generation: 10-20 seconds for 3 platforms

---

### Test Case 3.5: Test Different Tones

**Test Professional Tone:**
```
Source: (select source)
Platform: LinkedIn
Tone: Professional
CTA: (empty)
```

**Expected:**
- [ ] Formal language
- [ ] Professional terminology
- [ ] Structured paragraphs
- [ ] Business-appropriate

**Test Technical Tone:**
```
Source: (select technical article if available)
Platform: LinkedIn
Tone: Technical
CTA: (empty)
```

**Expected:**
- [ ] Technical terminology
- [ ] Industry-specific language
- [ ] Detail-oriented
- [ ] Less storytelling, more facts

**Test Casual Tone:**
```
Source: (select source)
Platform: Twitter
Tone: Casual
CTA: (empty)
```

**Expected:**
- [ ] Conversational language
- [ ] Friendly tone
- [ ] May include emojis
- [ ] Less formal structure

---

### Test Case 3.6: Verify Error Handling

**Note:** This test is optional for automated testing as it requires API key manipulation.

**Test Missing API Key Error:**
- If API key is invalid/missing, expect:
  - [ ] Error message appears
  - [ ] Message is user-friendly (not technical stack trace)
  - [ ] Message mentions "ANTHROPIC_API_KEY" or "API key"
  - [ ] Dialog doesn't close
  - [ ] Can close dialog and retry

**Selectors:**
- Error Message: Alert or text containing "error" or "failed"
- Error Dialog: May be different from main dialog

---

## Feature 4: Scheduling & Auto-Posting (v0.4.0)

### Test Case 4.1: Verify Scheduling UI Elements

**Prerequisites:**
- At least one campaign exists
- At least one task exists in any column

**Steps:**
1. Navigate to `/campaigns`
2. Select a campaign with existing tasks
3. Locate any task card
4. Look for calendar icon button on task card

**Expected Elements:**
- [ ] Calendar icon visible on each task card
- [ ] Calendar button is clickable
- [ ] Hover state indicates button is interactive

**Selectors:**
- Calendar Button: `button` with calendar icon on task card
- Task Card: Task container with all action buttons

---

### Test Case 4.2: Open Schedule Task Dialog

**Steps:**
1. Locate any task card (in any column)
2. Click the calendar icon button
3. Wait for dialog to open

**Expected Results:**
- [ ] Dialog opens with title "Schedule Task" or similar
- [ ] Date input field visible (type="date")
- [ ] Time input field visible (type="time")
- [ ] "Schedule Task" button visible and enabled
- [ ] "Clear Schedule" button visible (if task already scheduled)
- [ ] "Cancel" button visible
- [ ] If task is unscheduled: default date is tomorrow
- [ ] If task is unscheduled: default time is 09:00
- [ ] If task already scheduled: current date/time displayed

**Selectors:**
- Dialog: `[role="dialog"]`
- Dialog Title: Heading containing "Schedule"
- Date Input: `input[type="date"]` or `[data-testid="schedule-date-input"]`
- Time Input: `input[type="time"]` or `[data-testid="schedule-time-input"]`
- Schedule Button: `button` containing "Schedule Task"
- Clear Button: `button` containing "Clear Schedule"
- Cancel Button: `button` containing "Cancel"

**Timing:**
- Dialog animation: < 300ms

---

### Test Case 4.3: Schedule a Task for Future Date

**Steps:**
1. Select a task in "Draft" column
2. Click calendar icon
3. Wait for dialog to open
4. Set date: (tomorrow's date - use JavaScript Date API)
5. Set time: `14:30` (2:30 PM)
6. Click "Schedule Task" button
7. Wait for dialog to close

**Expected Results:**
- [ ] Dialog closes after scheduling
- [ ] Task moves from "Draft" to "Scheduled" column
- [ ] Task card shows scheduled date/time at bottom
- [ ] Scheduled date formatted as human-readable (e.g., "Nov 12, 2025 2:30 PM")
- [ ] Success message may appear (toast/notification)
- [ ] Task status is "scheduled"

**Selectors:**
- Scheduled Column: Column with "Scheduled" header
- Task Card: Task in Scheduled column
- Schedule Display: Text showing date/time on task card

**Timing:**
- Schedule operation: < 500ms
- Column transition: Smooth animation

---

### Test Case 4.4: Edit Scheduled Task

**Steps:**
1. Locate a task in "Scheduled" column (from Test 4.3)
2. Click calendar icon on scheduled task
3. Wait for dialog to open
4. Verify current schedule is displayed
5. Change date to day after tomorrow
6. Change time to `10:00`
7. Click "Schedule Task" button

**Expected Results:**
- [ ] Dialog opens with current scheduled date/time pre-filled
- [ ] Can edit both date and time
- [ ] After saving: task remains in "Scheduled" column
- [ ] Schedule display updates to new date/time
- [ ] No duplicate tasks created

**Timing:**
- Update operation: < 500ms

---

### Test Case 4.5: Clear Scheduled Date

**Steps:**
1. Locate a scheduled task
2. Click calendar icon
3. Wait for dialog to open
4. Click "Clear Schedule" button
5. Wait for dialog to close

**Expected Results:**
- [ ] Dialog closes
- [ ] Task moves from "Scheduled" back to previous status (usually "Draft")
- [ ] Schedule display removed from task card
- [ ] Task status changes from "scheduled" to previous status
- [ ] No schedule date shown on card

**Selectors:**
- Clear Button: `button` containing "Clear" or "Clear Schedule"
- Draft Column: Column where task should return

**Timing:**
- Clear operation: < 500ms

---

### Test Case 4.6: Schedule Validation - Past Dates

**Steps:**
1. Open schedule dialog on any task
2. Attempt to set date to yesterday or today (past date)
3. Observe validation behavior

**Expected Results:**
- [ ] Date input should have `min` attribute set to today
- [ ] Browser prevents selecting past dates (native validation)
- [ ] If past date somehow selected: error message or validation
- [ ] Cannot submit with invalid date

**Note:** This test depends on browser's native date input validation.

---

### Test Case 4.7: Automatic Task Posting (Time-Based)

**Important:** This test requires waiting for the scheduled time to pass, or manually triggering the scheduler.

**Option A: Short Wait Test (Manual Testing)**

**Steps:**
1. Create a new task in "Draft" column
2. Schedule it for 2 minutes in the future (current time + 2 min)
3. Click "Schedule Task"
4. Wait 2-3 minutes
5. Refresh page or observe kanban board

**Expected Results:**
- [ ] After scheduled time passes (within 60 seconds):
  - [ ] Task automatically moves to "Posted" column
  - [ ] Task status changes to "posted"
  - [ ] `postedAt` timestamp recorded
- [ ] No manual intervention required
- [ ] Transition happens in background

**Option B: API Test (Automated Testing)**

**Steps:**
1. Create task scheduled for past time (via API or database)
2. Call scheduler API manually: `POST /api/scheduler/process`
3. Verify task moved to "Posted"

**API Endpoint:**
```
POST http://localhost:3000/api/scheduler/process
```

**Expected Response:**
```json
{
  "message": "Processed 1 scheduled tasks",
  "successCount": 1,
  "failureCount": 0,
  "results": [...]
}
```

**Selectors:**
- Posted Column: Column with "Posted" header
- Task Card: Task in Posted column
- Posted Timestamp: May show "Posted at [time]" on card

**Timing:**
- Background scheduler: Runs every 60 seconds
- Processing: < 500ms per task
- Max delay: 60 seconds from scheduled time

---

### Test Case 4.8: Schedule Multiple Tasks

**Steps:**
1. Create 3 tasks in Draft column
2. Schedule Task 1 for tomorrow at 09:00
3. Schedule Task 2 for tomorrow at 14:00
4. Schedule Task 3 for day after tomorrow at 10:00
5. Verify all tasks in Scheduled column

**Expected Results:**
- [ ] All 3 tasks appear in "Scheduled" column
- [ ] Each shows correct scheduled date/time
- [ ] Tasks sorted by scheduled date (optional)
- [ ] Each can be individually edited or cleared
- [ ] No conflicts between scheduled tasks

---

### Test Case 4.9: Scheduler Status API

**Steps:**
1. Ensure at least one task is scheduled for future
2. Make GET request to scheduler API

**API Endpoint:**
```
GET http://localhost:3000/api/scheduler/process
```

**Expected Response:**
```json
{
  "dueNow": 0,
  "scheduledFuture": 1,
  "nextTask": {
    "id": "...",
    "platform": "linkedin",
    "scheduledAt": "2025-11-12T14:30:00.000Z",
    "timeUntilPost": "2 hours"
  }
}
```

**Assertions:**
- [ ] Response includes `dueNow` count (tasks ready to post)
- [ ] Response includes `scheduledFuture` count (tasks scheduled later)
- [ ] If tasks exist: `nextTask` object with details
- [ ] `timeUntilPost` is human-readable

**Note:** This is primarily an API test, not browser UI test.

---

### Test Case 4.10: Integration with Drag & Drop

**Steps:**
1. Create a task in "Draft"
2. Schedule it for tomorrow (should move to "Scheduled")
3. Manually drag the scheduled task back to "Draft"
4. Verify scheduled date is cleared

**Expected Results:**
- [ ] Can drag scheduled task to other columns
- [ ] Dragging to non-"Scheduled" column clears schedule
- [ ] Schedule display removed when moved
- [ ] Can re-schedule task after manual move

**Alternative Flow:**
5. Drag a "Draft" task to "Scheduled" column
6. Verify schedule dialog opens (or date picker appears)

**Expected:**
- [ ] May auto-open schedule dialog
- [ ] OR: Requires manual calendar click after drag
- [ ] Task remains in target column

---

## End-to-End Workflow Test

### Complete User Journey

**Day 1: Content Collection**

1. Navigate to `http://localhost:3000`
2. Fetch source 1: `https://www.paulgraham.com/startupideas.html`
3. Fetch source 2: `https://blog.samaltman.com/`
4. Go to campaigns page
5. Create campaign: "E2E Test Campaign"

**Day 2: Content Generation**

6. Select "E2E Test Campaign"
7. Generate LinkedIn + Twitter from source 1
8. Wait for 2 tasks to appear in Draft
9. Generate all 3 platforms from source 2
10. Wait for 3 tasks to appear in Draft
11. Verify 5 total tasks in Draft column

**Day 3: Content Management & Scheduling**

12. Edit one task's content inline
13. Select one task from Draft, click calendar icon
14. Schedule it for tomorrow at 9:00 AM
15. Verify task moved to "Scheduled" column with date displayed
16. Select another task from Draft, click calendar icon
17. Schedule it for tomorrow at 2:00 PM
18. Manually drag 1 task from Draft to Posted
19. Delete 1 task from Draft
20. Verify final state:
    - [ ] 1 task in Draft
    - [ ] 2 tasks in Scheduled (both showing scheduled dates)
    - [ ] 1 task in Posted
    - [ ] Total: 4 tasks (1 deleted)

**Day 4: Verify Persistence**

21. Refresh page (`F5` or reload)
22. Verify all tasks still in correct columns
23. Verify edited content persisted
24. Verify scheduled dates persisted
25. Verify campaign still selected

**Day 5: Test Auto-Posting (Optional)**

26. Edit one scheduled task to be 2 minutes in the future
27. Wait 2-3 minutes
28. Verify task automatically moved to "Posted" column

---

## Validation Checklists

### Feature 1: Source Ingestion ✓
- [ ] Home page loads
- [ ] URL input accepts text
- [ ] Fetch button triggers fetch
- [ ] Loading state appears
- [ ] Content displays after fetch
- [ ] Title extracted correctly
- [ ] Content cleaned (no HTML tags)
- [ ] Success message appears
- [ ] Multiple sources can be fetched

### Feature 2: Campaign & Task Management ✓
- [ ] Campaigns page loads
- [ ] Kanban board displays 4 columns
- [ ] Can create campaigns
- [ ] Can create tasks
- [ ] Tasks appear in correct columns
- [ ] Platform badges display correctly
- [ ] Drag and drop works
- [ ] Tasks move between columns
- [ ] Inline editing works
- [ ] Can delete tasks
- [ ] Confirmation required for delete
- [ ] Campaign switching works
- [ ] Task counts accurate
- [ ] Changes persist after refresh

### Feature 3: Content Generation ✓
- [ ] Generate button appears
- [ ] Dialog opens correctly
- [ ] Source selector works
- [ ] Platform checkboxes work
- [ ] Tone selector works
- [ ] CTA input works
- [ ] Generate button triggers generation
- [ ] Loading state during generation
- [ ] Single platform generation works
- [ ] Multiple platform generation works
- [ ] LinkedIn format correct
- [ ] Twitter format correct (< 280 chars)
- [ ] Blog format correct
- [ ] Content relevant to source
- [ ] Hashtags generated
- [ ] CTA included when specified
- [ ] Different tones produce different content
- [ ] Tasks created in Draft status
- [ ] Generated tasks can be edited
- [ ] Generated tasks can be moved
- [ ] Generated tasks can be deleted

### Feature 4: Scheduling & Auto-Posting ✓
- [ ] Calendar icon appears on all task cards
- [ ] Schedule dialog opens when calendar clicked
- [ ] Date input works (native HTML5)
- [ ] Time input works (native HTML5)
- [ ] Smart defaults (tomorrow at 9 AM)
- [ ] Can schedule task for future date/time
- [ ] Task moves to "Scheduled" column when scheduled
- [ ] Scheduled date/time displays on card
- [ ] Can edit scheduled date/time
- [ ] Can clear schedule
- [ ] Task returns to previous status when schedule cleared
- [ ] Schedule display removed when cleared
- [ ] Cannot schedule in the past (validation)
- [ ] Multiple tasks can be scheduled
- [ ] Each scheduled task shows its own date/time
- [ ] Scheduled tasks automatically move to "Posted" at scheduled time
- [ ] Background scheduler runs every 60 seconds
- [ ] Scheduler API endpoints work (GET/POST)
- [ ] Scheduled tasks can be manually dragged to other columns
- [ ] Scheduled dates persist after page refresh

---

## Selectors Reference

### Common Selectors

**Navigation:**
- Home Link: `a[href="/"]`
- Campaigns Link: `a[href="/campaigns"]`

**Buttons:**
- Primary Action: `button[type="submit"]` or `button` with action text
- Cancel: `button` containing "Cancel"
- Delete: `button` containing "Delete" or trash icon

**Dialogs:**
- Dialog Container: `[role="dialog"]` or `.dialog`
- Dialog Title: `h2` or `[role="heading"]` in dialog
- Dialog Close: `button` with × or "Close"

**Forms:**
- Text Input: `input[type="text"]` or `input[name="..."]`
- Textarea: `textarea[name="..."]`
- Select: `select[name="..."]`
- Checkbox: `input[type="checkbox"]`
- Radio: `input[type="radio"]`

**Feedback:**
- Success Toast: Element containing "success" or "created"
- Error Message: Element containing "error" or "failed"
- Loading Spinner: Element with spinner class or role

### Feature-Specific Selectors

**Source Ingestion:**
- URL Input: `input[type="url"]` or input in source section
- Fetch Button: `button` containing "Fetch"
- Content Preview: Container showing extracted content

**Campaigns:**
- Campaign Dropdown: `select` or dropdown trigger
- New Campaign: `button` containing "New Campaign"
- Campaign Name: `input[name="name"]`
- Campaign Description: `textarea[name="description"]`

**Tasks:**
- New Task: `button` containing "New Task"
- Task Card: `.task-card` or card element in kanban
- Platform Badge: Badge element or icon
- Task Content: Content area of task card
- Delete Task: Button with trash icon

**Kanban:**
- Column: Container for each status
- Column Header: Header with status name
- Droppable Area: Column that accepts drops
- Draggable Card: Task card with drag capability

**Content Generation:**
- Generate Button: `button` containing "Generate from Source"
- Source Select: `select[name="sourceId"]` or `[data-testid="generate-source-select"]`
- Platform Checkbox: `input[type="checkbox"]` or `[data-testid="generate-platform-linkedin"]`
- Tone Select: `select[name="tone"]` or `[data-testid="generate-tone-select"]`
- CTA Input: `input[name="cta"]` or `[data-testid="generate-cta-input"]`

**Scheduling:**
- Calendar Button: `button` with calendar icon on task card
- Schedule Dialog: `[role="dialog"]` containing "Schedule"
- Date Input: `input[type="date"]` or `[data-testid="schedule-date-input"]`
- Time Input: `input[type="time"]` or `[data-testid="schedule-time-input"]`
- Schedule Button: `button` containing "Schedule Task"
- Clear Schedule Button: `button` containing "Clear Schedule"
- Schedule Display: Text on task card showing scheduled date/time
- Scheduled Column: Column with "Scheduled" or "📅 Scheduled" header

---

## Timing Guidelines

### Expected Response Times

**Page Loads:**
- Home page: < 1 second
- Campaigns page: < 1 second
- Dialog open: < 300ms
- Dialog close: < 300ms

**Operations:**
- Source fetch: 2-5 seconds
- Campaign create: < 500ms
- Task create: < 500ms
- Task update: < 500ms
- Task delete: < 500ms
- Drag and drop: Immediate (< 100ms)

**Content Generation:**
- Single platform: 5-15 seconds
- Multiple platforms: 10-20 seconds
- Loading indicator should appear immediately

**Scheduling:**
- Schedule dialog open: < 300ms
- Schedule task operation: < 500ms
- Clear schedule operation: < 500ms
- Task move to Scheduled column: Smooth animation (< 500ms)
- Background scheduler check: Every 60 seconds
- Auto-posting processing: < 500ms per task
- Max delay for auto-posting: 60 seconds from scheduled time

### Wait Strategies

**For Source Fetch:**
- Wait for loading indicator to appear
- Wait for loading indicator to disappear
- Wait for content to be visible
- Max timeout: 10 seconds

**For Content Generation:**
- Wait for "Generating..." or spinner
- Wait for dialog to close
- Wait for new task cards to appear
- Max timeout: 30 seconds

**For Drag and Drop:**
- Wait for drag start (immediate)
- Wait for drop (immediate)
- Wait for position update (< 500ms)
- Verify final position

**For Page Refresh:**
- Wait for page load complete
- Wait for kanban board to render
- Wait for tasks to appear
- Verify data persistence

**For Scheduling:**
- Wait for schedule dialog to open (< 300ms)
- Wait for task to move to Scheduled column (< 500ms)
- Wait for schedule display to update on card
- For auto-posting test: Wait up to 3 minutes (scheduled time + 60s buffer)
- Verify task in correct column after scheduling

---

## Test Execution Order

### Recommended Test Sequence

**Phase 1: Setup (Features 1 & 2)**
1. Test Case 1.1: Navigate home
2. Test Case 1.2: Fetch first source
3. Test Case 1.3: Fetch second source
4. Test Case 2.1: Navigate campaigns
5. Test Case 2.2: Create first campaign
6. Test Case 2.3: Create first task
7. Test Case 2.4: Create multiple tasks

**Phase 2: Task Management (Feature 2)**
8. Test Case 2.5: Drag and drop
9. Test Case 2.6: Edit task
10. Test Case 2.7: Delete task
11. Test Case 2.8: Multiple campaigns

**Phase 3: Content Generation (Feature 3)**
12. Test Case 3.1: Verify prerequisites
13. Test Case 3.2: Open dialog
14. Test Case 3.3: Single platform generation
15. Test Case 3.4: Multiple platform generation
16. Test Case 3.5: Different tones

**Phase 4: Scheduling (Feature 4)**
17. Test Case 4.1: Verify scheduling UI elements
18. Test Case 4.2: Open schedule dialog
19. Test Case 4.3: Schedule a task
20. Test Case 4.4: Edit scheduled task
21. Test Case 4.5: Clear schedule
22. Test Case 4.8: Schedule multiple tasks
23. Test Case 4.10: Drag & drop integration

**Phase 5: Integration**
24. End-to-End Workflow Test

**Phase 6: Persistence**
25. Refresh browser
26. Verify all data persisted
27. Verify scheduled dates maintained
28. Verify state maintained

**Phase 7: Auto-Posting (Optional)**
29. Test Case 4.7: Automatic task posting (requires time wait or API call)

---

## Notes for Playwright Implementation

### Recommended Practices

**1. Use Data Attributes:**
If possible, add `data-testid` attributes to key elements for reliable selection.

**2. Wait for Network:**
Use `page.waitForLoadState('networkidle')` after navigation.

**3. Wait for Selectors:**
Use `page.waitForSelector()` before interacting with elements.

**4. Verify State Changes:**
Always assert state before and after actions.

**5. Handle Dialogs:**
Wait for dialogs to be fully visible before interacting.

**6. Screenshot on Failure:**
Capture screenshots when tests fail for debugging.

**7. Parallel Execution:**
Features 1 and 2 can run in parallel (different pages).
Feature 3 depends on 1 and 2 completing.

**8. Cleanup:**
Reset database between test runs for consistency.

### Example Playwright Code Structure

```javascript
// Source Ingestion Test
test('should fetch content from URL', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  const urlInput = page.locator('input[type="url"]');
  await urlInput.fill('https://www.paulgraham.com/startupideas.html');
  
  const fetchButton = page.locator('button:has-text("Fetch")');
  await fetchButton.click();
  
  // Wait for loading to complete
  await page.waitForSelector('text=Source saved successfully', { 
    timeout: 10000 
  });
  
  // Verify content displayed
  const content = page.locator('.content-preview');
  await expect(content).toBeVisible();
  
  const title = page.locator('.source-title');
  await expect(title).toContainText('Startup Ideas');
});

// Content Generation Test
test('should generate content for multiple platforms', async ({ page }) => {
  await page.goto('http://localhost:3000/campaigns');
  
  // Open generation dialog
  await page.click('button:has-text("Generate from Source")');
  
  // Wait for dialog
  await page.waitForSelector('[role="dialog"]');
  
  // Select source
  await page.selectOption('select[name="sourceId"]', { index: 0 });
  
  // Select platforms
  await page.check('input[type="checkbox"][value="linkedin"]');
  await page.check('input[type="checkbox"][value="twitter"]');
  await page.check('input[type="checkbox"][value="blog"]');
  
  // Select tone
  await page.selectOption('select[name="tone"]', 'professional');
  
  // Generate
  await page.click('button:has-text("Generate")');
  
  // Wait for completion (up to 30 seconds)
  await page.waitForSelector('[role="dialog"]', { 
    state: 'hidden',
    timeout: 30000 
  });
  
  // Verify 3 tasks created
  const draftColumn = page.locator('.column:has-text("Draft")');
  const taskCards = draftColumn.locator('.task-card');
  await expect(taskCards).toHaveCount(3);
});
```

---

## Feature 5: Performance Dashboard (v0.6.0)

### Test Case 5.1: Navigate to Dashboard

**Steps:**
1. Navigate to `http://localhost:3000/campaigns`
2. Locate "Dashboard" button in header
3. Click "Dashboard" button
4. Wait for dashboard page to load

**Expected Results:**
- [ ] Dashboard link appears in campaigns page header
- [ ] Click navigates to `/dashboard` URL
- [ ] Dashboard page loads successfully
- [ ] Page title is "Performance Dashboard"
- [ ] KPI cards are visible

**Selectors:**
- Dashboard Button: `button:has-text("Dashboard")`
- Dashboard Page: `h1:has-text("Performance Dashboard")`

---

### Test Case 5.2: Verify KPI Cards

**URL:** `http://localhost:3000/dashboard`

**Expected Elements:**
- [ ] Total Posts card with icon
- [ ] Total Clicks card with icon
- [ ] Total Likes card with icon
- [ ] Total Shares card with icon
- [ ] Each card shows a numeric value
- [ ] Cards are responsive (grid layout)

**Expected State (with data):**
- Values should be >= 0
- Cards have distinct colors (blue, green, pink, purple)
- Numbers formatted with commas if > 999

**Expected State (empty):**
- All cards show 0

**Selectors:**
- KPI Cards: `.card` or container with metrics
- Values: Large numbers in cards
- Icons: BarChart3, MousePointerClick, Heart, Share2

---

### Test Case 5.3: Verify Engagement Chart

**URL:** `http://localhost:3000/dashboard`

**Expected Elements:**
- [ ] Chart section with title "Engagement Over Time"
- [ ] Line chart with X/Y axes
- [ ] Three data series (Clicks, Likes, Shares)
- [ ] Legend showing series names
- [ ] Formatted dates on X-axis
- [ ] Responsive chart container

**Expected State (with data):**
- Lines visible with data points
- Hover tooltips show values
- Smooth line transitions

**Expected State (empty):**
- Empty state message: "No engagement data yet"
- Helpful text about metrics appearing

**Selectors:**
- Chart Container: Container with Recharts SVG
- Chart Lines: SVG paths with strokes
- Legend: Chart legend items

---

### Test Case 5.4: Create Metrics via API

**Purpose:** Test metrics creation and dashboard refresh

**Steps:**
1. Create a campaign and task (via UI or API)
2. Create metrics via API:
   ```javascript
   await fetch('http://localhost:3000/api/metrics', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       taskId: 'task_id_here',
       type: 'click',
       value: 5
     })
   });
   ```
3. Refresh dashboard page
4. Verify metrics appear

**Expected Results:**
- [ ] API returns 201 status
- [ ] Metric created successfully
- [ ] Dashboard reflects new data
- [ ] Total Clicks increases by 5
- [ ] Chart shows data point

---

### Test Case 5.5: Test Redirect Tracker

**Purpose:** Verify link click tracking

**Steps:**
1. Create a task (get task ID)
2. Navigate to redirect URL:
   `http://localhost:3000/r/{taskId}?url=https://example.com`
3. Wait for redirect
4. Check if metric was recorded

**Expected Results:**
- [ ] Page redirects to destination URL
- [ ] Click metric created in database
- [ ] Dashboard shows increased click count

**Verification:**
- Query metrics API: `GET /api/metrics?taskId={taskId}`
- Should find click metric with value 1

---

### Test Case 5.6: Dashboard Loading States

**URL:** `http://localhost:3000/dashboard`

**Expected Loading Behavior:**
- [ ] Loading spinner appears initially
- [ ] Text: "Loading dashboard..."
- [ ] Spinner animates (rotating)
- [ ] Content appears after load

**Expected Error Handling:**
- Simulate API error (disconnect network)
- [ ] Error message appears
- [ ] "Try Again" button shown
- [ ] Click button refetches data

**Selectors:**
- Loading Spinner: `.animate-spin`
- Error Message: Red alert/message
- Retry Button: `button:has-text("Try Again")`

---

### Test Case 5.7: Link Tracking Instructions

**URL:** `http://localhost:3000/dashboard`

**Expected Elements:**
- [ ] Info card with tracking instructions
- [ ] Code example showing redirect URL format
- [ ] Explanation of {taskId} and {destinationURL} placeholders
- [ ] Blue/info styling for visibility

**Content Verification:**
- URL format shown: `/r/{taskId}?url={destinationURL}`
- Instructions clear and helpful
- Example code copyable

---

### Playwright Test Example: Dashboard Flow

```javascript
test('should display dashboard with metrics', async ({ page }) => {
  // Setup: Create campaign, task, and metrics
  const campaign = await createTestCampaign();
  const task = await createTestTask({ campaignId: campaign.id, status: 'posted' });

  await fetch('http://localhost:3000/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId: task.id, type: 'click', value: 10 })
  });

  // Navigate to dashboard
  await page.goto('http://localhost:3000/dashboard');

  // Wait for loading to complete
  await page.waitForSelector('h1:has-text("Performance Dashboard")');

  // Verify KPI cards
  await expect(page.locator('text=/Total Posts/i')).toBeVisible();
  await expect(page.locator('text=/Total Clicks/i')).toBeVisible();
  await expect(page.locator('text=/Total Likes/i')).toBeVisible();
  await expect(page.locator('text=/Total Shares/i')).toBeVisible();

  // Verify clicks value
  const clicksCard = page.locator('.card:has-text("Total Clicks")');
  await expect(clicksCard).toContainText('10');

  // Verify chart is visible
  await expect(page.locator('text=/Engagement Over Time/i')).toBeVisible();
});

test('should track clicks via redirect', async ({ page }) => {
  const campaign = await createTestCampaign();
  const task = await createTestTask({ campaignId: campaign.id });

  // Navigate to redirect URL
  const redirectUrl = `http://localhost:3000/r/${task.id}?url=https://example.com`;
  await page.goto(redirectUrl);

  // Wait for redirect
  await page.waitForURL('https://example.com', { timeout: 5000 });

  // Verify metric was created
  const response = await fetch(`http://localhost:3000/api/metrics?taskId=${task.id}`);
  const data = await response.json();

  expect(data.metrics).toHaveLength(1);
  expect(data.metrics[0].type).toBe('click');
  expect(data.metrics[0].value).toBe(1);
});
```

---

## Feature 6: Unified Campaign Manager (v0.7.0)

### Test Case 6.1: Navigate to Campaigns with Tabs

**Steps:**
1. Navigate to `http://localhost:3000/campaigns`
2. Select a campaign from dropdown
3. Verify tabbed interface appears

**Expected Results:**
- [ ] Two tabs visible: "Tasks" and "Overview"
- [ ] Tasks tab is selected by default
- [ ] Tab icons visible (List for Tasks, BarChart3 for Overview)
- [ ] No separate Dashboard link in header (removed)
- [ ] Kanban board visible in Tasks tab

**Selectors:**
- Tabs Container: `[role="tablist"]`
- Tasks Tab: `button[data-state="active"]:has-text("Tasks")`
- Overview Tab: `button:has-text("Overview")`
- Kanban Board: Container with columns

---

### Test Case 6.2: Switch to Overview Tab

**Steps:**
1. Navigate to campaigns and select a campaign
2. Click "Overview" tab
3. Wait for dashboard content to load

**Expected Results:**
- [ ] Overview tab becomes active
- [ ] Tasks tab becomes inactive
- [ ] KPI cards appear (Total Posts, Clicks, Likes, Shares)
- [ ] Engagement chart appears
- [ ] Link tracking info card appears
- [ ] Content specific to selected campaign

**Selectors:**
- Overview Tab: `button:has-text("Overview")`
- KPI Cards: Multiple cards with metrics
- Chart: Recharts container with "Engagement Over Time"

---

### Test Case 6.3: Verify Campaign-Filtered Metrics

**Steps:**
1. Create two campaigns with tasks and metrics
2. Navigate to campaigns page
3. Select Campaign 1
4. Click "Overview" tab
5. Note the metrics values
6. Switch to Campaign 2
7. Verify metrics change

**Expected Results:**
- [ ] Metrics show only for selected campaign
- [ ] Values change when switching campaigns
- [ ] Chart data updates per campaign
- [ ] No global/all-campaigns metrics shown

**Verification:**
- Campaign 1 metrics != Campaign 2 metrics
- Switching campaigns triggers stats refresh
- Empty state shown if campaign has no metrics

---

### Test Case 6.4: Dashboard Redirect

**Steps:**
1. Navigate directly to `http://localhost:3000/dashboard`
2. Wait for redirect

**Expected Results:**
- [ ] Redirects to `/campaigns` URL
- [ ] Shows "Redirecting to campaigns..." message briefly
- [ ] Lands on campaigns page
- [ ] No 404 or error

**Timing:**
- Redirect should happen immediately
- No hanging or stuck states

---

### Test Case 6.5: Tab Persistence Within Session

**Steps:**
1. Navigate to campaigns
2. Select a campaign
3. Click "Overview" tab
4. Click "Tasks" tab
5. Click "Overview" tab again

**Expected Results:**
- [ ] Tab switching is instant (no network delays)
- [ ] Content switches smoothly
- [ ] No flickering or layout shifts
- [ ] No full page reloads

**Note:** Tab state resets on page refresh (known limitation)

---

### Test Case 6.6: Empty State in Overview Tab

**Steps:**
1. Create a new campaign with no tasks
2. Navigate to campaigns and select it
3. Click "Overview" tab

**Expected Results:**
- [ ] KPI cards show all zeros
- [ ] Chart shows empty state message
- [ ] Message: "No engagement data yet"
- [ ] Helpful text about metrics appearing
- [ ] No errors or broken states

---

### Test Case 6.7: Overview Tab Content

**URL:** `http://localhost:3000/campaigns` → Overview tab

**Expected Elements:**
- [ ] KPI Cards Grid (4 cards):
  - Total Posts (blue)
  - Total Clicks (green)
  - Total Likes (pink)
  - Total Shares (purple)
- [ ] Engagement Chart:
  - Title: "Engagement Over Time (Last 30 Days)"
  - Description: "Track clicks, likes, and shares for this campaign"
  - Line chart with three lines
  - Responsive container
- [ ] Link Tracking Info Card (blue background):
  - Title: "💡 Track Link Clicks"
  - Instructions for using `/r/{taskId}?url={destination}`
  - Code block with example URL
  - Helpful explanation text

---

### Playwright Test Example: Unified Campaign Manager

```javascript
test('should display unified campaign manager with tabs', async ({ page }) => {
  // Setup: Create campaign and task
  const campaign = await createTestCampaign();
  const task = await createTestTask({ campaignId: campaign.id, status: 'posted' });

  // Add metrics
  await fetch('http://localhost:3000/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId: task.id, type: 'click', value: 10 })
  });

  // Navigate to campaigns
  await page.goto('http://localhost:3000/campaigns');

  // Select campaign
  await page.click('button[role="combobox"]');
  await page.click(`text="${campaign.name}"`);

  // Verify tabs are visible
  await expect(page.locator('button:has-text("Tasks")')).toBeVisible();
  await expect(page.locator('button:has-text("Overview")')).toBeVisible();

  // Verify default tab is Tasks
  await expect(page.locator('button[data-state="active"]:has-text("Tasks")')).toBeVisible();

  // Verify Kanban board is visible
  await expect(page.locator('text=/To Do/i')).toBeVisible();

  // Switch to Overview tab
  await page.click('button:has-text("Overview")');

  // Wait for dashboard content
  await page.waitForSelector('text=/Total Posts/i');

  // Verify KPI cards
  await expect(page.locator('text=/Total Posts/i')).toBeVisible();
  await expect(page.locator('text=/Total Clicks/i')).toBeVisible();

  // Verify chart
  await expect(page.locator('text=/Engagement Over Time/i')).toBeVisible();

  // Switch back to Tasks tab
  await page.click('button:has-text("Tasks")');

  // Verify Kanban board reappears
  await expect(page.locator('text=/To Do/i')).toBeVisible();
});

test('should redirect from dashboard to campaigns', async ({ page }) => {
  // Navigate to old dashboard URL
  await page.goto('http://localhost:3000/dashboard');

  // Wait for redirect
  await page.waitForURL('http://localhost:3000/campaigns');

  // Verify we're on campaigns page
  await expect(page.locator('h1:has-text("Campaigns")')).toBeVisible();
});

test('should filter metrics by campaign', async ({ page }) => {
  // Create two campaigns with different metrics
  const campaign1 = await createTestCampaign({ name: 'Campaign 1' });
  const campaign2 = await createTestCampaign({ name: 'Campaign 2' });

  const task1 = await createTestTask({ campaignId: campaign1.id, status: 'posted' });
  const task2 = await createTestTask({ campaignId: campaign2.id, status: 'posted' });

  await fetch('http://localhost:3000/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId: task1.id, type: 'click', value: 10 })
  });

  await fetch('http://localhost:3000/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId: task2.id, type: 'click', value: 25 })
  });

  // Navigate to campaigns
  await page.goto('http://localhost:3000/campaigns');

  // Select Campaign 1
  await page.click('button[role="combobox"]');
  await page.click('text="Campaign 1"');

  // Go to Overview tab
  await page.click('button:has-text("Overview")');
  await page.waitForSelector('text=/Total Clicks/i');

  // Verify Campaign 1 metrics (10 clicks)
  const clicks1 = await page.locator('.card:has-text("Total Clicks")').textContent();
  expect(clicks1).toContain('10');

  // Switch to Campaign 2
  await page.click('button[role="combobox"]');
  await page.click('text="Campaign 2"');

  // Wait for stats refresh
  await page.waitForTimeout(1000);

  // Verify Campaign 2 metrics (25 clicks)
  const clicks2 = await page.locator('.card:has-text("Total Clicks")').textContent();
  expect(clicks2).toContain('25');
});
```

---

## Feature 7: Source Management (v0.7.1)

### Test Case 7.1: Navigate to Sources Page from Campaigns

**Steps:**
1. Navigate to `http://localhost:3000/campaigns`
2. Locate "Manage Sources" button in header
3. Click "Manage Sources" button
4. Wait for sources page to load

**Expected Results:**
- [ ] "Manage Sources" button visible in campaigns header
- [ ] Button has FileText icon
- [ ] Click navigates to `/sources` URL
- [ ] Sources page loads successfully
- [ ] Page title visible

**Selectors:**
- Manage Sources Button: `a[href="/sources"]` or `button:has-text("Manage Sources")`
- Sources Page Title: `h1` or heading with "Sources"

---

### Test Case 7.2: Verify Sources Page Empty State

**URL:** `http://localhost:3000/sources`

**Prerequisites:** No sources in database (clean state)

**Expected Elements:**
- [ ] Empty state message visible
- [ ] Helpful onboarding text
- [ ] "Add Your First Source" button visible
- [ ] Button links to home page
- [ ] Friendly, encouraging message

**Expected Text Content:**
- Message about no sources yet
- Instructions to add first source
- Clear call-to-action

**Selectors:**
- Empty State Container: `.empty-state` or card with message
- Add Source Button: `button` or link containing "Add" and "Source"
- Home Link: `a[href="/"]`

---

### Test Case 7.3: Verify Source Cards Display

**URL:** `http://localhost:3000/sources`

**Prerequisites:** At least 2 sources exist (from Feature 1 tests)

**Expected Elements:**
- [ ] Responsive grid layout (1/2/3 columns based on screen size)
- [ ] Source cards visible for each source
- [ ] Each card shows:
  - [ ] Title (or "Untitled Source" if missing)
  - [ ] URL as clickable external link
  - [ ] Content preview (first 200 chars)
  - [ ] Creation date
  - [ ] Task count (e.g., "3 tasks")
  - [ ] "Generate from Source" button with Sparkles icon
  - [ ] Delete button (trash icon)

**Card Styling:**
- Hover effects on cards
- Platform badges if applicable
- Proper spacing and padding
- Responsive design

**Selectors:**
- Sources Grid: Container with multiple cards
- Source Card: `.source-card` or card component
- Card Title: Heading in card
- Card URL: `a[target="_blank"]` with external link
- Content Preview: Text area with truncated content
- Metadata: Creation date and task count
- Generate Button: `button` containing "Generate"
- Delete Button: `button` with trash icon

---

### Test Case 7.4: Click Source URL (External Link)

**Steps:**
1. Navigate to `/sources`
2. Locate any source card
3. Click the URL link in card
4. Verify new tab opens

**Expected Results:**
- [ ] Link has `target="_blank"`
- [ ] Link has `rel="noopener noreferrer"` for security
- [ ] Clicking opens URL in new browser tab
- [ ] Original tab remains on sources page
- [ ] External site loads correctly

**Selectors:**
- Source URL Link: `a[target="_blank"][href^="http"]`

**Note:** This test requires handling new browser context/tab in Playwright.

---

### Test Case 7.5: Generate from Source (via Sources Page)

**Steps:**
1. Navigate to `/sources`
2. Ensure a campaign is selected (check in app state)
3. Click "Generate from Source" button on any source card
4. Wait for GenerateContentDialog to open
5. Verify source is pre-selected

**Expected Results:**
- [ ] Generate button triggers dialog
- [ ] GenerateContentDialog opens
- [ ] Source dropdown pre-filled with clicked source
- [ ] Can proceed with generation (same as Feature 3)

**If No Campaign Selected:**
- [ ] Alert or message appears
- [ ] Message states "Please select a campaign first"
- [ ] User directed to campaigns page
- [ ] Generate dialog does not open

**Selectors:**
- Generate Button: `button` with Sparkles icon, text "Generate from Source"
- Alert: Alert or toast notification
- Dialog: `[role="dialog"]` for generation

---

### Test Case 7.6: Delete Source - With No Tasks

**Steps:**
1. Navigate to `/sources`
2. Create a new source (or use one with 0 tasks)
3. Click delete button (trash icon)
4. Wait for confirmation dialog
5. Verify dialog shows "0 tasks"
6. Click "Delete" to confirm
7. Wait for deletion to complete

**Expected Results:**
- [ ] Delete button triggers confirmation dialog
- [ ] Dialog title: "Delete Source" or similar
- [ ] Dialog shows source title
- [ ] Dialog shows task count: "0 tasks"
- [ ] Warning message visible
- [ ] "Delete" button enabled
- [ ] "Cancel" button visible
- [ ] After deletion:
  - [ ] Dialog closes
  - [ ] Source card removed from grid
  - [ ] Source no longer visible
  - [ ] Smooth removal animation

**Selectors:**
- Delete Button: `button` with trash icon on source card
- Confirmation Dialog: `[role="dialog"]` or `.dialog`
- Task Count: Text showing "0 tasks" or "X tasks"
- Delete Confirm Button: `button` containing "Delete" in dialog
- Cancel Button: `button` containing "Cancel"

**Timing:**
- Delete operation: < 500ms
- UI update: Smooth animation

---

### Test Case 7.7: Delete Source - With Associated Tasks

**Steps:**
1. Navigate to `/sources`
2. Generate content from a source (creates tasks)
3. Verify source card shows task count > 0 (e.g., "3 tasks")
4. Click delete button on that source
5. Wait for confirmation dialog
6. Read warning message
7. Click "Delete" to confirm
8. Verify tasks still exist but sourceId is null

**Expected Results:**
- [ ] Dialog shows correct task count
- [ ] Warning message: "Tasks will not be deleted, but will no longer be linked to this source"
- [ ] Warning clearly explains cascade behavior
- [ ] After deletion:
  - [ ] Source removed from sources page
  - [ ] Tasks still visible in campaigns page
  - [ ] Tasks have no source association
  - [ ] No data loss

**Database Verification (via API or integration test):**
- [ ] Source deleted from database
- [ ] Tasks exist with `sourceId = null`
- [ ] Tasks linked to campaign still
- [ ] Metrics preserved

**Selectors:**
- Warning Text: Element in dialog containing "Tasks will not be deleted"
- Task Count Display: Text showing task count in dialog

---

### Test Case 7.8: Auto-Redirect After Source Fetch

**Steps:**
1. Navigate to `http://localhost:3000` (home page)
2. Enter URL in source ingestion form
3. Click "Fetch" button
4. Wait for content to be fetched and displayed
5. Wait 1.5 seconds for feedback
6. Observe automatic redirect

**Expected Results:**
- [ ] Content displays briefly (1.5 seconds)
- [ ] Success message visible
- [ ] Automatic redirect to `/sources` occurs
- [ ] User sees newly added source in sources grid
- [ ] No manual navigation required
- [ ] Workflow feels seamless

**Selectors:**
- Success Message: Toast or alert after fetch
- Sources URL: Verify URL becomes `/sources`
- New Source Card: Newest card in grid (check timestamp)

**Timing:**
- Display time: 1.5 seconds
- Redirect: Smooth transition

---

### Test Case 7.9: Sources Page Navigation Links

**URL:** `http://localhost:3000/sources`

**Expected Elements:**
- [ ] "Home" button visible in header
- [ ] "Add Source" button visible
- [ ] Both buttons navigate correctly

**Navigation Tests:**

**Home Button:**
1. Click "Home" button
2. Verify navigation to `/` (home page)
3. Source ingestion form visible

**Add Source Button:**
1. Click "Add Source" button
2. Should navigate to home page (same as Home)
3. Allows user to add another source

**Selectors:**
- Home Button: `a[href="/"]` or `button` with "Home"
- Add Source Button: `a[href="/"]` or button with "Add Source"

---

### Test Case 7.10: Verify Cascade Behavior (Integration Test)

**Purpose:** Verify database cascade behavior (onDelete: SetNull)

**Note:** This is primarily a database integration test, not browser UI test.

**Setup:**
1. Create source via API or browser
2. Generate 3 tasks from source
3. Verify tasks linked to source (via API)
4. Delete source (via browser or API)
5. Query tasks (via API)

**Expected Results:**
- [ ] Source deleted successfully
- [ ] All 3 tasks still exist in database
- [ ] Each task has `sourceId = null`
- [ ] Tasks still linked to campaign
- [ ] No foreign key constraint errors
- [ ] No data loss besides source

**API Verification:**
```javascript
// Check tasks after source deletion
const tasks = await prisma.task.findMany({
  where: { id: { in: [task1.id, task2.id, task3.id] } }
});

expect(tasks).toHaveLength(3);
tasks.forEach(task => {
  expect(task.sourceId).toBeNull();
  expect(task.campaignId).not.toBeNull();
});
```

---

### Test Case 7.11: Multiple Sources Grid Layout

**Steps:**
1. Navigate to `/sources`
2. Ensure 6+ sources exist (create if needed)
3. Observe grid layout at different screen sizes

**Expected Results:**
- [ ] Desktop (wide): 3 columns
- [ ] Tablet (medium): 2 columns
- [ ] Mobile (narrow): 1 column
- [ ] Responsive breakpoints work correctly
- [ ] Cards maintain aspect ratio
- [ ] No layout breaks or overlaps
- [ ] Smooth resizing behavior

**Selectors:**
- Grid Container: Container with responsive grid classes
- Source Cards: Multiple cards in grid

**Responsive Testing:**
- Test at 1920px width (desktop)
- Test at 768px width (tablet)
- Test at 375px width (mobile)

---

### Playwright Test Example: Source Management

```javascript
test('should display sources page with sources', async ({ page }) => {
  // Setup: Create 2 sources
  const source1 = await createTestSource({
    title: 'Test Article 1',
    url: 'https://example.com/article1'
  });
  const source2 = await createTestSource({
    title: 'Test Article 2',
    url: 'https://example.com/article2'
  });

  // Navigate to sources page
  await page.goto('http://localhost:3000/sources');

  // Wait for page load
  await page.waitForSelector('h1');

  // Verify source cards visible
  const sourceCards = page.locator('.source-card');
  await expect(sourceCards).toHaveCount(2);

  // Verify first source card content
  const firstCard = sourceCards.first();
  await expect(firstCard).toContainText('Test Article 1');
  await expect(firstCard).toContainText('https://example.com/article1');
  await expect(firstCard.locator('button:has-text("Generate")')).toBeVisible();
  await expect(firstCard.locator('button[aria-label="Delete"]')).toBeVisible();
});

test('should delete source with confirmation', async ({ page }) => {
  const source = await createTestSource({ title: 'To Delete' });

  await page.goto('http://localhost:3000/sources');

  // Click delete button
  const deleteButton = page.locator('button[aria-label="Delete"]').first();
  await deleteButton.click();

  // Wait for confirmation dialog
  await page.waitForSelector('[role="dialog"]');

  // Verify dialog content
  await expect(page.locator('[role="dialog"]')).toContainText('Delete Source');
  await expect(page.locator('[role="dialog"]')).toContainText('To Delete');

  // Confirm deletion
  await page.click('button:has-text("Delete")');

  // Wait for dialog to close
  await page.waitForSelector('[role="dialog"]', { state: 'hidden' });

  // Verify source removed
  await expect(page.locator('text="To Delete"')).not.toBeVisible();
});

test('should redirect after source fetch', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Fetch source
  await page.fill('input[type="url"]', 'https://www.paulgraham.com/startupideas.html');
  await page.click('button:has-text("Fetch")');

  // Wait for fetch to complete
  await page.waitForSelector('text=/success/i', { timeout: 10000 });

  // Wait for automatic redirect to sources page
  await page.waitForURL('http://localhost:3000/sources', { timeout: 5000 });

  // Verify on sources page
  await expect(page).toHaveURL('http://localhost:3000/sources');

  // Verify new source appears
  await expect(page.locator('text="Startup Ideas"')).toBeVisible();
});

test('should show empty state when no sources', async ({ page }) => {
  // Ensure database is empty
  await cleanDatabase();

  await page.goto('http://localhost:3000/sources');

  // Verify empty state
  await expect(page.locator('text=/no sources/i')).toBeVisible();
  await expect(page.locator('button:has-text("Add Your First Source")')).toBeVisible();

  // Click add source button
  await page.click('button:has-text("Add Your First Source")');

  // Verify navigation to home
  await expect(page).toHaveURL('http://localhost:3000');
});
```

---

## Feature 8: Improved Campaign Workflow Clarity (v0.11.0)

### Test Case 8.1: Empty State for Campaigns with No Tasks

**Prerequisites:**
- Campaign exists with no tasks

**Steps:**
1. Navigate to `/campaigns`
2. Select a campaign that has zero tasks
3. Verify empty state is displayed

**Expected Results:**
- [ ] Empty state card visible
- [ ] Title: "No Tasks Yet"
- [ ] Description: "Get started by creating tasks or generating content from your sources"
- [ ] Two option cards visible:
  - [ ] "Generate with Claude AI" with Sparkles icon
  - [ ] "Create Task Manually" with Plus icon
- [ ] Each option has description and action button
- [ ] Clicking "Generate Content" opens GenerateContentDialog
- [ ] Clicking "New Task" opens CreateTaskDialog
- [ ] No Kanban board displayed (replaced by empty state)

**Selectors:**
- Empty State Card: `h2:has-text("No Tasks Yet")`
- Generate Button: `button:has-text("Generate Content")`
- New Task Button: `button:has-text("New Task")`

---

### Test Case 8.2: Campaign-Source Relationship

**Prerequisites:**
- At least one source exists

**Steps:**
1. Navigate to `/sources`
2. Click "Generate from Source" on a source card
3. If no campaigns exist, verify campaign is auto-created
4. Navigate to `/campaigns`
5. Select the newly created campaign
6. Verify source attribution is displayed

**Expected Results:**
- [ ] Campaign auto-created with source name as campaign name
- [ ] Campaign has sourceId set
- [ ] Source attribution card visible below campaign description
- [ ] Source card shows:
  - [ ] FileText icon
  - [ ] "Source:" label
  - [ ] Source title as clickable link
  - [ ] Link opens in new tab
  - [ ] External URL matches source URL

**Database Verification:**
- [ ] Campaign.sourceId equals Source.id
- [ ] Campaign name matches source title (or "Untitled Campaign")

**Selectors:**
- Source Attribution: Container with FileText icon
- Source Link: `a[target="_blank"]` with source URL

---

### Test Case 8.3: Source Attribution Display

**Steps:**
1. Create source: "Test Blog Post" with URL "https://blog.example.com"
2. Create campaign from source via "Generate from Source"
3. Navigate to `/campaigns`
4. Select the campaign
5. Verify source attribution displays

**Expected Results:**
- [ ] Source info card visible
- [ ] FileText icon displayed
- [ ] Text: "Source:"
- [ ] Link text: "Test Blog Post"
- [ ] Link href: "https://blog.example.com"
- [ ] Link has target="_blank" and rel="noopener noreferrer"
- [ ] Source card only shows when campaign has source
- [ ] Card hidden for campaigns without source

---

### Test Case 8.4: Source Deletion with Campaign

**Steps:**
1. Create source
2. Create campaign from source (auto-generated)
3. Create tasks from the campaign
4. Delete the source
5. Navigate to campaigns
6. Select the campaign
7. Verify behavior

**Expected Results:**
- [ ] Campaign still exists after source deletion
- [ ] Tasks still exist
- [ ] Campaign.sourceId is NULL
- [ ] Source attribution card not displayed
- [ ] No errors or broken states
- [ ] Tasks still linked to campaign
- [ ] Can still create new tasks in campaign

**Database Verification:**
```javascript
const campaign = await prisma.campaign.findUnique({
  where: { id },
  include: { source: true, tasks: true }
});
expect(campaign.sourceId).toBeNull();
expect(campaign.source).toBeNull();
expect(campaign.tasks.length).toBeGreaterThan(0);
```

---

### Test Case 8.5: Multiple Campaigns from Same Source

**Steps:**
1. Create one source
2. Generate from source → Campaign 1 created
3. Generate from source again → Choose "Create New Campaign" in selector
4. Campaign 2 created
5. Verify both campaigns

**Expected Results:**
- [ ] Both campaigns have same sourceId
- [ ] Both show same source attribution
- [ ] Source attribution link works for both
- [ ] Deleting source sets both sourceIds to NULL
- [ ] Both campaigns remain independent

---

### Test Case 8.6: Campaign Without Source

**Steps:**
1. Navigate to `/campaigns`
2. Click "New Campaign"
3. Create campaign manually (without source)
4. Select the campaign
5. Verify behavior

**Expected Results:**
- [ ] Campaign created successfully
- [ ] Campaign.sourceId is NULL
- [ ] No source attribution card displayed
- [ ] Can still create tasks manually
- [ ] Can still generate content (requires selecting source in dialog)
- [ ] No errors or missing UI elements

---

### Playwright Test Example: Empty State & Source Attribution

```javascript
test('should display empty state when campaign has no tasks', async ({ page }) => {
  const campaign = await createTestCampaign({ name: 'Empty Campaign' });

  await page.goto('http://localhost:3000/campaigns');

  // Select campaign
  await page.click('button[role="combobox"]');
  await page.click('text="Empty Campaign"');

  // Verify empty state
  await expect(page.locator('h2:has-text("No Tasks Yet")')).toBeVisible();
  await expect(page.locator('text=/Get started by creating tasks/i')).toBeVisible();

  // Verify action buttons
  await expect(page.locator('button:has-text("Generate Content")')).toBeVisible();
  await expect(page.locator('button:has-text("New Task")')).toBeVisible();

  // Test Generate Content button
  await page.click('button:has-text("Generate Content")');
  await expect(page.locator('[role="dialog"]:has-text("Generate Content")')).toBeVisible();
});

test('should display source attribution for campaign created from source', async ({ page }) => {
  // Create source
  const source = await createTestSource({
    title: 'My Article',
    url: 'https://example.com/article'
  });

  // Create campaign with source
  const campaign = await createTestCampaign({
    name: 'My Article',
    sourceId: source.id
  });

  await page.goto('http://localhost:3000/campaigns');

  // Select campaign
  await page.click('button[role="combobox"]');
  await page.click('text="My Article"');

  // Verify source attribution
  await expect(page.locator('text="Source:"')).toBeVisible();
  await expect(page.locator('a:has-text("My Article")')).toBeVisible();

  // Verify link
  const link = page.locator('a:has-text("My Article")');
  await expect(link).toHaveAttribute('href', 'https://example.com/article');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('should handle source deletion gracefully', async ({ page }) => {
  // Create source and campaign
  const source = await createTestSource({ title: 'To Delete' });
  const campaign = await createTestCampaign({
    name: 'Campaign',
    sourceId: source.id
  });

  // Create task
  await createTestTask({
    campaignId: campaign.id,
    sourceId: source.id
  });

  // Delete source
  await prisma.source.delete({ where: { id: source.id } });

  // Navigate to campaign
  await page.goto('http://localhost:3000/campaigns');
  await page.click('button[role="combobox"]');
  await page.click('text="Campaign"');

  // Verify source attribution not shown
  await expect(page.locator('text="Source:"')).not.toBeVisible();

  // Verify campaign still functional
  await expect(page.locator('text=/To Do/i')).toBeVisible(); // Kanban board

  // Verify can still create tasks
  await page.click('button:has-text("New Task")');
  await expect(page.locator('[role="dialog"]:has-text("Create Task")')).toBeVisible();
});
```

---

## Feature 9: Dismissible Onboarding Hints (v0.11.1)

### Test Case 9.1: Onboarding Hint Display

**Prerequisites:**
- Fresh browser session (clear localStorage)
- At least one source exists

**Steps:**
1. Navigate to `/sources`
2. Verify hint is displayed

**Expected Results:**
- [ ] Compact hint visible below header
- [ ] Lightbulb icon displayed
- [ ] Message: "Click 'Generate from Source' to create platform-optimized social posts with Claude AI"
- [ ] Dismiss button (X) visible
- [ ] Blue color scheme (blue-50 background)

**Selectors:**
- Hint container: Has lightbulb icon and dismiss button
- Dismiss button: `button[aria-label="Dismiss hint"]`

---

### Test Case 9.2: Hint Dismissal

**Steps:**
1. Navigate to `/sources` (hint should be visible)
2. Click dismiss button on hint
3. Refresh page
4. Verify hint does not reappear

**Expected Results:**
- [ ] Hint disappears immediately after dismiss
- [ ] No animation or delay
- [ ] After page refresh, hint stays dismissed
- [ ] localStorage contains dismissed hint ID
- [ ] Other hints still show on other pages

**localStorage Verification:**
```javascript
const dismissed = JSON.parse(
  localStorage.getItem('navam-marketer-hints-dismissed')
);
expect(dismissed).toContain('sources-generate');
```

---

### Test Case 9.3: Multiple Hints Independence

**Steps:**
1. Navigate to `/sources`, dismiss sources hint
2. Navigate to `/campaigns`, select campaign
3. Verify campaigns hint still shows
4. Dismiss campaigns hint
5. Go back to `/sources`
6. Verify sources hint stays dismissed

**Expected Results:**
- [ ] Each hint dismissed independently
- [ ] Dismissing one doesn't affect others
- [ ] All dismissed hints persist across navigation
- [ ] localStorage tracks all dismissed hints

---

### Test Case 9.4: Campaign Select Hint

**Prerequisites:**
- At least two campaigns exist
- No campaign selected yet

**Steps:**
1. Navigate to `/campaigns`
2. Verify hint is displayed

**Expected Results:**
- [ ] Compact hint visible above campaign selector
- [ ] Message: "Choose a campaign from the dropdown to view and manage its tasks"
- [ ] Hint disappears when campaign is selected
- [ ] Hint can be dismissed with X button
- [ ] Dismissed state persists

**Selectors:**
- Hint: Contains text "Choose a campaign"
- Campaign selector: `select` or `button[role="combobox"]`

---

### Test Case 9.5: Kanban Drag-Drop Hint

**Prerequisites:**
- Campaign selected
- At least one task exists in campaign

**Steps:**
1. Navigate to `/campaigns`
2. Select campaign with tasks
3. Click "Tasks" tab (if not already active)
4. Verify hint is displayed above Kanban board

**Expected Results:**
- [ ] Compact hint visible above Kanban board
- [ ] Message: "Drag task cards between columns to update their status"
- [ ] Hint only shows when tasks exist (not on empty state)
- [ ] Can be dismissed
- [ ] Dismissed state persists

---

### Test Case 9.6: Dashboard Metrics Hint

**Prerequisites:**
- Campaign selected
- Campaign has posted tasks with metrics

**Steps:**
1. Navigate to `/campaigns`
2. Select campaign
3. Click "Overview" tab
4. Verify hint is displayed

**Expected Results:**
- [ ] Compact hint visible above dashboard stats
- [ ] Message: "Monitor clicks, likes, and shares. Use 'Record Metrics' button..."
- [ ] Hint appears on Overview tab only
- [ ] Can be dismissed
- [ ] Dismissed state persists

---

### Test Case 9.7: SSR Safety (Server-Side Rendering)

**Steps:**
1. Load page with hints enabled
2. Check browser console for errors
3. Verify no "window is not defined" errors
4. Verify hints render after client hydration

**Expected Results:**
- [ ] No SSR-related errors in console
- [ ] Hints don't flash/flicker on load
- [ ] localStorage access happens client-side only
- [ ] Default state (dismissed) prevents flash of content

---

### Test Case 9.8: localStorage Corruption Handling

**Steps:**
1. Manually corrupt localStorage:
   ```javascript
   localStorage.setItem('navam-marketer-hints-dismissed', 'invalid-json');
   ```
2. Navigate to `/sources`
3. Verify hint displays (fallback to non-dismissed state)
4. Dismiss hint
5. Verify localStorage is repaired with valid JSON

**Expected Results:**
- [ ] Corrupted data doesn't break app
- [ ] Hint shows when localStorage is invalid
- [ ] Console error logged (graceful degradation)
- [ ] Dismissal repairs localStorage with valid JSON

---

### Test Case 9.9: All Hints Workflow

**User Journey: First-Time User**

**Steps:**
1. Clear localStorage
2. Navigate to `/sources` - dismiss hint
3. Navigate to `/campaigns` - dismiss select hint
4. Select campaign with tasks - dismiss drag-drop hint
5. Click "Overview" tab - dismiss metrics hint
6. Refresh browser, navigate through all pages
7. Verify no hints reappear

**Expected Results:**
- [ ] 4 hints total across workflow
- [ ] Each dismisses independently
- [ ] All persist after refresh
- [ ] localStorage contains 4 hint IDs:
  - `sources-generate`
  - `campaigns-select`
  - `kanban-drag-drop`
  - `dashboard-metrics`

**localStorage State:**
```json
{
  "navam-marketer-hints-dismissed": [
    "sources-generate",
    "campaigns-select",
    "kanban-drag-drop",
    "dashboard-metrics"
  ]
}
```

---

### Test Case 9.10: Accessibility

**Steps:**
1. Navigate to page with visible hint
2. Tab through page with keyboard
3. Verify hint dismiss button is focusable
4. Press Enter on focused button
5. Verify hint dismisses

**Expected Results:**
- [ ] Dismiss button is keyboard accessible
- [ ] Button has `aria-label="Dismiss hint"`
- [ ] Button receives focus ring when tabbed to
- [ ] Enter key dismisses hint
- [ ] Screen reader announces button label

**ARIA Verification:**
```javascript
const dismissButton = page.locator('button[aria-label="Dismiss hint"]');
await expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss hint');
```

---

### Playwright Test Example: Onboarding Hints

```javascript
test('should show and dismiss onboarding hint on sources page', async ({ page }) => {
  // Create a source first
  await createTestSource({ title: 'Test Source' });

  // Clear localStorage to simulate first visit
  await page.evaluate(() => {
    localStorage.clear();
  });

  await page.goto('http://localhost:3000/sources');

  // Verify hint is visible
  await expect(page.locator('text=/Generate from Source/i')).toBeVisible();
  await expect(page.locator('button[aria-label="Dismiss hint"]')).toBeVisible();

  // Dismiss hint
  await page.click('button[aria-label="Dismiss hint"]');

  // Verify hint is gone
  await expect(page.locator('text=/Generate from Source/i')).not.toBeVisible();

  // Refresh page
  await page.reload();

  // Verify hint stays dismissed
  await expect(page.locator('text=/Generate from Source/i')).not.toBeVisible();

  // Verify localStorage
  const dismissed = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('navam-marketer-hints-dismissed'));
  });
  expect(dismissed).toContain('sources-generate');
});

test('should show multiple hints independently', async ({ page }) => {
  await createTestCampaign({ name: 'Campaign 1' });
  await createTestCampaign({ name: 'Campaign 2' });

  // Clear localStorage
  await page.evaluate(() => localStorage.clear());

  // Check sources hint
  await page.goto('http://localhost:3000/sources');
  await expect(page.locator('text=/Generate from Source/i')).toBeVisible();
  await page.click('button[aria-label="Dismiss hint"]');

  // Check campaigns hint
  await page.goto('http://localhost:3000/campaigns');
  await expect(page.locator('text=/Choose a campaign/i')).toBeVisible();

  // Sources hint should stay dismissed
  await page.goto('http://localhost:3000/sources');
  await expect(page.locator('text=/Generate from Source/i')).not.toBeVisible();
});

test('should handle localStorage corruption gracefully', async ({ page }) => {
  await createTestSource({ title: 'Test' });

  // Corrupt localStorage
  await page.evaluate(() => {
    localStorage.setItem('navam-marketer-hints-dismissed', 'invalid-json');
  });

  await page.goto('http://localhost:3000/sources');

  // Should show hint despite corrupted data
  await expect(page.locator('text=/Generate from Source/i')).toBeVisible();

  // Dismiss should repair localStorage
  await page.click('button[aria-label="Dismiss hint"]');

  const dismissed = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('navam-marketer-hints-dismissed'));
  });
  expect(Array.isArray(dismissed)).toBe(true);
  expect(dismissed).toContain('sources-generate');
});
```

---

## Feature 10: Campaign Archive Management (v0.11.2)

### Test Case 10.1: Archive Campaign

**Prerequisites:**
- At least one campaign exists

**Steps:**
1. Navigate to `/campaigns`
2. Select a campaign
3. Click "Archive" button
4. Verify campaign is archived

**Expected Results:**
- [ ] Archive button visible when campaign selected
- [ ] Click archive shows campaign with `[Archived]` label in dropdown
- [ ] Amber warning card appears
- [ ] "Generate with Claude" and "New Task" buttons hidden
- [ ] Archive button changes to "Unarchive"

### Test Case 10.2: Show/Hide Archived Campaigns

**Steps:**
1. Create and archive a campaign
2. Click "Show Archived" button
3. Verify archived campaign visible
4. Click "Hide Archived" button
5. Verify archived campaign hidden

**Expected Results:**
- [ ] Toggle button in header
- [ ] Button variant changes (outline/default)
- [ ] Archived campaigns appear with `[Archived]` label
- [ ] Default view hides archived campaigns

### Test Case 10.3: Unarchive Campaign

**Steps:**
1. Archive a campaign
2. Select the archived campaign
3. Click "Unarchive" button
4. Verify campaign restored

**Expected Results:**
- [ ] Unarchive button visible for archived campaigns
- [ ] Campaign removed from archived list
- [ ] Full functionality restored (Generate, New Task buttons)
- [ ] Amber warning card hidden

---

**End of Browser Evaluation Guide**
**Version 0.11.2 - Complete**

This guide is optimized for automated browser testing with Playwright. All manual setup and database verification steps have been removed, focusing purely on browser interactions and expected UI states.
