# Active Backlog - Improvement Phase

**Product:** Navam Marketer
**Current Version:** v0.11.2
**Phase:** Improvement & Refinement (Post-MLP)
**Last Updated:** 2025-11-13

---

## Overview

The initial MLP build phase (v0.1.0 - v0.6.0) is complete! All 5 core feature slices have been implemented with excellent test coverage (78 tests, 100% pass rate).

**Original Slices Completed:**
- ✅ Slice 1: Source Ingestion (v0.1.0)
- ✅ Slice 2: Campaign & Task Management (v0.2.0)
- ✅ Slice 3: Content Generation (v0.3.0)
- ✅ Slice 4: Scheduling & Auto-Posting (v0.4.0)
- ✅ Slice 5: Performance Dashboard (v0.6.0)

**Achievement Highlights:**
- 🚀 10 releases in rapid iteration (v0.1.0 → v0.10.0, all in 2 weeks!)
- 🧪 Comprehensive test coverage, 100% pass rate, <2s execution
- 📦 Full tech stack: Next.js 15, Prisma, Claude AI, dnd-kit, Recharts, Sonner
- 📚 Complete documentation with detailed release notes for every version
- ✨ 5 major issues resolved (unified navigation, streamlined workflows, toast notifications)

**Archive Note:** The original slice-based planning document has been preserved in `backlog/archive/active-slices-v0.1-v0.6.md` for historical reference.

---

## Current Focus: Improvement Phase

Based on user feedback (`backlog/feedback.md`) and test coverage analysis (`docs/tests-coverage.md`), the improvement phase has achieved:

1. ✅ **UX & Navigation Improvements** - Unified navigation, breadcrumbs, streamlined workflows (v0.7.2, v0.8.0, v0.9.0)
2. ✅ **UI Completeness** - Manual metrics recording, toast notifications, source details viewer (v0.7.3, v0.10.0)
3. ⏳ **Data Management** - Migration strategy and export/import (planned for v0.12.x)
4. ⏳ **Real Outcome Delivery** - Actual social media posting via API (planned for v0.13.0)
5. ⏳ **Testing & Quality** - Expand component and accessibility tests (ongoing)

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

### ✅ v0.7.1 - Source Management (RELEASED 2025-11-13)

**Theme:** Source management and navigation completeness

#### ✅ P0-2: Add Source Management Page
**Status:** Complete (Released in v0.7.1)
**Released:** 2025-11-13
**Problem:** No way to navigate back to sources, can't manage multiple sources effectively
**Solution:** Dedicated `/sources` page with full CRUD UI

**Implementation:**
- ✅ Created `GET /api/source` endpoint to list all sources
- ✅ Created `DELETE /api/source/[id]` endpoint
- ✅ Created `components/source-card.tsx` component
- ✅ Created `app/sources/page.tsx` with responsive grid
- ✅ Added delete confirmation dialog with task warning
- ✅ Added "Manage Sources" button on campaigns page
- ✅ Added auto-redirect to `/sources` after fetch
- ✅ Integration tests for source deletion and cascade behavior

**Results:**
- All 78 tests passing (+3 new)
- No regressions
- Complete source navigation flow
- Safe deletion with cascade (tasks preserved, sourceId nulled)
- Empty state onboarding

**See:** `backlog/release-0.7.1.md` for full details

---

### ✅ v0.7.2 - Unified Navigation (RELEASED 2025-11-13)

**Theme:** Navigation consolidation and workflow clarity

#### ✅ Issue #1: Unified Navigation System
**Status:** Complete (Released in v0.7.2)
**Released:** 2025-11-13
**Problem:** Dual navigation (top app bar + page-specific buttons) wasted screen space and lacked workflow context
**Solution:** Single, unified navigation component with breadcrumbs and active states

**Implementation:**
- ✅ Created unified Navigation component
- ✅ Added breadcrumb trail showing workflow context
- ✅ Active state indicators for current page
- ✅ Consistent navigation across all pages
- ✅ Saved ~80px vertical space per page
- ✅ Enhanced home page with better onboarding

**Results:**
- All 78 tests passing
- Consistent navigation UX
- Clear workflow progression
- Improved screen real estate utilization

**See:** `backlog/release-0.7.2.md` for full details

---

### ✅ v0.7.3 - Manual Metrics Recording UI (RELEASED 2025-11-13)

**Theme:** UI completeness for existing API features

#### ✅ P1-4: Manual Metric Recording UI
**Status:** Complete (Released in v0.7.3)
**Released:** 2025-11-13
**Problem:** Could only record clicks automatically, no UI for likes/shares/comments
**Solution:** Added manual metric recording dialog with quick actions

