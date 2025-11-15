import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * LinkedIn OAuth 2.0 - Initiate Authorization
 *
 * Redirects user to LinkedIn's authorization page to grant access.
 * LinkedIn will redirect back to /api/auth/linkedin/callback with an authorization code.
 *
 * Required environment variables:
 * - LINKEDIN_CLIENT_ID: Your LinkedIn app's client ID
 * - LINKEDIN_REDIRECT_URI: Your callback URL (e.g., http://localhost:3000/api/auth/linkedin/callback)
 *
 * Scopes requested:
 * - r_liteprofile: Read basic profile info
 * - w_member_social: Post updates on behalf of user
 */
export async function GET(request: NextRequest) {
  try {
    // Priority: User's database credentials > Environment variables (fallback)
    const user = await prisma.user.findFirst();

    let clientId: string | undefined;
    let clientSecret: string | undefined;
    let redirectUri: string | undefined;

    if (user?.linkedinClientId && user?.linkedinClientSecret && user?.linkedinRedirectUri) {
      // Use user's configured credentials from database
      clientId = user.linkedinClientId;
      clientSecret = user.linkedinClientSecret;
      redirectUri = user.linkedinRedirectUri;
    } else {
      // Fallback to environment variables (legacy support)
      clientId = process.env.LINKEDIN_CLIENT_ID;
      clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
      redirectUri = process.env.LINKEDIN_REDIRECT_URI;
    }

    // Check if LinkedIn OAuth is configured
    if (!clientId || !clientSecret || !redirectUri) {
      // Redirect back to campaigns page with error message instead of JSON response
      const errorMessage = encodeURIComponent(
        'LinkedIn OAuth is not configured. Please configure your LinkedIn app credentials in Settings.'
      );
      return NextResponse.redirect(
        new URL(`/campaigns?error=${errorMessage}`, request.url)
      );
    }

    // Generate a random state parameter for CSRF protection
    const state = Math.random().toString(36).substring(7);

    // Build LinkedIn authorization URL
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', 'r_liteprofile w_member_social');

    // Redirect to LinkedIn authorization page
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Error initiating LinkedIn OAuth:', error);
    const errorMessage = encodeURIComponent('Failed to initiate LinkedIn authorization');
    return NextResponse.redirect(
      new URL(`/campaigns?error=${errorMessage}`, request.url)
    );
  }
}
