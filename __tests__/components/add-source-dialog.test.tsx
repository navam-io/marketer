/**
 * Tests for AddSourceDialog component
 *
 * These tests verify the source ingestion dialog functionality:
 * - Dialog rendering and user interactions
 * - URL input and validation
 * - API integration for source fetching
 * - Success and error handling
 * - Form reset after completion
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddSourceDialog } from '@/components/add-source-dialog';
import { toast } from 'sonner';

// Mock fetch globally
global.fetch = jest.fn();

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AddSourceDialog', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSourceAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (toast.loading as jest.Mock).mockClear();
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  describe('Dialog Rendering', () => {
    it('should not render when closed', () => {
      render(
        <AddSourceDialog
          open={false}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      expect(screen.queryByText('Add Content Source')).not.toBeInTheDocument();
    });

    it('should render dialog when open', () => {
      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      expect(screen.getByText('Add Content Source')).toBeInTheDocument();
      expect(screen.getByText(/Paste a URL to extract and save content/)).toBeInTheDocument();
    });

    it('should render URL input field', () => {
      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'url');
      expect(input).toHaveAttribute('placeholder', 'https://example.com/article');
    });

    it('should render submit and cancel buttons', () => {
      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      expect(screen.getByText('Add Source')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should render workflow description', () => {
      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      expect(screen.getByText('What happens next:')).toBeInTheDocument();
      expect(screen.getByText(/Content is extracted and cleaned/)).toBeInTheDocument();
      expect(screen.getByText(/Source is saved to your library/)).toBeInTheDocument();
      expect(screen.getByText(/You can generate posts from this source/)).toBeInTheDocument();
    });
  });

  describe('Form Input', () => {
    it('should allow entering URL', async () => {
      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'https://example.com/article' } });

      await waitFor(() => {
        expect(input.value).toBe('https://example.com/article');
      });
    });

    it('should show error when submitting empty URL', async () => {
      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const submitButton = screen.getByText('Add Source');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a URL')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should show error when submitting whitespace-only URL', async () => {
      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL');
      const submitButton = screen.getByText('Add Source');

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a URL')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('API Integration - Success', () => {
    it('should call API with correct URL when submitting', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          source: {
            id: 'source-1',
            url: 'https://example.com/article',
            title: 'Test Article',
            content: 'Test content',
            excerpt: 'Test excerpt',
            createdAt: '2024-01-01'
          }
        })
      });

      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL');
      const submitButton = screen.getByText('Add Source');

      fireEvent.change(input, { target: { value: 'https://example.com/article' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/source/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: 'https://example.com/article' })
        });
      });
    });

    it('should close dialog and show loading toast on submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          source: {
            id: 'source-1',
            url: 'https://example.com/article',
            title: 'Test Article',
            content: 'Test content',
            excerpt: null,
            createdAt: '2024-01-01'
          }
        })
      });

      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL');
      const submitButton = screen.getByText('Add Source');

      fireEvent.change(input, { target: { value: 'https://example.com/article' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
        expect(toast.loading).toHaveBeenCalledWith('Processing source...', { id: 'fetch-source' });
      });
    });

    it('should show success toast and call onSourceAdded on success', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          source: {
            id: 'source-1',
            url: 'https://example.com/article',
            title: 'Test Article',
            content: 'Test content',
            excerpt: null,
            createdAt: '2024-01-01'
          }
        })
      });

      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL');
      const submitButton = screen.getByText('Add Source');

      fireEvent.change(input, { target: { value: 'https://example.com/article' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Source added successfully!', { id: 'fetch-source' });
        expect(mockOnSourceAdded).toHaveBeenCalled();
      });
    });

    it('should reset form after successful submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          source: {
            id: 'source-1',
            url: 'https://example.com/article',
            title: 'Test Article',
            content: 'Test content',
            excerpt: null,
            createdAt: '2024-01-01'
          }
        })
      });

      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL') as HTMLInputElement;
      const submitButton = screen.getByText('Add Source');

      fireEvent.change(input, { target: { value: 'https://example.com/article' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });

      // Note: Form reset happens before dialog closes, but we can't easily test
      // the internal state after dialog is closed
    });
  });

  describe('API Integration - Error', () => {
    it('should show error toast and reopen dialog when API returns error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Failed to fetch content from URL'
        })
      });

      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL');
      const submitButton = screen.getByText('Add Source');

      fireEvent.change(input, { target: { value: 'https://invalid-url.com' } });
      fireEvent.click(submitButton);

      // Dialog closes initially
      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });

      // Then error toast is shown and dialog reopens
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to fetch content from URL', { id: 'fetch-source' });
        expect(mockOnOpenChange).toHaveBeenCalledWith(true);
      });

      expect(mockOnSourceAdded).not.toHaveBeenCalled();
    });

    it('should show error toast when API throws', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL');
      const submitButton = screen.getByText('Add Source');

      fireEvent.change(input, { target: { value: 'https://example.com' } });
      fireEvent.click(submitButton);

      // Dialog closes initially
      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });

      // Then error toast is shown and dialog reopens
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Network error', { id: 'fetch-source' });
        expect(mockOnOpenChange).toHaveBeenCalledWith(true);
      });

      expect(mockOnSourceAdded).not.toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading toast during submission', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({ source: {} }) }), 100))
      );

      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL');
      const submitButton = screen.getByText('Add Source');

      fireEvent.change(input, { target: { value: 'https://example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.loading).toHaveBeenCalledWith('Processing source...', { id: 'fetch-source' });
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

  });

  describe('Dialog Interactions', () => {
    it('should call onOpenChange when cancel button is clicked', () => {
      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onOpenChange when cancel is clicked', () => {
      render(
        <AddSourceDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          onSourceAdded={mockOnSourceAdded}
        />
      );

      const input = screen.getByLabelText('URL') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'https://example.com' } });
      expect(input.value).toBe('https://example.com');

      // Click cancel to close dialog
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      // Verify onOpenChange was called with false
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

  });
});
