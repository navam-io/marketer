import { PrismaClient } from '@prisma/client';

// Create a singleton instance for tests
const globalForPrisma = global as unknown as { prismaTest: PrismaClient };

export const prismaTest = globalForPrisma.prismaTest || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./test.db'
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaTest = prismaTest;

/**
 * Clean up the test database before each test
 */
export async function cleanDatabase() {
  // Delete in order to respect foreign key constraints
  await prismaTest.metric.deleteMany();
  await prismaTest.task.deleteMany();
  await prismaTest.source.deleteMany();
  await prismaTest.campaign.deleteMany();
}

/**
 * Disconnect from the database after tests
 */
export async function disconnectDatabase() {
  await prismaTest.$disconnect();
}

/**
 * Create test data helpers
 */
export async function createTestCampaign(data?: Partial<{
  name: string;
  description: string;
  status: string;
}>) {
  return await prismaTest.campaign.create({
    data: {
      name: data?.name || 'Test Campaign',
      description: data?.description || 'Test Description',
      status: data?.status || 'active'
    }
  });
}

export async function createTestSource(data?: Partial<{
  url: string;
  title: string;
  content: string;
  rawHtml: string;
  excerpt: string;
}>) {
  return await prismaTest.source.create({
    data: {
      url: data?.url || 'https://example.com',
      title: data?.title || 'Test Article',
      content: data?.content || 'Test content',
      rawHtml: data?.rawHtml || '<html>Test</html>',
      excerpt: data?.excerpt || 'Test excerpt'
    }
  });
}

export async function createTestTask(data?: Partial<{
  campaignId: string;
  sourceId: string;
  platform: string;
  status: string;
  content: string;
}>) {
  return await prismaTest.task.create({
    data: {
      campaignId: data?.campaignId || null,
      sourceId: data?.sourceId || null,
      platform: data?.platform || 'linkedin',
      status: data?.status || 'todo',
      content: data?.content || 'Test task content'
    }
  });
}