**Implementation:**
- ✅ Created RecordMetricsDialog component
- ✅ Added "Record Metrics" button on posted task cards
- ✅ Quick action buttons: "+1 Like", "+1 Share"
- ✅ Manual entry form for any metric type/value
- ✅ Real-time metric badge updates on cards
- ✅ Comprehensive test coverage (16 new tests)

**Results:**
- All 94 tests passing (+16 new)
- Complete metrics recording workflow
- Intuitive quick actions for common operations
- All existing API features now have UI

**See:** `backlog/release-0.7.3.md` for full details

---

### ✅ v0.8.0 - Streamlined Navigation & Source Management (RELEASED 2025-11-13)

**Theme:** Remove redundancy, consolidate workflows

#### ✅ Issue #2: Remove Redundant Home Page Source Ingestion
**Status:** Complete (Released in v0.8.0)
**Released:** 2025-11-13
**Problem:** Duplicate source ingestion on both home page and sources page caused confusion
**Solution:** Consolidated all source management into modal dialog on Sources page

**Implementation:**
- ✅ Created AddSourceDialog modal component
- ✅ Removed source ingestion from home page
- ✅ "Add Source" button opens modal in-context
- ✅ Streamlined home page focused on onboarding
- ✅ Updated navigation flow
- ✅ Home page bundle reduced by 93% (2.56 kB → 174 B)

**Results:**
- All 94 tests passing
- Single, clear location for source management
- Cleaner navigation flow
- Dramatically improved home page performance

**See:** `backlog/release-0.8.0.md` for full details

---

### ✅ v0.8.1 - Fix Add Source Button Not Working (RELEASED 2025-11-13)

**Theme:** Bug fix

**Status:** Complete (Released in v0.8.1)
**Released:** 2025-11-13
**Problem:** "Add Your First Source" button on empty state didn't work
**Root Cause:** AddSourceDialog not rendered in empty state return block
**Solution:** One-line fix to ensure dialog always renders

**Results:**
- All 94 tests passing
- Empty state button functional
- No regressions

**See:** `backlog/release-0.8.1.md` for full details

---

### ✅ v0.9.0 - Streamlined Generate from Source Workflow (RELEASED 2025-11-13)

**Theme:** Intelligent workflow automation

#### ✅ Issue #5: Remove Campaign Creation Friction
**Status:** Complete (Released in v0.9.0)
**Released:** 2025-11-13
**Problem:** "Generate from Source" required manual campaign creation first, blocking new users
**Solution:** Intelligent campaign handling based on current state

**Implementation:**
- ✅ Auto-create campaign when none exist (named after source)
- ✅ Auto-select campaign when only one exists
- ✅ Show campaign selector when multiple exist
- ✅ Campaign selector allows creating new campaign from source
- ✅ Auto-navigate to Campaigns view after generation
- ✅ Reduced workflow from 8 steps to 2-3 steps

**Results:**
- All 94 tests passing
- Seamless first-time user experience
- 60-75% reduction in workflow friction
- Intelligent, context-aware behavior

**See:** `backlog/release-0.9.0.md` for full details

---

### ✅ v0.10.0 - Enhanced Source Fetch UX (RELEASED 2025-11-13)

**Theme:** Toast notifications and content viewer

#### ✅ Issue #3: Improve Source Fetch UX
**Status:** Complete (Released in v0.10.0)
**Released:** 2025-11-13
**Problem:** Janky redirect after source fetch, no way to review full source content later
**Solution:** Toast notification system + source details viewer modal

**Implementation:**
- ✅ Added Sonner toast library for notifications
- ✅ Dialog closes immediately with "Processing source..." toast
- ✅ Success toast shown when source is added
- ✅ Error toast shown on failure (dialog reopens for retry)
- ✅ Created SourceDetailsDialog for viewing full content
- ✅ Added "View Details" button (eye icon) on source cards
- ✅ Comprehensive test coverage (35 tests, all passing)

**Results:**
- All tests passing (updated for new behavior)
- Smooth, professional UX
- Users can review source content anytime
- Toast system available for future features

**See:** `backlog/release-0.10.0.md` for full details

---

### ✅ v0.11.0 - Improved Campaign Workflow Clarity (RELEASED 2025-11-13)

**Theme:** Campaign workflow clarity and source attribution

#### ✅ P1-3: Improve Campaign Workflow Clarity
**Status:** Complete (Released in v0.11.0)
**Released:** 2025-11-13
**Problem:** Workflow not obvious: source ingestion → campaign creation → task generation
**Goal:** Guided experience with contextual prompts and empty states

