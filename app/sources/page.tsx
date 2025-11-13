"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SourceCard } from '@/components/source-card';
import { AddSourceDialog } from '@/components/add-source-dialog';
import { GenerateContentDialog } from '@/components/generate-content-dialog';
import { useAppStore } from '@/lib/store';
import { Plus, Loader2, FileText } from 'lucide-react';

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

export default function SourcesPage() {
  const router = useRouter();
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const { isGenerateContentOpen, setIsGenerateContentOpen, selectedCampaignId } = useAppStore();

  const fetchSources = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/source');
      if (!response.ok) throw new Error('Failed to fetch sources');
      const data = await response.json();
      setSources(data.sources || []);
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/source/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete source');

      // Refresh sources list
      await fetchSources();
    } catch (error) {
      console.error('Error deleting source:', error);
      alert('Failed to delete source');
    }
  };

  const handleGenerate = () => {
    // Check if a campaign is selected, if not, prompt user to create/select one
    if (!selectedCampaignId) {
      alert('Please create or select a campaign first from the Campaigns page.');
      router.push('/campaigns');
      return;
    }

    setIsGenerateContentOpen(true);
  };

  const handleContentGenerated = () => {
    // Refresh sources to update task counts
    fetchSources();
  };

  const handleSourceAdded = () => {
    // Refresh sources list
    fetchSources();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Sources</h1>
          <p className="text-slate-600 mt-1">Manage your content sources</p>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No sources yet
              </h3>
              <p className="text-slate-600 mb-4 max-w-md mx-auto">
                Get started by adding a content source. Paste any blog post, article, or web page URL to extract and repurpose content.
              </p>
              <Button onClick={() => setIsAddSourceOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Source
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sources</h1>
          <p className="text-slate-600 mt-1">
            Manage your content sources and generate posts
          </p>
        </div>
        <Button onClick={() => setIsAddSourceOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((source) => (
          <SourceCard
            key={source.id}
            source={source}
            onDelete={handleDelete}
            onGenerate={handleGenerate}
          />
        ))}
      </div>

      <AddSourceDialog
        open={isAddSourceOpen}
        onOpenChange={setIsAddSourceOpen}
        onSourceAdded={handleSourceAdded}
      />

      {selectedCampaignId && (
        <GenerateContentDialog
          campaignId={selectedCampaignId}
          open={isGenerateContentOpen}
          onOpenChange={setIsGenerateContentOpen}
          onContentGenerated={handleContentGenerated}
        />
      )}
    </div>
  );
}
