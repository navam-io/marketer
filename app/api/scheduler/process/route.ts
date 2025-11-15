import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postToLinkedIn } from '@/lib/linkedin';

/**
 * POST /api/scheduler/process
 * Process scheduled tasks that are due to be posted
 *
 * This endpoint is called by the background scheduler service
 * to check for tasks with scheduledAt <= now and status = 'scheduled'
 * and automatically post them to the configured platforms.
 *
 * For LinkedIn tasks, it will actually post to LinkedIn API.
 * For other platforms, it will just mark as posted (mock for now).
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

    // Process each task
    const results = await Promise.all(
      dueTasks.map(async (task) => {
        try {
          let publishedUrl: string | undefined;
          let publishError: string | undefined;

          // Actually post to LinkedIn if platform is 'linkedin'
          if (task.platform?.toLowerCase() === 'linkedin' && task.content) {
            try {
              console.log(`[Scheduler] Posting task ${task.id} to LinkedIn...`);
              const result = await postToLinkedIn(task.content);
              publishedUrl = result.url;
              console.log(`[Scheduler] Successfully posted to LinkedIn: ${publishedUrl}`);
            } catch (error) {
              publishError = error instanceof Error ? error.message : 'Failed to post to LinkedIn';
              console.error(`[Scheduler] LinkedIn posting failed for task ${task.id}:`, publishError);
            }
          } else if (task.platform) {
            // For other platforms (Twitter, etc.), just mark as posted for now
            console.log(`[Scheduler] Platform '${task.platform}' not yet implemented, marking as posted`);
          }

          // Update task status
          const updated = await prisma.task.update({
            where: { id: task.id },
            data: {
              status: publishError ? 'scheduled' : 'posted', // Keep as scheduled if posting failed
              postedAt: publishError ? null : now,
              publishedUrl: publishedUrl || null,
              publishError: publishError || null
            }
          });

          if (publishError) {
            console.error(`[Scheduler] Task ${task.id} posting failed: ${publishError}`);
            return {
              success: false,
              taskId: task.id,
              platform: task.platform,
              error: publishError
            };
          }

          console.log(`[Scheduler] Posted task ${task.id} (${task.platform || 'unknown'})`);

          return {
            success: true,
            taskId: task.id,
            platform: task.platform,
            publishedUrl
          };
        } catch (error) {
          console.error(`[Scheduler] Error processing task ${task.id}:`, error);

          // Try to update task with error
          try {
            await prisma.task.update({
              where: { id: task.id },
              data: {
                publishError: error instanceof Error ? error.message : 'Unknown error'
              }
            });
          } catch (updateError) {
            console.error(`[Scheduler] Failed to update task error:`, updateError);
          }

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
