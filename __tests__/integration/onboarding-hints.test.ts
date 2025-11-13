/**
 * Integration tests for Onboarding Hints feature
 * Tests localStorage persistence and hint dismissal logic
 */

import { isHintDismissed, dismissHint, resetAllHints, getDismissedHints, HintId } from '@/lib/onboarding';

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Set up global localStorage mock
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Onboarding Hints - localStorage Persistence', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
  });

  describe('isHintDismissed', () => {
    it('should return false for new hints', () => {
      expect(isHintDismissed('sources-generate')).toBe(false);
    });

    it('should return true for dismissed hints', () => {
      dismissHint('sources-generate');
      expect(isHintDismissed('sources-generate')).toBe(true);
    });

    it('should handle multiple hints independently', () => {
      dismissHint('sources-generate');
      dismissHint('campaigns-select');

      expect(isHintDismissed('sources-generate')).toBe(true);
      expect(isHintDismissed('campaigns-select')).toBe(true);
      expect(isHintDismissed('kanban-drag-drop')).toBe(false);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorageMock.setItem('navam-marketer-hints-dismissed', 'invalid-json');
      expect(isHintDismissed('sources-generate')).toBe(false);
    });

    it('should handle empty localStorage', () => {
      expect(isHintDismissed('sources-generate')).toBe(false);
    });
  });

  describe('dismissHint', () => {
    it('should persist hint dismissal to localStorage', () => {
      dismissHint('sources-generate');

      const stored = localStorageMock.getItem('navam-marketer-hints-dismissed');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed).toContain('sources-generate');
    });

    it('should not duplicate dismissals', () => {
      dismissHint('sources-generate');
      dismissHint('sources-generate');
      dismissHint('sources-generate');

      const dismissed = getDismissedHints();
      expect(dismissed.filter(id => id === 'sources-generate').length).toBe(1);
    });

    it('should accumulate multiple dismissals', () => {
      dismissHint('sources-generate');
      dismissHint('campaigns-select');
      dismissHint('kanban-drag-drop');

      const dismissed = getDismissedHints();
      expect(dismissed).toHaveLength(3);
      expect(dismissed).toContain('sources-generate');
      expect(dismissed).toContain('campaigns-select');
      expect(dismissed).toContain('kanban-drag-drop');
    });

    it('should handle corrupted localStorage on dismiss', () => {
      localStorageMock.setItem('navam-marketer-hints-dismissed', 'invalid-json');

      // Should not throw, just handle gracefully
      expect(() => dismissHint('sources-generate')).not.toThrow();
    });
  });

  describe('resetAllHints', () => {
    it('should clear all dismissed hints', () => {
      dismissHint('sources-generate');
      dismissHint('campaigns-select');
      dismissHint('kanban-drag-drop');

      expect(getDismissedHints()).toHaveLength(3);

      resetAllHints();

      expect(getDismissedHints()).toHaveLength(0);
      expect(isHintDismissed('sources-generate')).toBe(false);
      expect(isHintDismissed('campaigns-select')).toBe(false);
      expect(isHintDismissed('kanban-drag-drop')).toBe(false);
    });

    it('should handle empty state gracefully', () => {
      expect(() => resetAllHints()).not.toThrow();
      expect(getDismissedHints()).toHaveLength(0);
    });
  });

  describe('getDismissedHints', () => {
    it('should return empty array when no hints dismissed', () => {
      expect(getDismissedHints()).toEqual([]);
    });

    it('should return all dismissed hints', () => {
      dismissHint('sources-generate');
      dismissHint('campaigns-select');

      const dismissed = getDismissedHints();
      expect(dismissed).toHaveLength(2);
      expect(dismissed).toContain('sources-generate');
      expect(dismissed).toContain('campaigns-select');
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorageMock.setItem('navam-marketer-hints-dismissed', 'invalid-json');
      expect(getDismissedHints()).toEqual([]);
    });
  });

  describe('All Hint IDs', () => {
    it('should support all defined hint IDs', () => {
      const allHintIds: HintId[] = [
        'sources-add-first',
        'sources-generate',
        'campaigns-select',
        'campaigns-generate',
        'campaigns-new-task',
        'kanban-drag-drop',
        'dashboard-metrics'
      ];

      allHintIds.forEach(hintId => {
        expect(isHintDismissed(hintId)).toBe(false);
        dismissHint(hintId);
        expect(isHintDismissed(hintId)).toBe(true);
      });

      const dismissed = getDismissedHints();
      expect(dismissed).toHaveLength(allHintIds.length);
    });
  });

  describe('Persistence across sessions', () => {
    it('should persist dismissals across page reloads (simulated)', () => {
      // Session 1: Dismiss hints
      dismissHint('sources-generate');
      dismissHint('campaigns-select');

      // Simulate page reload by getting fresh state from localStorage
      const persistedData = localStorageMock.getItem('navam-marketer-hints-dismissed');
      expect(persistedData).toBeTruthy();

      // Session 2: Check if still dismissed
      expect(isHintDismissed('sources-generate')).toBe(true);
      expect(isHintDismissed('campaigns-select')).toBe(true);
      expect(isHintDismissed('kanban-drag-drop')).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should handle localStorage quota exceeded', () => {
      // Mock setItem to throw quota exceeded error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = () => {
        throw new Error('QuotaExceededError');
      };

      // Should not throw, just log error
      expect(() => dismissHint('sources-generate')).not.toThrow();

      // Restore original
      localStorageMock.setItem = originalSetItem;
    });

    it('should handle localStorage read errors', () => {
      // Mock getItem to throw
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = () => {
        throw new Error('Storage access denied');
      };

      // Should not throw, return default values
      expect(() => isHintDismissed('sources-generate')).not.toThrow();
      expect(isHintDismissed('sources-generate')).toBe(false);

      // Restore original
      localStorageMock.getItem = originalGetItem;
    });
  });
});

