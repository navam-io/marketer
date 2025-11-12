/**
 * Background Scheduler Service
 *
 * Simple in-process scheduler that checks for due tasks every minute
 * and calls the process API to move them to 'posted' status.
 *
 * For production, consider using a more robust solution like:
 * - Vercel Cron Jobs
 * - AWS EventBridge
 * - Bull/BullMQ with Redis
 * - node-cron with better error handling
 */

let schedulerInterval: NodeJS.Timeout | null = null;
let isRunning = false;

const CHECK_INTERVAL = 60 * 1000; // Check every minute

/**
 * Start the background scheduler
 */
export function startScheduler() {
  if (isRunning) {
    console.log('[Scheduler] Already running');
    return;
  }

  console.log('[Scheduler] Starting background scheduler');
  isRunning = true;

  // Run immediately on start
  processScheduledTasks();

  // Then run every minute
  schedulerInterval = setInterval(() => {
    processScheduledTasks();
  }, CHECK_INTERVAL);
}

/**
 * Stop the background scheduler
 */
export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    isRunning = false;
    console.log('[Scheduler] Stopped');
  }
}

/**
 * Check if scheduler is running
 */
export function isSchedulerRunning() {
  return isRunning;
}

/**
 * Process scheduled tasks by calling the API route
 */
async function processScheduledTasks() {
  try {
    // In development, use localhost
    // In production, use the actual domain or internal API call
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/scheduler/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[Scheduler] API call failed:', response.status, response.statusText);
      return;
    }

    const result = await response.json();

    if (result.successCount > 0) {
      console.log(`[Scheduler] Successfully posted ${result.successCount} task(s)`);
    }

    if (result.failureCount > 0) {
      console.error(`[Scheduler] Failed to post ${result.failureCount} task(s)`);
    }

  } catch (error) {
    console.error('[Scheduler] Error calling process API:', error);
  }
}

// Auto-start scheduler in development mode
// In production, this should be triggered by a cron job or serverless function
if (process.env.NODE_ENV === 'development') {
  // Only start in development if not already started
  if (typeof window === 'undefined' && !isRunning) {
    // Run after a short delay to avoid conflicts during hot reload
    setTimeout(() => {
      startScheduler();
    }, 5000);
  }
}
