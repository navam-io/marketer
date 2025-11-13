# Active Backlog

# Marketing Automation MLP – Build Spec (for Claude Code)

## 1. Overview

**Product:** Navam Marketer (MLP edition)  
**Audience / ICP:** Bootstrapped startup founders who need to quickly turn existing content (website, blog, or product page) into social promotions (LinkedIn posts, tweets, short blogs) without hiring a marketing team.

**Goal:**  
Automate content → promo generation → scheduling → simple analytics, using Claude (via Bedrock/Anthropic) + minimal full-stack code.

---

## 2. Core Principles

- **MLP, not MVP**: deliver *delight* with minimal code — it must be usable and visually pleasing.  
- **Human in Loop**: each feature slice can be reviewed or edited by the founder before publishing.  
- **Single repo**: Next.js 15 (App Router) + Tailwind + Prisma.  
- **Claude-ready**: every feature exposed through API route for LLM orchestration.  
- **Local-first**: runs with SQLite and serverless deploy later (Vercel + Neon).

---

## 3. Feature Slices

### Slice 1 – Source Ingestion ✅ COMPLETED (v0.1.0)
**User story:** As a founder, I can paste a URL (product/blog) or text snippet and see a cleaned, readable summary of it.

**Status:** Implemented and tested
**Release:** v0.1.0
**Details:** See `backlog/release-0.1.0.md`

**Features** ✅
- URL input + fetch button.
- Readability extraction (JS-based).
- Display cleaned markdown + save to DB.

**Stack**
- Frontend: `shadcn/ui` input + preview pane.
- Backend: Next.js route `/api/source/fetch` using `@mozilla/readability` + `jsdom`.
- DB: `Source` table in Prisma.
- Eval checkpoint: extracted summary relevance & formatting.

---

### Slice 2 – Campaign & Task Management (Kanban) ✅ COMPLETED (v0.2.0)
**User story:** As a founder, I can create a campaign and view my generated tasks on a drag-drop Kanban board.

**Status:** Implemented and tested
**Release:** v0.2.0
**Details:** See `backlog/release-0.2.0.md`

**Features** ✅
- CRUD for campaigns.
- Kanban board with columns: *Todo*, *Draft*, *Scheduled*, *Posted*.
- Drag & drop tasks between columns.
- Inline edit of post text.

**Stack**
- Frontend: `dnd-kit`, `shadcn/ui`, Zustand for UI state.
- Backend: `/api/tasks/*` routes with Prisma `Task` model.
- Eval checkpoint: drag/drop smoothness, state persistence.

---

### Slice 3 – Content Generation (Claude Agent) ✅ COMPLETED (v0.3.0)
**User story:** As a founder, I can select a source and auto-generate social posts for multiple platforms.

**Status:** Implemented and tested
**Release:** v0.3.0
**Details:** See `backlog/release-0.3.0.md`

**Features** ✅
- "Generate from Source" modal (choose platforms, tone, CTA).
- Call Claude (Anthropic SDK) to produce structured JSON output.
- Save drafts to `Task.outputJson`.
- Multi-platform generation (LinkedIn, Twitter, Blog).
- Human-in-the-loop review workflow.

**Stack**
- Backend: `/api/generate` route with Claude 3.5 Sonnet.
- LLM: Claude Sonnet via Anthropic SDK (`@anthropic-ai/sdk`).
- Frontend: `GenerateContentDialog` with platform selection and tone customization.
- Eval checkpoint: quality of generated JSON and tone ✅ Excellent.

---

### Slice 4 – Scheduling & Mock Posting ✅ COMPLETED (v0.4.0)
**User story:** As a founder, I can schedule posts for later and see them move automatically to "Posted".

**Status:** Implemented and tested
**Release:** v0.4.0
**Details:** See `backlog/release-0.4.0.md`

**Features** ✅
- Date/time picker on Kanban card.
- Simple cron loop (in-process timer).
- Auto-update status → "Posted".
- Mock "share" log.
- Background scheduler service.
- Scheduler API endpoints.

