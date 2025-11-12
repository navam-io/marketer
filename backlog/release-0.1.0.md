# Release 0.1.0 - Initial Release

**Release Date:** November 11, 2025
**Type:** Initial MLP Release

## Completed Features

### Slice 1 - Source Ingestion ✅

**User Story:** As a founder, I can paste a URL (product/blog) or text snippet and see a cleaned, readable summary of it.

**Implementation:**
- ✅ URL input form with fetch button
- ✅ Readability extraction using `@mozilla/readability` and `jsdom`
- ✅ Display cleaned content with preview pane
- ✅ Save to SQLite database via Prisma
- ✅ REST API endpoint at `/api/source/fetch`
- ✅ Database model: `Source` table with fields: id, url, title, content, rawHtml, excerpt, timestamps
- ✅ UI components using `shadcn/ui` (Button, Input, Card, Label)
- ✅ Responsive layout with Tailwind CSS

**Tech Stack:**
- Next.js 15 (App Router)
- Prisma + SQLite
- shadcn/ui + Radix UI
- Tailwind CSS
- TypeScript
- @mozilla/readability + jsdom

**API Endpoints:**
- `POST /api/source/fetch` - Fetch and parse URL content
- `GET /api/source/fetch` - List all sources

**Files Created:**
- `/app/page.tsx` - Home page
- `/app/layout.tsx` - Root layout
- `/app/globals.css` - Global styles
- `/app/api/source/fetch/route.ts` - API route
- `/components/source-ingestion.tsx` - Main UI component
- `/components/ui/*` - shadcn/ui components (button, input, card, label)
- `/lib/prisma.ts` - Prisma client singleton
- `/lib/utils.ts` - Utility functions
- `/prisma/schema.prisma` - Database schema

**How to Use:**
1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Paste a URL in the input field
4. Click "Fetch" to extract and display the content
5. View the cleaned, readable content below

**Evaluation Checkpoint:**
- ✅ Successfully extracts article content from URLs
- ✅ Displays clean, formatted text
- ✅ Persists data to SQLite database
- ✅ Handles errors gracefully
- ✅ Provides visual feedback during loading

---

## Next Steps

The following slices are ready for implementation:

### Slice 2 - Campaign & Task Management (Kanban)
- CRUD for campaigns
- Kanban board with drag & drop
- Task status management

### Slice 3 - Content Generation (Claude Agent)
- Claude integration for content generation
- Multi-platform support
- Structured JSON output

### Slice 4 - Scheduling & Mock Posting
- Date/time picker
- Automated status transitions
- Mock posting functionality

### Slice 5 - Performance Dashboard
- KPI cards
- Engagement metrics
- Analytics graphs

### Slice 6 - Auth (Optional)
- Passwordless or OAuth login
- User session management
