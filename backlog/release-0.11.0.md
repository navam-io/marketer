# Release Notes - v0.11.0

**Release Date:** 2025-11-13
**Type:** Minor Release (New Features)
**Theme:** Improved Campaign Workflow Clarity & Source Attribution

---

## 🎯 Overview

Version 0.11.0 completes the **Campaign Workflow Clarity** improvements planned in the backlog. This release adds empty state guidance, campaign-source relationships, and source attribution display to help users understand the workflow from content ingestion to campaign execution.

**Key Improvements:**
- ✅ Empty state with actionable next steps when campaigns have no tasks
- ✅ Campaign-Source relationship tracking
- ✅ Source attribution display on campaign pages
- ✅ Test suite improvements (race condition fix)

---

## ✨ New Features

### 1. Empty State for Campaigns with No Tasks

**Problem:** When a campaign had no tasks, users saw an empty Kanban board with no guidance on what to do next.

**Solution:** Added an informative empty state card with two clear paths forward:

**Implementation:**
- Empty state card appears when `tasks.length === 0`
- Two guided options with icons and descriptions:
  1. **Generate with Claude AI** - Creates AI-generated content from sources
  2. **Create Task Manually** - Allows manual post creation
- Each option has a direct action button
- Replaces empty Kanban board with helpful onboarding

**User Benefits:**
- Clear next steps for new or empty campaigns
- Reduces confusion for first-time users
- Accelerates workflow by surfacing key actions

**Files Modified:**
- `app/campaigns/page.tsx` - Added empty state UI in Tasks tab

---

### 2. Campaign-Source Relationship

**Problem:** No way to track which source inspired a campaign, losing context over time.

**Solution:** Added optional `sourceId` field to Campaign model with full cascade handling.

**Schema Changes:**
```prisma
model Campaign {
  sourceId    String?  // Optional source this campaign originated from
  source      Source?  @relation(fields: [sourceId], references: [id], onDelete: SetNull)
}

model Source {
  campaigns   Campaign[]
}
```

**Behavior:**
- When campaign is auto-created from source (via "Generate from Source"), `sourceId` is automatically set
- When source is deleted, campaign's `sourceId` is set to NULL (campaign preserved)
- Multiple campaigns can share the same source
- Campaigns can exist without a source (manual creation)

**API Updates:**
- `POST /api/campaigns` - Accepts optional `sourceId` parameter
- `GET /api/campaigns` - Includes source data in response

**Files Modified:**
- `prisma/schema.prisma` - Added Campaign.sourceId relation
- `app/api/campaigns/route.ts` - Added sourceId support
- `app/sources/page.tsx` - Updated createCampaignFromSource to set sourceId

---

### 3. Source Attribution Display

**Problem:** Users couldn't see which source a campaign came from, breaking the content trail.

**Solution:** Display source name and link on campaign details card.

**Implementation:**
- Source info card appears below campaign description (when source exists)
- Shows source icon, title, and clickable URL
- External link opens in new tab
- Gracefully handles missing source data

**UI Details:**
- FileText icon for visual consistency
- Blue link styling for URLs
- Fallback text for sources without URLs
- Compact, non-intrusive display

**Files Modified:**
- `app/campaigns/page.tsx` - Added source attribution display

---

### 4. Test Suite Improvements

**Problem:** Tests were failing intermittently when run in parallel due to SQLite database conflicts.

**Solution:** Configured Jest to run tests sequentially to avoid race conditions.

**Changes:**
- Added `maxWorkers: 1` to `jest.config.js`
- Fixed `createTestTask` helper to support both string and object signatures
- Ensured all 192 tests pass reliably

**Test Coverage:**
- Added 8 new integration tests for Campaign-Source relationship
- Total: 192 tests, 100% pass rate
- All tests run in < 2 seconds

**Files Modified:**
- `jest.config.js` - Set maxWorkers to 1
- `lib/test-utils.ts` - Improved createTestTask signature
- `__tests__/integration/campaign-workflow.test.ts` - NEW: 8 comprehensive tests

---

## 🔧 Technical Details

### Database Migration

**Schema Changes:**
- Added `Campaign.sourceId: String?` field
- Added `Campaign.source` relation
- Added `Source.campaigns` relation
- OnDelete behavior: SetNull (preserves campaigns when source deleted)

**Migration Command:**
```bash
npm run db:push
```

**Backward Compatibility:**
- Existing campaigns get `sourceId = NULL` (fully compatible)
- No data loss
- No breaking changes

---

### API Changes

#### Updated Endpoints

**POST /api/campaigns**

*Request:*
```json
{
  "name": "Product Launch Q4",
  "description": "Social campaign",
  "status": "active",
  "sourceId": "clx..." // NEW: Optional
}
```

