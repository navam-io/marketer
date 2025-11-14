# Database Migrations Guide

This guide explains how to work with Prisma migrations in Navam Marketer.

## Overview

As of v0.12.0, Navam Marketer uses **Prisma Migrate** for database schema management. This provides:
- ✅ Version-controlled schema history
- ✅ Safe production deployments
- ✅ Rollback capabilities
- ✅ Team collaboration on schema changes

---

## Development Workflow

### Making Schema Changes

1. **Edit the schema:**
   ```bash
   # Edit prisma/schema.prisma
   ```

2. **Create a migration:**
   ```bash
   npm run db:migrate
   ```
   This will:
   - Prompt you for a migration name
   - Generate a migration file in `prisma/migrations/`
   - Apply the migration to your dev database
   - Regenerate the Prisma Client

3. **Commit the migration:**
   ```bash
   git add prisma/migrations/
   git commit -m "Add migration: <description>"
   ```

### Common Commands

```bash
# Create and apply a new migration (development)
npm run db:migrate

# Reset database and apply all migrations
npm run db:migrate:reset

# Regenerate Prisma Client (after pulling new migrations)
npm run db:generate

# View database in GUI
npm run db:studio
```

---

## Production Deployment

### Deploying Migrations

**For production environments (Vercel, Railway, etc.):**

```bash
npm run db:migrate:deploy
```

This command:
- Applies pending migrations without prompting
- Skips migration generation
- Is safe for CI/CD pipelines
- Only runs unapplied migrations

### Environment Variables

Ensure `DATABASE_URL` is set in production:

```bash
# SQLite (development)
DATABASE_URL="file:./dev.db"

# PostgreSQL (production - example)
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

### Vercel Deployment

Add to your build command in `vercel.json` or project settings:

```json
{
  "buildCommand": "npx prisma migrate deploy && npm run build"
}
```

Or use a `postinstall` script in `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## Migration History

### Current Migrations

1. **`0_init`** (v0.12.0) - Initial baseline migration
   - Campaign, Source, Task, Metric tables
   - Foreign key relationships
   - Indexes (Metric.taskId)
   - Soft delete support (Campaign.archived)

### Migration Files Structure

```
prisma/
├── migrations/
│   ├── 0_init/
│   │   └── migration.sql
│   ├── 20250113_add_feature/
│   │   └── migration.sql
│   └── migration_lock.toml
└── schema.prisma
```

---

## Database Providers

### SQLite (Development)

**Pros:**
- Zero configuration
- Fast local development
- File-based (easy to reset)

**Cons:**
- Not suitable for production with multiple users
- Limited concurrent writes

### PostgreSQL (Production Recommended)

**Pros:**
- Production-ready
- Excellent concurrency
- Advanced features (JSON, full-text search)
- Supported by most platforms

**Migration from SQLite to PostgreSQL:**

1. Update `datasource` in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Set `DATABASE_URL` for PostgreSQL

3. Run migrations:
   ```bash
   npm run db:migrate:deploy
   ```

---

## Troubleshooting

### Problem: "Migration already applied"

**Solution:**
```bash
# Mark migration as applied without running it
npx prisma migrate resolve --applied <migration_name>
```

### Problem: "Schema drift detected"

**Solution:**
```bash
# Reset and reapply all migrations (CAUTION: data loss)
npm run db:migrate:reset

# Or create a new migration to fix drift
npm run db:migrate
```

### Problem: "Prisma Client out of sync"

**Solution:**
```bash
npm run db:generate
```

### Problem: Migration fails in production

**Solution:**
1. Check logs for specific error
2. Verify `DATABASE_URL` is correct
3. Ensure database is accessible
4. Check migration file for syntax errors
5. Roll back if needed:
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

---

## Best Practices

### ✅ DO

- **Commit migrations to git** - They're part of your codebase
- **Test migrations locally first** - Run `db:migrate` before deploying
- **Use descriptive names** - `add_user_roles` not `migration_1`
- **Review generated SQL** - Check `migration.sql` files
- **Backup before production deploys** - Especially for destructive changes

### ❌ DON'T

- **Don't edit applied migrations** - Create a new migration instead
- **Don't use `db:push` in production** - Use `db:migrate:deploy`
- **Don't skip migrations** - Apply them in order
- **Don't delete migration files** - They're your schema history
- **Don't share databases across environments** - Each env needs its own

---

## Advanced Topics

### Creating Empty Migrations

For data migrations or manual SQL:

```bash
npx prisma migrate dev --create-only
# Edit the generated migration.sql file
npx prisma migrate dev
```

### Baseline Existing Databases

If migrating from `db:push`:

```bash
# Generate SQL for current schema
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

# Mark as applied
npx prisma migrate resolve --applied 0_init
```

### Custom Migration Names

```bash
npx prisma migrate dev --name add_user_authentication
```

---

## Schema Change Examples

### Adding a Field

```prisma
model Campaign {
  // ... existing fields
  color String? @default("#3B82F6") // New field
}
```

```bash
npm run db:migrate
# Name: add_campaign_color
```

### Adding a Table

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  campaigns Campaign[]
}
```

```bash
npm run db:migrate
# Name: add_user_table
```

### Adding a Relation

```prisma
model Campaign {
  // ... existing fields
  userId String?
  user   User?   @relation(fields: [userId], references: [id])
}
```

```bash
npm run db:migrate
# Name: add_campaign_user_relation
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        run: npm run db:migrate:deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Build
        run: npm run build
```

---

## Monitoring Migrations

### Check Migration Status

```bash
npx prisma migrate status
```

Output shows:
- Applied migrations
- Pending migrations
- Schema drift (if any)

### View Migration History

```bash
# List all migrations
ls -la prisma/migrations/

# View specific migration
cat prisma/migrations/<migration_name>/migration.sql
```

---

## Support

For issues or questions:
- **Prisma Docs:** https://www.prisma.io/docs/concepts/components/prisma-migrate
- **Project Issues:** See `backlog/feedback.md`

---

**Last Updated:** v0.12.0 (2025-11-13)
