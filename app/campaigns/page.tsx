"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KanbanBoard } from '@/components/kanban-board';
import { CreateCampaignDialog } from '@/components/create-campaign-dialog';
import { CreateTaskDialog } from '@/components/create-task-dialog';
import { GenerateContentDialog } from '@/components/generate-content-dialog';
import { useAppStore } from '@/lib/store';
import { Plus, Loader2, Sparkles } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  _count: { tasks: number };
}

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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    selectedCampaignId,
    setSelectedCampaignId,
    setIsCreateCampaignOpen,
    setIsCreateTaskOpen,
    isGenerateContentOpen,
    setIsGenerateContentOpen
  } = useAppStore();

  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await fetch('/api/campaigns');
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns || []);

      // Auto-select first campaign if none selected
      if (!selectedCampaignId && data.campaigns.length > 0) {
        setSelectedCampaignId(data.campaigns[0].id);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  }, [selectedCampaignId, setSelectedCampaignId]);

  const fetchTasks = useCallback(async () => {
    if (!selectedCampaignId) {
      setTasks([]);
      return;
    }

    try {
      const response = await fetch(`/api/tasks?campaignId=${selectedCampaignId}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [selectedCampaignId]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchCampaigns(), fetchTasks()]);
    setIsLoading(false);
  }, [fetchCampaigns, fetchTasks]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Refresh tasks
      await fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete task');

      // Refresh tasks
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Campaigns</CardTitle>
            <CardDescription>
              Create your first campaign to start organizing your social media posts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsCreateCampaignOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
        <CreateCampaignDialog onCampaignCreated={loadData} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-slate-600 mt-1">Manage your marketing campaigns and tasks</p>
        </div>
        <Button onClick={() => setIsCreateCampaignOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select value={selectedCampaignId || ''} onValueChange={setSelectedCampaignId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name} ({campaign._count.tasks} tasks)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedCampaignId && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsGenerateContentOpen(true)}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with Claude
            </Button>
            <Button onClick={() => setIsCreateTaskOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        )}
      </div>

      {selectedCampaign && selectedCampaign.description && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-slate-600">{selectedCampaign.description}</p>
          </CardContent>
        </Card>
      )}

      {selectedCampaignId ? (
        <KanbanBoard
          tasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-slate-600">
            Select a campaign to view tasks
          </CardContent>
        </Card>
      )}

      <CreateCampaignDialog onCampaignCreated={loadData} />
      {selectedCampaignId && (
        <>
          <CreateTaskDialog
            campaignId={selectedCampaignId}
            onTaskCreated={fetchTasks}
          />
          <GenerateContentDialog
            campaignId={selectedCampaignId}
            open={isGenerateContentOpen}
            onOpenChange={setIsGenerateContentOpen}
            onContentGenerated={fetchTasks}
          />
        </>
      )}
    </div>
  );
}
