# Feedback

The code generation cycle used for Navam Marketer worked effectively with just five cycles and limited number of human evaluated issue fixes noted in backlog/issues.md file. 

However, the features did diverge from original vision in the author's mind. For example, the fact that dashboard and campaigns are distinct and not merged into one. The author's vision is to have dual purpose campaign manager which is used for planning, scheduling, as well as monitoring all in one place.

The other aspect is that the app is not delivering an outcome. It starts to mock features starting at scheduling and publishing of posts and some aspects of the dashboard.

Another issue is with data persistence and management which will require more granular features, like a way to manage multiple campaigns and multiple sources for these campaigns. This will also require a way to persist, transform, migrate data between major feature releases which may change the underlying schema.

The current implementation also does not implement true agentic system using LangGraph and instead makes a direct API call to Anthropic Sonnet 4.5. We may need more granular control based on use case of routing to using Haiku 4.5 for optimal latency for certain parts of the workflow where that is more suited model vs Sonnet 4.5 for more complex reasoning tasks as the app features evolve.

Another issue is that while certain features may exist in API and tests, they may not have a UI implementation.

Final issue is with usability of the system. The navigation is not intuitive and neither is the workflow moving from sourcing the campaign to relating the tasks to the original source. It is not obvious that source ingestion is a required step before moving to campaign creation based on the source. There is no way to navigate back to source ingestion or managing multiple sources.

So a lot more work ahead. However, it took me only a few hours to get here already, starting from a blank slate!

Most important achievement is the implementation of this end to end tech stack through five iterations of mostly human and some automated evaluations as well as regression testing across 75 tests.


| Layer                  | Library / Tool                        | Status     | Purpose                                    |
| ---------------------- | ------------------------------------- | ---------- | ------------------------------------------ |
| **Frontend**           | Next.js 15 (App Router)               | ✅ v0.1.0   | UI + API routes                            |
|                        | Tailwind CSS + shadcn/ui + Radix      | ✅ v0.1.0   | Design system                              |
|                        | dnd-kit                               | ✅ v0.2.0   | Drag-drop Kanban                           |
|                        | Zustand                               | ✅ v0.2.0   | Local UI state                             |
|                        | Recharts                              | ✅ v0.6.0   | Charts and KPIs                            |
|                        | TanStack Query                        | 📋 Planned | Server state caching (future optimization) |
| **Backend**            | Prisma + SQLite (dev)                 | ✅ v0.1.0   | Persistence (Postgres for prod)            |
|                        | Next.js API Routes                    | ✅ v0.1.0   | Business logic                             |
|                        | Node setInterval (instrumentation.ts) | ✅ v0.4.0   | Background scheduling                      |
| **AI/Agents**          | Anthropic SDK (Claude Sonnet 4.5)     | ✅ v0.3.0   | Content generation                         |
|                        | LangGraph (JS)                        | 📋 Planned | Agent orchestration (future)               |
| **Content Extraction** | jsdom + @mozilla/readability          | ✅ v0.1.0   | HTML → markdown                            |
| **Auth**               | NextAuth                              | 📋 Planned | Optional (Slice 6)                         |
| **Infra**              | Localhost / Vercel                    | ✅ v0.1.0   | Development + deployment ready             |
