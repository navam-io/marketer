"use client";

import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Heart, Share2, MessageCircle, TrendingUp } from 'lucide-react';

interface RecordMetricsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  onMetricRecorded: () => void;
}

const METRIC_TYPES = [
  { value: 'like', label: 'Likes', icon: Heart, color: 'text-pink-500' },
  { value: 'share', label: 'Shares', icon: Share2, color: 'text-blue-500' },
  { value: 'comment', label: 'Comments', icon: MessageCircle, color: 'text-green-500' },
  { value: 'click', label: 'Clicks', icon: TrendingUp, color: 'text-purple-500' },
];

export function RecordMetricsDialog({
  open,
  onOpenChange,
  taskId,
  onMetricRecorded
}: RecordMetricsDialogProps) {
  const [metricType, setMetricType] = useState<string>('like');
  const [metricValue, setMetricValue] = useState<string>('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const value = parseInt(metricValue, 10);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          type: metricType,
          value
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record metric');
      }

      // Reset form
      setMetricType('like');
      setMetricValue('1');
      onOpenChange(false);
      onMetricRecorded();
    } catch (err) {
      console.error('Error recording metric:', err);
      setError(err instanceof Error ? err.message : 'Failed to record metric');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAction = async (type: string, value: number) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          type,
          value
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record metric');
      }

      onMetricRecorded();
    } catch (err) {
      console.error('Error recording metric:', err);
      setError(err instanceof Error ? err.message : 'Failed to record metric');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMetric = METRIC_TYPES.find(m => m.value === metricType);
  const MetricIcon = selectedMetric?.icon || Heart;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Metrics</DialogTitle>
            <DialogDescription>
              Manually record engagement metrics for this post
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Quick Actions */}
            <div className="space-y-2">
              <Label>Quick Actions</Label>
              <div className="grid grid-cols-2 gap-2">
                {METRIC_TYPES.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Button
                      key={metric.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(metric.value, 1)}
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <Icon className={`h-4 w-4 ${metric.color}`} />
                      +1 {metric.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or enter custom value
                </span>
              </div>
            </div>

            {/* Metric Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="metric-type">Metric Type</Label>
              <Select value={metricType} onValueChange={setMetricType}>
                <SelectTrigger id="metric-type">
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_TYPES.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <SelectItem key={metric.value} value={metric.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${metric.color}`} />
                          {metric.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Metric Value Input */}
            <div className="space-y-2">
              <Label htmlFor="metric-value">Value</Label>
              <div className="flex items-center gap-2">
                <MetricIcon className={`h-5 w-5 ${selectedMetric?.color}`} />
                <Input
                  id="metric-value"
                  type="number"
                  min="1"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-1"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                'Record Metric'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
