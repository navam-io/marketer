import { prismaTest, cleanDatabase, disconnectDatabase, createTestSource } from '@/lib/test-utils';

describe('Campaign Workflow Integration Tests', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Campaign-Source Relationship', () => {
    it('should create campaign with sourceId', async () => {
      const source = await createTestSource({
        title: 'Test Article',
        url: 'https://example.com/article'
      });

      const campaign = await prismaTest.campaign.create({
        data: {
          name: 'Test Campaign',
          description: 'Campaign from source',
          sourceId: source.id
        },
        include: {
          source: true
        }
      });

      expect(campaign.sourceId).toBe(source.id);
      expect(campaign.source).toBeDefined();
      expect(campaign.source?.id).toBe(source.id);
      expect(campaign.source?.title).toBe('Test Article');
    });

    it('should allow campaign without sourceId', async () => {
      const campaign = await prismaTest.campaign.create({
        data: {
          name: 'Manual Campaign',
          description: 'No source'
        }
      });

      expect(campaign.sourceId).toBeNull();
    });

    it('should set sourceId to null when source is deleted', async () => {
      const source = await createTestSource();
      const campaign = await prismaTest.campaign.create({
        data: {
          name: 'Test Campaign',
          sourceId: source.id
        }
      });

      // Delete source
      await prismaTest.source.delete({
        where: { id: source.id }
      });

      // Campaign should still exist with null sourceId
      const updatedCampaign = await prismaTest.campaign.findUnique({
        where: { id: campaign.id }
      });

      expect(updatedCampaign).toBeDefined();
      expect(updatedCampaign?.sourceId).toBeNull();
    });

    it('should allow multiple campaigns from same source', async () => {
      const source = await createTestSource();

      const campaign1 = await prismaTest.campaign.create({
        data: {
          name: 'Campaign 1',
          sourceId: source.id
        }
      });

      const campaign2 = await prismaTest.campaign.create({
        data: {
          name: 'Campaign 2',
          sourceId: source.id
        }
      });

      expect(campaign1.sourceId).toBe(source.id);
      expect(campaign2.sourceId).toBe(source.id);
    });
  });

  describe('Campaign API with Source', () => {
    it('should include source in campaign GET response', async () => {
      const source = await createTestSource({
        title: 'API Test Source',
        url: 'https://example.com'
      });

      await prismaTest.campaign.create({
        data: {
          name: 'API Test Campaign',
          sourceId: source.id
        }
      });

      const campaigns = await prismaTest.campaign.findMany({
        include: {
          source: {
            select: {
              id: true,
              title: true,
              url: true
            }
          },
          _count: {
            select: { tasks: true }
          }
        }
      });

      expect(campaigns).toHaveLength(1);
      expect(campaigns[0].source).toBeDefined();
      expect(campaigns[0].source?.title).toBe('API Test Source');
      expect(campaigns[0].source?.url).toBe('https://example.com');
    });
  });

  describe('Campaign Creation from Source', () => {
    it('should create campaign with source attribution', async () => {
      const source = await createTestSource({
        title: 'My Blog Post',
        url: 'https://blog.example.com/post'
      });

      const campaign = await prismaTest.campaign.create({
        data: {
          name: source.title || 'Untitled Campaign',
          sourceId: source.id,
          status: 'active'
        },
        include: {
          source: {
            select: {
              id: true,
              title: true,
              url: true
            }
          }
        }
      });

      expect(campaign.name).toBe('My Blog Post');
      expect(campaign.sourceId).toBe(source.id);
      expect(campaign.source?.title).toBe('My Blog Post');
      expect(campaign.source?.url).toBe('https://blog.example.com/post');
    });
  });

  describe('Source-Campaign-Task Relationships', () => {
    it('should maintain all relationships correctly', async () => {
      // Create source
      const source = await createTestSource({
        title: 'Full Workflow Test'
      });

      // Create campaign from source
      const campaign = await prismaTest.campaign.create({
        data: {
          name: source.title || 'Test',
          sourceId: source.id
        }
      });

      // Create tasks
      const task1 = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          sourceId: source.id,
          platform: 'linkedin',
          status: 'draft',
          content: 'Test post 1'
        }
      });

      const task2 = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          sourceId: source.id,
          platform: 'twitter',
          status: 'draft',
          content: 'Test post 2'
        }
      });

      // Verify relationships
      const campaignWithRelations = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: {
          source: true,
          tasks: true
        }
      });

      expect(campaignWithRelations?.source?.id).toBe(source.id);
      expect(campaignWithRelations?.tasks).toHaveLength(2);
      expect(campaignWithRelations?.tasks[0].sourceId).toBe(source.id);
      expect(campaignWithRelations?.tasks[1].sourceId).toBe(source.id);
    });

    it('should handle source deletion with existing campaign and tasks', async () => {
      // Create full workflow
      const source = await createTestSource();
      const campaign = await prismaTest.campaign.create({
        data: {
          name: 'Test Campaign',
          sourceId: source.id
        }
      });

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          sourceId: source.id,
          platform: 'linkedin',
          status: 'draft',
          content: 'Test'
        }
      });

      // Delete source
      await prismaTest.source.delete({
        where: { id: source.id }
      });

      // Campaign and task should still exist
      const campaignAfter = await prismaTest.campaign.findUnique({
        where: { id: campaign.id }
      });
      const taskAfter = await prismaTest.task.findUnique({
        where: { id: task.id }
      });

      expect(campaignAfter).toBeDefined();
      expect(campaignAfter?.sourceId).toBeNull();
      expect(taskAfter).toBeDefined();
      expect(taskAfter?.sourceId).toBeNull();
      expect(taskAfter?.campaignId).toBe(campaign.id); // Still linked to campaign
    });
  });
});
