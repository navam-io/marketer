import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * LinkedIn OAuth Settings API
 *
 * Allows users to configure their own LinkedIn OAuth app credentials
 * instead of relying on environment variables.
 *
 * This enables single-user deployments where each user brings their own
 * LinkedIn app credentials.
 */

/**
 * GET - Retrieve current LinkedIn OAuth settings
 * Returns whether credentials are configured (without exposing secrets)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({
        configured: false,
        clientId: null,
        redirectUri: null
      });
    }

    // Return whether credentials are configured without exposing secrets
    return NextResponse.json({
      configured: !!(user.linkedinClientId && user.linkedinClientSecret && user.linkedinRedirectUri),
      clientId: user.linkedinClientId || null,
      redirectUri: user.linkedinRedirectUri || null
    });
  } catch (error) {
    console.error('Error fetching LinkedIn settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LinkedIn settings' },
      { status: 500 }
    );
  }
}

/**
 * POST - Save LinkedIn OAuth app credentials
 * Stores user's own LinkedIn app credentials in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, clientSecret, redirectUri } = body;

    // Validate required fields
    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: 'Client ID, Client Secret, and Redirect URI are required' },
        { status: 400 }
      );
    }

    // Validate redirect URI format
    try {
      new URL(redirectUri);
    } catch {
      return NextResponse.json(
        { error: 'Invalid Redirect URI format' },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findFirst();

    if (user) {
      // Update existing user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          linkedinClientId: clientId.trim(),
          linkedinClientSecret: clientSecret.trim(),
          linkedinRedirectUri: redirectUri.trim()
        }
      });
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          linkedinClientId: clientId.trim(),
          linkedinClientSecret: clientSecret.trim(),
          linkedinRedirectUri: redirectUri.trim()
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'LinkedIn OAuth credentials saved successfully'
    });
  } catch (error) {
    console.error('Error saving LinkedIn settings:', error);
    return NextResponse.json(
      { error: 'Failed to save LinkedIn settings' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove LinkedIn OAuth app credentials
 * Clears user's LinkedIn app credentials and disconnects account
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'No credentials to delete'
      });
    }

    // Clear LinkedIn OAuth credentials and tokens
    await prisma.user.update({
      where: { id: user.id },
      data: {
        linkedinClientId: null,
        linkedinClientSecret: null,
        linkedinRedirectUri: null,
        linkedinAccessToken: null,
        linkedinRefreshToken: null,
        linkedinTokenExpiry: null,
        linkedinUserId: null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'LinkedIn OAuth credentials removed successfully'
    });
  } catch (error) {
    console.error('Error deleting LinkedIn settings:', error);
    return NextResponse.json(
      { error: 'Failed to delete LinkedIn settings' },
      { status: 500 }
    );
  }
}