*Response:*
```json
{
  "campaign": {
    "id": "cly...",
    "name": "Product Launch Q4",
    "sourceId": "clx...",
    "source": {  // NEW: Included in response
      "id": "clx...",
      "title": "Blog Post Title",
      "url": "https://example.com/post"
    },
    ...
  }
}
```

**GET /api/campaigns**

*Response (Updated):*
```json
{
  "campaigns": [
    {
      "id": "cly...",
      "name": "My Campaign",
      "sourceId": "clx...",
      "source": {  // NEW: Always included
        "id": "clx...",
        "title": "Source Title",
        "url": "https://..."
      },
      "_count": {
        "tasks": 5
      }
    }
  ]
}
```

---

## 🧪 Testing

### New Test Suite

**File:** `__tests__/integration/campaign-workflow.test.ts`

**Tests Added (8 total):**

1. ✅ Create campaign with sourceId
2. ✅ Create campaign without sourceId (null allowed)
3. ✅ Set sourceId to null when source deleted (cascade)
4. ✅ Allow multiple campaigns from same source
5. ✅ Include source in campaign GET response (API)
6. ✅ Create campaign with source attribution
7. ✅ Maintain Source-Campaign-Task relationships
8. ✅ Handle source deletion with existing campaign and tasks

**Test Results:**
```
Test Suites: 12 passed, 12 total
Tests:       192 passed, 192 total
Snapshots:   0 total
Time:        ~2s
```

---

## 📊 Impact

### User Experience
- **Reduced confusion:** Empty states provide clear guidance
- **Better context:** Source attribution shows content origin
- **Faster onboarding:** New users see actionable next steps

### Code Quality
- **100% test pass rate:** All 192 tests passing reliably
- **No flaky tests:** Sequential execution eliminates race conditions
- **Better coverage:** 8 new integration tests

### Data Integrity
- **No breaking changes:** Existing data fully compatible
- **Safe deletion:** Source deletion doesn't break campaigns
- **Flexible:** Campaigns can exist with or without sources

---

## 🚀 Deployment

### Steps

1. **Pull latest code**
   ```bash
   git pull origin master
   ```

2. **Install dependencies** (if needed)
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run database migration**
   ```bash
   npm run db:push
   ```

4. **Run tests** (verify)
   ```bash
   npm test
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Deploy**
   - Vercel: Auto-deploy on push
   - Manual: `npm run start`

---

## 📝 Documentation Updates

### Files Updated
- `backlog/active.md` - Marked P1-3 items as completed
- `README.md` - Added v0.11.0 to roadmap
- `evals/evaluation-guide.md` - Added test cases for new features

---

## 🎓 Backlog Status

### Completed Features (P1-3: Campaign Workflow Clarity)

✅ **Empty state on Campaigns page with next step guidance**
✅ **Add `Campaign.sourceId` optional relation to track source origin**
✅ **Show source name/link on campaign cards**

### Remaining Items
⏳ **Dismissible onboarding hints for first-time users** - Deferred to v0.11.1

---

## 🐛 Bug Fixes

### Test Suite Race Conditions

**Issue:** Tests failing intermittently when run in parallel

**Root Cause:** Multiple test workers accessing SQLite database simultaneously

**Fix:** Configure Jest to run with `maxWorkers: 1`

**Impact:**
- All tests now pass reliably
- Slight increase in test time (~0.5s) but acceptable for determinism
- No changes to application code

---

## 🔜 Next Release

### v0.11.1 (Planned)

**Theme:** Dismissible Onboarding Hints

**Features:**
- First-time user hints on key pages
- Dismissible tooltips for workflow guidance
- Persistent user preferences (localStorage)

**Expected:** Patch release, minor UX improvements

---

## 📈 Metrics

### Code Changes
- Files modified: 7
- Files added: 1 (test suite)
- Lines added: ~250
- Lines removed: ~50

### Test Coverage
- Integration tests: +8
- Total tests: 192 (was 184)
- Pass rate: 100%
- Execution time: < 2s

### Database
- Schema changes: 2 fields, 2 relations
- Migration risk: Low (additive only)
- Backward compatible: Yes

---

## 👥 Contributors

- **Development:** Claude Code (Anthropic)
- **Planning:** Based on backlog/active.md feedback
- **Testing:** Comprehensive integration test suite

---

## 🙏 Acknowledgments

This release completes a major UX improvement milestone identified in user feedback. The campaign workflow is now clearer, more intuitive, and provides better context throughout the content creation process.

**Special Thanks:**
- Original MLP vision for human-in-loop workflows
- Backlog feedback driving iterative improvements
- Test-driven development ensuring quality

---

**Full Changelog:** See `backlog/active.md` for complete feature history

**Previous Release:** [v0.10.0](./release-0.10.0.md)
**Next Release:** v0.11.1 (TBD)
