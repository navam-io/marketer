import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all campaigns
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        source: {
          select: {
            id: true,
            title: true,
            url: true
          }
        },
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, status, sourceId } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Campaign name is required' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description: description || null,
        status: status || 'active',
        sourceId: sourceId || null
      },
      include: {
        source: {
          select: {
            id: true,
            title: true,
            url: true
          }
        }
      }
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
