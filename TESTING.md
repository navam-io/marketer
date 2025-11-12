# Testing Documentation

## Overview

This project includes comprehensive integration and component tests to ensure production features work correctly. Tests focus on real database operations and actual component behavior rather than mocks.

## Test Results

```
Test Suites: 2 passed, 2 total
Tests:       21 passed, 21 total
Time:        ~1s
```

## Test Structure

```
__tests__/
├── integration/
│   └── database.test.ts       # Database integration tests
└── components/
    └── ui/
        └── badge.test.tsx     # Component tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

### Integration Tests (database.test.ts)

**Slice 1 - Source Ingestion**
- ✅ Create and retrieve source
- ✅ List all sources ordered by creation date
- ✅ Handle sources without URLs

**Slice 2 - Campaign Management**
- ✅ Create campaign with all fields
- ✅ Update campaign fields
- ✅ Delete campaign
- ✅ Include task count with campaign

**Slice 2 - Task Management**
- ✅ Create task with all relations
- ✅ Update task status
- ✅ Handle task workflow progression (todo → draft → scheduled → posted)
- ✅ Filter tasks by campaign
- ✅ Delete task
- ✅ Set task campaignId to null when campaign is deleted
- ✅ Support scheduled dates

**Data Integrity**
- ✅ Maintain referential integrity between campaigns and tasks
- ✅ Maintain referential integrity between sources and tasks
- ✅ Handle task without campaign or source

### Component Tests (badge.test.tsx)

- ✅ Render with default variant
- ✅ Render with different variants (default, secondary, destructive, outline)
- ✅ Apply custom className
- ✅ Render children correctly

## What's Being Tested

### Production Features

1. **Database Operations** - All tests use real Prisma operations against a test database
2. **Data Relationships** - Campaign → Tasks, Source → Tasks relationships
3. **CRUD Operations** - Create, Read, Update, Delete for all models
4. **Business Logic** - Task workflow, status transitions, scheduled dates
5. **Data Integrity** - Foreign key constraints, cascading deletions, null handling
6. **Component Rendering** - UI component behavior and prop handling

### Not Mocked

- ✅ Database connections (real Prisma client)
- ✅ Database queries
- ✅ Data validation
- ✅ Referential integrity
- ✅ Component rendering

## Test Utilities

### Database Helpers (`lib/test-utils.ts`)

```typescript
// Clean database before each test
await cleanDatabase()

// Create test data
const campaign = await createTestCampaign({ name: 'Test' })
const source = await createTestSource({ title: 'Article' })
const task = await createTestTask({ campaignId: campaign.id })

// Disconnect after tests
await disconnectDatabase()
```

### Setup

**jest.config.js**
- Uses `next/jest` for Next.js integration
- jsdom environment for component tests
- Module path mapping for `@/` imports
- Coverage collection enabled

**jest.setup.js**
- Extends Jest matchers with `@testing-library/jest-dom`
- Polyfills `setImmediate` for Prisma compatibility

## Test Philosophy

### Integration Over Unit

We focus on **integration tests** that verify actual production behavior:
- Real database operations
- Actual data persistence
- True referential integrity
- Complete workflow scenarios

### Production-like Environment

Tests run against:
- Real Prisma client (not mocked)
- Actual database (SQLite for tests)
- Real TypeScript compilation
- Genuine error scenarios

### Coverage Goals

Current focus areas:
1. ✅ **Core Database Operations** - 100% of critical paths tested
2. ✅ **Feature Workflows** - Task progression, campaign management
3. ⚠️ **API Routes** - Tested indirectly through database operations
4. ⚠️ **UI Components** - Basic coverage (badge component)

## Known Limitations

1. **API Route Testing** - Edge runtime limitations prevent direct Next.js route handler testing
2. **Component Coverage** - Limited to critical UI primitives (more to be added)
3. **E2E Tests** - Not included (focus is on integration tests)
4. **External APIs** - URL fetching in source ingestion not tested (requires mock server)

## Best Practices

### Writing New Tests

```typescript
describe('Feature Name', () => {
  beforeEach(async () => {
    await cleanDatabase(); // Clean slate for each test
  });

  afterAll(async () => {
    await disconnectDatabase(); // Cleanup
  });

  it('should describe expected behavior', async () => {
    // Arrange
    const campaign = await createTestCampaign();

    // Act
    const result = await prismaTest.task.create({
      data: { campaignId: campaign.id }
    });

    // Assert
    expect(result.campaignId).toBe(campaign.id);
  });
});
```

### Test Naming

- Use descriptive "should" statements
- Group related tests in `describe` blocks
- Separate by feature/slice

### Test Data

- Use helper functions (`createTestCampaign`, etc.)
- Create minimal data needed for test
- Don't rely on test execution order

## Continuous Integration

Tests are designed to run in CI environments:
- Fast execution (~1 second)
- No external dependencies
- Deterministic results
- Clean state between tests

## Future Enhancements

- [ ] Add E2E tests with Playwright
- [ ] Increase component test coverage
- [ ] Add performance benchmarks
- [ ] Test error boundaries
- [ ] Add accessibility tests
- [ ] Test drag-and-drop interactions

## Troubleshooting

### Common Issues

**Issue:** `setImmediate is not defined`
**Solution:** Already fixed with polyfill in `jest.setup.js`

**Issue:** Import errors with Next.js modules
**Solution:** Use `next/jest` config wrapper

**Issue:** Database connection errors
**Solution:** Ensure Prisma client is generated (`npm run db:generate`)

### Debug Tips

```bash
# Run specific test file
npm test database.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="Campaign"

# Show console logs
npm test -- --verbose
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing)
