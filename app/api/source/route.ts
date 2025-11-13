import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all sources
export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    });

    return NextResponse.json({ sources });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    );
  }
}
