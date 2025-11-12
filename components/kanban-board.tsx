"use client";

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { KanbanCard } from './kanban-card';
import { useAppStore } from '@/lib/store';

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

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-100' },
  { id: 'draft', title: 'Draft', color: 'bg-blue-100' },
  { id: 'scheduled', title: 'Scheduled', color: 'bg-yellow-100' },
  { id: 'posted', title: 'Posted', color: 'bg-green-100' }
];

export function KanbanBoard({ tasks, onTaskUpdate, onTaskDelete }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { setIsDragging } = useAppStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
      setIsDragging(true);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setIsDragging(false);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    // Find the task being moved
    const task = tasks.find(t => t.id === taskId);

    if (task && task.status !== newStatus) {
      // Update task status
      await onTaskUpdate(taskId, {
        status: newStatus,
        postedAt: newStatus === 'posted' ? new Date() : task.postedAt
      });
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(column => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              count={columnTasks.length}
              color={column.color}
            >
              <SortableContext
                items={columnTasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {columnTasks.map(task => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      onUpdate={onTaskUpdate}
                      onDelete={onTaskDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-50">
            <KanbanCard
              task={activeTask}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
