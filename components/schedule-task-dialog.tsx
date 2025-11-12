"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  currentScheduledAt?: Date | null;
  onSchedule: (taskId: string, scheduledAt: Date | null) => Promise<void>;
}

export function ScheduleTaskDialog({
  open,
  onOpenChange,
  taskId,
  currentScheduledAt,
  onSchedule
}: ScheduleTaskDialogProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && currentScheduledAt) {
      const scheduled = new Date(currentScheduledAt);
      // Format date as YYYY-MM-DD
      const dateStr = scheduled.toISOString().split('T')[0];
      // Format time as HH:MM
      const timeStr = scheduled.toTimeString().slice(0, 5);
      setDate(dateStr);
      setTime(timeStr);
    } else if (open) {
      // Default to tomorrow at 9 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTime('09:00');
    }
  }, [open, currentScheduledAt]);

  const handleSchedule = async () => {
    if (!date || !time) return;

    setIsLoading(true);
    try {
      // Combine date and time
      const scheduledAt = new Date(`${date}T${time}`);
      await onSchedule(taskId, scheduledAt);
      onOpenChange(false);
    } catch (error) {
      console.error('Error scheduling task:', error);
      alert('Failed to schedule task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSchedule = async () => {
    setIsLoading(true);
    try {
      await onSchedule(taskId, null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error clearing schedule:', error);
      alert('Failed to clear schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Task</DialogTitle>
          <DialogDescription>
            Set a date and time for this task to be automatically posted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="schedule-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              data-testid="schedule-date-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time
            </Label>
            <Input
              id="schedule-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              data-testid="schedule-time-input"
              required
            />
          </div>

          {currentScheduledAt && (
            <div className="text-sm text-slate-600">
              Currently scheduled for: {new Date(currentScheduledAt).toLocaleString()}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {currentScheduledAt && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearSchedule}
              disabled={isLoading}
              className="sm:mr-auto"
              data-testid="clear-schedule-button"
            >
              Clear Schedule
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSchedule}
            disabled={isLoading || !date || !time}
            data-testid="schedule-task-submit"
          >
            {isLoading ? 'Scheduling...' : 'Schedule Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
