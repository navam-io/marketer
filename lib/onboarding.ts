/**
 * Onboarding hints tracking and persistence
 * Manages dismissal state using localStorage
 */

export type HintId =
  | 'sources-add-first'
  | 'sources-generate'
  | 'campaigns-select'
  | 'campaigns-generate'
  | 'campaigns-new-task'
  | 'kanban-drag-drop'
  | 'dashboard-metrics';

const STORAGE_KEY = 'navam-marketer-hints-dismissed';

/**
 * Check if a hint has been dismissed
 */
export function isHintDismissed(hintId: HintId): boolean {
  if (typeof window === 'undefined') return true; // SSR

  try {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) return false;

    const dismissedHints: HintId[] = JSON.parse(dismissed);
    return dismissedHints.includes(hintId);
  } catch (error) {
    console.error('Error reading hint dismissal state:', error);
    return false;
  }
}

/**
 * Dismiss a hint (persist to localStorage)
 */
export function dismissHint(hintId: HintId): void {
  if (typeof window === 'undefined') return; // SSR

  try {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    const dismissedHints: HintId[] = dismissed ? JSON.parse(dismissed) : [];

    if (!dismissedHints.includes(hintId)) {
      dismissedHints.push(hintId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissedHints));
    }
  } catch (error) {
    console.error('Error saving hint dismissal state:', error);
  }
}

/**
 * Reset all hints (for testing or user preference)
 */
export function resetAllHints(): void {
  if (typeof window === 'undefined') return; // SSR

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting hints:', error);
  }
}

/**
 * Get all dismissed hint IDs
 */
export function getDismissedHints(): HintId[] {
  if (typeof window === 'undefined') return [];

  try {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    return dismissed ? JSON.parse(dismissed) : [];
  } catch (error) {
    console.error('Error reading dismissed hints:', error);
    return [];
  }
}
