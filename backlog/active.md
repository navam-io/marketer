# Active Backlog - Improvement Phase

**Product:** Navam Marketer
**Current Version:** v0.6.0
**Phase:** Improvement & Refinement (Post-MLP)
**Last Updated:** 2025-11-13

---

## Overview

The initial MLP build phase (v0.1.0 - v0.6.0) is complete! All 5 core feature slices have been implemented with excellent test coverage (75 tests, 100% pass rate).

**Original Slices Completed:**
- ✅ Slice 1: Source Ingestion (v0.1.0)
- ✅ Slice 2: Campaign & Task Management (v0.2.0)
- ✅ Slice 3: Content Generation (v0.3.0)
- ✅ Slice 4: Scheduling & Auto-Posting (v0.4.0)
- ✅ Slice 5: Performance Dashboard (v0.6.0)

**Achievement Highlights:**
- 🚀 5 releases in rapid iteration
- 🧪 75 integration tests, 100% pass rate, <1s execution
- 📦 Full tech stack: Next.js 15, Prisma, Claude AI, dnd-kit, Recharts
- 📚 Comprehensive documentation and release notes

**Archive Note:** The original slice-based planning document has been preserved in `backlog/archive/active-slices-v0.1-v0.6.md` for historical reference.

---

## Current Focus: Improvement Phase

Based on user feedback (`backlog/feedback.md`) and test coverage analysis (`docs/tests-coverage.md`), we're now focusing on:

1. **UX & Navigation Improvements** - Fix architectural divergence, improve workflow clarity
2. **UI Completeness** - Add UI for existing API features
3. **Data Management** - Better persistence and migration strategy
4. **Real Outcome Delivery** - Actual social media posting (vs. mocking)
5. **Testing & Quality** - Expand test coverage beyond integration tests

**Planning Reference:** See `backlog/improvements-v0.7-planning.md` for detailed analysis and prioritization framework.

---

## Completed Improvements

### ✅ v0.7.0 - Unified Campaign Manager (RELEASED 2025-11-13)

**Theme:** Unified workflow and better navigation

#### ✅ P0-1: Merge Dashboard into Campaigns Page
**Status:** Complete (Released in v0.7.0)
**Released:** 2025-11-13
**Problem:** Dashboard and campaigns were separate, breaking the dual-purpose vision
**Solution:** Added tabbed interface with Tasks and Overview tabs

**Implementation:**
- ✅ Added Tabs component (Radix UI)
- ✅ Created Tasks tab with Kanban board
- ✅ Created Overview tab with dashboard stats and chart
- ✅ Dashboard metrics automatically filter by selected campaign
- ✅ Removed Dashboard link from header
- ✅ `/dashboard` redirects to `/campaigns`

**Results:**
- All 75 tests passing
- No regressions
- Campaign-specific metrics working
- Seamless tab switching
- Aligns with original MLP vision

**See:** `backlog/release-0.7.0.md` for full details

---

## Active Improvements

### 🚧 v0.7.x - Continued UX Improvements (IN PLANNING)

---

#### 🔴 P0-2: Add Source Management Page
**Status:** Planned
**Problem:** No way to navigate back to sources, can't manage multiple sources effectively
**Goal:** Dedicated page for viewing, managing, and generating from sources

**Implementation Plan:**
- Create `/sources` page listing all ingested sources
- Show source cards: title, URL, created date, task count
- Add "Generate from Source" action on each card
- Add "Delete Source" with confirmation dialog
- Add navigation link: "Manage Sources"
- Redirect from home page after fetch to `/sources`

**Files to Create:**
- `app/sources/page.tsx` - Source management page
- `components/source-card.tsx` - Individual source display card

**Files to Modify:**
- `app/page.tsx` - Redirect to /sources after successful fetch
- Add navigation link to sources in page headers

**API Changes:**
- Add `DELETE /api/source/[id]` endpoint
- Existing `GET /api/source` already lists all sources

**Tests:**
- Integration tests for source deletion
- Integration tests for cascade behavior (tasks remain, sourceId nulled)
- Component tests for source cards

**Estimated Effort:** 3-4 hours
**Expected Release:** v0.7.0

---

#### 🟡 P1-3: Improve Campaign Workflow Clarity
**Status:** Planned
**Problem:** Workflow not obvious: source ingestion → campaign creation → task generation
**Goal:** Guided experience with contextual prompts and empty states

**Implementation Plan:**
- Add empty state messages with next step guidance
  - No sources: "Get started by adding a content source"
  - No campaigns: "Create your first campaign to organize tasks"
  - No tasks: "Generate content from a source or create manually"
- Add breadcrumb navigation component
- Add campaign description field to show which source was used
- Add onboarding hints (can be dismissed)

**Files to Create:**
- `components/empty-state.tsx` - Reusable empty state component
- `components/breadcrumbs.tsx` - Navigation breadcrumbs

