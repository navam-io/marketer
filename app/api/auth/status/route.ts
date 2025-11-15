import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Auth Status Endpoint
 *
 * Returns the authentication status for LinkedIn and Twitter.
 * Used by the UI to show "Connect" or "Connected" buttons.
 */
export async function GET(request: NextRequest) {
  try {
    // Check if LinkedIn OAuth is configured
    const linkedinConfigured = !!(
      process.env.LINKEDIN_CLIENT_ID &&
      process.env.LINKEDIN_CLIENT_SECRET &&
      process.env.LINKEDIN_REDIRECT_URI
    );

    // Check if Twitter OAuth is configured (future feature)
    const twitterConfigured = !!(
      process.env.TWITTER_CLIENT_ID &&
      process.env.TWITTER_CLIENT_SECRET
    );

    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({
        linkedin: {
          connected: false,
          configured: linkedinConfigured
        },
        twitter: {
          connected: false,
          configured: twitterConfigured
        }
      });
    }

    // Check if LinkedIn token exists and is not expired
    const linkedinConnected = !!(
      user.linkedinAccessToken &&
      user.linkedinTokenExpiry &&
      user.linkedinTokenExpiry > new Date()
    );

    // Check if Twitter token exists and is not expired
    const twitterConnected = !!(
      user.twitterAccessToken &&
      user.twitterTokenExpiry &&
      user.twitterTokenExpiry > new Date()
    );

    return NextResponse.json({
      linkedin: {
        connected: linkedinConnected,
        configured: linkedinConfigured,
        userId: linkedinConnected ? user.linkedinUserId : null,
        expiresAt: linkedinConnected ? user.linkedinTokenExpiry : null
      },
      twitter: {
        connected: twitterConnected,
        configured: twitterConfigured,
        userId: twitterConnected ? user.twitterUserId : null,
        expiresAt: twitterConnected ? user.twitterTokenExpiry : null
      }
    });
  } catch (error) {
    console.error('Error fetching auth status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authentication status' },
      { status: 500 }
    );
  }
}
