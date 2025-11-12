<div align="center">

# 🚀 Navam Marketer

### Marketing Automation Made Simple

*Transform your content into social promotions — no marketing team required.*

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/yourusername/navam-marketer)
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

<details>
<summary><b>🤖 Coming Soon: AI Content Generation</b> <code>v0.3.0</code></summary>

<br>

Generate platform-optimized posts with Claude AI.

- Multi-platform content generation
- Tone and CTA customization
- Structured JSON output
- Batch generation from sources

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

### 🚧 In Progress

- [ ] **v0.3.0** — Content Generation with Claude AI
  - Multi-platform content generation
  - AI-powered post creation
  - Tone and style customization

### 📅 Planned

- [ ] **v0.4.0** — Scheduling & Automation
  - Date/time picker for posts
  - Automated status transitions
  - Mock posting functionality

- [ ] **v0.5.0** — Performance Dashboard
  - Engagement metrics
  - KPI cards and charts
  - Link tracking and analytics

- [ ] **v0.6.0** — Authentication (Optional)
  - Passwordless login
  - OAuth integration
  - Multi-user support

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
