"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanbanBoard } from '@/components/kanban-board';
import { CreateCampaignDialog } from '@/components/create-campaign-dialog';
import { CreateTaskDialog } from '@/components/create-task-dialog';
import { GenerateContentDialog } from '@/components/generate-content-dialog';
import { DashboardStats } from '@/components/dashboard-stats';
import { EngagementChart } from '@/components/engagement-chart';
import { OnboardingHint } from '@/components/onboarding-hint';
import { useAppStore } from '@/lib/store';
import { Plus, Loader2, Sparkles, BarChart3, List, FileText } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  sourceId?: string;
  source?: {
    id: string;
    title?: string;
    url?: string;
  };
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

interface Stats {
  totalPosts: number;
  totalClicks: number;
  totalLikes: number;
  totalShares: number;
  engagementOverTime: Array<{
    date: string;
    clicks: number;
    likes: number;
    shares: number;
  }>;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

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

  const fetchStats = useCallback(async () => {
    if (!selectedCampaignId) {
      setStats(null);
      return;
    }

    try {
      const response = await fetch(`/api/metrics/stats?campaignId=${selectedCampaignId}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.stats || null);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    }
  }, [selectedCampaignId]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchCampaigns(), fetchTasks(), fetchStats()]);
    setIsLoading(false);
  }, [fetchCampaigns, fetchTasks, fetchStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Poll for changes every 60 seconds to catch scheduled posts moving to posted
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // Only poll if a campaign is selected
      if (selectedCampaignId) {
        fetchTasks();
        fetchCampaigns();
        fetchStats();
      }
    }, 60000); // 60 seconds

    return () => clearInterval(pollInterval);
  }, [selectedCampaignId, fetchTasks, fetchCampaigns, fetchStats]);

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Refresh both tasks and campaigns to update task counts
      await Promise.all([fetchTasks(), fetchCampaigns()]);
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

      // Refresh both tasks and campaigns to update task counts
      await Promise.all([fetchTasks(), fetchCampaigns()]);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  // Helper to refresh both tasks and campaigns (for task creation/generation)
  const refreshTasksAndCampaigns = async () => {
    await Promise.all([fetchTasks(), fetchCampaigns()]);
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
          <p className="text-slate-600 mt-1">Manage your marketing campaigns, tasks, and performance</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsCreateCampaignOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {!selectedCampaignId && campaigns.length > 0 && (
        <OnboardingHint
          id="campaigns-select"
          title="Select a Campaign"
          description="Choose a campaign from the dropdown to view and manage its tasks. You can organize different marketing initiatives as separate campaigns."
          variant="compact"
        />
      )}

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

      {selectedCampaign && (selectedCampaign.description || selectedCampaign.source) && (
        <Card>
          <CardContent className="pt-6 space-y-2">
            {selectedCampaign.description && (
              <p className="text-slate-600">{selectedCampaign.description}</p>
            )}
            {selectedCampaign.source && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FileText className="h-4 w-4" />
                <span>Source:</span>
                {selectedCampaign.source.url ? (
                  <a
                    href={selectedCampaign.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedCampaign.source.title || 'View Source'}
                  </a>
                ) : (
                  <span>{selectedCampaign.source.title || 'Untitled Source'}</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedCampaignId ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tasks">
              <List className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4 mt-6">
            {tasks.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Tasks Yet</CardTitle>
                  <CardDescription>
                    Get started by creating tasks or generating content from your sources
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 text-blue-700 rounded-full p-2 mt-0.5">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Generate with Claude AI</h4>
                        <p className="text-sm text-slate-600">
                          Use AI to create platform-optimized posts from your sources
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setIsGenerateContentOpen(true)}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Content
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-700 rounded-full p-2 mt-0.5">
                        <Plus className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Create Task Manually</h4>
                        <p className="text-sm text-slate-600">
                          Write and organize your own social media posts
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setIsCreateTaskOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Task
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <OnboardingHint
                  id="kanban-drag-drop"
                  title="Drag & Drop Tasks"
                  description="Drag task cards between columns (To Do → Draft → Scheduled → Posted) to update their status. You can also reorder tasks within each column."
                  variant="compact"
                />
                <KanbanBoard
                  tasks={tasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {stats ? (
              <>
                <OnboardingHint
                  id="dashboard-metrics"
                  title="Track Performance"
                  description='Monitor clicks, likes, and shares for your posts. Use the "Record Metrics" button on posted task cards to manually log engagement data.'
                  variant="compact"
                />
                <DashboardStats stats={stats} />
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Over Time (Last 30 Days)</CardTitle>
                    <CardDescription>
                      Track clicks, likes, and shares for this campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EngagementChart data={stats.engagementOverTime} />
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      💡 Track Link Clicks
                    </h3>
                    <p className="text-sm text-blue-800 mb-2">
                      To track clicks on links in your posts, use the redirect tracker URL:
                    </p>
                    <code className="block p-3 bg-white border border-blue-200 rounded text-xs text-slate-800">
                      {typeof window !== 'undefined' && `${window.location.origin}/r/{'{taskId}'}?url={'{destinationURL}'}`}
                    </code>
                    <p className="text-xs text-blue-700 mt-2">
                      Replace <span className="font-mono bg-white px-1 rounded">{'taskId'}</span> with your task ID and
                      <span className="font-mono bg-white px-1 rounded ml-1">{'destinationURL'}</span> with where you want users to go.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-slate-600 mb-2">No metrics data yet</p>
                  <p className="text-sm text-slate-500">
                    Metrics will appear here once your posts start getting engagement
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-slate-600">
            Select a campaign to view tasks and metrics
          </CardContent>
        </Card>
      )}

      <CreateCampaignDialog onCampaignCreated={loadData} />
      {selectedCampaignId && (
        <>
          <CreateTaskDialog
            campaignId={selectedCampaignId}
            onTaskCreated={refreshTasksAndCampaigns}
          />
          <GenerateContentDialog
            campaignId={selectedCampaignId}
            open={isGenerateContentOpen}
            onOpenChange={setIsGenerateContentOpen}
            onContentGenerated={refreshTasksAndCampaigns}
          />
        </>
      )}
    </div>
  );
}
