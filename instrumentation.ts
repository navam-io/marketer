/**
 * Next.js Instrumentation
 *
 * This file is automatically loaded by Next.js on server start
 * Perfect for initializing background services like our scheduler
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startScheduler } = await import('./lib/scheduler');

    // Start the background scheduler
    startScheduler();

    console.log('[Instrumentation] Background scheduler initialized');
  }
}
