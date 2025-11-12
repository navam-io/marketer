# Navam Marketer - Marketing Automation MLP

A Marketing Automation tool for bootstrapped startup founders. Turn existing content (website, blog, or product page) into social promotions automatically.

## Features

### Slice 1 - Source Ingestion ✅ (v0.1.0)
- Paste a URL and extract cleaned, readable content
- Automatic content parsing using Mozilla Readability
- Save sources to database for future use
- Clean, modern UI with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Backend:** Next.js API Routes
- **Database:** Prisma + SQLite (production: PostgreSQL)
- **Content Extraction:** @mozilla/readability + jsdom
- **Language:** TypeScript

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd marketer
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npm run db:push
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Source Ingestion
1. Navigate to the home page
2. Paste a URL in the input field (e.g., a blog post, product page, or article)
3. Click "Fetch" to extract and display the content
4. View the cleaned, readable content with title and excerpt

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
marketer/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── source/
│   │       └── fetch/     # Source ingestion endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── source-ingestion.tsx
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database
│   └── schema.prisma     # Database schema
└── backlog/              # Project backlog
    ├── active.md         # Active development spec
    └── release-*.md      # Release notes
```

## Roadmap

See `backlog/active.md` for the complete development roadmap.

### Upcoming Features
- **Slice 2:** Campaign & Task Management (Kanban board)
- **Slice 3:** Content Generation with Claude AI
- **Slice 4:** Scheduling & Mock Posting
- **Slice 5:** Performance Dashboard
- **Slice 6:** Authentication (optional)

## Development Philosophy

This is an MLP (Minimum Lovable Product), not just an MVP:
- Deliver delight with minimal code
- Human-in-loop for all operations
- Usable and visually pleasing from day one
- Local-first with easy deployment options

## License

Private - All rights reserved

## Support

For issues or questions, check the backlog or contact the development team.
