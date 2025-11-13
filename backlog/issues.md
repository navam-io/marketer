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
