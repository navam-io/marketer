/**
 * Integration tests for database operations
 * These tests verify the actual production behavior of the database layer
 */

import { prismaTest, cleanDatabase, disconnectDatabase, createTestCampaign, createTestSource, createTestTask } from '@/lib/test-utils';

describe('Database Integration Tests', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Source Ingestion (Slice 1)', () => {
    it('should create and retrieve source', async () => {
      const source = await prismaTest.source.create({
        data: {
          url: 'https://example.com/article',
          title: 'Test Article',
          content: 'Test content',
          rawHtml: '<html>Test</html>',
          excerpt: 'Test excerpt'
        }
      });

      expect(source.id).toBeDefined();
      expect(source.title).toBe('Test Article');

      const retrieved = await prismaTest.source.findUnique({
        where: { id: source.id }
      });

      expect(retrieved).toBeTruthy();
      expect(retrieved?.url).toBe('https://example.com/article');
    });

    it('should list all sources ordered by creation date', async () => {
      await createTestSource({ title: 'First' });
      await new Promise(resolve => setTimeout(resolve, 10));
      await createTestSource({ title: 'Second' });

      const sources = await prismaTest.source.findMany({
        orderBy: { createdAt: 'desc' }
      });

      expect(sources).toHaveLength(2);
      expect(sources[0].title).toBe('Second');
      expect(sources[1].title).toBe('First');
    });

    it('should handle sources without URLs', async () => {
      const source = await prismaTest.source.create({
        data: {
          content: 'Direct text input',
        }
      });

      expect(source.id).toBeDefined();
      expect(source.url).toBeNull();
      expect(source.content).toBe('Direct text input');
    });
  });

  describe('Campaign Management (Slice 2)', () => {
    it('should create campaign with all fields', async () => {
      const campaign = await prismaTest.campaign.create({
        data: {
          name: 'Product Launch Q4',
          description: 'Marketing campaign',
          status: 'active'
        }
      });

      expect(campaign.id).toBeDefined();
      expect(campaign.name).toBe('Product Launch Q4');
      expect(campaign.status).toBe('active');
    });

    it('should update campaign fields', async () => {
      const campaign = await createTestCampaign({ name: 'Old Name' });

      const updated = await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: { name: 'New Name', status: 'paused' }
      });

      expect(updated.name).toBe('New Name');
      expect(updated.status).toBe('paused');
    });

    it('should delete campaign', async () => {
      const campaign = await createTestCampaign();

      await prismaTest.campaign.delete({
        where: { id: campaign.id }
      });

      const deleted = await prismaTest.campaign.findUnique({
        where: { id: campaign.id }
      });

      expect(deleted).toBeNull();
    });

    it('should include task count with campaign', async () => {
      const campaign = await createTestCampaign();
      await createTestTask({ campaignId: campaign.id });
      await createTestTask({ campaignId: campaign.id });

      const retrieved = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: {
          _count: { select: { tasks: true } }
        }
      });

      expect(retrieved?._count.tasks).toBe(2);
    });
  });

  describe('Task Management (Slice 2)', () => {
    it('should create task with all relations', async () => {
      const campaign = await createTestCampaign();
      const source = await createTestSource();

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          sourceId: source.id,
          platform: 'linkedin',
          status: 'draft',
          content: 'Test post'
        },
        include: {
          campaign: true,
          source: true
        }
      });

      expect(task.id).toBeDefined();
      expect(task.campaign?.name).toBeDefined();
      expect(task.source?.title).toBeDefined();
    });

    it('should update task status', async () => {
      const task = await createTestTask({ status: 'todo' });

      const updated = await prismaTest.task.update({
        where: { id: task.id },
        data: { status: 'draft' }
      });

      expect(updated.status).toBe('draft');
    });

    it('should handle task workflow progression', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask({
        campaignId: campaign.id,
        status: 'todo'
      });

      // Todo → Draft
      await prismaTest.task.update({
        where: { id: task.id },
        data: { status: 'draft' }
      });

      let current = await prismaTest.task.findUnique({
        where: { id: task.id }
      });
      expect(current?.status).toBe('draft');

      // Draft → Scheduled
      await prismaTest.task.update({
        where: { id: task.id },
        data: {
          status: 'scheduled',
          scheduledAt: new Date()
        }
      });

      current = await prismaTest.task.findUnique({
        where: { id: task.id }
      });
      expect(current?.status).toBe('scheduled');
      expect(current?.scheduledAt).toBeDefined();

      // Scheduled → Posted
      await prismaTest.task.update({
        where: { id: task.id },
        data: {
          status: 'posted',
          postedAt: new Date()
        }
      });

      current = await prismaTest.task.findUnique({
        where: { id: task.id }
      });
      expect(current?.status).toBe('posted');
      expect(current?.postedAt).toBeDefined();
    });

    it('should filter tasks by campaign', async () => {
      const campaign1 = await createTestCampaign({ name: 'Campaign 1' });
      const campaign2 = await createTestCampaign({ name: 'Campaign 2' });

      await createTestTask({ campaignId: campaign1.id });
      await createTestTask({ campaignId: campaign1.id });
      await createTestTask({ campaignId: campaign2.id });

      const campaign1Tasks = await prismaTest.task.findMany({
        where: { campaignId: campaign1.id }
      });

      expect(campaign1Tasks).toHaveLength(2);
    });

    it('should delete task', async () => {
      const task = await createTestTask();

      await prismaTest.task.delete({
        where: { id: task.id }
      });

      const deleted = await prismaTest.task.findUnique({
        where: { id: task.id }
      });

      expect(deleted).toBeNull();
    });

    it('should set task campaignId to null when campaign is deleted', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask({ campaignId: campaign.id });

      await prismaTest.campaign.delete({
        where: { id: campaign.id }
      });

      const updatedTask = await prismaTest.task.findUnique({
        where: { id: task.id }
      });

      expect(updatedTask).toBeTruthy();
      expect(updatedTask?.campaignId).toBeNull();
    });

    it('should support scheduled dates', async () => {
      const scheduledDate = new Date('2025-12-25T10:00:00Z');

      const task = await prismaTest.task.create({
        data: {
          platform: 'twitter',
          status: 'scheduled',
          content: 'Holiday post',
          scheduledAt: scheduledDate
        }
      });

      expect(task.scheduledAt).toBeDefined();
      expect(task.scheduledAt?.toISOString()).toBe(scheduledDate.toISOString());
    });
  });

  describe('Data Integrity', () => {
    it('should maintain referential integrity between campaigns and tasks', async () => {
      const campaign = await createTestCampaign();
      const task1 = await createTestTask({ campaignId: campaign.id });
      const task2 = await createTestTask({ campaignId: campaign.id });

      const campaignWithTasks = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: { tasks: true }
      });

      expect(campaignWithTasks?.tasks).toHaveLength(2);
      expect(campaignWithTasks?.tasks.map(t => t.id)).toContain(task1.id);
      expect(campaignWithTasks?.tasks.map(t => t.id)).toContain(task2.id);
    });

    it('should maintain referential integrity between sources and tasks', async () => {
      const source = await createTestSource();
      const task = await createTestTask({ sourceId: source.id });

      const sourceWithTasks = await prismaTest.source.findUnique({
        where: { id: source.id },
        include: { tasks: true }
      });

      expect(sourceWithTasks?.tasks).toHaveLength(1);
      expect(sourceWithTasks?.tasks[0].id).toBe(task.id);
    });

    it('should handle task without campaign or source', async () => {
      const task = await prismaTest.task.create({
        data: {
          platform: 'linkedin',
          status: 'todo',
          content: 'Standalone task'
        }
      });

      expect(task.id).toBeDefined();
      expect(task.campaignId).toBeNull();
      expect(task.sourceId).toBeNull();
    });
  });
});
