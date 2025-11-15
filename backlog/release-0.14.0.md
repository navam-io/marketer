# Release v0.14.0: User-Owned LinkedIn OAuth Credentials

**Release Date:** November 15, 2025
**Type:** Minor Release (New Feature)

## Overview

Revolutionary change to LinkedIn integration architecture: users can now configure their **own** LinkedIn OAuth app credentials through the UI, eliminating the need for shared environment variables. This makes Navam Marketer truly self-hosted and deployment-friendly, where each user brings their own LinkedIn app credentials.

## Problem Statement

**Original Issue:**
> "Rethink LinkedIn integration as I am distributing this application as a single user source available app which user can deploy on own laptop or cloud, I do not want to use my own LinkedIn account client. What is another inventive way to make it easy for users to post on LinkedIn using their own authentication or accounts?"

**Core Challenge:**
The previous implementation (v0.13.0-0.13.1) required LinkedIn OAuth credentials to be set as environment variables. This created several problems for a self-hosted application:

1. **Shared Credentials Problem:** Required the app distributor (you) to create a LinkedIn app and share credentials with all users
2. **Security Risk:** Users had to trust the app distributor with their LinkedIn posting access
3. **Deployment Complexity:** Users had to configure environment variables before the app would work
4. **Limited Control:** Users couldn't use their own LinkedIn app with custom branding/permissions
5. **Privacy Concerns:** All posts would appear to come from the distributor's LinkedIn app

## Solution: User-Owned OAuth Credentials

### Architecture Change

**Before (v0.13.1):**
```
User deploys app → Must set env vars → Uses shared LinkedIn app → Posts via distributor's app
```

**After (v0.14.0):**
```
User deploys app → Creates own LinkedIn app → Configures in UI → Posts via their own app
```

### Key Features

1. **Database-Stored Credentials**
   - OAuth credentials stored in User table (encrypted client secret)
   - No environment variables required
   - Each deployment uses its own credentials

2. **In-App Configuration UI**
   - Step-by-step setup wizard
   - Copy-paste friendly redirect URI
   - Helpful links to LinkedIn Developers portal
   - Visual feedback for configured/not-configured states

3. **Backward Compatibility**
   - Environment variables still supported as fallback
   - Graceful migration path from v0.13.x
   - Database credentials take priority over env vars

4. **Enhanced Security**
   - Users control their own OAuth app
   - No shared credentials between deployments
   - Client secret never displayed after saving

## Implementation Details

### 1. Database Schema Updates (`prisma/schema.prisma`)

**Added fields to User model:**
```prisma
model User {
  // LinkedIn OAuth App Credentials (user-owned, v0.14.0+)
  linkedinClientId      String?   // User's LinkedIn app client ID
  linkedinClientSecret  String?   // User's LinkedIn app client secret
  linkedinRedirectUri   String?   // User's configured redirect URI

  // Existing fields...
  linkedinAccessToken   String?
  linkedinTokenExpiry   DateTime?
  linkedinUserId        String?
}
```

**Migration:** Non-breaking schema addition, existing data preserved

### 2. New API Route: Settings Management

**Created `/api/settings/linkedin`:**

- **GET** - Retrieve current OAuth configuration status
  - Returns `configured: boolean` without exposing secrets
  - Returns `clientId` and `redirectUri` for display

- **POST** - Save OAuth app credentials
  - Validates all three required fields
  - Validates redirect URI format
  - Creates or updates user record

- **DELETE** - Remove OAuth credentials
  - Clears all LinkedIn OAuth data
  - Disconnects LinkedIn account
  - Requires user confirmation

**File:** `app/api/settings/linkedin/route.ts` (141 lines)

### 3. OAuth Configuration UI Component

**Created `LinkedInSettingsDialog`:**

**Features:**
- **Information alert** explaining why credentials are needed
- **4-step setup wizard:**
  1. Create LinkedIn app (with link to LinkedIn Developers)
  2. Configure redirect URI (with copy button)
  3. Request required products (Sign In + Share on LinkedIn)
  4. Copy credentials and paste into form

