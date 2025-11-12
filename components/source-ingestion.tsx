'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Source {
  id: string;
  url: string | null;
  title: string | null;
  content: string;
  excerpt: string | null;
  createdAt: string;
}

export function SourceIngestion() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<Source | null>(null);
  const [error, setError] = useState('');

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setSource(null);

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

      setSource(data.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Source Ingestion</CardTitle>
          <CardDescription>
            Paste a URL to extract and view cleaned, readable content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFetch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    'Fetch'
                  )}
                </Button>
              </div>
            </div>
            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {source && (
        <Card>
          <CardHeader>
            <CardTitle>{source.title || 'Untitled'}</CardTitle>
            {source.url && (
              <CardDescription>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {source.url}
                </a>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {source.excerpt && (
                <div className="mb-4 p-4 bg-muted rounded-md">
                  <p className="text-sm italic">{source.excerpt}</p>
                </div>
              )}
              <div className="whitespace-pre-wrap">
                {source.content}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