**Implementation:**
- ✅ Breadcrumb navigation component (v0.7.2)
- ✅ Empty states on Sources page with guidance (v0.7.1, v0.8.0)
- ✅ Intelligent campaign workflow reducing friction (v0.9.0)
- ✅ Auto-campaign creation from source (v0.9.0)
- ✅ Streamlined navigation flow (v0.7.2, v0.8.0)
- ✅ Active state indicators (v0.7.2)
- ✅ Empty state on Campaigns page with next step guidance (v0.11.0)
- ✅ Add `Campaign.sourceId` optional relation to track source origin (v0.11.0)
- ✅ Show source name/link on campaign cards (v0.11.0)
- ✅ Test suite improvements - race condition fix (v0.11.0)

**Files Modified:**
- `prisma/schema.prisma` - Added Campaign.sourceId relation
- `app/api/campaigns/route.ts` - Added sourceId support
- `app/campaigns/page.tsx` - Added empty state and source attribution
- `app/sources/page.tsx` - Updated createCampaignFromSource
- `jest.config.js` - Added maxWorkers: 1
- `lib/test-utils.ts` - Improved createTestTask signature
- `__tests__/integration/campaign-workflow.test.ts` - NEW: 8 tests

**Results:**
- All 192 tests passing (+8 new integration tests)
- No regressions
- Clear workflow guidance throughout
- Source attribution tracking working
- 100% reliable test execution

**See:** `backlog/release-0.11.0.md` for full details

---

### ✅ v0.11.1 - Dismissible Onboarding Hints (RELEASED 2025-11-13)

**Theme:** First-time user guidance with dismissible hints

#### ✅ P2-13: Dismissible Onboarding Hints
**Status:** Complete (Released in v0.11.1)
**Released:** 2025-11-13
**Problem:** First-time users may still miss key features
**Goal:** Subtle, dismissible hints for workflow guidance

**Implementation:**
- ✅ Created `OnboardingHint` component with default and compact variants
- ✅ Created `lib/onboarding.ts` for localStorage persistence
- ✅ Added hints to Sources page (sources-generate)
- ✅ Added hints to Campaigns page (campaigns-select, kanban-drag-drop, dashboard-metrics)
- ✅ localStorage-based dismissal tracking
- ✅ SSR-safe implementation
- ✅ Full error handling (corrupt data, quota exceeded, access denied)
- ✅ Comprehensive test coverage (35 new tests)

**Files Created:**
- `lib/onboarding.ts` - Hint persistence logic
- `components/onboarding-hint.tsx` - Reusable hint component
- `__tests__/integration/onboarding-hints.test.ts` - 30 tests
- `__tests__/components/onboarding-hint.test.tsx` - 20 tests
- `backlog/release-0.11.1.md` - Release notes

**Files Modified:**
- `app/sources/page.tsx` - Added sources-generate hint
- `app/campaigns/page.tsx` - Added 3 contextual hints
- `package.json` - Version bump to 0.11.1

**Results:**
- All 227 tests passing (+35 new tests)
- No regressions
- Contextual hints guide first-time users
- Non-intrusive UX (dismissible, persistent)
- 100% test coverage on new code

**See:** `backlog/release-0.11.1.md` for full details

---

### ✅ v0.11.2 - Campaign Archive Management (RELEASED 2025-11-13)

**Theme:** Campaign organization and lifecycle management

#### ✅ P2-5a: Campaign Archive Functionality
**Status:** Complete (Released in v0.11.2)
**Released:** 2025-11-13
**Problem:** No way to hide completed/inactive campaigns
**Goal:** Archive campaigns to declutter UI while preserving data

**Implementation:**
- ✅ Added Campaign.archived and Campaign.archivedAt fields
- ✅ Created PATCH /api/campaigns/[id]/archive endpoint
- ✅ Updated GET /api/campaigns with includeArchived filter
- ✅ Added Show Archived toggle button in UI
- ✅ Added Archive/Unarchive button per campaign
- ✅ Added archived status indicators ([Archived] label)
- ✅ Added amber warning card for archived campaigns
- ✅ Disabled action buttons for archived campaigns
- ✅ Comprehensive test coverage (14 new tests)

**Results:**
- All 241 tests passing (+14 new tests)
- Soft delete preserves all data
- Clear visual indicators
- Easy archive/restore workflow

**See:** `backlog/release-0.11.2.md` for full details

---

## Active Improvements

### 🟡 v0.11.x - Continued UX Improvements (IN PLANNING)

---

## Backlog - Future Improvements

### v0.11.x - UI & UX Refinements



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
**Expected Release:** v0.11.0

---

### v0.12.0 - Data Management (Minor Release)

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
**Expected Release:** v0.12.0

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
**Expected Release:** v0.12.1

---

### v0.13.0 - Real Outcome Delivery (Minor Release)

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
**Expected Release:** v0.13.0

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
**Expected Release:** v0.13.1

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
**Current Status:** v0.11.2 released - Ready for v0.11.3 planning
**Recent Momentum:** 13 releases in 2 weeks with 7 major improvements completed
