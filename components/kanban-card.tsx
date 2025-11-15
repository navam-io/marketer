"use client";

import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Check, X, Calendar, BarChart3, Heart, Share2, MessageCircle, TrendingUp, Copy, Link2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScheduleTaskDialog } from '@/components/schedule-task-dialog';
import { RecordMetricsDialog } from '@/components/record-metrics-dialog';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  campaignId?: string;
  sourceId?: string;
  platform?: string;
  status: string;
  content?: string;
  outputJson?: string;
  scheduledAt?: Date;
  postedAt?: Date;
  publishedUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Metric {
  id: string;
  type: string;
  value: number;
}

interface KanbanCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  isDragging?: boolean;
}

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: 'bg-blue-500',
  twitter: 'bg-sky-400',
  blog: 'bg-purple-500',
  default: 'bg-slate-500'
};

export function KanbanCard({ task, onUpdate, onDelete, isDragging = false }: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content || '');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isRecordMetricsOpen, setIsRecordMetricsOpen] = useState(false);
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(task.publishedUrl || '');
  const [metrics, setMetrics] = useState<Metric[]>([]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
    id: task.id,
    animateLayoutChanges: () => true, // Always animate layout changes
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
  };

  const handleSave = async () => {
    await onUpdate(task.id, { content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(task.content || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await onDelete(task.id);
    }
  };

  const handleSchedule = async (taskId: string, scheduledAt: Date | null) => {
    // When scheduling a task, automatically move it to 'scheduled' status
    // When clearing schedule, move it back to 'draft' status
    const updates: Partial<Task> = {
      scheduledAt: scheduledAt || undefined,
      status: scheduledAt ? 'scheduled' : 'draft'
    };
    await onUpdate(taskId, updates);
  };

  // Fetch metrics for posted tasks
  useEffect(() => {
    if (task.status === 'posted') {
      fetchMetrics();
    }
  }, [task.id, task.status]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/metrics?taskId=${task.id}`);
      if (!response.ok) return;
      const data = await response.json();

      // Aggregate metrics by type
      const aggregated = data.metrics.reduce((acc: Record<string, number>, metric: Metric) => {
        acc[metric.type] = (acc[metric.type] || 0) + metric.value;
        return acc;
      }, {});

      const metricsArray = Object.entries(aggregated).map(([type, value]) => ({
        id: type,
        type,
        value: value as number
      }));

      setMetrics(metricsArray);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleMetricRecorded = () => {
    fetchMetrics(); // Refresh metrics after recording
  };

  const handleCopyContent = async () => {
    if (!task.content) return;

    try {
      await navigator.clipboard.writeText(task.content);
      toast.success('Post content copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy content');
    }
  };

  const handleSaveUrl = async () => {
    await onUpdate(task.id, { publishedUrl: urlInput || undefined });
    setIsAddingUrl(false);
    toast.success('Post URL saved!');
  };

  const handleCancelUrl = () => {
    setUrlInput(task.publishedUrl || '');
    setIsAddingUrl(false);
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="h-3 w-3" />;
      case 'share': return <Share2 className="h-3 w-3" />;
      case 'comment': return <MessageCircle className="h-3 w-3" />;
      case 'click': return <TrendingUp className="h-3 w-3" />;
      default: return <BarChart3 className="h-3 w-3" />;
    }
  };

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'like': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'share': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'comment': return 'bg-green-100 text-green-700 border-green-200';
      case 'click': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const platformColor = task.platform
    ? PLATFORM_COLORS[task.platform] || PLATFORM_COLORS.default
    : PLATFORM_COLORS.default;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none transition-opacity duration-200",
        (isDragging || isSortableDragging) && "opacity-30"
      )}
    >
      <Card className="cursor-move hover:shadow-md transition-all duration-300 ease-in-out">
        <CardHeader className="p-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {task.platform && (
                <Badge className={cn(platformColor, "text-white mb-2")}>
                  {task.platform}
                </Badge>
              )}
            </div>
            <div className="flex gap-1">
              {!isEditing && !isAddingUrl && (
                <>
                  {task.content && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyContent();
                      }}
                      title="Copy content to clipboard"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                  {task.status === 'posted' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAddingUrl(true);
                        }}
                        title="Add post URL"
                      >
                        <Link2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRecordMetricsOpen(true);
                        }}
                        title="Record metrics"
                      >
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {isAddingUrl ? (
            <div className="space-y-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://linkedin.com/posts/..."
                className="text-sm"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveUrl();
                  }}
                  className="flex-1"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Save URL
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelUrl();
                  }}
                  className="flex-1"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px] text-sm"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="flex-1"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel();
                  }}
                  className="flex-1"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-700 line-clamp-4">
                {task.content || 'No content'}
              </p>
              {task.scheduledAt && (
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(task.scheduledAt).toLocaleDateString()}
                </div>
              )}
              {task.publishedUrl && (
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <a
                    href={task.publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Post
                  </a>
                </div>
              )}
              {task.status === 'posted' && metrics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {metrics.map((metric) => (
                    <Badge
                      key={metric.id}
                      variant="outline"
                      className={cn("text-xs flex items-center gap-1", getMetricColor(metric.type))}
                    >
                      {getMetricIcon(metric.type)}
                      {metric.value}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ScheduleTaskDialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        taskId={task.id}
        currentScheduledAt={task.scheduledAt}
        onSchedule={handleSchedule}
      />

      <RecordMetricsDialog
        open={isRecordMetricsOpen}
        onOpenChange={setIsRecordMetricsOpen}
        taskId={task.id}
        onMetricRecorded={handleMetricRecorded}
      />
    </div>
  );
}
