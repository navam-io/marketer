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

## Active

---

[ ] **Issue #3 - Improve Source Fetch UX**

When source is added using Sources Ingestion, it shows the source content for a second then moves to Sources view. This is janky behavior as user is not able to parse the detailed source scraped content before the view changes.

**Desired Behavior:**
1. Show source ingestion modal
2. User enters url and clicks fetch
3. Ease out modal and show notification on sources view that processing source
4. Show notification done processing
5. Show new source card
6. Add icon on source card to view source details
7. Show modal to show source details

**Priority:** Medium
**Estimated Effort:** 3-4 hours