**Stack**
- Frontend: native date/time inputs, schedule dialog (`shadcn/ui`).
- Backend: Node interval job via `instrumentation.ts`.
- API: `/api/scheduler/process` for manual and automated processing.
- Eval checkpoint: accurate state transitions ✅ Excellent (60 tests pass).

---

### Slice 5 – Performance Dashboard ✅ COMPLETED (v0.6.0)
**User story:** As a founder, I can see engagement metrics at a glance.

**Status:** Implemented and tested
**Release:** v0.6.0
**Details:** See `backlog/release-0.6.0.md`

**Features** ✅
- Mini-KPI cards: total posts, clicks, likes, shares.
- Recharts graph: engagement over time.
- Links served through `/r/:id` route to record metrics before redirect.
- Dashboard page with beautiful visualizations.
- Metrics API with aggregation endpoints.
- Link click tracking with redirect tracker.

**Stack**
- Frontend: Recharts, Tailwind grid, responsive design.
- Backend: `/api/metrics` routes + redirect tracker + stats endpoint.
- DB: `Metrics` model in Prisma (already existed).
- Eval checkpoint: data correctness and visual clarity ✅ Excellent (75 tests pass).

---

### Slice 6 – Auth (Optional)
**User story:** As a founder, I can log in with email or GitHub.

**Features**
- Passwordless email or OAuth.
- Session per user.

**Stack**
- `Auth.js` (NextAuth) + Prisma adapter.
- Eval checkpoint: basic secure login flow.

---

## 4. Tech Stack Summary

| Layer | Library / Tool | Status | Purpose |
|-------|----------------|--------|----------|
| **Frontend** | Next.js 15 (App Router) | ✅ v0.1.0 | UI + API routes |
|  | Tailwind CSS + shadcn/ui + Radix | ✅ v0.1.0 | Design system |
|  | dnd-kit | ✅ v0.2.0 | Drag-drop Kanban |
|  | Zustand | ✅ v0.2.0 | Local UI state |
|  | Recharts | ✅ v0.6.0 | Charts and KPIs |
|  | TanStack Query | 📋 Planned | Server state caching (future optimization) |
| **Backend** | Prisma + SQLite (dev) | ✅ v0.1.0 | Persistence (Postgres for prod) |
|  | Next.js API Routes | ✅ v0.1.0 | Business logic |
|  | Node setInterval (instrumentation.ts) | ✅ v0.4.0 | Background scheduling |
| **AI/Agents** | Anthropic SDK (Claude Sonnet 4.5) | ✅ v0.3.0 | Content generation |
|  | LangGraph (JS) | 📋 Planned | Agent orchestration (future) |
| **Content Extraction** | jsdom + @mozilla/readability | ✅ v0.1.0 | HTML → markdown |
| **Auth** | NextAuth | 📋 Planned | Optional (Slice 6) |
| **Infra** | Localhost / Vercel | ✅ v0.1.0 | Development + deployment ready |

**Legend:** ✅ Implemented | 📋 Planned | ❌ Not used

---

## 5. Development Workflow (Human-in-Loop)

1. **Pick one slice** below.  
2. Claude builds the implementation incrementally (UI + API + schema).  
3. You run locally (`pnpm dev`), evaluate UX + correctness.  
4. Approve or revise → move to next slice.

**Recommended Order**
1. Slice 1 – Source Ingestion  
2. Slice 2 – Kanban Tasks  
3. Slice 3 – Claude Generation  
4. Slice 4 – Scheduling  
5. Slice 5 – Dashboard  
6. Slice 6 – Auth (optional)

---

## 6. Example Claude Command Prompts

### Build a Slice
> Implement *Slice 1 – Source Ingestion* from the MLP Spec.  
> Include both frontend and backend code in Next.js 15 with Prisma models.  
> Use shadcn/ui and Tailwind for styling.  
> Output runnable code and brief usage steps.

### Evaluate a Slice
> Review output from previous slice, run it locally, and suggest UX/code improvements.

---

## 7. Deliverables

Each slice must include:
- Updated Prisma schema (if needed)
- Next.js route(s)
- UI components (page, modal, or board)
- Example data (seed)
- Test command to verify flow locally

---

**End of Spec**
