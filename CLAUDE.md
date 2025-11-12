# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Navam Marketer** is a marketing automation MLP (Minimum Lovable Product) for bootstrapped startup founders. It transforms existing content into platform-ready social promotions with a human-in-the-loop workflow.

**Core Philosophy:**
- **MLP over MVP** — Deliver delight with minimal code
- **Human-in-Loop** — Review and edit before publishing
- **Local-First** — SQLite locally, PostgreSQL in production
- **Claude-Ready** — Every feature exposed through API routes for LLM orchestration

## Development Commands

### Essential Commands
```bash
# Development
npm run dev              # Start dev server on localhost:3000
npm run build            # Production build
npm run lint             # ESLint

# Database
npm run db:push          # Push schema changes (development)
npm run db:generate      # Regenerate Prisma client
npm run db:migrate       # Create migrations (production)
npm run db:studio        # Open Prisma Studio GUI

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm test database.test.ts # Run specific test file
npm test -- --testNamePattern="Campaign" # Run tests matching pattern
```

### Package Management
Always use `--legacy-peer-deps` when installing new packages due to React 19 RC:
```bash
npm install <package> --legacy-peer-deps
```

## Architecture

### Tech Stack Layers

```
┌─────────────────────────────────────────────┐
│  Next.js 15 App Router (React 19 RC)      │
├─────────────────────────────────────────────┤
│  Frontend          │  Backend              │
│  ├─ shadcn/ui      │  ├─ API Routes        │
│  ├─ Tailwind CSS   │  ├─ Prisma ORM        │
│  ├─ dnd-kit        │  └─ SQLite/Postgres   │
│  └─ Zustand        │                       │
└─────────────────────────────────────────────┘
```

**Key Technologies:**
- **Frontend:** Next.js 15 App Router, React 19 RC, TypeScript, Tailwind CSS
- **UI:** shadcn/ui + Radix UI primitives
- **State:** Zustand (UI state), TanStack Query (server state - planned)
- **Drag & Drop:** @dnd-kit/core, @dnd-kit/sortable
- **Database:** Prisma + SQLite (dev) / PostgreSQL (prod)
- **Content Extraction:** @mozilla/readability + jsdom
- **Testing:** Jest + Testing Library

### Database Schema Relationships

```
Campaign (1) ──→ (N) Task
Source (1)   ──→ (N) Task
Task (1)     ──→ (N) Metric

Key Relations:
- Campaign.tasks[] → Task.campaignId (onDelete: SetNull)
- Source.tasks[] → Task.sourceId (onDelete: SetNull)
- Task.metrics[] → Metric.taskId (onDelete: Cascade)
```

**Task Status Flow:**
```
todo → draft → scheduled → posted
```

**Important:** When deleting a Campaign or Source, related Tasks have their FK set to NULL (not deleted).

### State Management Patterns

**Zustand Store** (`lib/store.ts`):
- UI-only state (dialogs, selections, drag state)
- No server data (use direct Prisma calls or TanStack Query)

**Current Zustand State:**
```typescript
{
  selectedCampaignId: string | null
  isCreateCampaignOpen: boolean
  isCreateTaskOpen: boolean
  editingTaskId: string | null
  isDragging: boolean
}
```

### API Route Patterns

All API routes follow RESTful conventions:

```
POST   /api/campaigns        → Create
GET    /api/campaigns        → List all
GET    /api/campaigns/[id]   → Get one
PATCH  /api/campaigns/[id]   → Update
DELETE /api/campaigns/[id]   → Delete
```

