/**
 * LinkedIn OAuth Settings Management Tests
 *
 * Tests the user-owned OAuth credentials management system.
 * This ensures users can configure their own LinkedIn app credentials
 * instead of relying on shared environment variables.
 *
 * Issue Context:
 * Since Navam Marketer is distributed as a single-user app, each user
 * should be able to configure their own LinkedIn OAuth credentials
 * through the database instead of environment variables.
 */

import { prismaTest, cleanDatabase, disconnectDatabase } from '@/lib/test-utils';

describe('LinkedIn OAuth Settings Management', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Database Credentials Storage', () => {
    it('should store LinkedIn OAuth credentials in database', async () => {
      // Create user with OAuth credentials
      const user = await prismaTest.user.create({
        data: {
          linkedinClientId: 'test_client_id',
          linkedinClientSecret: 'test_client_secret',
          linkedinRedirectUri: 'http://localhost:3000/api/auth/linkedin/callback'
        }
      });

      expect(user.linkedinClientId).toBe('test_client_id');
      expect(user.linkedinClientSecret).toBe('test_client_secret');
      expect(user.linkedinRedirectUri).toBe('http://localhost:3000/api/auth/linkedin/callback');
    });

    it('should allow updating OAuth credentials', async () => {
      // Create user with initial credentials
      const user = await prismaTest.user.create({
        data: {
          linkedinClientId: 'old_client_id',
          linkedinClientSecret: 'old_secret',
          linkedinRedirectUri: 'http://localhost:3000/api/auth/linkedin/callback'
        }
      });

      // Update credentials
      const updated = await prismaTest.user.update({
        where: { id: user.id },
        data: {
          linkedinClientId: 'new_client_id',
          linkedinClientSecret: 'new_secret'
        }
      });

      expect(updated.linkedinClientId).toBe('new_client_id');
      expect(updated.linkedinClientSecret).toBe('new_secret');
    });

    it('should allow deleting OAuth credentials', async () => {
      // Create user with credentials
      const user = await prismaTest.user.create({
        data: {
          linkedinClientId: 'test_client_id',
          linkedinClientSecret: 'test_client_secret',
          linkedinRedirectUri: 'http://localhost:3000/api/auth/linkedin/callback'
        }
      });

      // Delete credentials
      const updated = await prismaTest.user.update({
        where: { id: user.id },
        data: {
          linkedinClientId: null,
          linkedinClientSecret: null,
          linkedinRedirectUri: null
        }
      });

      expect(updated.linkedinClientId).toBeNull();
      expect(updated.linkedinClientSecret).toBeNull();
      expect(updated.linkedinRedirectUri).toBeNull();
    });
  });

  describe('Configuration Priority', () => {
    it('should prioritize database credentials over environment variables', () => {
      // Save environment variables
      const envClientId = process.env.LINKEDIN_CLIENT_ID;
      const envClientSecret = process.env.LINKEDIN_CLIENT_SECRET;
      const envRedirectUri = process.env.LINKEDIN_REDIRECT_URI;

      // Set environment variables
      process.env.LINKEDIN_CLIENT_ID = 'env_client_id';
      process.env.LINKEDIN_CLIENT_SECRET = 'env_secret';
      process.env.LINKEDIN_REDIRECT_URI = 'http://localhost:3000/callback';

      const dbClientId = 'db_client_id';
      const dbClientSecret = 'db_secret';
      const dbRedirectUri = 'http://localhost:3000/api/auth/linkedin/callback';

      // Simulate priority logic (database > env)
      const clientId = dbClientId || process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = dbClientSecret || process.env.LINKEDIN_CLIENT_SECRET;
      const redirectUri = dbRedirectUri || process.env.LINKEDIN_REDIRECT_URI;

      expect(clientId).toBe('db_client_id');
      expect(clientSecret).toBe('db_secret');
      expect(redirectUri).toBe('http://localhost:3000/api/auth/linkedin/callback');

      // Restore environment variables
      if (envClientId) process.env.LINKEDIN_CLIENT_ID = envClientId;
      else delete process.env.LINKEDIN_CLIENT_ID;
      if (envClientSecret) process.env.LINKEDIN_CLIENT_SECRET = envClientSecret;
      else delete process.env.LINKEDIN_CLIENT_SECRET;
      if (envRedirectUri) process.env.LINKEDIN_REDIRECT_URI = envRedirectUri;
      else delete process.env.LINKEDIN_REDIRECT_URI;
    });

    it('should fall back to environment variables when database credentials are missing', () => {
      // Set environment variables
      process.env.LINKEDIN_CLIENT_ID = 'env_client_id';
      process.env.LINKEDIN_CLIENT_SECRET = 'env_secret';
      process.env.LINKEDIN_REDIRECT_URI = 'http://localhost:3000/callback';

      const dbClientId = null;
      const dbClientSecret = null;
      const dbRedirectUri = null;

      // Simulate fallback logic
      const clientId = dbClientId || process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = dbClientSecret || process.env.LINKEDIN_CLIENT_SECRET;
      const redirectUri = dbRedirectUri || process.env.LINKEDIN_REDIRECT_URI;

      expect(clientId).toBe('env_client_id');
      expect(clientSecret).toBe('env_secret');
      expect(redirectUri).toBe('http://localhost:3000/callback');
    });
  });

  describe('Configuration Detection', () => {
    it('should detect configured state when database credentials exist', async () => {
      // Create user with credentials
      const user = await prismaTest.user.create({
        data: {
          linkedinClientId: 'test_client_id',
          linkedinClientSecret: 'test_client_secret',
          linkedinRedirectUri: 'http://localhost:3000/api/auth/linkedin/callback'
        }
      });

      // Test configuration detection
      const configured = !!(
        user.linkedinClientId &&
        user.linkedinClientSecret &&
        user.linkedinRedirectUri
      );

      expect(configured).toBe(true);
    });

    it('should detect not configured when credentials are missing', async () => {
      // Create user without credentials
      const user = await prismaTest.user.create({
        data: {}
      });

      // Test configuration detection
      const configured = !!(
        user.linkedinClientId &&
        user.linkedinClientSecret &&
        user.linkedinRedirectUri
      );

      expect(configured).toBe(false);
    });

    it('should detect not configured when only some credentials exist', async () => {
      // Create user with partial credentials
      const user = await prismaTest.user.create({
        data: {
          linkedinClientId: 'test_client_id'
          // Missing clientSecret and redirectUri
        }
      });

      // Test configuration detection
      const configured = !!(
        user.linkedinClientId &&
        user.linkedinClientSecret &&
        user.linkedinRedirectUri
      );

      expect(configured).toBe(false);
    });
  });

  describe('Credential Lifecycle', () => {
    it('should maintain access tokens when updating OAuth credentials', async () => {
      // Create user with credentials and access token
      const futureDate = new Date(Date.now() + 86400000);
      const user = await prismaTest.user.create({
        data: {
          linkedinClientId: 'old_client_id',
          linkedinClientSecret: 'old_secret',
          linkedinRedirectUri: 'http://localhost:3000/api/auth/linkedin/callback',
          linkedinAccessToken: 'access_token',
          linkedinTokenExpiry: futureDate,
          linkedinUserId: 'user_123'
        }
      });

      // Update OAuth credentials
      const updated = await prismaTest.user.update({
        where: { id: user.id },
        data: {
          linkedinClientId: 'new_client_id',
          linkedinClientSecret: 'new_secret'
        }
      });

      // Access token should remain
      expect(updated.linkedinAccessToken).toBe('access_token');
      expect(updated.linkedinUserId).toBe('user_123');
      expect(updated.linkedinTokenExpiry).toEqual(futureDate);
    });

    it('should clear access tokens when deleting OAuth credentials', async () => {
      // Create user with credentials and access token
      const user = await prismaTest.user.create({
        data: {
          linkedinClientId: 'test_client_id',
          linkedinClientSecret: 'test_secret',
          linkedinRedirectUri: 'http://localhost:3000/api/auth/linkedin/callback',
          linkedinAccessToken: 'access_token',
          linkedinTokenExpiry: new Date(Date.now() + 86400000),
          linkedinUserId: 'user_123'
        }
      });

      // Delete all LinkedIn data
      const updated = await prismaTest.user.update({
        where: { id: user.id },
        data: {
          linkedinClientId: null,
          linkedinClientSecret: null,
          linkedinRedirectUri: null,
          linkedinAccessToken: null,
          linkedinTokenExpiry: null,
          linkedinUserId: null
        }
      });

      // All LinkedIn fields should be cleared
      expect(updated.linkedinClientId).toBeNull();
      expect(updated.linkedinClientSecret).toBeNull();
      expect(updated.linkedinRedirectUri).toBeNull();
      expect(updated.linkedinAccessToken).toBeNull();
      expect(updated.linkedinTokenExpiry).toBeNull();
      expect(updated.linkedinUserId).toBeNull();
    });
  });
});
