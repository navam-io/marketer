import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * LinkedIn OAuth 2.0 - Callback Handler
 *
 * Receives authorization code from LinkedIn, exchanges it for access tokens,
 * and stores them in the database for the single user.
 *
 * Flow:
 * 1. LinkedIn redirects here with ?code=xxx&state=xxx
 * 2. Exchange authorization code for access token
 * 3. Fetch LinkedIn user profile (to get user ID)
 * 4. Store or update tokens in User table (single row)
 * 5. Redirect to campaigns page with success message
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('LinkedIn OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/campaigns?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/campaigns?error=No authorization code received', request.url)
      );
    }

    // Get user to check for database credentials
    let user = await prisma.user.findFirst();

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

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(
        new URL('/campaigns?error=LinkedIn OAuth not configured', request.url)
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('LinkedIn token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/campaigns?error=Failed to exchange authorization code', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in; // seconds
    const tokenExpiry = new Date(Date.now() + expiresIn * 1000);

    // Fetch LinkedIn user profile to get user ID
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!profileResponse.ok) {
      console.error('Failed to fetch LinkedIn profile');
      return NextResponse.redirect(
        new URL('/campaigns?error=Failed to fetch profile', request.url)
      );
    }

    const profileData = await profileResponse.json();
    const linkedinUserId = profileData.id;

    // Store or update tokens in User table (single user)
    // Re-fetch user in case it was created during credential check
    user = await prisma.user.findFirst();

    if (user) {
      // Update existing user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          linkedinAccessToken: accessToken,
          linkedinTokenExpiry: tokenExpiry,
          linkedinUserId: linkedinUserId
        }
      });
    } else {
      // Create new user (first time)
      await prisma.user.create({
        data: {
          linkedinAccessToken: accessToken,
          linkedinTokenExpiry: tokenExpiry,
          linkedinUserId: linkedinUserId
        }
      });
    }

    // Redirect to campaigns page with success message
    return NextResponse.redirect(
      new URL('/campaigns?linkedin=connected', request.url)
    );
  } catch (error) {
    console.error('Error in LinkedIn OAuth callback:', error);
    return NextResponse.redirect(
      new URL('/campaigns?error=LinkedIn authentication failed', request.url)
    );
  }
}
