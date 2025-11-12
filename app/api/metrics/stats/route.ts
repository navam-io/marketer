import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET aggregated stats for dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    // Build where clause for campaign filter
    const taskWhere = campaignId ? { campaignId } : undefined;

    // Get total posted tasks
    const totalPosts = await prisma.task.count({
      where: {
        ...taskWhere,
        status: 'posted'
      }
    });

    // Get metrics by type
    const metricsWhere: any = {};
    if (campaignId) {
      metricsWhere.task = { campaignId };
    }

    const clicks = await prisma.metric.aggregate({
      where: {
        ...metricsWhere,
        type: 'click'
      },
      _sum: {
        value: true
      }
    });

    const likes = await prisma.metric.aggregate({
      where: {
        ...metricsWhere,
        type: 'like'
      },
      _sum: {
        value: true
      }
    });

    const shares = await prisma.metric.aggregate({
      where: {
        ...metricsWhere,
        type: 'share'
      },
      _sum: {
        value: true
      }
    });

    // Get engagement over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const engagementOverTime = await prisma.metric.groupBy({
      by: ['createdAt', 'type'],
      where: {
        ...metricsWhere,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        value: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Format engagement data for chart
    const chartData = engagementOverTime.reduce((acc: any[], curr) => {
      const date = new Date(curr.createdAt).toISOString().split('T')[0];
      let dayData = acc.find(d => d.date === date);

      if (!dayData) {
        dayData = { date, clicks: 0, likes: 0, shares: 0 };
        acc.push(dayData);
      }

      if (curr.type === 'click') dayData.clicks += curr._sum.value || 0;
      if (curr.type === 'like') dayData.likes += curr._sum.value || 0;
      if (curr.type === 'share') dayData.shares += curr._sum.value || 0;

      return acc;
    }, []);

    const stats = {
      totalPosts,
      totalClicks: clicks._sum.value || 0,
      totalLikes: likes._sum.value || 0,
      totalShares: shares._sum.value || 0,
      engagementOverTime: chartData
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
