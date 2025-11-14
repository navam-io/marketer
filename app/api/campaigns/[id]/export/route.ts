import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET export campaign with all related data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            metrics: {
              orderBy: {
                createdAt: 'asc'
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        source: true
      }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Format the export data
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      campaign: {
        name: campaign.name,
        description: campaign.description,
        status: campaign.status,
        source: campaign.source ? {
          url: campaign.source.url,
          title: campaign.source.title,
          content: campaign.source.content,
          excerpt: campaign.source.excerpt
        } : null,
        tasks: campaign.tasks.map(task => ({
          platform: task.platform,
          status: task.status,
          content: task.content,
          outputJson: task.outputJson,
          scheduledAt: task.scheduledAt,
          postedAt: task.postedAt,
          createdAt: task.createdAt,
          metrics: task.metrics.map(metric => ({
            type: metric.type,
            value: metric.value,
            createdAt: metric.createdAt
          }))
        }))
      }
    };

    // Return as downloadable JSON file
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="campaign-${campaign.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json"`
      }
    });
  } catch (error) {
    console.error('Error exporting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to export campaign' },
      { status: 500 }
    );
  }
}
