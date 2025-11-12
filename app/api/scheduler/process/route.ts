import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/scheduler/process
 * Process scheduled tasks that are due to be posted
 *
 * This endpoint is called by the background scheduler service
 * to check for tasks with scheduledAt <= now and status = 'scheduled'
 * and automatically move them to 'posted' status
 */
export async function POST(request: NextRequest) {
  try {
    const now = new Date();

    // Find all tasks that are scheduled and due
    const dueTasks = await prisma.task.findMany({
      where: {
        status: 'scheduled',
        scheduledAt: {
          lte: now
        }
      }
    });

    console.log(`[Scheduler] Found ${dueTasks.length} tasks due for posting`);

    // Update each task to 'posted' status
    const results = await Promise.all(
      dueTasks.map(async (task) => {
        try {
          const updated = await prisma.task.update({
            where: { id: task.id },
            data: {
              status: 'posted',
              postedAt: now
            }
          });

          console.log(`[Scheduler] Posted task ${task.id} (${task.platform || 'unknown'})`);

          return {
            success: true,
            taskId: task.id,
            platform: task.platform
          };
        } catch (error) {
          console.error(`[Scheduler] Error posting task ${task.id}:`, error);
          return {
            success: false,
            taskId: task.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      message: `Processed ${dueTasks.length} scheduled tasks`,
      successCount,
      failureCount,
      results
    }, { status: 200 });

  } catch (error) {
    console.error('[Scheduler] Error processing scheduled tasks:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduled tasks' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/scheduler/process
 * Get information about pending scheduled tasks
 */
export async function GET() {
  try {
    const now = new Date();

    // Count tasks that are scheduled and due
    const dueCount = await prisma.task.count({
      where: {
        status: 'scheduled',
        scheduledAt: {
          lte: now
        }
      }
    });

    // Count tasks that are scheduled for future
    const futureCount = await prisma.task.count({
      where: {
        status: 'scheduled',
        scheduledAt: {
          gt: now
        }
      }
    });

    // Get next scheduled task
    const nextTask = await prisma.task.findFirst({
      where: {
        status: 'scheduled',
        scheduledAt: {
          gt: now
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      },
      select: {
        id: true,
        platform: true,
        scheduledAt: true
      }
    });

    return NextResponse.json({
      dueNow: dueCount,
      scheduledFuture: futureCount,
      nextTask: nextTask ? {
        id: nextTask.id,
        platform: nextTask.platform,
        scheduledAt: nextTask.scheduledAt,
        timeUntil: nextTask.scheduledAt ?
          Math.round((new Date(nextTask.scheduledAt).getTime() - now.getTime()) / 1000) : null
      } : null
    }, { status: 200 });

  } catch (error) {
    console.error('[Scheduler] Error getting scheduler info:', error);
    return NextResponse.json(
      { error: 'Failed to get scheduler information' },
      { status: 500 }
    );
  }
}
