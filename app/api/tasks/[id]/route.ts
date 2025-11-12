import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        campaign: true,
        source: true,
        metrics: true
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      campaignId,
      sourceId,
      platform,
      status,
      content,
      outputJson,
      scheduledAt,
      postedAt
    } = body;

    const updateData: any = {};

    if (campaignId !== undefined) updateData.campaignId = campaignId;
    if (sourceId !== undefined) updateData.sourceId = sourceId;
    if (platform !== undefined) updateData.platform = platform;
    if (status !== undefined) updateData.status = status;
    if (content !== undefined) updateData.content = content;
    if (outputJson !== undefined) updateData.outputJson = outputJson;
    if (scheduledAt !== undefined) {
      updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    }
    if (postedAt !== undefined) {
      updateData.postedAt = postedAt ? new Date(postedAt) : null;
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        campaign: true,
        source: true
      }
    });

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
