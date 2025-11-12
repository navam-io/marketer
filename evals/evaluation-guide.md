# Navam Marketer - Browser Evaluation Guide

**Version:** 0.3.1
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

**Day 3: Content Management**

12. Edit one task's content inline
13. Drag 2 tasks from Draft to Scheduled
14. Drag 1 task from Scheduled to Posted
15. Delete 1 task from Draft
16. Verify final state:
    - [ ] 1 task in Draft
    - [ ] 2 tasks in Scheduled
    - [ ] 1 task in Posted
    - [ ] Total: 4 tasks (1 deleted)

**Day 4: Verify Persistence**

17. Refresh page (`F5` or reload)
18. Verify all tasks still in correct columns
19. Verify edited content persisted
20. Verify campaign still selected

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
- Source Select: `select[name="sourceId"]`
- Platform Checkbox: `input[type="checkbox"][value="linkedin"]` etc.
- Tone Select: `select[name="tone"]`
- CTA Input: `input[name="cta"]`

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

**Phase 4: Integration**
17. End-to-End Workflow Test

**Phase 5: Persistence**
18. Refresh browser
19. Verify all data persisted
20. Verify state maintained

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

**End of Browser Evaluation Guide**

This guide is optimized for automated browser testing with Playwright. All manual setup and database verification steps have been removed, focusing purely on browser interactions and expected UI states.
