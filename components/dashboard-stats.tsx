"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, MousePointerClick, Heart, Share2 } from 'lucide-react';

interface Stats {
  totalPosts: number;
  totalClicks: number;
  totalLikes: number;
  totalShares: number;
}

interface DashboardStatsProps {
  stats: Stats;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
          </div>
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <div className={color}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts,
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks,
      icon: <MousePointerClick className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes,
      icon: <Heart className="h-6 w-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Total Shares',
      value: stats.totalShares,
      icon: <Share2 className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
