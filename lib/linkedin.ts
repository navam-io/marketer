/**
 * LinkedIn API Integration
 *
 * Functions for posting content to LinkedIn using the UGC Posts API.
 * Requires OAuth 2.0 access token with w_member_social scope.
 *
 * API Documentation: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
 */

import { prisma } from '@/lib/prisma';

interface LinkedInPostResponse {
  id: string;
  url?: string;
}

interface LinkedInErrorResponse {
  message: string;
  status: number;
  serviceErrorCode?: number;
}

/**
 * Get the current user's LinkedIn access token from database
 * Throws error if token doesn't exist or is expired
 */
async function getLinkedInAccessToken(): Promise<{ token: string; userId: string }> {
  const user = await prisma.user.findFirst();

  if (!user || !user.linkedinAccessToken) {
    throw new Error('LinkedIn not connected. Please connect your LinkedIn account first.');
  }

  if (!user.linkedinTokenExpiry || user.linkedinTokenExpiry < new Date()) {
    throw new Error('LinkedIn token expired. Please reconnect your LinkedIn account.');
  }

  if (!user.linkedinUserId) {
    throw new Error('LinkedIn user ID not found. Please reconnect your LinkedIn account.');
  }

  return {
    token: user.linkedinAccessToken,
    userId: user.linkedinUserId
  };
}

/**
 * Post text content to LinkedIn as a UGC post
 *
 * @param content - The text content to post
 * @returns Object with post ID and URL
 * @throws Error if posting fails
 */
export async function postToLinkedIn(content: string): Promise<LinkedInPostResponse> {
  try {
    const { token, userId } = await getLinkedInAccessToken();

    // Build LinkedIn UGC Post request
    // Reference: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin#create-a-ugc-post
    const postData = {
      author: `urn:li:person:${userId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      const error: LinkedInErrorResponse = {
        message: errorData.message || 'Failed to post to LinkedIn',
        status: response.status,
        serviceErrorCode: errorData.serviceErrorCode
      };

      console.error('LinkedIn API error:', error);
      throw new Error(`LinkedIn posting failed: ${error.message}`);
    }

    const responseData = await response.json();
    const postId = responseData.id;

    // LinkedIn UGC post URLs follow this pattern:
    // https://www.linkedin.com/feed/update/urn:li:share:ACTIVITY_ID
    // The post ID from the API is the URN (e.g., urn:li:share:1234567890)
    const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

    return {
      id: postId,
      url: postUrl
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while posting to LinkedIn');
  }
}

/**
 * Check if LinkedIn is currently connected (has valid token)
 */
export async function isLinkedInConnected(): Promise<boolean> {
  try {
    await getLinkedInAccessToken();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get LinkedIn connection status with details
 */
export async function getLinkedInStatus(): Promise<{
  connected: boolean;
  userId?: string;
  expiresAt?: Date;
}> {
  try {
    const user = await prisma.user.findFirst();

    if (!user || !user.linkedinAccessToken) {
      return { connected: false };
    }

    const isExpired = !user.linkedinTokenExpiry || user.linkedinTokenExpiry < new Date();

    if (isExpired) {
      return { connected: false };
    }

    return {
      connected: true,
      userId: user.linkedinUserId || undefined,
      expiresAt: user.linkedinTokenExpiry || undefined
    };
  } catch (error) {
    console.error('Error checking LinkedIn status:', error);
    return { connected: false };
  }
}
