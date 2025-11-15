/**
 * Manual Posting Workflow Integration Tests
 *
 * Tests the simplified copy-paste workflow where users:
 * 1. Copy post content from task cards
 * 2. Manually paste to social media platforms
 * 3. Add the published post URL back to the task
 *
 * This replaces the automated LinkedIn OAuth posting workflow.
 */

import { prismaTest, cleanDatabase, disconnectDatabase, createTestCampaign, createTestTask } from '@/lib/test-utils';

describe('Manual Posting Workflow', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Task API - publishedUrl field', () => {
    it('should support creating tasks with publishedUrl', async () => {
      const campaign = await createTestCampaign();

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'posted',
          content: 'Test post content',
          publishedUrl: 'https://linkedin.com/posts/test-123'
        }
      });

      expect(task.publishedUrl).toBe('https://linkedin.com/posts/test-123');
    });

    it('should support updating task with publishedUrl', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask({ campaignId: campaign.id });

      const updated = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          publishedUrl: 'https://twitter.com/user/status/123456'
        }
      });

      expect(updated.publishedUrl).toBe('https://twitter.com/user/status/123456');
    });

    it('should support clearing publishedUrl', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask({
        campaignId: campaign.id,
        publishedUrl: 'https://linkedin.com/posts/old-123'
      });

      const updated = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          publishedUrl: null
        }
      });

      expect(updated.publishedUrl).toBeNull();
    });

    it('should allow tasks without publishedUrl (optional field)', async () => {
      const campaign = await createTestCampaign();
      const task = await createTestTask({ campaignId: campaign.id });

      expect(task.publishedUrl).toBeNull();
    });
  });

  describe('Complete manual posting workflow', () => {
    it('should support full workflow: create -> copy -> post -> add URL', async () => {
      const campaign = await createTestCampaign({ name: 'LinkedIn Campaign' });

      // Step 1: Create task with content
      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'draft',
          content: 'Excited to share our new product launch! 🚀 #startup #innovation'
        }
      });

      expect(task.content).toBeDefined();
      expect(task.publishedUrl).toBeNull();

      // Step 2: User copies content (simulated - would be clipboard operation in UI)
      const contentToCopy = task.content;
      expect(contentToCopy).toBe('Excited to share our new product launch! 🚀 #startup #innovation');

      // Step 3: User manually posts to LinkedIn and marks as posted
      const markedPosted = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          status: 'posted',
          postedAt: new Date()
        }
      });

      expect(markedPosted.status).toBe('posted');
      expect(markedPosted.postedAt).toBeDefined();

      // Step 4: User adds the published URL
      const withUrl = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          publishedUrl: 'https://www.linkedin.com/posts/user_activity-123456789'
        }
      });

      expect(withUrl.publishedUrl).toBe('https://www.linkedin.com/posts/user_activity-123456789');
      expect(withUrl.status).toBe('posted');
    });

    it('should support multiple platforms with different URLs', async () => {
      const campaign = await createTestCampaign({ name: 'Multi-Platform Campaign' });

      // LinkedIn post
      const linkedinTask = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'posted',
          content: 'Professional update on LinkedIn',
          publishedUrl: 'https://linkedin.com/posts/test-linkedin'
        }
      });

      // Twitter post
      const twitterTask = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'twitter',
          status: 'posted',
          content: 'Quick update on Twitter',
          publishedUrl: 'https://twitter.com/user/status/123456'
        }
      });

      // Verify both are saved correctly
      expect(linkedinTask.publishedUrl).toContain('linkedin.com');
      expect(twitterTask.publishedUrl).toContain('twitter.com');
    });

    it('should allow posting without adding URL (for tracking purposes)', async () => {
      const campaign = await createTestCampaign();

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'posted',
          content: 'Posted manually, no URL needed',
          postedAt: new Date()
        }
      });

      expect(task.status).toBe('posted');
      expect(task.publishedUrl).toBeNull();
      expect(task.postedAt).toBeDefined();
    });
  });

  describe('Task status transitions', () => {
    it('should support typical workflow: todo -> draft -> posted', async () => {
      const campaign = await createTestCampaign();

      // Create as todo
      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'todo'
        }
      });

      expect(task.status).toBe('todo');

      // Move to draft when adding content
      const draft = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          status: 'draft',
          content: 'Draft content ready to copy'
        }
      });

      expect(draft.status).toBe('draft');
      expect(draft.content).toBeDefined();

      // Move to posted after manual posting
      const posted = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          status: 'posted',
          postedAt: new Date(),
          publishedUrl: 'https://linkedin.com/posts/final'
        }
      });

      expect(posted.status).toBe('posted');
      expect(posted.publishedUrl).toBe('https://linkedin.com/posts/final');
    });

    it('should allow skipping scheduled status (no auto-posting)', async () => {
      const campaign = await createTestCampaign();

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          status: 'draft',
          content: 'Ready to post'
        }
      });

      // Skip 'scheduled' and go directly to 'posted'
      const posted = await prismaTest.task.update({
        where: { id: task.id },
        data: {
          status: 'posted',
          postedAt: new Date()
        }
      });

      expect(posted.status).toBe('posted');
      expect(posted.scheduledAt).toBeNull();
    });
  });

  describe('Metrics tracking with manual posting', () => {
    it('should record metrics for manually posted tasks', async () => {
      const campaign = await createTestCampaign();

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'posted',
          content: 'Post with engagement',
          publishedUrl: 'https://linkedin.com/posts/test',
          postedAt: new Date()
        }
      });

      // Record metrics manually
      await prismaTest.metric.createMany({
        data: [
          { taskId: task.id, type: 'like', value: 25 },
          { taskId: task.id, type: 'share', value: 5 },
          { taskId: task.id, type: 'comment', value: 3 }
        ]
      });

      const metrics = await prismaTest.metric.findMany({
        where: { taskId: task.id }
      });

      expect(metrics).toHaveLength(3);
      expect(metrics.find(m => m.type === 'like')?.value).toBe(25);
    });
  });

  describe('URL validation', () => {
    it('should accept various social media URL formats', async () => {
      const campaign = await createTestCampaign();

      const urls = [
        'https://linkedin.com/posts/user_activity-123',
        'https://www.linkedin.com/feed/update/urn:li:share:123',
        'https://twitter.com/user/status/123456789',
        'https://x.com/user/status/123456789',
        'https://facebook.com/posts/123456',
        'https://instagram.com/p/ABC123/',
        'https://threads.net/@user/post/ABC123'
      ];

      for (const url of urls) {
        const task = await prismaTest.task.create({
          data: {
            campaignId: campaign.id,
            platform: 'various',
            status: 'posted',
            publishedUrl: url
          }
        });

        expect(task.publishedUrl).toBe(url);
      }
    });

    it('should accept custom or shortened URLs', async () => {
      const campaign = await createTestCampaign();

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          status: 'posted',
          publishedUrl: 'https://bit.ly/custom-short-url'
        }
      });

      expect(task.publishedUrl).toBe('https://bit.ly/custom-short-url');
    });
  });

  describe('Campaign export/import with publishedUrl', () => {
    it('should preserve publishedUrl when exporting/importing campaigns', async () => {
      const campaign = await createTestCampaign();

      const originalTask = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: 'linkedin',
          status: 'posted',
          content: 'Original post',
          publishedUrl: 'https://linkedin.com/posts/original',
          postedAt: new Date()
        }
      });

      // Simulate export
      const exported = await prismaTest.task.findUnique({
        where: { id: originalTask.id }
      });

      expect(exported?.publishedUrl).toBe('https://linkedin.com/posts/original');

      // Simulate import (create duplicate)
      const imported = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          platform: exported!.platform,
          status: exported!.status,
          content: exported!.content,
          publishedUrl: exported!.publishedUrl
        }
      });

      expect(imported.publishedUrl).toBe(exported!.publishedUrl);
    });
  });
});