describe('Onboarding Hints - User Workflows', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should support typical first-time user journey', () => {
    // User sees sources hint, dismisses it
    expect(isHintDismissed('sources-generate')).toBe(false);
    dismissHint('sources-generate');

    // User navigates to campaigns, sees select hint
    expect(isHintDismissed('campaigns-select')).toBe(false);
    dismissHint('campaigns-select');

    // User creates tasks, sees drag-drop hint
    expect(isHintDismissed('kanban-drag-drop')).toBe(false);
    dismissHint('kanban-drag-drop');

    // User checks overview, sees metrics hint
    expect(isHintDismissed('dashboard-metrics')).toBe(false);
    dismissHint('dashboard-metrics');

    // All hints should be dismissed
    const dismissed = getDismissedHints();
    expect(dismissed).toHaveLength(4);
    expect(dismissed).toContain('sources-generate');
    expect(dismissed).toContain('campaigns-select');
    expect(dismissed).toContain('kanban-drag-drop');
    expect(dismissed).toContain('dashboard-metrics');
  });

  it('should support user resetting hints to see them again', () => {
    // Dismiss several hints
    dismissHint('sources-generate');
    dismissHint('campaigns-select');
    dismissHint('kanban-drag-drop');

    expect(getDismissedHints()).toHaveLength(3);

    // User clicks "Reset Hints" button (future feature)
    resetAllHints();

    // All hints should be visible again
    expect(isHintDismissed('sources-generate')).toBe(false);
    expect(isHintDismissed('campaigns-select')).toBe(false);
    expect(isHintDismissed('kanban-drag-drop')).toBe(false);
    expect(getDismissedHints()).toHaveLength(0);
  });

  it('should support partial hint dismissal', () => {
    // User dismisses some but not all hints
    dismissHint('sources-generate');
    dismissHint('kanban-drag-drop');

    expect(isHintDismissed('sources-generate')).toBe(true);
    expect(isHintDismissed('campaigns-select')).toBe(false);
    expect(isHintDismissed('kanban-drag-drop')).toBe(true);
    expect(isHintDismissed('dashboard-metrics')).toBe(false);

    const dismissed = getDismissedHints();
    expect(dismissed).toHaveLength(2);
  });
});
