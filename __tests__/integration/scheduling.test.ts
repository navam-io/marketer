import { prismaTest, cleanDatabase, disconnectDatabase, createTestCampaign, createTestTask } from '@/lib/test-utils';

describe('Scheduling Feature Integration Tests', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Task Scheduling', () => {
    it('should create a task with a scheduled date', async () => {
      const campaign = await createTestCampaign();
      const scheduledDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'scheduled',
          content: 'Test post content',
          scheduledAt: scheduledDate,
        },
      });

      expect(task.scheduledAt).toEqual(scheduledDate);
      expect(task.status).toBe('scheduled');
      expect(task.postedAt).toBeNull();
    });

    it('should update a task with a scheduled date', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask(campaign.id);

      const scheduledDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const updated = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          scheduledAt: scheduledDate,
          status: 'scheduled',
        },
      });

      expect(updated.scheduledAt).toEqual(scheduledDate);
      expect(updated.status).toBe('scheduled');
    });

    it('should clear a scheduled date', async () => {
      const campaign = await createTestCampaign();
      const scheduledDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'twitter',
          status: 'scheduled',
          content: 'Test post',
          scheduledAt: scheduledDate,
        },
      });

      // Clear the schedule
      const updated = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          scheduledAt: null,
          status: 'draft',
        },
      });

      expect(updated.scheduledAt).toBeNull();
      expect(updated.status).toBe('draft');
    });
  });

  describe('Scheduler API - GET /api/scheduler/process', () => {
    it('should return info about scheduled tasks', async () => {
      const campaign = await createTestCampaign();

      // Create a task scheduled for the past (due now)
      const pastDate = new Date(Date.now() - 60 * 1000); // 1 minute ago
      await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'scheduled',
          content: 'Past task',
          scheduledAt: pastDate,
        },
      });

      // Create a task scheduled for the future
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
      await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'twitter',
          status: 'scheduled',
          content: 'Future task',
          scheduledAt: futureDate,
        },
      });

      // Create a non-scheduled task
      await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'blog',
          status: 'draft',
          content: 'Draft task',
        },
      });

      // Query for scheduled tasks
      const dueNow = await prismaTest.task.count({
        where: {
          status: 'scheduled',
          scheduledAt: { lte: new Date() },
        },
      });

      const scheduledFuture = await prismaTest.task.count({
        where: {
          status: 'scheduled',
          scheduledAt: { gt: new Date() },
        },
      });

      expect(dueNow).toBe(1);
      expect(scheduledFuture).toBe(1);
    });
  });

  describe('Scheduler API - POST /api/scheduler/process', () => {
    it('should process due tasks and mark them as posted', async () => {
      const campaign = await createTestCampaign();

      // Create tasks scheduled in the past
      const pastDate1 = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago
      const task1 = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'scheduled',
          content: 'Task 1',
          scheduledAt: pastDate1,
        },
      });

      const pastDate2 = new Date(Date.now() - 1 * 60 * 1000); // 1 minute ago
      const task2 = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'twitter',
          status: 'scheduled',
          content: 'Task 2',
          scheduledAt: pastDate2,
        },
      });

      // Create a task scheduled in the future (should NOT be processed)
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const task3 = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'blog',
          status: 'scheduled',
          content: 'Future task',
          scheduledAt: futureDate,
        },
      });

      // Find and process due tasks (simulating the scheduler)
      const now = new Date();
      const dueTasks = await prismaTest.task.findMany({
        where: {
          status: 'scheduled',
          scheduledAt: { lte: now },
        },
      });

      expect(dueTasks).toHaveLength(2);
      expect(dueTasks.map(t => t.id).sort()).toEqual([task1.id, task2.id].sort());

      // Update due tasks to 'posted'
      for (const task of dueTasks) {
        await prismaTest.task.update({
          where: { id: task.id },
          data: {
            status: 'posted',
            postedAt: now,
          },
        });
      }

      // Verify tasks were updated
      const postedTask1 = await prismaTest.task.findUnique({ where: { id: task1.id } });
      const postedTask2 = await prismaTest.task.findUnique({ where: { id: task2.id } });
      const futureTask = await prismaTest.task.findUnique({ where: { id: task3.id } });

      expect(postedTask1?.status).toBe('posted');
      expect(postedTask1?.postedAt).not.toBeNull();
      expect(postedTask2?.status).toBe('posted');
      expect(postedTask2?.postedAt).not.toBeNull();

      // Future task should remain scheduled
      expect(futureTask?.status).toBe('scheduled');
      expect(futureTask?.postedAt).toBeNull();
    });

    it('should not process tasks that are not in scheduled status', async () => {
      const campaign = await createTestCampaign();

      // Create task in 'draft' status with a past scheduled date
      const pastDate = new Date(Date.now() - 60 * 1000);
      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'draft', // Not scheduled!
          content: 'Draft task',
          scheduledAt: pastDate,
        },
      });

      // Find due scheduled tasks
      const dueTasks = await prismaTest.task.findMany({
        where: {
          status: 'scheduled', // Only scheduled tasks
          scheduledAt: { lte: new Date() },
        },
      });

      expect(dueTasks).toHaveLength(0);

      // Verify task remains in draft
      const unchangedTask = await prismaTest.task.findUnique({ where: { id: task.id } });
      expect(unchangedTask?.status).toBe('draft');
    });

    it('should handle multiple scheduled tasks at the same time', async () => {
      const campaign = await createTestCampaign();
      const scheduledTime = new Date(Date.now() - 30 * 1000); // 30 seconds ago

      // Create 5 tasks all scheduled for the same time
      const taskIds: string[] = [];
      for (let i = 0; i < 5; i++) {
        const task = await prismaTest.task.create({
          data: {
            campaignId: campaign.id,
            platform: i % 2 === 0 ? 'linkedin' : 'twitter',
            status: 'scheduled',
            content: `Task ${i + 1}`,
            scheduledAt: scheduledTime,
          },
        });
        taskIds.push(task.id);
      }

      // Process all due tasks
      const dueTasks = await prismaTest.task.findMany({
        where: {
          status: 'scheduled',
          scheduledAt: { lte: new Date() },
        },
      });

      expect(dueTasks).toHaveLength(5);

      const now = new Date();
      await prismaTest.task.updateMany({
        where: {
          id: { in: taskIds },
        },
        data: {
          status: 'posted',
          postedAt: now,
        },
      });

      // Verify all tasks were posted
      const postedCount = await prismaTest.task.count({
        where: {
          id: { in: taskIds },
          status: 'posted',
        },
      });

      expect(postedCount).toBe(5);
    });
  });

  describe('Task Status Transitions', () => {
    it('should transition task from draft -> scheduled -> posted', async () => {
      const campaign = await createTestCampaign();

      // Create draft task
      let task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'draft',
          content: 'Test task',
        },
      });

      expect(task.status).toBe('draft');
      expect(task.scheduledAt).toBeNull();
      expect(task.postedAt).toBeNull();

      // Schedule the task
      const scheduledDate = new Date(Date.now() - 60 * 1000); // Past date for immediate processing
      task = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          status: 'scheduled',
          scheduledAt: scheduledDate,
        },
      });

      expect(task.status).toBe('scheduled');
      expect(task.scheduledAt).toEqual(scheduledDate);
      expect(task.postedAt).toBeNull();

      // Post the task
      task = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          status: 'posted',
          postedAt: new Date(),
        },
      });

      expect(task.status).toBe('posted');
      expect(task.scheduledAt).toEqual(scheduledDate);
      expect(task.postedAt).not.toBeNull();
    });
  });
});
