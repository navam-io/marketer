import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE a source
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete the source (tasks will have sourceId set to null due to onDelete: SetNull)
    await prisma.source.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Source deleted successfully' });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json(
      { error: 'Failed to delete source' },
      { status: 500 }
    );
  }
}