**Files to Modify:**
- `app/campaigns/page.tsx` - Add empty states
- `app/sources/page.tsx` - Add empty states
- Schema: Add `Campaign.sourceId` optional relation

**Tests:**
- Component tests for empty states
- Integration tests for campaign-source relationship

**Estimated Effort:** 2-3 hours
**Expected Release:** v0.7.0

---

**Total v0.7.0 Effort:** ~9-13 hours
**Release Criteria:**
- All 3 improvements implemented
- Tests passing (target: 80+ tests)
- Documentation updated (README, release notes)
- Manual testing of new navigation flow

---

## Backlog - Future Improvements

### v0.7.x - UI Completeness (Patches)

#### 🟡 P1-4: Manual Metric Recording UI
**Status:** Backlog
**Problem:** Can only record clicks automatically, no UI for likes/shares
**Goal:** Manual metric entry for engagement tracking

**Features:**
- "Record Metrics" button on posted task cards
- Dialog with metric type (like, share, comment) and value input
- Quick actions: "+1 Like", "+1 Share" buttons
- Show current metrics as badges on cards

**API:** Already exists (POST /api/metrics)
**Estimated Effort:** 2-3 hours
**Expected Release:** v0.7.1

---

#### 🟢 P2-5: Enhanced Campaign Management
**Status:** Backlog
**Problem:** Limited campaign management features
**Goal:** Better campaign organization and lifecycle management

**Features:**
- Campaign search/filter in dropdown
- Campaign statistics in dropdown (task count, posted count)
- Archive campaign (soft delete with archived flag)
- Restore archived campaigns
- Duplicate campaign with tasks

**Schema Changes:**
- Add `Campaign.archived: Boolean` (default false)
- Add `Campaign.archivedAt: DateTime?`

**Estimated Effort:** 3-4 hours
**Expected Release:** v0.7.2

---

### v0.8.0 - Data Management (Minor Release)

#### 🟡 P1-6: Prisma Migrations Setup
**Status:** Backlog
**Problem:** Using `db:push` for development, no migration history
**Goal:** Production-ready migration workflow

**Features:**
- Initialize Prisma migrations with full history
- Migration files for all schema changes
- Update README with migration instructions
- Production deployment guide

**Tasks:**
- Run `npx prisma migrate dev --name init`
- Update package.json scripts
- Document migration workflow

**Estimated Effort:** 2-3 hours
**Expected Release:** v0.8.0

---

#### 🟢 P2-7: Data Export/Import
**Status:** Backlog
**Problem:** No way to backup or transfer campaigns
**Goal:** Export/import campaigns with all related data

**Features:**
- Export campaign as JSON (includes tasks and metrics)
- Import campaign from JSON file
- Validation and error handling
- Duplicate detection

**API:**
- `GET /api/campaigns/[id]/export`
- `POST /api/campaigns/import`

**Estimated Effort:** 4-5 hours
**Expected Release:** v0.8.1

---

### v0.9.0 - Real Outcome Delivery (Minor Release)

#### 🟡 P1-8: LinkedIn API Integration
**Status:** Backlog
**Problem:** "Posted" status is mock, not actually posting to LinkedIn
**Goal:** Real LinkedIn publishing via API

**Features:**
- LinkedIn OAuth flow for authentication
- Store access tokens securely
- POST to LinkedIn API when task is scheduled
- Handle API errors and rate limits
- Store published post URL
- Show actual LinkedIn link on task card

**Dependencies:**
- User authentication (Slice 6 or simple token storage)
- LinkedIn Developer App credentials

**Schema Changes:**
- Add `User` table (if not exists)
- Add `User.linkedinAccessToken: String?`
- Add `Task.publishedUrl: String?`
- Add `Task.publishError: String?`

**Estimated Effort:** 8-10 hours
**Expected Release:** v0.9.0

---

#### 🟢 P2-9: Twitter/X API Integration
**Status:** Backlog
**Problem:** No actual posting to Twitter/X
**Goal:** Real Twitter publishing via API v2

**Features:**
- Twitter OAuth 2.0 flow
- POST to Twitter API
- Handle character limits and media
- Thread support for longer content
- Store tweet URL

**Similar to LinkedIn integration but with Twitter API**

**Estimated Effort:** 6-8 hours
**Expected Release:** v0.9.1

---

### v1.0.0 - Agentic System (Major Release)

#### 🟡 P1-10: LangGraph Agent Orchestration
**Status:** Backlog
**Problem:** Direct Anthropic API calls, no intelligent routing
**Goal:** LangGraph workflow with model routing (Haiku for speed, Sonnet for reasoning)

**Features:**
- Install LangGraph JS
- Create agent graph with nodes: analyze → route → generate → review
- Route simple tasks to Haiku 4.5 (faster, cheaper)
- Route complex tasks to Sonnet 4.5 (better reasoning)
- Human-in-loop checkpoints
- Stream progress updates to UI
- Agent decision logging

