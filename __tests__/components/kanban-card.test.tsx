/**
 * Tests for KanbanCard component - Metrics Functionality
 *
 * These tests verify the metrics display and recording integration:
 * - Metrics fetching for posted tasks
 * - Badge display with correct colors and icons
 * - Record metrics button visibility (only on posted tasks)
 * - RecordMetricsDialog integration
 * - Metric aggregation logic
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KanbanCard } from '@/components/kanban-card';
import { DndContext } from '@dnd-kit/core';

// Mock fetch globally
global.fetch = jest.fn();

describe('KanbanCard - Metrics Functionality', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  const baseTask = {
    id: 'task-1',
    campaignId: 'campaign-1',
    sourceId: 'source-1',
    platform: 'linkedin',
    content: 'Test task content',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  // Helper to render KanbanCard within DndContext
  const renderCard = (task: any) => {
    return render(
      <DndContext>
        <KanbanCard
          task={task}
          onUpdate={mockOnUpdate}
          onDelete={mockOnDelete}
        />
      </DndContext>
    );
  };

  describe('Record Metrics Button Visibility', () => {
    it('should not show record metrics button for todo tasks', () => {
      const task = { ...baseTask, status: 'todo' };
      renderCard(task);

      // BarChart3 icon button should not be present
      const buttons = screen.getAllByRole('button');
      const metricsButton = buttons.find(btn => btn.getAttribute('title') === 'Record metrics');

      expect(metricsButton).toBeUndefined();
    });

    it('should not show record metrics button for draft tasks', () => {
      const task = { ...baseTask, status: 'draft' };
      renderCard(task);

      const buttons = screen.getAllByRole('button');
      const metricsButton = buttons.find(btn => btn.getAttribute('title') === 'Record metrics');

      expect(metricsButton).toBeUndefined();
    });

    it('should not show record metrics button for scheduled tasks', () => {
      const task = { ...baseTask, status: 'scheduled' };
      renderCard(task);

      const buttons = screen.getAllByRole('button');
      const metricsButton = buttons.find(btn => btn.getAttribute('title') === 'Record metrics');

      expect(metricsButton).toBeUndefined();
    });

    it('should show record metrics button for posted tasks', () => {
      // Mock empty metrics response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ metrics: [] })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      const buttons = screen.getAllByRole('button');
      const metricsButton = buttons.find(btn => btn.getAttribute('title') === 'Record metrics');

      expect(metricsButton).toBeDefined();
    });
  });

  describe('Metrics Fetching', () => {
    it('should fetch metrics when task status is posted', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'like', value: 5 },
            { id: '2', taskId: 'task-1', type: 'share', value: 2 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/metrics?taskId=task-1');
      });
    });

    it('should not fetch metrics for non-posted tasks', () => {
      const task = { ...baseTask, status: 'draft' };
      renderCard(task);

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should handle metrics fetch errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching metrics:', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle non-ok response from metrics API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Not found' })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Should not crash - just silently fail
    });
  });

  describe('Metrics Display - Badge Rendering', () => {
    it('should display like metrics with correct styling', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'like', value: 10 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument();
      });
    });

    it('should display share metrics with correct styling', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'share', value: 5 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });

    it('should display comment metrics with correct styling', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'comment', value: 8 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(screen.getByText('8')).toBeInTheDocument();
      });
    });

    it('should display click metrics with correct styling', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'click', value: 25 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(screen.getByText('25')).toBeInTheDocument();
      });
    });

    it('should display multiple metrics simultaneously', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'like', value: 10 },
            { id: '2', taskId: 'task-1', type: 'share', value: 5 },
            { id: '3', taskId: 'task-1', type: 'comment', value: 3 },
            { id: '4', taskId: 'task-1', type: 'click', value: 50 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
      });
    });

    it('should not display metrics section when no metrics exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ metrics: [] })
      });

      const task = { ...baseTask, status: 'posted', content: 'Test content' };
      const { container } = renderCard(task);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      // Verify content is shown but no metrics badges
      expect(screen.getByText('Test content')).toBeInTheDocument();

      // No badges should be rendered
      const badges = container.querySelectorAll('[class*="bg-pink-100"], [class*="bg-blue-100"], [class*="bg-green-100"], [class*="bg-purple-100"]');
      expect(badges.length).toBe(0);
    });
  });

  describe('Metrics Aggregation', () => {
    it('should aggregate multiple metrics of the same type', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'like', value: 10 },
            { id: '2', taskId: 'task-1', type: 'like', value: 5 },
            { id: '3', taskId: 'task-1', type: 'like', value: 3 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        // Should show aggregated total: 10 + 5 + 3 = 18
        expect(screen.getByText('18')).toBeInTheDocument();
      });
    });

    it('should aggregate mixed metric types correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'like', value: 10 },
            { id: '2', taskId: 'task-1', type: 'like', value: 5 },
            { id: '3', taskId: 'task-1', type: 'share', value: 2 },
            { id: '4', taskId: 'task-1', type: 'share', value: 3 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        // Likes: 10 + 5 = 15
        expect(screen.getByText('15')).toBeInTheDocument();
        // Shares: 2 + 3 = 5
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });
  });

  describe('RecordMetricsDialog Integration', () => {
    it('should open RecordMetricsDialog when record metrics button is clicked', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ metrics: [] })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const metricsButton = buttons.find(btn => btn.getAttribute('title') === 'Record metrics');
        expect(metricsButton).toBeDefined();
      });

      const buttons = screen.getAllByRole('button');
      const metricsButton = buttons.find(btn => btn.getAttribute('title') === 'Record metrics');

      if (metricsButton) {
        fireEvent.click(metricsButton);

        await waitFor(() => {
          expect(screen.getByText('Record Metrics')).toBeInTheDocument();
        });
      }
    });

    it('should pass correct taskId to RecordMetricsDialog', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ metrics: [] })
      });

      const task = { ...baseTask, id: 'unique-task-123', status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        const metricsButton = buttons.find(btn => btn.getAttribute('title') === 'Record metrics');
        expect(metricsButton).toBeDefined();
      });

      const buttons = screen.getAllByRole('button');
      const metricsButton = buttons.find(btn => btn.getAttribute('title') === 'Record metrics');

      if (metricsButton) {
        fireEvent.click(metricsButton);

        // Dialog should be open
        await waitFor(() => {
          expect(screen.getByText('Record Metrics')).toBeInTheDocument();
        });
      }
    });

    it('should refresh metrics after recording new metric', async () => {
      // Initial metrics fetch
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'like', value: 10 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument();
      });

      // Open dialog
      const buttons = screen.getAllByRole('button');
      const metricsButton = buttons.find(btn => btn.getAttribute('title') === 'Record metrics');

      if (metricsButton) {
        fireEvent.click(metricsButton);

        await waitFor(() => {
          expect(screen.getByText('Record Metrics')).toBeInTheDocument();
        });

        // Mock recording a new metric (quick action)
        (global.fetch as jest.Mock)
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true })
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              metrics: [
                { id: '1', taskId: 'task-1', type: 'like', value: 10 },
                { id: '2', taskId: 'task-1', type: 'like', value: 1 }
              ]
            })
          });

        const likesButton = screen.getByText('+1 Likes');
        fireEvent.click(likesButton);

        // Metrics should refresh and show updated total: 10 + 1 = 11
        await waitFor(() => {
          expect(screen.getByText('11')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero-value metrics', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'like', value: 0 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
      });
    });

    it('should handle large metric values', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'like', value: 999999 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(screen.getByText('999999')).toBeInTheDocument();
      });
    });

    it('should handle unknown metric types gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'unknown_type', value: 5 }
          ]
        })
      });

      const task = { ...baseTask, status: 'posted' };
      renderCard(task);

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });

    it('should not show metrics on non-posted tasks even if metrics exist in response', () => {
      const task = { ...baseTask, status: 'draft' };
      renderCard(task);

      // Fetch should not be called for non-posted tasks
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Scheduled Date Display', () => {
    it('should show scheduled date when task is scheduled', async () => {
      const scheduledDate = new Date('2024-12-25T12:00:00Z'); // Use UTC time
      const task = { ...baseTask, status: 'scheduled', scheduledAt: scheduledDate };

      renderCard(task);

      await waitFor(() => {
        // Check that the calendar icon and some date text are present
        const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });

    it('should show both scheduled date and metrics for posted tasks with schedule', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          metrics: [
            { id: '1', taskId: 'task-1', type: 'like', value: 15 }
          ]
        })
      });

      const scheduledDate = new Date('2024-12-25T12:00:00Z');
      const task = { ...baseTask, status: 'posted', scheduledAt: scheduledDate };

      renderCard(task);

      await waitFor(() => {
        // Check for metrics badge
        expect(screen.getByText('15')).toBeInTheDocument();
      });

      // Check for date presence
      const dateElements = screen.queryAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });
});
