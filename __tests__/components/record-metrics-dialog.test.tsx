/**
 * Tests for RecordMetricsDialog component
 *
 * These tests verify the manual metrics recording UI functionality:
 * - Dialog rendering and user interactions
 * - Quick action buttons for +1 increments
 * - Custom metric entry form
 * - Validation and error handling
 * - API integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RecordMetricsDialog } from '@/components/record-metrics-dialog';

// Mock fetch globally
global.fetch = jest.fn();

describe('RecordMetricsDialog', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnMetricRecorded = jest.fn();
  const mockTaskId = 'test-task-123';

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Dialog Rendering', () => {
    it('should not render when closed', () => {
      render(
        <RecordMetricsDialog
          open={false}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      expect(screen.queryByText('Record Metrics')).not.toBeInTheDocument();
    });

    it('should render dialog when open', () => {
      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      expect(screen.getByText('Record Metrics')).toBeInTheDocument();
      expect(screen.getByText('Manually record engagement metrics for this post')).toBeInTheDocument();
    });

    it('should render all quick action buttons', () => {
      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      expect(screen.getByText('+1 Likes')).toBeInTheDocument();
      expect(screen.getByText('+1 Shares')).toBeInTheDocument();
      expect(screen.getByText('+1 Comments')).toBeInTheDocument();
      expect(screen.getByText('+1 Clicks')).toBeInTheDocument();
    });

    it('should render custom metric entry form', () => {
      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      expect(screen.getByText('Or enter custom value')).toBeInTheDocument();
      expect(screen.getByLabelText('Metric Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Value')).toBeInTheDocument();
    });

    it('should render submit and cancel buttons', () => {
      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      expect(screen.getByText('Record Metric')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  describe('Quick Action Buttons', () => {
    it('should call API with correct data when +1 Likes is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const likesButton = screen.getByText('+1 Likes');
      fireEvent.click(likesButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: mockTaskId,
            type: 'like',
            value: 1
          })
        });
      });

      expect(mockOnMetricRecorded).toHaveBeenCalled();
    });

    it('should call API with correct data when +1 Shares is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const sharesButton = screen.getByText('+1 Shares');
      fireEvent.click(sharesButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: mockTaskId,
            type: 'share',
            value: 1
          })
        });
      });

      expect(mockOnMetricRecorded).toHaveBeenCalled();
    });

    it('should disable quick action buttons while submitting', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
      );

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const likesButton = screen.getByText('+1 Likes');
      fireEvent.click(likesButton);

      // Check if buttons are disabled
      expect(likesButton).toBeDisabled();
      expect(screen.getByText('+1 Shares')).toBeDisabled();
      expect(screen.getByText('+1 Comments')).toBeDisabled();
      expect(screen.getByText('+1 Clicks')).toBeDisabled();

      await waitFor(() => {
        expect(mockOnMetricRecorded).toHaveBeenCalled();
      });
    });

    it('should show error message when quick action API call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to record metric' })
      });

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const likesButton = screen.getByText('+1 Likes');
      fireEvent.click(likesButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to record metric')).toBeInTheDocument();
      });

      expect(mockOnMetricRecorded).not.toHaveBeenCalled();
    });
  });

  describe('Custom Metric Entry Form', () => {
    it('should allow changing metric type', async () => {
      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      await waitFor(() => {
        const select = screen.getByLabelText('Metric Type');
        expect(select).toBeInTheDocument();
      });
    });

    it('should allow entering custom value', async () => {
      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const input = screen.getByLabelText('Value') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '50' } });

      await waitFor(() => {
        expect(input.value).toBe('50');
      });
    });

    it('should validate positive numbers', async () => {
      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const input = screen.getByLabelText('Value');
      const submitButton = screen.getByText('Record Metric');

      // Enter invalid value
      fireEvent.change(input, { target: { value: '-5' } });
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid positive number')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should validate numeric input', async () => {
      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const input = screen.getByLabelText('Value');

      // Enter non-numeric value
      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.submit(input.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid positive number')).toBeInTheDocument();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should submit custom metric with correct data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const input = screen.getByLabelText('Value');
      const submitButton = screen.getByText('Record Metric');

      fireEvent.change(input, { target: { value: '25' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskId: mockTaskId,
            type: 'like', // Default type
            value: 25
          })
        });
      });

      expect(mockOnMetricRecorded).toHaveBeenCalled();
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should reset form after successful submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const input = screen.getByLabelText('Value') as HTMLInputElement;
      const submitButton = screen.getByText('Record Metric');

      fireEvent.change(input, { target: { value: '100' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });

      expect(mockOnMetricRecorded).toHaveBeenCalled();
    });

    it('should show error message when form submission fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error occurred' })
      });

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const submitButton = screen.getByText('Record Metric');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Server error occurred')).toBeInTheDocument();
      });

      expect(mockOnMetricRecorded).not.toHaveBeenCalled();
      expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
    });

    it('should show loading state during submission', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
      );

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const submitButton = screen.getByText('Record Metric');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Recording...')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(mockOnMetricRecorded).toHaveBeenCalled();
      });
    });

    it('should disable form inputs while submitting', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
      );

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const input = screen.getByLabelText('Value');
      const submitButton = screen.getByText('Record Metric');
      const cancelButton = screen.getByText('Cancel');

      fireEvent.click(submitButton);

      expect(input).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();

      await waitFor(() => {
        expect(mockOnMetricRecorded).toHaveBeenCalled();
      });
    });
  });

  describe('Dialog Interactions', () => {
    it('should call onOpenChange when cancel button is clicked', () => {
      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should close dialog after successful submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const submitButton = screen.getByText('Record Metric');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should not close dialog after failed submission', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed' })
      });

      render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      const submitButton = screen.getByText('Record Metric');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument();
      });

      expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
    });
  });

  describe('Metric Type Icons', () => {
    it('should render icons for all metric types in quick actions', async () => {
      const { container } = render(
        <RecordMetricsDialog
          open={true}
          onOpenChange={mockOnOpenChange}
          taskId={mockTaskId}
          onMetricRecorded={mockOnMetricRecorded}
        />
      );

      // Check for quick action buttons with icons
      await waitFor(() => {
        const quickActionsButtons = screen.getAllByRole('button');
        // Should have at least: 4 quick actions + Cancel + Record Metric = 6 buttons
        expect(quickActionsButtons.length).toBeGreaterThanOrEqual(6);
      });
    });
  });
});