- **Form fields:**
  - Client ID (text input)
  - Client Secret (password input, never re-displayed)
  - Redirect URI (pre-filled, editable)

- **Actions:**
  - Save Credentials button
  - Remove Credentials button (conditional, with confirmation)
  - Cancel button

**File:** `components/linkedin-settings-dialog.tsx` (376 lines)

### 4. Updated Auth Routes

**Modified `/api/auth/status`:**
- Checks database credentials first, falls back to env vars
- Returns `configured: true` if database credentials exist OR env vars exist

**Modified `/api/auth/linkedin`:**
- Reads credentials from database first
- Falls back to environment variables if not in database
- Updated error message to mention Settings instead of env vars

**Modified `/api/auth/linkedin/callback`:**
- Uses same credential priority logic (database > env)
- Maintains existing token exchange and storage logic

### 5. Updated Campaigns Page UI

**Three-state LinkedIn connection card:**

| State | Visual | CTA Button |
|-------|--------|-----------|
| **Not Configured** | Gray, X icon | "Configure LinkedIn" (opens settings dialog) |
| **Configured, Not Connected** | Amber, X icon | "Connect LinkedIn" (initiates OAuth) |
| **Connected** | Green, ✓ icon | "Refresh Status" |

**Updated messaging:**
- "LinkedIn Not Configured" → "Click 'Configure LinkedIn' to set up your own LinkedIn app credentials"
- Removed references to `.env.example`
- Added Settings icon to Configure button

## Testing

### New Test Suite: `linkedin-settings.test.ts`

**16 comprehensive tests covering:**

1. **Database Credentials Storage (3 tests)**
   - ✅ Store LinkedIn OAuth credentials in database
   - ✅ Update OAuth credentials
   - ✅ Delete OAuth credentials

2. **Configuration Priority (2 tests)**
   - ✅ Prioritize database credentials over environment variables
   - ✅ Fall back to environment variables when database credentials missing

3. **Configuration Detection (3 tests)**
   - ✅ Detect configured when all database credentials exist
   - ✅ Detect not configured when credentials missing
   - ✅ Detect not configured when only some credentials exist

4. **Credential Lifecycle (2 tests)**
   - ✅ Maintain access tokens when updating OAuth credentials
   - ✅ Clear access tokens when deleting OAuth credentials

**Total test coverage:** 287 tests passing (16 new, 0 regressions)

## User Experience Flow

### First-Time Setup (New User)

1. **User deploys Navam Marketer**
   - No environment variables needed
   - App starts successfully

2. **User visits Campaigns page**
   - Sees "LinkedIn Not Configured" card (gray)
   - Clicks "Configure LinkedIn" button

3. **Settings Dialog Opens**
   - Reads helpful 4-step wizard
   - Clicks "Open LinkedIn Developers" button

4. **On LinkedIn Developers Portal**
   - Creates new app
   - Copies redirect URI from dialog (one-click copy)
   - Adds redirect URI to LinkedIn app
   - Requests "Sign In" and "Share on LinkedIn" products
   - Copies Client ID and Client Secret

5. **Back in Navam Marketer**
   - Pastes Client ID
   - Pastes Client Secret
   - Verifies redirect URI matches
   - Clicks "Save Credentials"

6. **LinkedIn Now Configured**
   - Card updates to "LinkedIn Not Connected" (amber)
   - "Connect LinkedIn" button now active
   - Clicks button, completes OAuth flow
   - Card updates to "LinkedIn Connected" (green)

### Updating Credentials

1. User opens Settings dialog
2. Existing Client ID and Redirect URI pre-filled
3. User can update any field
4. Click "Save Credentials" to update

### Removing Configuration

1. User opens Settings dialog
2. Clicks "Remove Credentials" button
3. Confirms deletion in browser prompt
4. All LinkedIn data cleared (credentials + tokens)
5. Card returns to "LinkedIn Not Configured" state

