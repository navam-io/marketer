"use client";

import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface GenerateContentDialogProps {
  campaignId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContentGenerated: () => void;
}

interface Source {
  id: string;
  title: string | null;
  url: string | null;
  excerpt: string | null;
  createdAt: string;
}

const PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', description: 'Professional network (3000 chars)' },
  { value: 'twitter', label: 'Twitter', description: 'Microblogging (280 chars)' },
  { value: 'blog', label: 'Blog', description: 'Blog introduction (500 chars)' },
];

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'technical', label: 'Technical' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
];

export function GenerateContentDialog({
  campaignId,
  open,
  onOpenChange,
  onContentGenerated
}: GenerateContentDialogProps) {
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set(['linkedin']));
  const [tone, setTone] = useState<string>('professional');
  const [cta, setCta] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSources, setLoadingSources] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sources when dialog opens
  useEffect(() => {
    if (open) {
      loadSources();
    }
  }, [open]);

  const loadSources = async () => {
    setLoadingSources(true);
    try {
      const response = await fetch('/api/source/fetch?action=list');
      if (!response.ok) throw new Error('Failed to fetch sources');
      const data = await response.json();
      setSources(data.sources || []);

      // Auto-select first source if available
      if (data.sources && data.sources.length > 0 && !selectedSourceId) {
        setSelectedSourceId(data.sources[0].id);
      }
    } catch (err) {
      console.error('Error loading sources:', err);
      setError('Failed to load sources');
    } finally {
      setLoadingSources(false);
    }
  };

  const togglePlatform = (platform: string) => {
    const newPlatforms = new Set(selectedPlatforms);
    if (newPlatforms.has(platform)) {
      newPlatforms.delete(platform);
    } else {
      newPlatforms.add(platform);
    }
    setSelectedPlatforms(newPlatforms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!selectedSourceId) {
      setError('Please select a source');
      return;
    }

    if (selectedPlatforms.size === 0) {
      setError('Please select at least one platform');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: selectedSourceId,
          campaignId: campaignId || null,
          platforms: Array.from(selectedPlatforms),
          tone,
          cta: cta || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const result = await response.json();
      console.log('Generated content:', result);

      // Reset form
      setSelectedSourceId('');
      setSelectedPlatforms(new Set(['linkedin']));
      setTone('professional');
      setCta('');
      onOpenChange(false);
      onContentGenerated();

    } catch (err) {
      console.error('Error generating content:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSource = sources.find(s => s.id === selectedSourceId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Generate Content with Claude</DialogTitle>
            <DialogDescription>
              Select a source and platforms to automatically generate engaging social posts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Source Selection */}
            <div className="space-y-2">
              <Label htmlFor="source">Source Content</Label>
              {loadingSources ? (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading sources...
                </div>
              ) : sources.length === 0 ? (
                <div className="text-sm text-zinc-500">
                  No sources available. Please ingest content first.
                </div>
              ) : (
                <>
                  <Select value={selectedSourceId} onValueChange={setSelectedSourceId}>
                    <SelectTrigger data-testid="generate-source-select">
                      <SelectValue placeholder="Select a source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map(source => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.title || source.url || 'Untitled'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedSource && selectedSource.excerpt && (
                    <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
                      {selectedSource.excerpt}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <Label>Platforms</Label>
              <div className="space-y-3">
                {PLATFORMS.map(platform => (
                  <div key={platform.value} className="flex items-start space-x-3">
                    <Checkbox
                      id={platform.value}
                      data-testid={`generate-platform-${platform.value}`}
                      checked={selectedPlatforms.has(platform.value)}
                      onCheckedChange={() => togglePlatform(platform.value)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={platform.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {platform.label}
                      </label>
                      <p className="text-sm text-zinc-500">
                        {platform.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger data-testid="generate-tone-select">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Call to Action */}
            <div className="space-y-2">
              <Label htmlFor="cta">Call to Action (Optional)</Label>
              <Input
                id="cta"
                data-testid="generate-cta-input"
                placeholder="e.g., Learn more, Sign up, Visit our website..."
                value={cta}
                onChange={(e) => setCta(e.target.value)}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            {/* API Key Warning */}
            {!isLoading && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3 text-sm">
                <strong>Note:</strong> Make sure ANTHROPIC_API_KEY is set in your .env file.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || loadingSources || sources.length === 0}
              data-testid="generate-content-submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Content'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