**Files to Create:**
- `lib/agents/content-generator.ts` - Main LangGraph agent
- `lib/agents/nodes/analyze.ts` - Content analysis node
- `lib/agents/nodes/generate.ts` - Generation node
- `lib/agents/nodes/review.ts` - Quality review node

**Dependencies:**
- `@langchain/langgraph` package

**Estimated Effort:** 15-20 hours (major refactor)
**Expected Release:** v1.0.0

---

## Testing & Quality Improvements (Ongoing)

### 🟢 P2-11: Component Tests for Complex UI
**Status:** Backlog
**Goal:** Test Kanban and Dashboard components with React Testing Library

**Scope:**
- Kanban board drag-and-drop interactions
- Dashboard chart rendering and data
- Dialog open/close and form submissions
- Mock API calls with MSW (Mock Service Worker)

**Target:** +15-20 tests
**Expected Release:** Patch releases (0.7.3, 0.8.2, etc.)

---

### 🟢 P2-12: Accessibility Tests
**Status:** Backlog
**Goal:** Ensure app is accessible (a11y compliance)

**Scope:**
- Install jest-axe
- Add a11y tests for all components
- Add ARIA labels where missing
- Test keyboard navigation
- Color contrast validation

**Target:** +10-15 tests
**Expected Release:** Patch releases

---

### ⚪ P3-13: E2E Tests with Playwright
**Status:** Future (blocked)
**Goal:** Full browser automation for critical workflows

**Blockers:**
- Previous Playwright attempts failed with modal form inputs
- Need better selectors and wait strategies

**Scope:**
- Full workflow: source → campaign → generate → schedule → metrics
- Drag-and-drop in real browser
- Form submissions and validations

**Target:** +10-15 E2E tests
**Expected Release:** v1.1.0+

---

### ⚪ P3-14: Performance Tests
**Status:** Future
**Goal:** Test with large datasets (500+ tasks)

**Scope:**
- Seed test database with large datasets
- Measure Kanban render performance
- Measure API response times
- Optimize with database indexes
- Add pagination if needed

**Expected Release:** v1.1.0+

---

## Development Workflow

**For Each Improvement:**

1. **Planning**
   - Review item from backlog
   - Confirm scope and approach
   - Update item status to "In Progress"

2. **Implementation**
   - Create/modify files as specified
   - Follow existing patterns and conventions
   - Update schema if needed (run db:push)

3. **Testing**
   - Write integration tests for API changes
   - Write component tests for UI changes
   - Run all tests: `npm test`
   - Fix any regressions

4. **Documentation**
   - Create release notes in `backlog/release-X.Y.Z.md`
   - Update README.md if user-facing changes
   - Update this file to mark item complete

5. **Version & Release**
   - Update package.json version
   - Commit with descriptive message
   - Push to remote
   - Update backlog item status to "Complete"

---

## Versioning Strategy

**Semantic Versioning (semver):**
- **Major (X.0.0):** Breaking changes, major refactors (e.g., LangGraph)
- **Minor (0.X.0):** New features, significant improvements (e.g., LinkedIn integration)
- **Patch (0.0.X):** Bug fixes, UI completeness, small enhancements

**Current:** v0.6.0
**Next:** v0.7.0 (UX improvements - minor bump)

---

## Success Metrics

**How we measure improvement success:**

1. **User Experience**
   - ✅ Can complete full workflow without confusion
   - ✅ Empty states guide next actions
   - ✅ Navigation is intuitive and clear

2. **Feature Completeness**
   - ✅ All API features have UI implementations
   - ✅ No mocked features (real posting works)
   - ✅ Data can be managed (export, import, backup)

3. **Code Quality**
   - ✅ Test coverage stays ≥75 tests, 100% pass rate
   - ✅ Build time stays fast (<5 seconds)
   - ✅ No console errors or warnings

4. **Documentation**
   - ✅ README reflects current features accurately
   - ✅ Every release has detailed notes
   - ✅ Code has inline comments for complex logic

---

## Notes

- **MLP Philosophy:** Delight with minimal code - maintained throughout improvements
- **Human-in-Loop:** Always review before publish - no change to this principle
- **Incremental Releases:** Small, frequent improvements - better than big rewrites
- **Test-Driven:** No new feature without tests - quality over speed
- **User Feedback:** Continuously incorporate feedback from `backlog/feedback.md`

**Planning Reference:** `backlog/improvements-v0.7-planning.md` contains detailed analysis, prioritization framework, and decision rationale.

**Archive:** Original slice-based planning: `backlog/archive/active-slices-v0.1-v0.6.md`

---

**Last Updated:** 2025-11-13
**Status:** Ready for v0.7.0 development
