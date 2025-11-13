"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExternalLink } from 'lucide-react';

interface Source {
  id: string;
  url: string;
  title?: string;
  content?: string;
  excerpt?: string;
  createdAt: Date;
}

interface SourceDetailsDialogProps {
  source: Source | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SourceDetailsDialog({ source, open, onOpenChange }: SourceDetailsDialogProps) {
  if (!source) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl pr-8">
            {source.title || 'Untitled Source'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              {source.url}
            </a>
          </div>
          <div className="text-xs text-slate-500">
            Added on {formatDate(source.createdAt)}
          </div>
        </div>

        <div className="space-y-4 mt-4">
          {source.excerpt && (
            <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Excerpt</h3>
              <p className="text-sm text-slate-600 italic">{source.excerpt}</p>
            </div>
          )}

          {source.content && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Full Content</h3>
              <div className="prose prose-sm max-w-none">
                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {source.content}
                </div>
              </div>
            </div>
          )}

          {!source.content && !source.excerpt && (
            <div className="text-center py-8 text-slate-500">
              No content available for this source.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
