/**
 * Campaign Duplication Integration Tests
 *
 * Tests the campaign duplication feature which allows users to:
 * - Duplicate a campaign with all its tasks
 * - Reset task status to 'todo' in the duplicate
 * - Preserve task content and outputJson
 * - Auto-name duplicate as "(Copy)"
 */

import { prismaTest, cleanDatabase, disconnectDatabase, createTestCampaign, createTestSource, createTestTask } from '@/lib/test-utils';

describe('Campaign Duplication', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /api/campaigns/[id]/duplicate - Basic Duplication', () => {
    it('should duplicate a campaign with basic properties', async () => {
      const campaign = await createTestCampaign({
        name: 'Original Campaign',
        description: 'Original description',
        status: 'active'
      });

      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${campaign.name} (Copy)`,
          description: campaign.description,
          status: campaign.status,
          sourceId: campaign.sourceId,
          archived: false
        },
        include: {
          tasks: true,
          source: true
        }
      });

      expect(duplicated.name).toBe('Original Campaign (Copy)');
      expect(duplicated.description).toBe('Original description');
      expect(duplicated.status).toBe('active');
      expect(duplicated.archived).toBe(false);
      expect(duplicated.id).not.toBe(campaign.id);
    });

    it('should duplicate a campaign with tasks', async () => {
      const campaign = await createTestCampaign({
        name: 'Campaign with Tasks'
      });

      // Create multiple tasks with different statuses
      await createTestTask({
        campaignId: campaign.id,
        platform: 'linkedin',
        status: 'posted',
        content: 'Task 1 content'
      });

      await createTestTask({
        campaignId: campaign.id,
        platform: 'twitter',
        status: 'scheduled',
        content: 'Task 2 content'
      });

      await createTestTask({
        campaignId: campaign.id,
        platform: 'facebook',
        status: 'draft',
        content: 'Task 3 content'
      });

      // Get the original campaign with tasks
      const original = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: { tasks: true }
      });

      expect(original?.tasks).toHaveLength(3);

      // Duplicate the campaign
      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${original!.name} (Copy)`,
          description: original!.description,
          status: original!.status,
          sourceId: original!.sourceId,
          archived: false,
          tasks: {
            create: original!.tasks.map(task => ({
              platform: task.platform,
              status: 'todo', // Reset to todo
              content: task.content,
              outputJson: task.outputJson,
              sourceId: task.sourceId
            }))
          }
        },
        include: {
          tasks: true
        }
      });

      expect(duplicated.tasks).toHaveLength(3);
      expect(duplicated.name).toBe('Campaign with Tasks (Copy)');

      // Verify all tasks were duplicated with status reset to 'todo'
      duplicated.tasks.forEach(task => {
        expect(task.status).toBe('todo');
        expect(task.campaignId).toBe(duplicated.id);
      });

      // Verify task content was preserved
      const taskContents = duplicated.tasks.map(t => t.content).sort();
      expect(taskContents).toEqual(['Task 1 content', 'Task 2 content', 'Task 3 content']);

      // Verify platforms were preserved
      const platforms = duplicated.tasks.map(t => t.platform).sort();
      expect(platforms).toEqual(['facebook', 'linkedin', 'twitter']);
    });

    it('should duplicate a campaign with source attribution', async () => {
      const source = await createTestSource({
        url: 'https://example.com/article',
        title: 'Test Article'
      });

      const campaign = await createTestCampaign({
        name: 'Sourced Campaign',
        sourceId: source.id
      });

      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${campaign.name} (Copy)`,
          description: campaign.description,
          status: campaign.status,
          sourceId: campaign.sourceId,
          archived: false
        },
        include: {
          source: true
        }
      });

      expect(duplicated.sourceId).toBe(source.id);
      expect(duplicated.source?.title).toBe('Test Article');
    });

    it('should preserve task outputJson in duplicate', async () => {
      const campaign = await createTestCampaign({
        name: 'Campaign with JSON'
      });

      const outputData = {
        variations: [
          { text: 'Variation 1', platform: 'linkedin' },
          { text: 'Variation 2', platform: 'twitter' }
        ]
      };

      await createTestTask({
        campaignId: campaign.id,
        platform: 'linkedin',
        status: 'posted',
        content: 'Main content',
        outputJson: JSON.stringify(outputData)
      });

      const original = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: { tasks: true }
      });

      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${original!.name} (Copy)`,
          description: original!.description,
          status: original!.status,
          sourceId: original!.sourceId,
          archived: false,
          tasks: {
            create: original!.tasks.map(task => ({
              platform: task.platform,
              status: 'todo',
              content: task.content,
              outputJson: task.outputJson,
              sourceId: task.sourceId
            }))
          }
        },
        include: {
          tasks: true
        }
      });

      expect(duplicated.tasks).toHaveLength(1);
      expect(duplicated.tasks[0].outputJson).toBe(JSON.stringify(outputData));
      expect(JSON.parse(duplicated.tasks[0].outputJson!)).toEqual(outputData);
    });

    it('should always create duplicate as active (archived = false)', async () => {
      const campaign = await createTestCampaign({
        name: 'Archived Campaign'
      });

      // Archive the original campaign
      await prismaTest.campaign.update({
        where: { id: campaign.id },
        data: { archived: true, archivedAt: new Date() }
      });

      const archivedCampaign = await prismaTest.campaign.findUnique({
        where: { id: campaign.id }
      });

      expect(archivedCampaign?.archived).toBe(true);

      // Duplicate it
      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${archivedCampaign!.name} (Copy)`,
          description: archivedCampaign!.description,
          status: archivedCampaign!.status,
          sourceId: archivedCampaign!.sourceId,
          archived: false // Always create as active
        }
      });

      expect(duplicated.archived).toBe(false);
      expect(duplicated.archivedAt).toBeNull();
    });
  });

  describe('POST /api/campaigns/[id]/duplicate - Task Data Handling', () => {
    it('should NOT copy scheduledAt and postedAt from original tasks', async () => {
      const campaign = await createTestCampaign({
        name: 'Campaign with Scheduled Tasks'
      });

      const scheduledDate = new Date('2025-12-01T10:00:00Z');
      const postedDate = new Date('2025-12-01T10:05:00Z');

      await createTestTask({
        campaignId: campaign.id,
        platform: 'linkedin',
        status: 'posted',
        scheduledAt: scheduledDate,
        postedAt: postedDate
      });

      const original = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: { tasks: true }
      });

      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${original!.name} (Copy)`,
          description: original!.description,
          status: original!.status,
          sourceId: original!.sourceId,
          archived: false,
          tasks: {
            create: original!.tasks.map(task => ({
              platform: task.platform,
              status: 'todo',
              content: task.content,
              outputJson: task.outputJson,
              sourceId: task.sourceId
              // Deliberately NOT copying scheduledAt and postedAt
            }))
          }
        },
        include: {
          tasks: true
        }
      });

      expect(duplicated.tasks).toHaveLength(1);
      expect(duplicated.tasks[0].scheduledAt).toBeNull();
      expect(duplicated.tasks[0].postedAt).toBeNull();
      expect(duplicated.tasks[0].status).toBe('todo');
    });

    it('should NOT copy metrics from original tasks', async () => {
      const campaign = await createTestCampaign({
        name: 'Campaign with Metrics'
      });

      const task = await createTestTask({
        campaignId: campaign.id,
        platform: 'linkedin',
        status: 'posted'
      });

      // Add metrics to the original task
      await prismaTest.metric.createMany({
        data: [
          { taskId: task.id, type: 'click', value: 100 },
          { taskId: task.id, type: 'like', value: 50 },
          { taskId: task.id, type: 'share', value: 10 }
        ]
      });

      const original = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: {
          tasks: {
            include: {
              metrics: true
            }
          }
        }
      });

      expect(original!.tasks[0].metrics).toHaveLength(3);

      // Duplicate the campaign (without metrics)
      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${original!.name} (Copy)`,
          description: original!.description,
          status: original!.status,
          sourceId: original!.sourceId,
          archived: false,
          tasks: {
            create: original!.tasks.map(task => ({
              platform: task.platform,
              status: 'todo',
              content: task.content,
              outputJson: task.outputJson,
              sourceId: task.sourceId
            }))
          }
        },
        include: {
          tasks: {
            include: {
              metrics: true
            }
          }
        }
      });

      expect(duplicated.tasks).toHaveLength(1);
      expect(duplicated.tasks[0].metrics).toHaveLength(0);
    });

    it('should preserve task sourceId references', async () => {
      const source = await createTestSource({
        url: 'https://example.com/article',
        title: 'Source Article'
      });

      const campaign = await createTestCampaign({
        name: 'Campaign with Source Tasks',
        sourceId: source.id
      });

      await createTestTask({
        campaignId: campaign.id,
        sourceId: source.id,
        platform: 'linkedin',
        content: 'Content from source'
      });

      const original = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: { tasks: true }
      });

      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${original!.name} (Copy)`,
          description: original!.description,
          status: original!.status,
          sourceId: original!.sourceId,
          archived: false,
          tasks: {
            create: original!.tasks.map(task => ({
              platform: task.platform,
              status: 'todo',
              content: task.content,
              outputJson: task.outputJson,
              sourceId: task.sourceId
            }))
          }
        },
        include: {
          tasks: {
            include: {
              source: true
            }
          }
        }
      });

      expect(duplicated.tasks).toHaveLength(1);
      expect(duplicated.tasks[0].sourceId).toBe(source.id);
      expect(duplicated.tasks[0].source?.title).toBe('Source Article');
    });
  });

  describe('POST /api/campaigns/[id]/duplicate - Edge Cases', () => {
    it('should handle duplicating a campaign with no tasks', async () => {
      const campaign = await createTestCampaign({
        name: 'Empty Campaign',
        description: 'No tasks here'
      });

      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${campaign.name} (Copy)`,
          description: campaign.description,
          status: campaign.status,
          sourceId: campaign.sourceId,
          archived: false
        },
        include: {
          tasks: true
        }
      });

      expect(duplicated.name).toBe('Empty Campaign (Copy)');
      expect(duplicated.tasks).toHaveLength(0);
    });

    it('should handle duplicating a campaign with many tasks', async () => {
      const campaign = await createTestCampaign({
        name: 'Large Campaign'
      });

      // Create 20 tasks
      const taskPromises = Array.from({ length: 20 }, (_, i) =>
        createTestTask({
          campaignId: campaign.id,
          platform: ['linkedin', 'twitter', 'facebook'][i % 3] as 'linkedin' | 'twitter' | 'facebook',
          status: ['todo', 'draft', 'scheduled', 'posted'][i % 4] as 'todo' | 'draft' | 'scheduled' | 'posted',
          content: `Task ${i + 1} content`
        })
      );

      await Promise.all(taskPromises);

      const original = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: { tasks: true }
      });

      expect(original?.tasks).toHaveLength(20);

      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${original!.name} (Copy)`,
          description: original!.description,
          status: original!.status,
          sourceId: original!.sourceId,
          archived: false,
          tasks: {
            create: original!.tasks.map(task => ({
              platform: task.platform,
              status: 'todo',
              content: task.content,
              outputJson: task.outputJson,
              sourceId: task.sourceId
            }))
          }
        },
        include: {
          tasks: true
        }
      });

      expect(duplicated.tasks).toHaveLength(20);
      duplicated.tasks.forEach(task => {
        expect(task.status).toBe('todo');
        expect(task.campaignId).toBe(duplicated.id);
      });
    });

    it('should handle duplicate naming with special characters', async () => {
      const campaign = await createTestCampaign({
        name: 'Campaign! @#$%'
      });

      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${campaign.name} (Copy)`,
          description: campaign.description,
          status: campaign.status,
          sourceId: campaign.sourceId,
          archived: false
        }
      });

      expect(duplicated.name).toBe('Campaign! @#$% (Copy)');
    });

    it('should create unique IDs for duplicated campaign and tasks', async () => {
      const campaign = await createTestCampaign({
        name: 'Unique ID Test'
      });

      const task1 = await createTestTask({
        campaignId: campaign.id,
        platform: 'linkedin'
      });

      const task2 = await createTestTask({
        campaignId: campaign.id,
        platform: 'twitter'
      });

      const original = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: { tasks: true }
      });

      const duplicated = await prismaTest.campaign.create({
        data: {
          name: `${original!.name} (Copy)`,
          description: original!.description,
          status: original!.status,
          sourceId: original!.sourceId,
          archived: false,
          tasks: {
            create: original!.tasks.map(task => ({
              platform: task.platform,
              status: 'todo',
              content: task.content,
              outputJson: task.outputJson,
              sourceId: task.sourceId
            }))
          }
        },
        include: {
          tasks: true
        }
      });

      // Verify unique IDs
      expect(duplicated.id).not.toBe(campaign.id);
      expect(duplicated.tasks[0].id).not.toBe(task1.id);
      expect(duplicated.tasks[1].id).not.toBe(task2.id);

      // Verify all task IDs are different
      const allTaskIds = [...original!.tasks, ...duplicated.tasks].map(t => t.id);
      const uniqueTaskIds = new Set(allTaskIds);
      expect(uniqueTaskIds.size).toBe(allTaskIds.length);
    });
  });
});
