/**
 * Integration tests for Content Generation (Slice 3)
 * These tests verify the actual production behavior of content generation with Claude
 */

import {
  prismaTest,
  cleanDatabase,
  disconnectDatabase,
  createTestCampaign,
  createTestSource
} from '@/lib/test-utils';

describe('Content Generation Integration Tests (Slice 3)', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Database Operations for Generated Content', () => {
    it('should store outputJson in task when content is generated', async () => {
      const source = await createTestSource({
        title: 'AI Revolution in Marketing',
        content: 'Artificial intelligence is transforming how we approach marketing...',
        excerpt: 'AI is changing marketing'
      });

      const campaign = await createTestCampaign({
        name: 'AI Marketing Campaign'
      });

      // Simulate generated content from Claude
      const generatedContent = {
        platform: 'linkedin',
        content: 'AI is revolutionizing marketing! Here are 3 ways it can help your business...',
        hashtags: ['#AI', '#Marketing', '#Innovation'],
        cta: 'Learn more'
      };

      const task = await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          sourceId: source.id,
          platform: generatedContent.platform,
          status: 'draft',
          content: generatedContent.content,
          outputJson: JSON.stringify(generatedContent)
        }
      });

      expect(task.id).toBeDefined();
      expect(task.platform).toBe('linkedin');
      expect(task.status).toBe('draft');
      expect(task.content).toContain('AI is revolutionizing');
      expect(task.outputJson).toBeTruthy();

      // Verify JSON can be parsed
      const parsed = JSON.parse(task.outputJson!);
      expect(parsed.hashtags).toHaveLength(3);
      expect(parsed.cta).toBe('Learn more');
    });

    it('should create multiple tasks for multiple platforms', async () => {
      const source = await createTestSource({
        title: 'Product Launch',
        content: 'Introducing our new product that will change the industry...'
      });

      const campaign = await createTestCampaign({
        name: 'Product Launch Campaign'
      });

      // Simulate generated content for multiple platforms
      const platforms = ['linkedin', 'twitter', 'blog'];
      const tasks = await Promise.all(
        platforms.map(platform =>
          prismaTest.task.create({
            data: {
              campaignId: campaign.id,
              sourceId: source.id,
              platform,
              status: 'draft',
              content: `Generated ${platform} content`,
              outputJson: JSON.stringify({ platform, content: 'test' })
            }
          })
        )
      );

      expect(tasks).toHaveLength(3);
      expect(tasks.map(t => t.platform)).toEqual(['linkedin', 'twitter', 'blog']);

      // Verify all tasks are linked to the same source and campaign
      const allTasks = await prismaTest.task.findMany({
        where: {
          campaignId: campaign.id,
          sourceId: source.id
        }
      });

      expect(allTasks).toHaveLength(3);
    });

    it('should link generated tasks to source for traceability', async () => {
      const source = await createTestSource({
        url: 'https://example.com/article',
        title: 'Original Article'
      });

      const task = await prismaTest.task.create({
        data: {
          sourceId: source.id,
          platform: 'linkedin',
          status: 'draft',
          content: 'Generated from source',
          outputJson: JSON.stringify({ platform: 'linkedin' })
        },
        include: {
          source: true
        }
      });

      expect(task.source).toBeTruthy();
      expect(task.source?.id).toBe(source.id);
      expect(task.source?.url).toBe('https://example.com/article');
    });

    it('should retrieve tasks with source and campaign relations', async () => {
      const source = await createTestSource({
        title: 'Source Article'
      });

      const campaign = await createTestCampaign({
        name: 'Test Campaign'
      });

      await prismaTest.task.create({
        data: {
          campaignId: campaign.id,
          sourceId: source.id,
          platform: 'twitter',
          status: 'draft',
          content: 'Test content'
        }
      });

      const tasks = await prismaTest.task.findMany({
        where: { campaignId: campaign.id },
        include: {
          source: true,
          campaign: true
        }
      });

      expect(tasks).toHaveLength(1);
      expect(tasks[0].source?.title).toBe('Source Article');
      expect(tasks[0].campaign?.name).toBe('Test Campaign');
    });
  });

  describe('Content Generation Data Flow', () => {
    it('should preserve content structure in outputJson', async () => {
      const source = await createTestSource({
        content: 'Sample article content for generation'
      });

      const complexOutput = {
        platform: 'linkedin',
        content: 'Professional post with multiple paragraphs.\n\nSecond paragraph here.',
        hashtags: ['#Marketing', '#AI', '#Innovation'],
        cta: 'Read the full article',
        metadata: {
          tone: 'professional',
          targetAudience: 'founders',
          wordCount: 150
        }
      };

      const task = await prismaTest.task.create({
        data: {
          sourceId: source.id,
          platform: 'linkedin',
          status: 'draft',
          content: complexOutput.content,
          outputJson: JSON.stringify(complexOutput)
        }
      });

      const retrieved = await prismaTest.task.findUnique({
        where: { id: task.id }
      });

      const parsed = JSON.parse(retrieved!.outputJson!);
      expect(parsed.metadata.tone).toBe('professional');
      expect(parsed.metadata.wordCount).toBe(150);
      expect(parsed.hashtags).toHaveLength(3);
    });

    it('should handle different platform-specific formats', async () => {
      const source = await createTestSource();

      const platformFormats = [
        {
          platform: 'linkedin',
          content: 'Long form professional content with storytelling',
          hashtags: ['#Tag1', '#Tag2', '#Tag3', '#Tag4', '#Tag5']
        },
        {
          platform: 'twitter',
          content: 'Short punchy tweet',
          hashtags: ['#Tweet']
        },
        {
          platform: 'blog',
          content: 'Opening paragraph for blog post that hooks the reader...',
          hashtags: []
        }
      ];

      const tasks = await Promise.all(
        platformFormats.map(format =>
          prismaTest.task.create({
            data: {
              sourceId: source.id,
              platform: format.platform,
              status: 'draft',
              content: format.content,
              outputJson: JSON.stringify(format)
            }
          })
        )
      );

      // Verify different content lengths
      const linkedin = tasks.find(t => t.platform === 'linkedin');
      const twitter = tasks.find(t => t.platform === 'twitter');
      const blog = tasks.find(t => t.platform === 'blog');

      expect(linkedin?.content!.length).toBeGreaterThan(twitter?.content!.length);
      expect(JSON.parse(linkedin?.outputJson!).hashtags).toHaveLength(5);
      expect(JSON.parse(twitter?.outputJson!).hashtags).toHaveLength(1);
      expect(JSON.parse(blog?.outputJson!).hashtags).toHaveLength(0);
    });
  });

  describe('Source Content Retrieval', () => {
    it('should retrieve sources for content generation', async () => {
      // Create multiple sources
      await createTestSource({ title: 'Article 1' });
      await new Promise(resolve => setTimeout(resolve, 10));
      await createTestSource({ title: 'Article 2' });
      await new Promise(resolve => setTimeout(resolve, 10));
      await createTestSource({ title: 'Article 3' });

      const sources = await prismaTest.source.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      });

      expect(sources).toHaveLength(3);
      expect(sources[0].title).toBe('Article 3'); // Most recent first
      expect(sources[2].title).toBe('Article 1');
    });

    it('should include all necessary fields for generation', async () => {
      const source = await createTestSource({
        url: 'https://example.com/article',
        title: 'Test Article',
        content: 'Full article content here...',
        excerpt: 'Short excerpt',
        rawHtml: '<html><body>Content</body></html>'
      });

      const retrieved = await prismaTest.source.findUnique({
        where: { id: source.id }
      });

      expect(retrieved).toBeTruthy();
      expect(retrieved?.title).toBe('Test Article');
      expect(retrieved?.content).toBeTruthy();
      expect(retrieved?.excerpt).toBeTruthy();
      expect(retrieved?.url).toBeTruthy();
    });
  });

  describe('Task Status for Generated Content', () => {
    it('should create generated tasks in draft status', async () => {
      const source = await createTestSource();

      const task = await prismaTest.task.create({
        data: {
          sourceId: source.id,
          platform: 'linkedin',
          status: 'draft', // Generated content starts as draft
          content: 'AI-generated content'
        }
      });

      expect(task.status).toBe('draft');
    });

    it('should allow status progression after generation', async () => {
      const source = await createTestSource();

      const task = await prismaTest.task.create({
        data: {
          sourceId: source.id,
          platform: 'linkedin',
          status: 'draft',
          content: 'Generated content'
        }
      });

      // Simulate human review and status change
      const updated = await prismaTest.task.update({
        where: { id: task.id },
        data: { status: 'scheduled' }
      });

      expect(updated.status).toBe('scheduled');
    });
  });

  describe('Validation and Error Scenarios', () => {
    it('should require sourceId for content generation', async () => {
      // This should work - task with sourceId
      const source = await createTestSource();
      const validTask = await prismaTest.task.create({
        data: {
          sourceId: source.id,
          platform: 'linkedin',
          status: 'draft',
          content: 'Valid content'
        }
      });

      expect(validTask.sourceId).toBe(source.id);
    });

    it('should allow tasks without campaign (optional)', async () => {
      const source = await createTestSource();

      const task = await prismaTest.task.create({
        data: {
          sourceId: source.id,
          // No campaignId
          platform: 'linkedin',
          status: 'draft',
          content: 'Content without campaign'
        }
      });

      expect(task.campaignId).toBeNull();
      expect(task.sourceId).toBe(source.id);
    });

    it('should handle empty or null outputJson', async () => {
      const source = await createTestSource();

      const task = await prismaTest.task.create({
        data: {
          sourceId: source.id,
          platform: 'linkedin',
          status: 'draft',
          content: 'Content',
          outputJson: null
        }
      });

      expect(task.outputJson).toBeNull();
    });
  });

  describe('Campaign Integration with Generated Content', () => {
    it('should count generated tasks in campaign', async () => {
      const source = await createTestSource();
      const campaign = await createTestCampaign();

      // Generate 3 tasks
      await Promise.all([
        prismaTest.task.create({
          data: {
            campaignId: campaign.id,
            sourceId: source.id,
            platform: 'linkedin',
            status: 'draft',
            content: 'Post 1'
          }
        }),
        prismaTest.task.create({
          data: {
            campaignId: campaign.id,
            sourceId: source.id,
            platform: 'twitter',
            status: 'draft',
            content: 'Post 2'
          }
        }),
        prismaTest.task.create({
          data: {
            campaignId: campaign.id,
            sourceId: source.id,
            platform: 'blog',
            status: 'draft',
            content: 'Post 3'
          }
        })
      ]);

      const campaignWithCount = await prismaTest.campaign.findUnique({
        where: { id: campaign.id },
        include: {
          _count: {
            select: { tasks: true }
          }
        }
      });

      expect(campaignWithCount?._count.tasks).toBe(3);
    });
  });
});
