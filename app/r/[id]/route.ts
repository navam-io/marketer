import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Redirect tracker route
 *
 * Usage: /r/{taskId}?url={destination}
 *
 * This route:
 * 1. Records a click metric for the task
 * 2. Redirects user to the destination URL
 *
 * This allows tracking link clicks in social posts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Verify task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Record click metric
    await prisma.metric.create({
      data: {
        taskId,
        type: 'click',
        value: 1
      }
    });

    console.log(`[Tracker] Recorded click for task ${taskId}, redirecting to ${url}`);

    // Redirect to destination
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Error tracking click:', error);

    // Still redirect even if tracking fails
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (url) {
      return NextResponse.redirect(url);
    }

    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    );
  }
}
