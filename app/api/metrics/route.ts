import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all metrics (optionally filtered by task, campaign, or type)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const campaignId = searchParams.get('campaignId');
    const type = searchParams.get('type');

    const where: any = {};

    if (taskId) {
      where.taskId = taskId;
    }

    if (campaignId) {
      where.task = {
        campaignId
      };
    }

    if (type) {
      where.type = type;
    }

    const metrics = await prisma.metric.findMany({
      where,
      include: {
        task: {
          include: {
            campaign: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

// POST create new metric
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, type, value } = body;

    if (!taskId || !type) {
      return NextResponse.json(
        { error: 'taskId and type are required' },
        { status: 400 }
      );
    }

    const metric = await prisma.metric.create({
      data: {
        taskId,
        type,
        value: value || 0
      },
      include: {
        task: true
      }
    });

    return NextResponse.json({ metric }, { status: 201 });
  } catch (error) {
    console.error('Error creating metric:', error);
    return NextResponse.json(
      { error: 'Failed to create metric' },
      { status: 500 }
    );
  }
}
