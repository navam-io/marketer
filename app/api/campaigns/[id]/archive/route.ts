import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/campaigns/[id]/archive
 * Archive or unarchive a campaign
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { archived } = body;

    if (typeof archived !== 'boolean') {
      return NextResponse.json(
        { error: 'archived field must be a boolean' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        archived,
        archivedAt: archived ? new Date() : null
      },
      include: {
        source: {
          select: {
            id: true,
            title: true,
            url: true
          }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });

    return NextResponse.json({ campaign }, { status: 200 });
  } catch (error) {
    console.error('Error archiving campaign:', error);
    return NextResponse.json(
      { error: 'Failed to archive campaign' },
      { status: 500 }
    );
  }
}
