# Improvement Planning for v0.7+

**Current Version:** v0.6.0
**Planning Date:** 2025-11-13
**Status:** Planning Phase

---

## Analysis Summary

### Feedback Review (backlog/feedback.md)

**Key Issues Identified:**

1. **Architecture Divergence**
   - Dashboard and campaigns are separate (should be merged)
   - Original vision: Dual-purpose campaign manager for planning, scheduling, AND monitoring all in one place

2. **Outcome Delivery**
   - App is mocking features (scheduling, publishing)
   - Not delivering real outcomes to social media platforms

3. **Data Management**
   - Need granular features for multiple campaigns and sources
   - Need data persistence, transformation, and migration between releases
   - Schema changes need proper migration strategy

4. **Agentic System**
   - Currently using direct Anthropic API calls
   - Should implement LangGraph for true agentic workflows
   - Need routing between Haiku 4.5 (speed) and Sonnet 4.5 (reasoning)

5. **UI Gaps**
   - Some API features don't have UI implementations
   - Example: Manual metric recording (likes, shares) only via API

6. **Navigation & UX**
   - Navigation not intuitive
   - Workflow unclear: source ingestion → campaign creation → tasks
   - No way to navigate back to source management
   - Can't easily manage multiple sources

### Test Coverage Review (docs/tests-coverage.md)

**Strengths:**
- 75 tests, 100% pass rate, <1 second execution
- Excellent integration coverage for all features
- Production-like testing with real database

**Gaps:**
- No E2E browser tests (Playwright attempts failed)
- No component tests for complex UI (Kanban, Dashboard)
- API routes not directly testable (Edge runtime issue)
- No accessibility (a11y) tests
- No performance tests for large datasets

---

## Prioritization Framework

**Criteria:**
1. **User Impact** - How much does this improve founder experience?
2. **MLP Alignment** - Does it deliver delight with minimal code?
3. **Technical Debt** - Does it fix architectural issues?
4. **Effort** - Can it be done incrementally?

**Priority Levels:**
- 🔴 **P0 - Critical** - Core UX issues, must fix
- 🟡 **P1 - High** - Important improvements, significant value
- 🟢 **P2 - Medium** - Nice to have, enhances experience
- ⚪ **P3 - Low** - Future optimization, not urgent

---

## Improvement Roadmap

### Phase 1: UX & Navigation Improvements (v0.7.0)
**Theme:** Fix navigation and merge views for unified workflow

#### 🔴 P0-1: Merge Dashboard into Campaigns Page
**Problem:** Dashboard and campaigns are separate, breaking the dual-purpose vision
**Solution:** Unified campaign manager with tabs or sections

**Implementation:**
- Add Dashboard section/tab to `/campaigns` page
- Show metrics for selected campaign only
- Include KPI cards + engagement chart filtered by campaign
- Remove separate `/dashboard` route
- Update navigation to remove Dashboard link

**Files to modify:**
- `app/campaigns/page.tsx` - Add dashboard section
- `components/dashboard-stats.tsx` - Accept campaignId filter
- `components/engagement-chart.tsx` - Accept campaignId filter
- `app/dashboard/page.tsx` - Remove or redirect

**Tests:**
- Update component tests for filtered dashboard
- Verify metrics API filtering works with campaignId

**Version:** 0.7.0 (minor - feature enhancement)

---

#### 🔴 P0-2: Add Source Management Page
**Problem:** No way to navigate back to sources, can't manage multiple sources
**Solution:** Dedicated source management page with CRUD operations

**Implementation:**
- Create `/sources` page listing all sources
- Add "Manage Sources" navigation link
- Show source cards with: title, URL, created date, task count
- Add "Generate from Source" button on each card
- Add "Delete Source" with confirmation
- Update home page to redirect to `/sources` after fetch

**Files to create:**
- `app/sources/page.tsx` - Source management page
- `components/source-card.tsx` - Individual source display

**Files to modify:**
- `app/page.tsx` - Redirect to /sources after fetch
- Navigation component (if exists) or page headers

**API:**
- Already exists: GET /api/source (list all)
- Need: DELETE /api/source/[id]

**Tests:**
- Integration tests for source deletion
- Component tests for source cards

**Version:** 0.7.0

---

#### 🟡 P1-3: Improve Campaign Workflow Clarity
**Problem:** Not obvious that source ingestion → campaign creation workflow
**Solution:** Guided onboarding flow and contextual prompts

**Implementation:**
- Add empty state messages with next steps
- "No sources? → Add a source first"
- "No campaigns? → Create your first campaign"
- "No tasks? → Generate from a source"
- Add breadcrumb navigation: Sources → Campaigns → Tasks
- Add campaign description showing source used

**Files to modify:**
- `app/campaigns/page.tsx` - Empty states
- `app/sources/page.tsx` - Empty states
- Add breadcrumb component

