# Issues

## Completed

[x] **Issue #1 - Unified Navigation** (Resolved in v0.7.2)

**Problem:** The dual navigation once for top app bar and once for the various views like home, campaigns, sources should be merged intelligently to save top page real estate, improve navigation, indicate where user is in the workflow, indicate prior workflow step and next.

**Solution:** Created unified navigation component with:
- Single navigation header across all pages
- Breadcrumb trail showing workflow context
- Active state indicators
- Sticky header with consistent experience
- Saved ~10-20px of screen space per page

**See:** `backlog/release-0.7.2.md` for details

---

[x] **Issue #2 - Remove Redundant Home Page** (Resolved in v0.8.0)

**Problem:** Now with sources view, the home view is redundant. Source ingestion url box should be a modal on Sources page which comes up when user clicks Add Source button.

**Solution:** Created AddSourceDialog modal component:
- Modal dialog on Sources page for adding sources
- Removed source ingestion from home page
- Simplified home page to focus on onboarding
- Single, clear location for source management
- Home page bundle reduced by 93% (2.56 kB → 174 B)

**See:** `backlog/release-0.8.0.md` for details

---

[x] **Issue #4 - Add Source Button Not Working** (Resolved in v0.8.1)

**Problem:** Clicking "Add Your First Source" button on the Sources page empty state did nothing. The AddSourceDialog was not opening.

**Root Cause:** AddSourceDialog component was only rendered in the main return statement, not in the empty state early return. When there were no sources, the component never mounted.

**Solution:** Added AddSourceDialog component to the empty state return block, ensuring it's always rendered regardless of sources count.

**See:** One-line fix in `app/sources/page.tsx`

---

[x] **Issue #5 - Streamline Generate from Source Workflow** (Resolved in v0.9.0)

**Problem:** Clicking "Generate from Source" button on a source card required a campaign to exist, showing alert: "Please create or select a campaign first from the Campaigns page." This created unnecessary friction, especially for first-time users.

**Solution:** Implemented intelligent workflow based on campaign state:
- **No campaigns:** Auto-creates campaign named after source
- **One campaign:** Uses it automatically
- **Multiple campaigns:** Shows campaign selector dialog
- After generation, automatically navigates to Campaigns view
- Campaign selector allows creating new campaign from source

**See:** `backlog/release-0.9.0.md` for details

---

[x] **Issue #3 - Improve Source Fetch UX** (Resolved in v0.10.0)

**Problem:** When source is added using Sources Ingestion, it shows the source content for a second then moves to Sources view. This is janky behavior as user is not able to parse the detailed source scraped content before the view changes.

**Solution:** Implemented toast notification system and source details viewer:
- Added Sonner toast library for elegant notifications
- Dialog closes immediately with "Processing source..." loading toast
- Success toast shown when source is added
- Error toast shown on failure with dialog reopening for retry
- New "View Details" button (eye icon) on each source card
- SourceDetailsDialog modal shows full content, excerpt, URL, and metadata
- Users can now review source content anytime after ingestion

**Implementation:**
- Created `components/ui/sonner.tsx` wrapper for toast system
- Created `components/source-details-dialog.tsx` for viewing full source content
- Updated `components/add-source-dialog.tsx` to use toast notifications
- Updated `components/source-card.tsx` to add view details button
- Updated `app/sources/page.tsx` to integrate details dialog
- Added comprehensive test coverage (35 tests total)

**See:** `backlog/release-0.10.0.md` for details

---

## Active

No active issues at this time.

---

[x] **Issue #7 - User-Owned LinkedIn OAuth Credentials** (Resolved in v0.14.0)

**Problem:** The app required shared LinkedIn OAuth credentials via environment variables, making it unsuitable for self-hosted, single-user deployments. Users had to trust the app distributor with their LinkedIn integration, and couldn't use their own LinkedIn app credentials.

**Requirements:**
- Enable users to configure their own LinkedIn OAuth app credentials
- Remove dependency on environment variables for LinkedIn integration
- Provide user-friendly UI for OAuth app setup
- Maintain backward compatibility with existing env var approach
- Give users full control and ownership of their LinkedIn integration

**Solution:** Implemented user-owned OAuth credential management system:
- **Database Storage**: Added `linkedinClientId`, `linkedinClientSecret`, and `linkedinRedirectUri` fields to User model
- **Settings API**: Created `/api/settings/linkedin` endpoint (GET/POST/DELETE) for credential management
- **Configuration UI**: Built `LinkedInSettingsDialog` with 4-step wizard guiding users through LinkedIn app creation
- **Smart Priority**: Database credentials take priority over environment variables (graceful fallback)
- **Three-State UX**: Clear visual states for Not Configured / Configured / Connected

**Implementation:**
- Modified auth routes to check database first, then fall back to env vars
- Created comprehensive settings management UI with copy-paste helpers
- Updated Campaigns page with "Configure LinkedIn" button when not configured
- Added 16 integration tests covering all credential lifecycle scenarios
- Fully backward compatible - env vars still work as fallback

**User Impact:**
- No environment variables needed for LinkedIn integration
- Users create and configure their own LinkedIn app
- Full ownership and control of OAuth credentials
- Better privacy - posts come from user's own LinkedIn app
- Easier deployment - one less setup step
- Visual setup wizard with step-by-step guidance

**See:** `backlog/release-0.14.0.md` for detailed release notes

---

[x] **Issue #6 - LinkedIn OAuth Configuration Error** (Resolved in v0.13.1)

**Problem:** When clicking "Connect LinkedIn" button without having LinkedIn OAuth credentials configured, users received a raw JSON error response instead of a user-friendly message. The error appeared as: `{"error":"LinkedIn OAuth not configured","message":"Please set LINKEDIN_CLIENT_ID and LINKEDIN_REDIRECT_URI environment variables"}`

**Issues:**
- Poor UX: JSON error displayed on white page instead of graceful error handling
- No distinction between "not configured" vs "not connected" states
- No guidance for users on how to set up LinkedIn OAuth
- Button appeared clickable even when OAuth wasn't configured

**Solution:** Implemented comprehensive OAuth configuration handling:
- **Auth Status API**: Added `configured: boolean` field to `/api/auth/status` response
- **Error Handling**: LinkedIn OAuth route now redirects with error message instead of returning JSON
- **UI States**: Three distinct visual states (Connected, Not Connected, Not Configured)
- **Toast Notifications**: User-friendly error and success messages using Sonner
- **Disabled Button**: "Setup Required" button disabled when OAuth not configured
- **Guidance**: Card shows instructions to check `.env.example` for required variables

**Implementation:**
- Modified `app/api/auth/status/route.ts` to detect OAuth configuration
- Updated `app/api/auth/linkedin/route.ts` to redirect with errors instead of JSON
- Enhanced `app/campaigns/page.tsx` with three-state UI and toast notifications
- Added comprehensive test coverage (7 new tests in `linkedin-oauth.test.ts`)
- All 273 tests passing with zero regressions

**User Impact:**
- Clear visual indication of LinkedIn integration status
- Helpful guidance when OAuth credentials need to be set up
- No more confusing JSON error pages
- Better onboarding experience for new users

**See:** `backlog/release-0.13.1.md` for detailed release notes