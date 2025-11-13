'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
import { Loader2 } from 'lucide-react';

interface Source {
  id: string;
  url: string | null;
  title: string | null;
  content: string;
  excerpt: string | null;
  createdAt: string;
}

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSourceAdded: () => void;
}

export function AddSourceDialog({ open, onOpenChange, onSourceAdded }: AddSourceDialogProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');

    // Close dialog immediately and show processing notification
    onOpenChange(false);
    toast.loading('Processing source...', { id: 'fetch-source' });

    try {
      const response = await fetch('/api/source/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      // Show success notification
      toast.success('Source added successfully!', { id: 'fetch-source' });

      // Reset form
      setUrl('');
      setError('');

      // Notify parent to refresh sources list
      onSourceAdded();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast.error(errorMessage, { id: 'fetch-source' });
      setError(errorMessage);
      // Reopen dialog on error so user can retry
      onOpenChange(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Reset form when closing
        setUrl('');
        setError('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleFetch}>
          <DialogHeader>
            <DialogTitle>Add Content Source</DialogTitle>
            <DialogDescription>
              Paste a URL to extract and save content from any web page, blog post, or article.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                autoFocus
              />
              {error && (
                <div className="text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>What happens next:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Content is extracted and cleaned</li>
                <li>Source is saved to your library</li>
                <li>You can generate posts from this source</li>
              </ol>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Add Source'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