**Version:** 0.7.0

---

### Phase 2: UI Completeness (v0.7.1+)
**Theme:** Add UI for existing API features

#### 🟡 P1-4: Manual Metric Recording UI
**Problem:** Metrics API exists but can only record clicks automatically
**Solution:** Manual recording for likes, shares, comments

**Implementation:**
- Add "Record Metrics" button on posted task cards
- Dialog with metric type selector + value input
- Quick action buttons: "+1 Like", "+1 Share"
- Show current metrics on card badge

**Files to create:**
- `components/record-metrics-dialog.tsx`

**Files to modify:**
- `components/kanban-card.tsx` - Add metrics badge and record button

**API:**
- Already exists: POST /api/metrics

**Tests:**
- Component tests for dialog
- Integration tests for metric recording flow

**Version:** 0.7.1 (patch - UI completion)

---

#### 🟢 P2-5: Enhanced Campaign Management
**Problem:** Limited campaign management features
**Solution:** Better campaign switching, filtering, archiving

**Implementation:**
- Campaign dropdown with search/filter
- Campaign stats in dropdown: task count, posted count
- Archive campaign (soft delete)
- Restore archived campaigns
- Campaign duplication

**Files to modify:**
- `app/campaigns/page.tsx` - Enhanced dropdown
- `app/api/campaigns/[id]/route.ts` - Add archive flag

**Schema changes:**
- Add `Campaign.archived` boolean field
- Add `Campaign.archivedAt` datetime field

**Version:** 0.7.2 (patch)

---

### Phase 3: Data Management (v0.8.0)
**Theme:** Better data persistence and migration

#### 🟡 P1-6: Prisma Migrations Setup
**Problem:** Using db:push, no migration history
**Solution:** Proper migration workflow for production

**Implementation:**
- Initialize Prisma migrations: `npx prisma migrate dev --name init`
- Create migrations for all schema changes
- Add migration guide to README
- Update deployment docs for production migrations

**Files to modify:**
- `prisma/migrations/` - Add migration files
- `README.md` - Add migration instructions
- `package.json` - Update db scripts

**Version:** 0.8.0 (minor - infrastructure change)

---

#### 🟢 P2-7: Data Export/Import
**Problem:** No way to backup or move data
**Solution:** Export/import campaigns and tasks as JSON

**Implementation:**
- Add "Export Campaign" button → downloads JSON
- Add "Import Campaign" button → uploads JSON
- Include tasks, metrics in export
- Validation on import

**Files to create:**
- `app/api/campaigns/[id]/export/route.ts`
- `app/api/campaigns/import/route.ts`
- `components/export-campaign-dialog.tsx`

**Version:** 0.8.1 (patch)

---

### Phase 4: Real Outcome Delivery (v0.9.0+)
**Theme:** Stop mocking, implement real posting

#### 🟡 P1-8: LinkedIn API Integration
**Problem:** "Posted" status is mock, not actually posting
**Solution:** Real LinkedIn API integration with OAuth

**Implementation:**
- LinkedIn OAuth flow
- Store access tokens per user
- POST to LinkedIn API on schedule
- Handle API errors and rate limits
- Show actual post URL after publishing

**Dependencies:**
- Slice 6 (Auth) or simple token storage
- LinkedIn Developer App setup

**Files to create:**
- `lib/linkedin-client.ts` - API wrapper
- `app/api/auth/linkedin/route.ts` - OAuth callback
- `app/api/publish/linkedin/route.ts` - Publishing endpoint

**Schema changes:**
- Add `User` table with LinkedIn tokens
- Add `Task.publishedUrl` field
- Add `Task.publishError` field

**Version:** 0.9.0 (minor - major feature)

---

#### 🟢 P2-9: Twitter/X API Integration
**Problem:** No actual posting to Twitter
**Solution:** Twitter API v2 integration

**Implementation:**
- Similar to LinkedIn but with Twitter API
- OAuth 2.0 flow
- Handle character limits, media uploads
- Thread support for longer content

**Version:** 0.9.1 (patch)

---

### Phase 5: Agentic System (v1.0.0)
**Theme:** LangGraph implementation for true AI workflows

#### 🟡 P1-10: LangGraph Agent Orchestration
**Problem:** Direct API calls, no routing logic
**Solution:** LangGraph workflow with model routing

**Implementation:**
- Install LangGraph JS
- Create agent graph: analyze → route → generate → review
- Route to Haiku 4.5 for speed (simple tasks)
- Route to Sonnet 4.5 for reasoning (complex tasks)
- Add human-in-loop checkpoints
- Stream progress updates to UI

**Files to create:**
- `lib/agents/content-generator.ts` - LangGraph agent
- `lib/agents/nodes/analyze.ts` - Analysis node
- `lib/agents/nodes/generate.ts` - Generation node
- `lib/agents/nodes/review.ts` - Review node

