import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Platform-specific content schemas
interface PlatformContent {
  platform: string;
  content: string;
  hashtags?: string[];
  cta?: string;
}

interface GenerateRequest {
  sourceId: string;
  campaignId?: string;
  platforms: string[]; // ['linkedin', 'twitter', 'blog']
  tone?: string; // 'professional', 'casual', 'technical'
  cta?: string; // Call to action
}

// POST generate content from source
export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { sourceId, campaignId, platforms, tone = 'professional', cta } = body;

    // Validate input
    if (!sourceId || !platforms || platforms.length === 0) {
      return NextResponse.json(
        { error: 'sourceId and platforms are required' },
        { status: 400 }
      );
    }

    // Fetch source content
    const source = await prisma.source.findUnique({
      where: { id: sourceId }
    });

    if (!source) {
      return NextResponse.json(
        { error: 'Source not found' },
        { status: 404 }
      );
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Generate content using Claude
    const generatedContent = await generateWithClaude(
      source,
      platforms,
      tone,
      cta
    );

    // Create tasks for each platform
    const tasks = await Promise.all(
      generatedContent.map(async (content) => {
        return prisma.task.create({
          data: {
            campaignId: campaignId || null,
            sourceId: sourceId,
            platform: content.platform,
            status: 'draft',
            content: content.content,
            outputJson: JSON.stringify(content)
          },
          include: {
            campaign: true,
            source: true
          }
        });
      })
    );

    return NextResponse.json({
      tasks,
      message: `Generated ${tasks.length} posts successfully`
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating content:', error);

    // Handle Anthropic API errors specifically
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

/**
 * Generate platform-specific content using Claude
 */
async function generateWithClaude(
  source: { title: string | null; content: string; excerpt: string | null },
  platforms: string[],
  tone: string,
  cta?: string
): Promise<PlatformContent[]> {

  // Build the prompt for Claude
  const prompt = buildGenerationPrompt(source, platforms, tone, cta);

  // Call Claude API
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  // Extract text content from Claude's response
  const responseText = message.content
    .filter(block => block.type === 'text')
    .map(block => 'text' in block ? block.text : '')
    .join('\n');

  // Parse JSON response
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.posts || [];
  } catch (parseError) {
    console.error('Failed to parse Claude response:', responseText);
    throw new Error('Failed to parse generated content');
  }
}

/**
 * Build the generation prompt for Claude
 */
function buildGenerationPrompt(
  source: { title: string | null; content: string; excerpt: string | null },
  platforms: string[],
  tone: string,
  cta?: string
): string {
  const platformSpecs = {
    linkedin: {
      maxLength: 3000,
      style: 'Professional with engaging storytelling. Use line breaks for readability.',
      format: '2-3 short paragraphs with 3-5 relevant hashtags'
    },
    twitter: {
      maxLength: 280,
      style: 'Concise, punchy, and engaging. Hook readers in the first line.',
      format: 'Single impactful message with 1-2 hashtags'
    },
    blog: {
      maxLength: 500,
      style: 'Educational and informative intro paragraph for a blog post.',
      format: 'Opening paragraph that hooks readers and sets expectations'
    }
  };

  const platformInstructions = platforms
    .map(platform => {
      const spec = platformSpecs[platform as keyof typeof platformSpecs];
      return `
**${platform.toUpperCase()}**
- Max length: ${spec.maxLength} characters
- Style: ${spec.style}
- Format: ${spec.format}`;
    })
    .join('\n');

  return `You are a content marketing expert. Generate engaging social media posts from the following source content.

**SOURCE CONTENT:**
Title: ${source.title || 'Untitled'}
Excerpt: ${source.excerpt || 'No excerpt'}
Content: ${source.content.slice(0, 2000)}${source.content.length > 2000 ? '...' : ''}

**TONE:** ${tone}
${cta ? `**CALL TO ACTION:** ${cta}` : ''}

**PLATFORMS TO GENERATE FOR:**
${platformInstructions}

**INSTRUCTIONS:**
1. Read and understand the source content
2. For each platform, create an engaging post that:
   - Captures the key message from the source
   - Matches the platform's style and character limits
   - Uses the specified tone
   - Includes relevant hashtags (where appropriate)
   ${cta ? '- Incorporates the call to action naturally' : ''}
3. Make each post unique and tailored to the platform's audience

**OUTPUT FORMAT (JSON):**
Return ONLY valid JSON in this exact format:
{
  "posts": [
    {
      "platform": "linkedin",
      "content": "Your LinkedIn post here...",
      "hashtags": ["#Marketing", "#ContentStrategy"],
      "cta": "Call to action if applicable"
    },
    {
      "platform": "twitter",
      "content": "Your tweet here...",
      "hashtags": ["#Growth"]
    }
  ]
}

Generate high-quality, engaging posts now:`;
}
