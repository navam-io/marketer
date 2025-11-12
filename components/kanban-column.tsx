"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

export function KanbanColumn({ id, title, count, color, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-lg border-2 p-4 min-h-[400px] transition-all duration-300 ease-in-out",
        isOver ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-slate-200 bg-white"
      )}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase text-slate-600">{title}</h3>
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            color,
            "text-slate-700"
          )}>
            {count}
          </span>
        </div>
      </div>
      <div className="flex-1 transition-all duration-300 ease-in-out">
        {children}
      </div>
    </div>
  );
}