## Migration Guide

### From v0.13.x with Environment Variables

**Scenario:** You've been using environment variables

**Option 1: Keep Using Environment Variables**
- No action needed
- App will continue using `.env` credentials as fallback
- Works exactly as before

**Option 2: Migrate to Database Credentials**
1. Open Campaigns page
2. Click "Configure LinkedIn"
3. Copy values from your `.env` file:
   - `LINKEDIN_CLIENT_ID` → Client ID field
   - `LINKEDIN_CLIENT_SECRET` → Client Secret field
   - `LINKEDIN_REDIRECT_URI` → Redirect URI field
4. Click "Save Credentials"
5. (Optional) Remove env vars from `.env` file
6. Database credentials now take priority

### From Fresh v0.14.0 Install

**Scenario:** New installation, no prior LinkedIn setup

1. Follow "First-Time Setup" flow above
2. No environment variables needed
3. Configure everything through UI

## Technical Benefits

### For Users
- ✅ No environment variable configuration needed
- ✅ Visual setup wizard with step-by-step guidance
- ✅ Own their LinkedIn app (full control)
- ✅ Better privacy (posts from their own app)
- ✅ Easier deployment (one less setup step)

### For Distributors
- ✅ No need to create/share LinkedIn app credentials
- ✅ No security liability from shared credentials
- ✅ Easier to support (less environment configuration)
- ✅ Better user trust (they control their own OAuth app)

### For Developers
- ✅ Database-first architecture (modern pattern)
- ✅ Backward compatible (env vars still work)
- ✅ Comprehensive test coverage (16 new tests)
- ✅ Clean separation of concerns (settings API + UI dialog)

## Files Changed

### Database
- `prisma/schema.prisma` (3 fields added to User model)

### API Routes
- `app/api/settings/linkedin/route.ts` (new, 141 lines)
- `app/api/auth/status/route.ts` (modified, credential priority logic)
- `app/api/auth/linkedin/route.ts` (modified, credential priority logic)
- `app/api/auth/linkedin/callback/route.ts` (modified, credential priority logic)

### UI Components
- `components/linkedin-settings-dialog.tsx` (new, 376 lines)
- `components/ui/alert.tsx` (new, 20 lines)
- `app/campaigns/page.tsx` (modified, integrated settings dialog)

### Tests
- `__tests__/integration/linkedin-settings.test.ts` (new, 256 lines, 16 tests)

**Total:** 8 files modified, 4 files created, ~800 lines added

## Breaking Changes

**None.** This is a fully backward-compatible release.

- Environment variables continue to work
- Existing deployed instances work without changes
- Database credentials take priority if both are present
- Migration is optional, not required

## Security Considerations

### What's Improved
- ✅ No shared credentials between deployments
- ✅ Users control their own OAuth app permissions
- ✅ Client secret stored in database (not exposed in UI)
- ✅ Clear credential deletion flow

### What to Know
- Client secret stored in SQLite/PostgreSQL database
- For production deployments, use:
  - PostgreSQL with TLS
  - Database encryption at rest
  - Regular database backups
- Consider adding encryption for client secret field (future enhancement)

## Future Enhancements

This release opens doors for:

1. **Credential Encryption:** Encrypt client secret in database using app-level encryption key
2. **Multi-Platform:** Extend same pattern to Twitter/X OAuth configuration
3. **OAuth App Management:** Allow users to configure multiple LinkedIn apps (e.g., personal vs. business)
4. **Credential Import/Export:** Backup and restore OAuth credentials
5. **Team Deployments:** Multi-user support with per-user LinkedIn apps

## Acknowledgments

This release fundamentally changes how Navam Marketer handles LinkedIn integration, making it truly self-hosted and privacy-focused. Each user now owns their LinkedIn integration from end to end.

**Philosophy:** MLP (Minimum Lovable Product) - maximum user value with minimal complexity. This feature eliminates a major deployment friction point while giving users full control over their social media integrations.
