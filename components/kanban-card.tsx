"use client";

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Check, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScheduleTaskDialog } from '@/components/schedule-task-dialog';

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
  createdAt: Date;
  updatedAt: Date;
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
        "touch-none",
        (isDragging || isSortableDragging) && "opacity-50"
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
              {!isEditing && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsScheduleDialogOpen(true);
                    }}
                    title="Schedule task"
                  >
                    <Calendar className="h-3 w-3" />
                  </Button>
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
          {isEditing ? (
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
    </div>
  );
}
