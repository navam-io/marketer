import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ImportData {
  version: string;
  exportedAt: string;
  campaign: {
    name: string;
    description?: string | null;
    status: string;
    source?: {
      url?: string | null;
      title?: string | null;
      content: string;
      excerpt?: string | null;
    } | null;
    tasks: Array<{
      platform?: string | null;
      status: string;
      content?: string | null;
      outputJson?: string | null;
      scheduledAt?: string | null;
      postedAt?: string | null;
      createdAt: string;
      metrics: Array<{
        type: string;
        value: number;
        createdAt: string;
      }>;
    }>;
  };
}

// POST import campaign from JSON
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ImportData;

    // Validation
    if (!body.version || !body.campaign) {
      return NextResponse.json(
        { error: 'Invalid import file format' },
        { status: 400 }
      );
    }

    if (body.version !== '1.0.0') {
      return NextResponse.json(
        { error: `Unsupported import version: ${body.version}` },
        { status: 400 }
      );
    }

    if (!body.campaign.name) {
      return NextResponse.json(
        { error: 'Campaign name is required' },
        { status: 400 }
      );
    }

    // Check for duplicate campaign name
    const existingCampaign = await prisma.campaign.findFirst({
      where: { name: body.campaign.name }
    });

    if (existingCampaign) {
      return NextResponse.json(
        { error: `Campaign with name "${body.campaign.name}" already exists. Please rename the campaign in the import file or delete the existing campaign.` },
        { status: 409 }
      );
    }

    // Create source if included in export
    let sourceId: string | null = null;
    if (body.campaign.source) {
      const source = await prisma.source.create({
        data: {
          url: body.campaign.source.url,
          title: body.campaign.source.title,
          content: body.campaign.source.content,
          excerpt: body.campaign.source.excerpt
        }
      });
      sourceId = source.id;
    }

    // Create campaign with tasks and metrics in a transaction
    const campaign = await prisma.campaign.create({
      data: {
        name: body.campaign.name,
        description: body.campaign.description,
        status: body.campaign.status,
        sourceId,
        tasks: {
          create: body.campaign.tasks.map(task => ({
            platform: task.platform,
            status: task.status,
            content: task.content,
            outputJson: task.outputJson,
            scheduledAt: task.scheduledAt ? new Date(task.scheduledAt) : null,
            postedAt: task.postedAt ? new Date(task.postedAt) : null,
            sourceId,
            metrics: {
              create: task.metrics.map(metric => ({
                type: metric.type,
                value: metric.value,
                createdAt: new Date(metric.createdAt)
              }))
            }
          }))
        }
      },
      include: {
        tasks: {
          include: {
            metrics: true
          }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      campaign,
      message: `Campaign "${campaign.name}" imported successfully with ${campaign._count.tasks} tasks`
    });
  } catch (error) {
    console.error('Error importing campaign:', error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Campaign with this name already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to import campaign' },
      { status: 500 }
    );
  }
}
