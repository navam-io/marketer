<div align="center">

# 🚀 Navam Marketer

### Marketing Automation Made Simple

*Transform your content into social promotions — no marketing team required.*

[![Version](https://img.shields.io/badge/version-0.11.0-blue.svg)](https://github.com/yourusername/navam-marketer)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Roadmap](#-roadmap)

</div>

---

## 📖 About

**Navam Marketer** is a marketing automation tool built specifically for **bootstrapped startup founders**. It automates the journey from existing content (blogs, product pages, articles) to platform-ready social promotions — all with a human-in-the-loop approach.

### Why Navam Marketer?

- 🎯 **Built for Founders** — No marketing team? No problem. Automate content repurposing.
- 💎 **MLP Philosophy** — Minimum Lovable Product with delightful UX from day one.
- 🔄 **Human-in-Loop** — Review and edit everything before it goes live.
- 🏠 **Local-First** — Runs on SQLite locally, deploys to Vercel + Neon seamlessly.

---

## ✨ Features

<details open>
<summary><b>🔗 Source Ingestion</b> <code>v0.1.0</code></summary>

<br>

Extract clean, readable content from any URL with a single click.

- **Intelligent Parsing** — Powered by Mozilla Readability
- **Clean Output** — Removes ads, clutter, and navigation
- **Database Storage** — Saved for future campaign use
- **Modern UI** — Beautiful Tailwind CSS design

</details>

<details open>
<summary><b>📋 Campaign & Task Management</b> <code>v0.2.0</code></summary>

<br>

Organize your social media workflow with an intuitive Kanban board.

**Campaign Management**
- Create unlimited campaigns with names and descriptions
- Track task counts per campaign
- Switch between campaigns instantly

**Kanban Board**
- 🗂️ **4 Status Columns:** To Do → Draft → Scheduled → Posted
- 🖱️ **Drag & Drop:** Smooth task movement with visual feedback
- ✏️ **Inline Editing:** Edit post content directly on cards
- 🏷️ **Platform Tags:** LinkedIn, Twitter, Blog with color coding
- 🔄 **Real-Time Updates:** Instant sync with database

**Task Features**
- Platform-specific categorization
- Scheduled date tracking
- Delete with confirmation
- Content preview with line clamping

</details>

<details open>
<summary><b>🤖 AI Content Generation</b> <code>v0.3.0</code></summary>

<br>

Generate platform-optimized posts with Claude AI (Sonnet 4.5).

**Multi-Platform Generation**
- 📱 **LinkedIn**: Professional posts (3000 chars, 3-5 hashtags)
- 🐦 **Twitter**: Punchy tweets (280 chars, 1-2 hashtags)
- 📝 **Blog**: Introduction paragraphs (500 chars)

**Customization Options**
- **Tone Selection:** Professional, Casual, Technical, Enthusiastic
- **Call-to-Action:** Optional CTA for driving engagement
- **Source-Based:** Generate from ingested content

**Features**
- Batch generation for all platforms at once
- Preview before saving to kanban
- Tasks created in Draft status for review
- Powered by Claude Sonnet 4.5 via Anthropic SDK

</details>

<details open>
<summary><b>⏰ Scheduling & Auto-Posting</b> <code>v0.4.0</code></summary>

<br>

Schedule posts for automatic publishing at future dates/times.

**Scheduling Interface**
- 📅 **Date/Time Picker**: Native HTML5 inputs for date and time selection
- 🎯 **Smart Defaults**: Default to next day at 9 AM
- 🗓️ **Visual Indicators**: Scheduled date displayed on kanban cards
- ❌ **Clear Schedule**: One-click schedule removal

**Background Automation**
- ⚡ **Auto-Processing**: Tasks automatically move to "Posted" at scheduled time
- 🔄 **60-Second Checks**: Background service runs every minute
- 📊 **Status Tracking**: `postedAt` timestamp recorded for analytics
- 🛡️ **Robust**: Error handling and logging built-in

**API Endpoints**
- `GET /api/scheduler/process` - View scheduler status and pending tasks
- `POST /api/scheduler/process` - Manually trigger scheduled task processing

**Production Ready**
- Development: In-process scheduler auto-starts
- Production: Migrate to Vercel Cron Jobs or external cron service
- Flexible: Works with any hosting platform

</details>

<details open>
<summary><b>📊 Performance Dashboard</b> <code>v0.6.0</code></summary>

<br>

Track your social media engagement with real-time metrics and beautiful visualizations.

**KPI Cards**
- 📊 **Total Posts**: Count of published content
- 👆 **Total Clicks**: Link clicks via tracking
- ❤️ **Total Likes**: Engagement metrics
- 🔄 **Total Shares**: Content sharing stats

**Engagement Chart**
- 📈 Line chart showing metrics over last 30 days
- Multiple data series (clicks, likes, shares)
- Interactive tooltips and legend
- Responsive design for all screen sizes

**Link Click Tracking**
- Redirect tracker: `/r/{taskId}?url={destination}`
- Automatic click recording
- Real-time dashboard updates
- Easy integration in social posts

**API Endpoints**
- `GET /api/metrics` - Retrieve metrics with filtering
- `POST /api/metrics` - Create new metrics
- `GET /api/metrics/stats` - Aggregated statistics

**Manual Metric Recording** <code>v0.7.3</code>
- 📊 **Record Metrics Dialog**: Click-to-open interface on posted tasks
- ⚡ **Quick Actions**: One-click +1 buttons for likes, shares, comments, clicks
- 📝 **Custom Entry**: Form for bulk metric recording
- 🎨 **Visual Display**: Color-coded badges with icons on kanban cards
- 🔄 **Real-Time Updates**: Metrics refresh automatically after recording
- 🎯 **Smart Aggregation**: Automatic summing of metrics by type

</details>

<details open>
<summary><b>🎯 Unified Campaign Manager</b> <code>v0.7.0</code></summary>

<br>

Manage campaigns, tasks, and performance metrics all in one place with seamless tab switching.

**Tabbed Interface**
- 📝 **Tasks Tab**: Complete Kanban board for task management
- 📊 **Overview Tab**: Performance dashboard with campaign-specific metrics
- 🔄 **Seamless Switching**: Instant tab navigation without page reloads
- 🎯 **Filtered Metrics**: Automatically shows data for selected campaign only

**Unified Workflow**
- Single page for planning, scheduling, AND monitoring
- No context switching between separate pages
- Campaign-specific insights at a glance
- Fulfills original MLP vision: dual-purpose campaign manager

**User Benefits**
- ✅ Better workflow - everything in one place
- ✅ Campaign-focused metrics - no confusion
- ✅ Faster navigation - one click to switch views
- ✅ Cleaner interface - removed redundant links

**Technical**
- Dashboard automatically filters by selected campaign
- `/dashboard` URL redirects to unified campaigns page
- Built with Radix UI Tabs for accessibility
- Real-time updates on tab switch

</details>

<details open>
<summary><b>📚 Source Management</b> <code>v0.7.1</code></summary>

<br>

Dedicated page for managing all your ingested content sources with full CRUD operations.

**Source Management Page**
- 🗂️ **View All Sources**: Responsive grid showing all ingested sources
- 📄 **Source Cards**: Display title, URL, content preview, creation date, task count
- ✨ **Generate from Source**: One-click content generation button on each card
- 🗑️ **Safe Deletion**: Delete sources with confirmation dialog and task warning
- 📭 **Empty State**: Helpful onboarding when no sources exist

**Navigation & Workflow**
- 🔗 **"Manage Sources" button** on campaigns page for easy access
- 🔄 **Auto-redirect** from home page after source ingestion
- 🏠 **Quick return** to home page to add more sources
- 🌊 **Seamless workflow**: Ingest → View → Generate → Manage

**Data Safety**
- ⚠️ **Warning Dialog**: Shows task count when deleting sources with tasks
- 🔒 **Cascade Behavior**: Tasks preserved with `sourceId` set to null (onDelete: SetNull)
- 💾 **No Data Loss**: Tasks remain linked to campaigns and metrics intact

**User Benefits**
- ✅ Complete source lifecycle management
- ✅ Multi-source workflow support
- ✅ Clear visibility of source-task relationships
- ✅ Safe deletion with clear warnings

**API Endpoints**
- `GET /api/source` - List all sources with task counts
- `DELETE /api/source/:id` - Delete source with cascade handling

</details>

<details open>
<summary><b>📊 Improved Campaign Workflow Clarity</b> <code>v0.11.0</code></summary>

<br>

Better workflow guidance with empty states, source attribution, and campaign-source relationships.

**Empty State for Campaigns with No Tasks**
- Helpful guidance card when campaign has no tasks
- Two clear options with action buttons:
  - "Generate with Claude AI" - Creates AI content from sources
  - "Create Task Manually" - Manual post creation
- Icons and descriptions for each option
- Replaces empty Kanban board with actionable next steps

**Campaign-Source Relationship**
- Tracks which source inspired each campaign
- Auto-sets sourceId when campaign created from source
- Safe deletion: source removal preserves campaigns (sourceId → NULL)
- Multiple campaigns can share same source
- Full cascade handling with database integrity

**Source Attribution Display**
- Shows source name and clickable link on campaign page
- FileText icon for visual consistency
- External link opens in new tab
- Appears below campaign description
- Hidden for manually-created campaigns

**Test Suite Improvements**
- Fixed test race conditions (all 192 tests pass reliably)
- Sequential test execution for SQLite compatibility
- 8 new integration tests for campaign-source features
- 100% pass rate, < 2s execution time

**Schema Changes**
- Added `Campaign.sourceId: String?` field
- Added `Campaign.source` relation
- OnDelete: SetNull (preserves campaigns)

**API Updates**
- `POST /api/campaigns` - Accepts optional `sourceId` parameter
- `GET /api/campaigns` - Includes source data in response

</details>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/navam-marketer.git
cd navam-marketer

# Install dependencies
npm install

# Set up the database
npm run db:push

# Start the development server
npm run dev
```

🎉 **That's it!** Open [http://localhost:3000](http://localhost:3000) to get started.

---

## 💡 Usage

### 1️⃣ Extract Content from URLs

<table>
<tr>
<td>

1. Navigate to the home page
2. Paste any blog or article URL
3. Click **Fetch** to extract content
4. View cleaned, readable text

</td>
<td width="50%">

```
Example URLs:
→ Medium articles
→ Product pages
→ Blog posts
→ News articles
```

</td>
</tr>
</table>

### 2️⃣ Create Your First Campaign

<table>
<tr>
<td>

1. Click **Go to Campaigns**
2. Click **New Campaign**
3. Enter campaign details
4. Start adding tasks

</td>
<td width="50%">

```
Campaign Example:
Name: Product Launch Q4
Description: Social promotions
for our new feature release
```

</td>
</tr>
</table>

### 3️⃣ Manage Tasks on Kanban Board

<table>
<tr>
<td>

**Create Tasks**
- Select campaign from dropdown
- Click **New Task**
- Choose platform and write content

**Organize Tasks**
- Drag cards between columns
- Edit content inline
- Track scheduled dates

</td>
<td>

```
Workflow:
📝 To Do      → Draft posts
✍️  Draft     → Review & edit
📅 Scheduled  → Ready to publish
✅ Posted     → Published content
```

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center"><b>Category</b></td>
<td><b>Technology</b></td>
</tr>
<tr>
<td><b>Framework</b></td>
<td>
  <img src="https://img.shields.io/badge/Next.js-15.0-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19_RC-61DAFB?logo=react" alt="React">
</td>
</tr>
<tr>
<td><b>Language</b></td>
<td>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript">
</td>
</tr>
<tr>
<td><b>Styling</b></td>
<td>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/shadcn/ui-latest-000000" alt="shadcn/ui">
  <img src="https://img.shields.io/badge/Radix_UI-latest-161618" alt="Radix">
</td>
</tr>
<tr>
<td><b>Database</b></td>
<td>
  <img src="https://img.shields.io/badge/Prisma-6.0-2D3748?logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/SQLite-local-003B57?logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/PostgreSQL-prod-4169E1?logo=postgresql" alt="PostgreSQL">
</td>
</tr>
<tr>
<td><b>State</b></td>
<td>
  <img src="https://img.shields.io/badge/Zustand-5.0-593D88" alt="Zustand">
  <img src="https://img.shields.io/badge/TanStack_Query-5.0-FF4154" alt="TanStack Query">
</td>
</tr>
<tr>
<td><b>DnD</b></td>
<td>
  <img src="https://img.shields.io/badge/dnd--kit-6.3-000000" alt="dnd-kit">
</td>
</tr>
<tr>
<td><b>Charts</b></td>
<td>
  <img src="https://img.shields.io/badge/Recharts-3.4-FF6384" alt="Recharts">
</td>
</tr>
<tr>
<td><b>Tools</b></td>
<td>
  <img src="https://img.shields.io/badge/Mozilla_Readability-0.5-000000" alt="Readability">
  <img src="https://img.shields.io/badge/JSDOM-25.0-E34C26" alt="JSDOM">
</td>
</tr>
</table>

### Architecture Highlights

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

---

## 📁 Project Structure

```
marketer/
├── 📁 app/                      # Next.js App Router
│   ├── 📁 api/                  # Backend API routes
│   │   ├── 📁 campaigns/        # Campaign CRUD
│   │   ├── 📁 tasks/            # Task CRUD
│   │   └── 📁 source/           # Content extraction
│   ├── 📁 campaigns/            # Campaign management page
│   ├── 📄 layout.tsx            # Root layout
│   ├── 📄 page.tsx              # Home page
│   └── 📄 globals.css           # Global styles
│
├── 📁 components/               # React components
│   ├── 📁 ui/                   # shadcn/ui primitives
│   ├── 📄 kanban-board.tsx      # Drag-drop board
│   ├── 📄 kanban-column.tsx     # Column container
│   ├── 📄 kanban-card.tsx       # Task card
│   ├── 📄 create-campaign-dialog.tsx
│   ├── 📄 create-task-dialog.tsx
│   └── 📄 source-ingestion.tsx
│
├── 📁 lib/                      # Utilities
│   ├── 📄 prisma.ts             # Database client
│   ├── 📄 store.ts              # Zustand state
│   └── 📄 utils.ts              # Helper functions
│
├── 📁 prisma/                   # Database
│   └── 📄 schema.prisma         # Schema definition
│
└── 📁 backlog/                  # Project planning
    ├── 📄 active.md             # Development roadmap
    └── 📄 release-*.md          # Release notes
```

---

## 🎯 Roadmap

### ✅ Completed

- [x] **v0.1.0** — Source Ingestion
- [x] **v0.2.0** — Campaign & Task Management (Kanban)
- [x] **v0.3.0** — Content Generation with Claude AI
- [x] **v0.3.1** — Claude Model Update (Bug Fix)
- [x] **v0.3.2** — Automated Testing Support
- [x] **v0.4.0** — Scheduling & Auto-Posting
- [x] **v0.4.1** — Next.js Config Fix
- [x] **v0.4.2** — Auto-Schedule Status Change
- [x] **v0.4.3 & v0.4.4** — Campaign Task Count Refresh
- [x] **v0.5.0** — Smooth Drag-and-Drop Animations
- [x] **v0.6.0** — Performance Dashboard & Analytics
- [x] **v0.7.0** — Unified Campaign Manager
- [x] **v0.7.1** — Source Management
- [x] **v0.7.2** — Unified Navigation System
- [x] **v0.7.3** — Manual Metrics Recording UI
- [x] **v0.8.0** — Streamlined Navigation & Source Management
- [x] **v0.8.1** — Fix Add Source Button Bug
- [x] **v0.9.0** — Streamlined Generate from Source Workflow
- [x] **v0.10.0** — Enhanced Source Fetch UX (Toast Notifications)
- [x] **v0.11.0** — Improved Campaign Workflow Clarity

### 📅 Planned

- [ ] **v0.11.x** — Continued UX Refinements
  - Dismissible onboarding hints
  - Enhanced campaign management features

- [ ] **v0.12.0** — Data Management
  - Prisma migrations setup
  - Campaign export/import

- [ ] **v0.13.0** — Real Outcome Delivery
  - LinkedIn API integration
  - Twitter/X API integration
  - Actual posting (vs. mocking)

- [ ] **v1.0.0** — Agentic System
  - LangGraph implementation
  - Model routing (Haiku/Sonnet)
  - Agent orchestration

> 📖 See [`backlog/active.md`](backlog/active.md) for detailed specifications.

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build optimized production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Create database migrations |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## 🏗️ Development Philosophy

### MLP (Minimum Lovable Product)

We're not building an MVP — we're building an **MLP**:

- ✨ **Delight from Day One** — Beautiful UI and smooth UX
- 👤 **Human-in-Loop** — Review before publish, always
- 🎯 **Focused Features** — Do less, but do it exceptionally well
- 🏠 **Local-First** — Works offline, deploys globally

### Design Principles

1. **Progressive Disclosure** — Show what matters, hide complexity
2. **Instant Feedback** — Loading states, error messages, confirmations
3. **Type Safety** — Full TypeScript coverage
4. **Component Reusability** — DRY with shadcn/ui primitives

---

## 🤝 Contributing

This is currently a private project. For questions or feedback, please contact the development team.

---

## 📄 License

**Private** — All rights reserved.

---

## 🙏 Acknowledgments

Built with modern tools from the open-source community:

- [Next.js](https://nextjs.org/) — The React Framework
- [shadcn/ui](https://ui.shadcn.com/) — Beautifully designed components
- [Prisma](https://www.prisma.io/) — Next-generation ORM
- [dnd-kit](https://dndkit.com/) — Modern drag and drop
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Zustand](https://zustand-demo.pmnd.rs/) — Minimal state management

---

<div align="center">

**[⬆ Back to Top](#-navam-marketer)**

Made with ❤️ for bootstrapped founders

</div>
