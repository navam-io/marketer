"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/components/dashboard-stats';
import { EngagementChart } from '@/components/engagement-chart';
import { ArrowLeft } from 'lucide-react';

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

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/metrics/stats');

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Performance Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Track your social media engagement and metrics
              </p>
            </div>
            <Link href="/campaigns">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-blue-600"></div>
              <p className="mt-4 text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchStats} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {/* KPI Cards */}
            <DashboardStats stats={stats} />

            {/* Engagement Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Engagement Over Time (Last 30 Days)
              </h2>
              <EngagementChart data={stats.engagementOverTime} />
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                💡 Track Link Clicks
              </h3>
              <p className="text-sm text-blue-800">
                To track clicks on links in your posts, use the redirect tracker URL:
              </p>
              <code className="block mt-2 p-3 bg-white border border-blue-200 rounded text-xs text-slate-800">
                {typeof window !== 'undefined' && `${window.location.origin}/r/{taskId}?url={destinationURL}`}
              </code>
              <p className="text-xs text-blue-700 mt-2">
                Replace <span className="font-mono bg-white px-1 rounded">{'{taskId}'}</span> with your task ID and
                <span className="font-mono bg-white px-1 rounded ml-1">{'{destinationURL}'}</span> with where you want users to go.
              </p>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