**Files to modify:**
- `app/api/generate/route.ts` - Use agent instead of direct API

**Dependencies:**
- `@langchain/langgraph` package
- `@anthropic-ai/sdk` (already installed)

**Version:** 1.0.0 (major - significant architecture change)

---

### Phase 6: Testing & Quality (Ongoing)
**Theme:** Improve test coverage and quality

#### 🟢 P2-11: Component Tests for Complex UI
**Problem:** Kanban and Dashboard not tested
**Solution:** React Testing Library tests for interactions

**Implementation:**
- Test Kanban drag-and-drop interactions
- Test Dashboard chart rendering
- Test dialog interactions
- Mock API calls with MSW

**Files to create:**
- `__tests__/components/kanban-board.test.tsx`
- `__tests__/components/dashboard-stats.test.tsx`
- `__tests__/components/engagement-chart.test.tsx`

**Version:** Patch releases (0.7.3, 0.8.2, etc.)

---

#### 🟢 P2-12: Accessibility Tests
**Problem:** No a11y testing
**Solution:** Add jest-axe for accessibility checks

**Implementation:**
- Install jest-axe
- Add a11y tests for all components
- Add ARIA labels where missing
- Test keyboard navigation

**Version:** Patch releases

---

#### ⚪ P3-13: E2E Tests with Playwright (Future)
**Problem:** No full browser automation tests
**Solution:** Playwright test suite for critical workflows

**Implementation:**
- Setup Playwright properly
- Test full workflow: source → campaign → generate → schedule
- Test drag-and-drop in real browser
- Test form submissions
- Add to CI pipeline

**Blockers:**
- Previous attempts failed with modal form inputs
- Need better selectors and wait strategies

**Version:** Future (1.1.0+)

---

#### ⚪ P3-14: Performance Tests (Future)
**Problem:** No testing with large datasets
**Solution:** Performance benchmarks for 100s of tasks

**Implementation:**
- Seed test data with 500+ tasks
- Measure Kanban render time
- Measure API response times
- Optimize queries with indexes
- Add pagination if needed

**Version:** Future (1.1.0+)

---

## Recommended Immediate Next Steps

**For v0.7.0 (Next Release):**

1. ✅ **P0-1: Merge Dashboard into Campaigns** (Highest priority)
   - Unified view matches original vision
   - Better UX for monitoring campaigns
   - Estimated effort: 4-6 hours

2. ✅ **P0-2: Add Source Management Page** (High priority)
   - Fixes major navigation gap
   - Enables multi-source workflow
   - Estimated effort: 3-4 hours

3. ✅ **P1-3: Improve Workflow Clarity** (Medium priority)
   - Quick wins with empty states
   - Better onboarding experience
   - Estimated effort: 2-3 hours

**Total for v0.7.0:** ~9-13 hours of development

**After v0.7.0:**
- Release v0.7.0 with UX improvements
- Get user feedback on new workflow
- Then decide: UI completeness (v0.7.x) or Real posting (v0.9.0)

---

## Decision on Backlog Structure

**Recommendation: Archive and Create New**

**Reasoning:**
1. Original `active.md` focused on "slices" - all major slices complete ✅
2. Now entering "improvement phase" - different mindset
3. Original spec served its purpose (5 slices, 5 releases, great success!)
4. New phase needs different planning structure (priorities, not slices)

**Action Plan:**
1. Move `backlog/active.md` → `backlog/archive/active-slices-v0.1-v0.6.md`
2. Create new `backlog/active.md` focused on improvements
3. Keep slice-based approach for reference but use priority-based planning
4. Reference this planning doc in new active.md

**Benefits:**
- Clear separation between "build phase" and "improve phase"
- Easier to track what's left vs. what's done
- Original spec preserved for historical context
- Fresh start for new planning methodology

---

## Success Metrics

**How to measure if improvements are working:**

1. **Navigation Clarity**
   - User can complete full workflow without getting lost
   - Empty states guide next actions
   - Breadcrumbs show current location

2. **Unified Experience**
   - Dashboard data visible in context of campaign
   - No need to switch between pages to see metrics
   - Campaign is central hub for all activity

3. **Data Management**
   - Multiple sources managed easily
   - Campaign export/import works reliably
   - Migrations run without data loss

4. **Real Outcomes**
   - Posts actually published to LinkedIn/Twitter
   - API errors handled gracefully
   - Published URL shown on task

5. **Code Quality**
   - Test coverage remains 100%
   - New features have tests before release
   - Build time stays fast (<5s)

---

## Notes

- Keep MLP philosophy: delight with minimal code
- Human-in-loop always: review before publish
- Incremental releases: small, frequent improvements
- Test-driven: no new feature without tests
- Documentation: update README with each release

**End of Planning Document**
