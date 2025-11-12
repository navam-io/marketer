import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all tasks (optionally filtered by campaign)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    const tasks = await prisma.task.findMany({
      where: campaignId ? { campaignId } : undefined,
      include: {
        campaign: true,
        source: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      campaignId,
      sourceId,
      platform,
      status,
      content,
      outputJson,
      scheduledAt
    } = body;

    const task = await prisma.task.create({
      data: {
        campaignId: campaignId || null,
        sourceId: sourceId || null,
        platform: platform || null,
        status: status || 'todo',
        content: content || null,
        outputJson: outputJson || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      },
      include: {
        campaign: true,
        source: true
      }
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
