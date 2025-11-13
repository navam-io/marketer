"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink, Sparkles, Trash2, FileText, Eye } from 'lucide-react';

interface Source {
  id: string;
  url: string;
  title?: string;
  content?: string;
  createdAt: Date;
  _count?: {
    tasks: number;
  };
}

interface SourceCardProps {
  source: Source;
  onDelete: (id: string) => void;
  onGenerate: (source: Source) => void;
  onViewDetails: (source: Source) => void;
}

export function SourceCard({ source, onDelete, onGenerate, onViewDetails }: SourceCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(source.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting source:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-2">
                {source.title || 'Untitled Source'}
              </CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2">
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                >
                  {source.url}
                </a>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {source.content && (
            <div className="text-sm text-slate-600 line-clamp-3">
              {truncateContent(source.content, 200)}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-4">
              <span>Added {formatDate(source.createdAt)}</span>
              {source._count && source._count.tasks > 0 && (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {source._count.tasks} {source._count.tasks === 1 ? 'task' : 'tasks'}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onGenerate(source)}
              className="flex-1"
              variant="default"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate from Source
            </Button>
            <Button
              onClick={() => onViewDetails(source)}
              variant="outline"
              size="icon"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="outline"
              size="icon"
              title="Delete source"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Source</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this source? This action cannot be undone.
              {source._count && source._count.tasks > 0 && (
                <p className="mt-2 text-amber-600 font-medium">
                  Note: This source has {source._count.tasks} associated {source._count.tasks === 1 ? 'task' : 'tasks'}.
                  The {source._count.tasks === 1 ? 'task' : 'tasks'} will not be deleted, but will no longer be linked to this source.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Source'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
