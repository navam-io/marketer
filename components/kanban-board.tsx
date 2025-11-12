"use client";

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
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
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const { setIsDragging } = useAppStore();

  // Update local tasks when props change
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = localTasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
      setIsDragging(true);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active and over tasks
    const activeTask = localTasks.find(t => t.id === activeId);
    const overTask = localTasks.find(t => t.id === overId);

    if (!activeTask) return;

    // Determine the target status (either a column id or task's status)
    const activeStatus = activeTask.status;
    const overStatus = overTask ? overTask.status : overId;

    // If dragging over the same position, do nothing
    if (activeId === overId) return;

    // Update local state for smooth animation
    setLocalTasks((prevTasks) => {
      const activeIndex = prevTasks.findIndex(t => t.id === activeId);
      const overIndex = prevTasks.findIndex(t => t.id === overId);

      if (activeIndex === -1) return prevTasks;

      // If dragging over a column header (not a task)
      if (overIndex === -1) {
        // Moving to a different column
        if (activeStatus !== overStatus) {
          const updatedTasks = [...prevTasks];
          updatedTasks[activeIndex] = {
            ...updatedTasks[activeIndex],
            status: overStatus
          };
          return updatedTasks;
        }
        return prevTasks;
      }

      // If dragging over another task
      if (activeStatus === overStatus) {
        // Reordering within the same column
        return arrayMove(prevTasks, activeIndex, overIndex);
      } else {
        // Moving to a different column
        const updatedTasks = [...prevTasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          status: overStatus
        };

        // Move the task to the position of the over task
        const taskToMove = updatedTasks[activeIndex];
        updatedTasks.splice(activeIndex, 1);
        const newOverIndex = updatedTasks.findIndex(t => t.id === overId);
        updatedTasks.splice(newOverIndex, 0, taskToMove);

        return updatedTasks;
      }
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setIsDragging(false);

    if (!over) {
      // Reset to original state if dropped outside
      setLocalTasks(tasks);
      return;
    }

    const taskId = active.id as string;
    const task = localTasks.find(t => t.id === taskId);

    if (!task) {
      setLocalTasks(tasks);
      return;
    }

    // Only update if status actually changed
    if (task.status !== tasks.find(t => t.id === taskId)?.status) {
      await onTaskUpdate(taskId, {
        status: task.status,
        postedAt: task.status === 'posted' ? new Date() : task.postedAt
      });
    }
  };

  const getTasksByStatus = (status: string) => {
    return localTasks.filter(task => task.status === status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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
