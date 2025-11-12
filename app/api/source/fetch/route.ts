import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, text } = body;

    if (!url && !text) {
      return NextResponse.json(
        { error: 'Either URL or text is required' },
        { status: 400 }
      );
    }

    let title = '';
    let content = '';
    let rawHtml = '';
    let excerpt = '';

    if (url) {
      // Fetch URL content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NavamMarketer/1.0)',
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch URL: ${response.statusText}` },
          { status: response.status }
        );
      }

      rawHtml = await response.text();

      // Parse with Readability
      const dom = new JSDOM(rawHtml, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (!article) {
        return NextResponse.json(
          { error: 'Failed to parse article content' },
          { status: 400 }
        );
      }

      title = article.title || 'Untitled';
      content = article.textContent || '';
      excerpt = article.excerpt || content.substring(0, 200);
    } else if (text) {
      // Handle text input
      title = 'Text Snippet';
      content = text;
      excerpt = text.substring(0, 200);
    }

    // Save to database
    const source = await prisma.source.create({
      data: {
        url: url || null,
        title,
        content,
        rawHtml: rawHtml || null,
        excerpt,
      },
    });

    return NextResponse.json({
      success: true,
      source: {
        id: source.id,
        url: source.url,
        title: source.title,
        content: source.content,
        excerpt: source.excerpt,
        createdAt: source.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching source:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return NextResponse.json({ sources });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
