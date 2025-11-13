/**
 * Integration tests for Campaign Archive feature
 * Tests archiving/unarchiving campaigns and filtering
 */

import { prismaTest, cleanDatabase, disconnectDatabase, createTestCampaign, createTestTask } from '@/lib/test-utils';

describe('Campaign Archive Feature', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Schema and Database', () => {
    it('should have archived and archivedAt fields on Campaign model', async () => {
      const campaign = await createTestCampaign({
        name: 'Test Campaign'
      });

      expect(campaign).toHaveProperty('archived');
      expect(campaign).toHaveProperty('archivedAt');
      expect(campaign.archived).toBe(false);
      expect(campaign.archivedAt).toBeNull();
    });

    it('should default archived to false on new campaigns', async () => {
      const campaign = await prismaTest.campaign.create({
        data: {
          name: 'New Campaign'
        }
      });

      expect(campaign.archived).toBe(false);
      expect(campaign.archivedAt).toBeNull();
    });
  });

  describe('Archive Campaign', () => {
    it('should archive a campaign', async () => {
      const campaign = await createTestCampaign({
        name: 'To Archive'
      });

      const archived = await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: {
          archived: true,
          archivedAt: new Date()
        }
      });

      expect(archived.archived).toBe(true);
      expect(archived.archivedAt).toBeTruthy();
      expect(archived.archivedAt).toBeInstanceOf(Date);
    });

    it('should preserve campaign data when archiving', async () => {
      const campaign = await createTestCampaign({
        name: 'Campaign to Archive',
        description: 'Test description',
        status: 'active'
      });

      const archived = await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: {
          archived: true,
          archivedAt: new Date()
        }
      });

      expect(archived.name).toBe('Campaign to Archive');
      expect(archived.description).toBe('Test description');
      expect(archived.status).toBe('active');
    });

    it('should preserve tasks when archiving campaign', async () => {
      const campaign = await createTestCampaign();
      await createTestTask({ campaignId: campaign.id });
      await createTestTask({ campaignId: campaign.id });

      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: {
          archived: true,
          archivedAt: new Date()
        }
      });

      const tasks = await prismaTest.task.findMany({
        where: { campaignId: campaign.id }
      });

      expect(tasks).toHaveLength(2);
    });
  });

  describe('Unarchive Campaign', () => {
    it('should unarchive a campaign', async () => {
      const campaign = await createTestCampaign();

      // Archive it first
      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: {
          archived: true,
          archivedAt: new Date()
        }
      });

      // Now unarchive it
      const unarchived = await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: {
          archived: false,
          archivedAt: null
        }
      });

      expect(unarchived.archived).toBe(false);
      expect(unarchived.archivedAt).toBeNull();
    });

    it('should allow creating tasks after unarchiving', async () => {
      const campaign = await createTestCampaign();

      // Archive and unarchive
      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: { archived: true, archivedAt: new Date() }
      });

      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: { archived: false, archivedAt: null }
      });

      // Should be able to create task
      const task = await createTestTask({ campaignId: campaign.id });
      expect(task.campaignId).toBe(campaign.id);
    });
  });

  describe('Filtering Campaigns', () => {
    it('should exclude archived campaigns by default', async () => {
      await createTestCampaign({ name: 'Active 1' });
      await createTestCampaign({ name: 'Active 2' });

      const archivedCampaign = await createTestCampaign({ name: 'Archived' });
      await prismaTest.campaign.update({
        where: { id: archivedCampaign.id },
        data: { archived: true, archivedAt: new Date() }
      });

      const campaigns = await prismaTest.campaign.findMany({
        where: { archived: false }
      });

      expect(campaigns).toHaveLength(2);
      expect(campaigns.map(c => c.name)).toEqual(['Active 1', 'Active 2']);
    });

    it('should include archived campaigns when explicitly requested', async () => {
      await createTestCampaign({ name: 'Active 1' });

      const archivedCampaign = await createTestCampaign({ name: 'Archived' });
      await prismaTest.campaign.update({
        where: { id: archivedCampaign.id },
        data: { archived: true, archivedAt: new Date() }
      });

      const allCampaigns = await prismaTest.campaign.findMany();
      expect(allCampaigns).toHaveLength(2);

      const onlyArchived = await prismaTest.campaign.findMany({
        where: { archived: true }
      });
      expect(onlyArchived).toHaveLength(1);
      expect(onlyArchived[0].name).toBe('Archived');
    });

    it('should filter active and archived separately', async () => {
      // Create 3 active campaigns
      await createTestCampaign({ name: 'Active 1' });
      await createTestCampaign({ name: 'Active 2' });
      await createTestCampaign({ name: 'Active 3' });

      // Create 2 archived campaigns
      const archived1 = await createTestCampaign({ name: 'Archived 1' });
      const archived2 = await createTestCampaign({ name: 'Archived 2' });

      await prismaTest.campaign.update({
        where: { id: archived1.id },
        data: { archived: true, archivedAt: new Date() }
      });

      await prismaTest.campaign.update({
        where: { id: archived2.id },
        data: { archived: true, archivedAt: new Date() }
      });

      const active = await prismaTest.campaign.findMany({
        where: { archived: false }
      });

      const archived = await prismaTest.campaign.findMany({
        where: { archived: true }
      });

      expect(active).toHaveLength(3);
      expect(archived).toHaveLength(2);
    });
  });

  describe('Archive with Source Relationship', () => {
    it('should preserve source relationship when archiving', async () => {
      const source = await prismaTest.source.create({
        data: {
          content: 'Test content',
          title: 'Test Source'
        }
      });

      const campaign = await prismaTest.campaign.create({
        data: {
          name: 'Campaign with Source',
          sourceId: source.id
        }
      });

      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: { archived: true, archivedAt: new Date() }
      });

      const archivedCampaign = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: { source: true }
      });

      expect(archivedCampaign?.sourceId).toBe(source.id);
      expect(archivedCampaign?.source?.id).toBe(source.id);
    });
  });

  describe('Multiple Archive/Unarchive Cycles', () => {
    it('should handle multiple archive/unarchive cycles', async () => {
      const campaign = await createTestCampaign({ name: 'Cycle Test' });

      // Cycle 1: Archive
      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: { archived: true, archivedAt: new Date() }
      });

      let current = await prismaTest.campaign.findUnique({
        where: { id: campaign.id }
      });
      expect(current?.archived).toBe(true);

      // Cycle 1: Unarchive
      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: { archived: false, archivedAt: null }
      });

      current = await prismaTest.campaign.findUnique({
        where: { id: campaign.id }
      });
      expect(current?.archived).toBe(false);

      // Cycle 2: Archive again
      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: { archived: true, archivedAt: new Date() }
      });

      current = await prismaTest.campaign.findUnique({
        where: { id: campaign.id }
      });
      expect(current?.archived).toBe(true);
    });
  });

  describe('Archiving with Task Counts', () => {
    it('should maintain accurate task counts for archived campaigns', async () => {
      const campaign = await createTestCampaign();
      await createTestTask({ campaignId: campaign.id });
      await createTestTask({ campaignId: campaign.id });
      await createTestTask({ campaignId: campaign.id });

      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: { archived: true, archivedAt: new Date() }
      });

      const archivedWithCount = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: {
          _count: {
            select: { tasks: true }
          }
        }
      });

      expect(archivedWithCount?._count.tasks).toBe(3);
    });
  });

  describe('Sorting and Ordering', () => {
    it('should maintain creation order regardless of archive status', async () => {
      const campaign1 = await createTestCampaign({ name: 'First' });
      await new Promise(resolve => setTimeout(resolve, 10)); // Small delay

      const campaign2 = await createTestCampaign({ name: 'Second' });
      await new Promise(resolve => setTimeout(resolve, 10));

      const campaign3 = await createTestCampaign({ name: 'Third' });

      // Archive the middle one
      await prismaTest.campaign.update({
        where: { id: campaign2.id },
        data: { archived: true, archivedAt: new Date() }
      });

      const campaigns = await prismaTest.campaign.findMany({
        orderBy: { createdAt: 'asc' }
      });

      expect(campaigns[0].name).toBe('First');
      expect(campaigns[1].name).toBe('Second');
      expect(campaigns[2].name).toBe('Third');
    });
  });
});