**Next.js 15 Route Handler Pattern:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // IMPORTANT: await params in Next.js 15
  // ... implementation
}
```

**Note:** In Next.js 15, route params are async and must be awaited.

## Feature Development (Slice-Based)

Features are developed in "slices" following the spec in `backlog/active.md`.

### Completed Slices

**✅ Slice 1 - Source Ingestion (v0.1.0)**
- Route: `/api/source/fetch`
- Component: `source-ingestion.tsx`
- Uses: @mozilla/readability + jsdom

**✅ Slice 2 - Campaign & Task Management (v0.2.0)**
- Routes: `/api/campaigns/*`, `/api/tasks/*`
- Page: `/campaigns`
- Components: `kanban-board.tsx`, `kanban-column.tsx`, `kanban-card.tsx`
- Uses: @dnd-kit for drag-and-drop

### Next Slice

**🚧 Slice 3 - Content Generation (Planned v0.3.0)**
- Will use Claude AI (Bedrock or Anthropic SDK)
- Route: `/api/generate`
- Saves to `Task.outputJson`

### Slice Development Workflow

Each slice should include:
1. **Database:** Update `prisma/schema.prisma` if needed
2. **API Routes:** Create in `app/api/[feature]/`
3. **UI Components:** Create in `components/`
4. **Page:** Create/update in `app/[feature]/`
5. **Tests:** Add integration tests in `__tests__/integration/`
6. **Versioning:** Update `package.json` version (minor for new features)
7. **Documentation:** Create `backlog/release-X.Y.Z.md`
8. **Backlog:** Mark complete in `backlog/active.md`

## Component Patterns

### shadcn/ui Components

Components are in `components/ui/`. They are **NOT installed via CLI** but created manually to avoid the components.json requirement.

**Pattern for creating new UI components:**
```typescript
// components/ui/my-component.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const MyComponent = React.forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("...", className)} {...props} />
  )
)
MyComponent.displayName = "MyComponent"

export { MyComponent }
```

### Drag-and-Drop Pattern (@dnd-kit)

**Structure:**
1. `KanbanBoard` - DndContext wrapper
2. `KanbanColumn` - Droppable column
3. `KanbanCard` - Draggable + Sortable task card

**Key Implementation Details:**
- Use `PointerSensor` with activation distance
- Droppable IDs = column status ('todo', 'draft', 'scheduled', 'posted')
- Sortable IDs = task IDs
- Update task status via API on drop

## Testing Guidelines

### Test Philosophy
- **Integration over unit** — Test real database operations, not mocks
- **Production-like** — Real Prisma client, actual SQLite database
- **Fast & deterministic** — ~1 second execution, no flakiness

### Test Structure
```
__tests__/
├── integration/
│   └── database.test.ts    # Database operations (21 tests)
└── components/
    └── ui/
        └── badge.test.tsx  # Component tests
```

### Writing Tests

**Database Integration Tests:**
```typescript
import { prismaTest, cleanDatabase, disconnectDatabase, createTestCampaign } from '@/lib/test-utils';

describe('Feature', () => {
  beforeEach(async () => {
    await cleanDatabase(); // Clean slate
  });

  afterAll(async () => {
    await disconnectDatabase(); // Cleanup
  });

  it('should test behavior', async () => {
    const campaign = await createTestCampaign();
    // Test real database operations
  });
});
```

**Helper Functions:**
- `cleanDatabase()` - Delete all data (respects FK constraints)
- `createTestCampaign()`, `createTestSource()`, `createTestTask()` - Create test data
- `disconnectDatabase()` - Close Prisma connection

### Known Testing Limitations
- API route handlers cannot be tested directly (Edge runtime issues)
- Test API behavior indirectly through database integration tests
- Component tests limited to UI primitives

## Important Patterns & Conventions

### Prisma Client Singleton
```typescript
// lib/prisma.ts
const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
```
Always import from `@/lib/prisma`, never instantiate directly.

### Module Path Alias
`@/` maps to project root:
```typescript
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
```

### TypeScript Patterns
- **Strict mode enabled** — No implicit any
- **Full type coverage** — Export types from components
- **Prisma types** — Import from `@prisma/client`

### Dialog Pattern
Dialogs use Zustand for open/close state:
```typescript
const { isCreateCampaignOpen, setIsCreateCampaignOpen } = useAppStore();

<Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
  {/* content */}
</Dialog>
```

### Error Handling in API Routes
```typescript
try {
  // operation
  return NextResponse.json({ data }, { status: 200 });
} catch (error) {
  console.error('Error description:', error);
  return NextResponse.json(
    { error: 'User-friendly message' },
    { status: 500 }
  );
}
```

## Database Workflow

### Schema Changes
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push` (development)
3. Regenerate client automatically (or `npm run db:generate`)
4. For production: `npm run db:migrate` (creates migration files)

### Database URLs
- **Development:** SQLite at `prisma/dev.db`
- **Production:** PostgreSQL (Neon or similar)
- Set via `DATABASE_URL` environment variable

### Common Prisma Patterns

**Include relations:**
```typescript
await prisma.campaign.findUnique({
  where: { id },
  include: {
    tasks: true,
    _count: { select: { tasks: true } }
  }
})
```

**Order results:**
```typescript
await prisma.source.findMany({
  orderBy: { createdAt: 'desc' }
})
```

**Conditional updates:**
```typescript
await prisma.task.update({
  where: { id },
  data: {
    ...(status && { status }),
    ...(content && { content })
  }
})
```

## Versioning & Releases

Follow **semantic versioning**:
- **Major (X.0.0):** Breaking changes
- **Minor (0.X.0):** New features (new slices)
- **Patch (0.0.X):** Bug fixes

**Release Process:**
1. Increment `package.json` version
2. Create `backlog/release-X.Y.Z.md` with detailed notes
3. Update `backlog/active.md` to mark slice as completed
4. Update `README.md` with new features
5. Git commit: "Release vX.Y.Z: Feature description"

## Project-Specific Notes

### React 19 RC Compatibility
Using React 19 RC requires `--legacy-peer-deps` for most packages. This is expected and not an error.

### Next.js 15 App Router
- All routes in `app/` directory
- Route params are async: `const { id } = await params`
- API routes return `NextResponse`
- Client components need `"use client"` directive

### Backlog System
- `backlog/active.md` - Master spec with all slices
- `backlog/release-*.md` - Detailed release notes per version
- Follow slice-based development order

### Human-in-Loop UX
All features should allow review/edit before final action:
- Source content shown before saving
- Task drafts editable before scheduling
- Confirmations on destructive actions

## Troubleshooting

**Prisma Client Out of Sync:**
```bash
npm run db:generate
```

**Database Schema Drift:**
```bash
npm run db:push  # Reset dev database to match schema
```

**Test Failures with setImmediate:**
Already fixed in `jest.setup.js` with polyfill.

**Import Errors with Next.js:**
Ensure `jest.config.js` uses `next/jest` wrapper.

**Type Errors After Schema Changes:**
Regenerate Prisma client and restart TypeScript server.
