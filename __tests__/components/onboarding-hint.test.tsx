/**
 * Component tests for OnboardingHint
 * Tests rendering, dismissal, and variants
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OnboardingHint } from '@/components/onboarding-hint';
import { resetAllHints } from '@/lib/onboarding';

// Mock localStorage
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

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('OnboardingHint Component', () => {
  beforeEach(() => {
    localStorageMock.clear();
    resetAllHints();
  });

  describe('Rendering', () => {
    it('should render with default variant', async () => {
      render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Test Title')).toBeInTheDocument();
      });
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render with compact variant', async () => {
      render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
          variant="compact"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Test description')).toBeInTheDocument();
      });
      // Compact variant should not show title
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    });

    it('should render lightbulb icon', async () => {
      const { container } = render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
        />
      );

      await waitFor(() => {
        const lightbulbIcon = container.querySelector('svg');
        expect(lightbulbIcon).toBeInTheDocument();
      });
    });

    it('should render dismiss button', async () => {
      render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
        />
      );

      await waitFor(() => {
        const dismissButton = screen.getByLabelText('Dismiss hint');
        expect(dismissButton).toBeInTheDocument();
      });
    });

    it('should apply custom className', async () => {
      const { container } = render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
          className="custom-class"
        />
      );

      await waitFor(() => {
        const hint = container.firstChild as HTMLElement;
        expect(hint.classList.contains('custom-class')).toBe(true);
      });
    });
  });

  describe('Dismissal', () => {
    it('should hide hint when dismiss button is clicked', async () => {
      render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Test Title')).toBeInTheDocument();
      });

      const dismissButton = screen.getByLabelText('Dismiss hint');
      fireEvent.click(dismissButton);

      await waitFor(() => {
        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
      });
    });

    it('should persist dismissal to localStorage', async () => {
      render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Test Title')).toBeInTheDocument();
      });

      const dismissButton = screen.getByLabelText('Dismiss hint');
      fireEvent.click(dismissButton);

      await waitFor(() => {
        const stored = localStorageMock.getItem('navam-marketer-hints-dismissed');
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed).toContain('sources-generate');
      });
    });

    it('should not show hint if already dismissed', async () => {
      // Pre-dismiss the hint
      localStorageMock.setItem(
        'navam-marketer-hints-dismissed',
        JSON.stringify(['sources-generate'])
      );

      const { container } = render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
        />
      );

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Multiple Hints', () => {
    it('should handle multiple hints independently', async () => {
      const { rerender } = render(
        <div>
          <OnboardingHint
            id="sources-generate"
            title="Sources Hint"
            description="Sources description"
          />
          <OnboardingHint
            id="campaigns-select"
            title="Campaigns Hint"
            description="Campaigns description"
          />
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText('Sources Hint')).toBeInTheDocument();
        expect(screen.getByText('Campaigns Hint')).toBeInTheDocument();
      });

      // Dismiss first hint
      const dismissButtons = screen.getAllByLabelText('Dismiss hint');
      fireEvent.click(dismissButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText('Sources Hint')).not.toBeInTheDocument();
        expect(screen.getByText('Campaigns Hint')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible dismiss button', async () => {
      render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
        />
      );

      await waitFor(() => {
        const dismissButton = screen.getByLabelText('Dismiss hint');
        expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss hint');
      });
    });

    it('should support keyboard navigation', async () => {
      render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description="Test description"
        />
      );

      await waitFor(() => {
        const dismissButton = screen.getByLabelText('Dismiss hint');
        dismissButton.focus();
        expect(dismissButton).toHaveFocus();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title gracefully', async () => {
      render(
        <OnboardingHint
          id="sources-generate"
          title=""
          description="Test description"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Test description')).toBeInTheDocument();
      });
    });

    it('should handle empty description gracefully', async () => {
      render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description=""
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Test Title')).toBeInTheDocument();
      });
    });

    it('should handle very long text', async () => {
      const longDescription = 'A'.repeat(500);
      render(
        <OnboardingHint
          id="sources-generate"
          title="Test Title"
          description={longDescription}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(longDescription)).toBeInTheDocument();
      });
    });
  });
});
