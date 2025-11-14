import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST duplicate a campaign with all its tasks
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the original campaign with all tasks
    const originalCampaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!originalCampaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Create the duplicated campaign
    const duplicatedCampaign = await prisma.campaign.create({
      data: {
        name: `${originalCampaign.name} (Copy)`,
        description: originalCampaign.description,
        status: originalCampaign.status,
        sourceId: originalCampaign.sourceId,
        archived: false, // Always create duplicates as active
        tasks: {
          create: originalCampaign.tasks.map(task => ({
            platform: task.platform,
            status: 'todo', // Reset all tasks to todo status
            content: task.content,
            outputJson: task.outputJson,
            sourceId: task.sourceId,
            // Don't copy scheduled/posted dates or metrics
            // These should be fresh for the new campaign
          }))
        }
      },
      include: {
        tasks: true,
        source: true,
        _count: {
          select: { tasks: true }
        }
      }
    });

    return NextResponse.json(duplicatedCampaign, { status: 201 });
  } catch (error) {
    console.error('Error duplicating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate campaign' },
      { status: 500 }
    );
  }
}
