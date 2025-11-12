import { prismaTest, cleanDatabase, disconnectDatabase, createTestCampaign, createTestTask } from '@/lib/test-utils';

describe('Metrics Integration Tests', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Metric Creation', () => {
    it('should create a metric for a task', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask(campaign.id);

      const metric = await prismaTest.metric.create({
        data: {
          taskId: task.id,
          type: 'click',
          value: 1
        }
      });

      expect(metric).toBeDefined();
      expect(metric.taskId).toBe(task.id);
      expect(metric.type).toBe('click');
      expect(metric.value).toBe(1);
    });

    it('should create multiple metrics for a task', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask(campaign.id);

      const metrics = await Promise.all([
        prismaTest.metric.create({ data: { taskId: task.id, type: 'click', value: 5 } }),
        prismaTest.metric.create({ data: { taskId: task.id, type: 'like', value: 3 } }),
        prismaTest.metric.create({ data: { taskId: task.id, type: 'share', value: 2 } })
      ]);

      expect(metrics).toHaveLength(3);
      expect(metrics[0].type).toBe('click');
      expect(metrics[1].type).toBe('like');
      expect(metrics[2].type).toBe('share');
    });

    it('should cascade delete metrics when task is deleted', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask(campaign.id);

      await prismaTest.metric.create({
        data: {
          taskId: task.id,
          type: 'click',
          value: 1
        }
      });

      // Delete task
      await prismaTest.task.delete({
        where: { id: task.id }
      });

      // Metrics should be deleted
      const metrics = await prismaTest.metric.findMany({
        where: { taskId: task.id }
      });

      expect(metrics).toHaveLength(0);
    });
  });

  describe('Metric Queries', () => {
    it('should find metrics by task', async () => {
      const campaign = await createTestCampaign();
      const task1 = await createTestTask(campaign.id);
      const task2 = await createTestTask(campaign.id);

      await prismaTest.metric.create({ data: { taskId: task1.id, type: 'click', value: 5 } });
      await prismaTest.metric.create({ data: { taskId: task1.id, type: 'like', value: 3 } });
      await prismaTest.metric.create({ data: { taskId: task2.id, type: 'click', value: 2 } });

      const task1Metrics = await prismaTest.metric.findMany({
        where: { taskId: task1.id }
      });

      expect(task1Metrics).toHaveLength(2);
      expect(task1Metrics.every(m => m.taskId === task1.id)).toBe(true);
    });

    it('should find metrics by type', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask(campaign.id);

      await prismaTest.metric.create({ data: { taskId: task.id, type: 'click', value: 5 } });
      await prismaTest.metric.create({ data: { taskId: task.id, type: 'click', value: 3 } });
      await prismaTest.metric.create({ data: { taskId: task.id, type: 'like', value: 2 } });

      const clickMetrics = await prismaTest.metric.findMany({
        where: { type: 'click' }
      });

      expect(clickMetrics).toHaveLength(2);
      expect(clickMetrics.every(m => m.type === 'click')).toBe(true);
    });

    it('should include task and campaign data in metrics query', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask({ campaignId: campaign.id });

      await prismaTest.metric.create({
        data: {
          taskId: task.id,
          type: 'click',
          value: 1
        }
      });

      const metrics = await prismaTest.metric.findMany({
        where: { taskId: task.id },
        include: {
          task: {
            include: {
              campaign: true
            }
          }
        }
      });

      expect(metrics).toHaveLength(1);
      expect(metrics[0].task).toBeDefined();
      expect(metrics[0].task.campaign).toBeDefined();
      expect(metrics[0].task.campaign?.id).toBe(campaign.id);
    });
  });

  describe('Metric Aggregations', () => {
    it('should aggregate metrics by type', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask(campaign.id);

      await prismaTest.metric.create({ data: { taskId: task.id, type: 'click', value: 5 } });
      await prismaTest.metric.create({ data: { taskId: task.id, type: 'click', value: 3 } });
      await prismaTest.metric.create({ data: { taskId: task.id, type: 'click', value: 2 } });

      const result = await prismaTest.metric.aggregate({
        where: { type: 'click' },
        _sum: {
          value: true
        },
        _count: true
      });

      expect(result._sum.value).toBe(10);
      expect(result._count).toBe(3);
    });

    it('should group metrics by type', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask(campaign.id);

      await prismaTest.metric.create({ data: { taskId: task.id, type: 'click', value: 5 } });
      await prismaTest.metric.create({ data: { taskId: task.id, type: 'click', value: 3 } });
      await prismaTest.metric.create({ data: { taskId: task.id, type: 'like', value: 2 } });
      await prismaTest.metric.create({ data: { taskId: task.id, type: 'share', value: 1 } });

      const results = await prismaTest.metric.groupBy({
        by: ['type'],
        _sum: {
          value: true
        }
      });

      expect(results).toHaveLength(3);

      const clickSum = results.find(r => r.type === 'click')?._sum.value;
      const likeSum = results.find(r => r.type === 'like')?._sum.value;
      const shareSum = results.find(r => r.type === 'share')?._sum.value;

      expect(clickSum).toBe(8);
      expect(likeSum).toBe(2);
      expect(shareSum).toBe(1);
    });

    it('should calculate total metrics across all tasks', async () => {
      const campaign = await createTestCampaign();
      const task1 = await createTestTask(campaign.id);
      const task2 = await createTestTask(campaign.id);

      await prismaTest.metric.create({ data: { taskId: task1.id, type: 'click', value: 5 } });
      await prismaTest.metric.create({ data: { taskId: task2.id, type: 'click', value: 3 } });

      const totalClicks = await prismaTest.metric.aggregate({
        where: { type: 'click' },
        _sum: {
          value: true
        }
      });

      expect(totalClicks._sum.value).toBe(8);
    });
  });

  describe('Campaign-Level Metrics', () => {
    it('should get all metrics for a campaign', async () => {
      const campaign1 = await createTestCampaign();
      const campaign2 = await createTestCampaign();

      const task1 = await createTestTask({ campaignId: campaign1.id });
      const task2 = await createTestTask({ campaignId: campaign1.id });
      const task3 = await createTestTask({ campaignId: campaign2.id });

      await prismaTest.metric.create({ data: { taskId: task1.id, type: 'click', value: 5 } });
      await prismaTest.metric.create({ data: { taskId: task2.id, type: 'click', value: 3 } });
      await prismaTest.metric.create({ data: { taskId: task3.id, type: 'click', value: 2 } });

      const campaign1Metrics = await prismaTest.metric.findMany({
        where: {
          task: {
            campaignId: campaign1.id
          }
        }
      });

      expect(campaign1Metrics).toHaveLength(2);
      expect(campaign1Metrics[0].value + campaign1Metrics[1].value).toBe(8);
    });

    it('should aggregate metrics by campaign', async () => {
      const campaign1 = await createTestCampaign();
      const campaign2 = await createTestCampaign();

      const task1 = await createTestTask({ campaignId: campaign1.id });
      const task2 = await createTestTask({ campaignId: campaign2.id });

      await prismaTest.metric.create({ data: { taskId: task1.id, type: 'click', value: 10 } });
      await prismaTest.metric.create({ data: { taskId: task2.id, type: 'click', value: 5 } });

      const campaign1Total = await prismaTest.metric.aggregate({
        where: {
          task: {
            campaignId: campaign1.id
          }
        },
        _sum: {
          value: true
        }
      });

      expect(campaign1Total._sum.value).toBe(10);
    });
  });

  describe('Time-Based Metrics', () => {
    it('should filter metrics by date range', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask(campaign.id);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Create metric with yesterday's date (manually set)
      await prismaTest.metric.create({
        data: {
          taskId: task.id,
          type: 'click',
          value: 5,
          createdAt: yesterday
        }
      });

      // Create metric with today's date
      await prismaTest.metric.create({
        data: {
          taskId: task.id,
          type: 'click',
          value: 3
        }
      });

      const recentMetrics = await prismaTest.metric.findMany({
        where: {
          createdAt: {
            gte: yesterday
          }
        }
      });

      expect(recentMetrics.length).toBeGreaterThanOrEqual(2);
    });

    it('should group metrics by date', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask(campaign.id);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prismaTest.metric.create({
        data: {
          taskId: task.id,
          type: 'click',
          value: 5,
          createdAt: today
        }
      });

      await prismaTest.metric.create({
        data: {
          taskId: task.id,
          type: 'click',
          value: 3,
          createdAt: today
        }
      });

      const grouped = await prismaTest.metric.groupBy({
        by: ['createdAt', 'type'],
        _sum: {
          value: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      expect(grouped.length).toBeGreaterThan(0);
    });
  });

  describe('Posted Tasks and Metrics', () => {
    it('should count total posted tasks', async () => {
      const campaign = await createTestCampaign();

      await createTestTask({ campaignId: campaign.id, status: 'todo' });
      await createTestTask({ campaignId: campaign.id, status: 'draft' });
      await createTestTask({ campaignId: campaign.id, status: 'posted' });
      await createTestTask({ campaignId: campaign.id, status: 'posted' });

      const postedCount = await prismaTest.task.count({
        where: {
          status: 'posted'
        }
      });

      expect(postedCount).toBe(2);
    });

    it('should get metrics only for posted tasks', async () => {
      const campaign = await createTestCampaign();

      const draftTask = await createTestTask({ campaignId: campaign.id, status: 'draft' });
      const postedTask = await createTestTask({ campaignId: campaign.id, status: 'posted' });

      await prismaTest.metric.create({ data: { taskId: draftTask.id, type: 'click', value: 5 } });
      await prismaTest.metric.create({ data: { taskId: postedTask.id, type: 'click', value: 10 } });

      const postedMetrics = await prismaTest.metric.findMany({
        where: {
          task: {
            status: 'posted'
          }
        }
      });

      expect(postedMetrics).toHaveLength(1);
      expect(postedMetrics[0].value).toBe(10);
    });
  });
});
