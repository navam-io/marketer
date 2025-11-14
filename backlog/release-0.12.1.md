# Release v0.12.1 - Data Export/Import

**Released:** 2025-11-13
**Type:** Minor Feature Release
**Theme:** Campaign backup and portability

---

## Overview

This release implements the Data Export/Import feature (P2-7 from backlog), enabling users to backup campaigns with all related data and transfer them between environments. This is a critical feature for data portability, disaster recovery, and sharing campaign templates.

---

## Features

### Campaign Export

**Feature:** Export campaigns as JSON files with complete data
**Location:** Campaigns page → Select campaign → Export button

**Capabilities:**
- Export campaign metadata (name, description, status)
- Include all tasks with their properties (platform, status, content, scheduling)
- Include all metrics for each task (clicks, likes, shares, custom metrics)
- Include source attribution if campaign originated from a source
- Preserve all timestamps (createdAt, scheduledAt, postedAt)
- Downloaded as versioned JSON file with descriptive filename

**Export Format:**
```json
{
  "version": "1.0.0",
  "exportedAt": "2025-11-13T12:00:00.000Z",
  "campaign": {
    "name": "Campaign Name",
    "description": "Campaign description",
    "status": "active",
    "source": { /* source data if applicable */ },
    "tasks": [
      {
        "platform": "linkedin",
        "status": "posted",
        "content": "Post content",
        "metrics": [
          { "type": "click", "value": 10 }
        ]
      }
    ]
  }
}
```

### Campaign Import

**Feature:** Import campaigns from JSON export files
**Location:** Campaigns page → Import button (top right)

**Capabilities:**
- Import complete campaign with all tasks and metrics
- Automatically recreate source if included in export
- Validate import file format and version
- Detect duplicate campaign names and prevent conflicts
- Link tasks to the imported source
- Preserve all original timestamps
- Auto-select newly imported campaign

**Validation:**
- Version compatibility check (supports v1.0.0)
- Required field validation (campaign name)
- Duplicate campaign name detection with clear error messages
- JSON format validation

### User Experience

**Export Workflow:**
1. Navigate to Campaigns page
2. Select campaign from dropdown
3. Click "Export" button
4. JSON file downloads automatically with campaign-specific filename
5. Success notification shown

**Import Workflow:**
1. Navigate to Campaigns page
2. Click "Import" button
3. Select JSON file from file picker
4. Import processes automatically
5. Success message shows imported campaign details
6. Newly imported campaign is auto-selected

**Error Handling:**
- Duplicate campaign name: Clear error message with guidance
- Invalid file format: Validation error shown
- Version mismatch: Unsupported version error
- File selection: Can cancel or retry

---

## Technical Implementation

### API Routes

**GET /api/campaigns/[id]/export**
- Fetches campaign with all relations (tasks, metrics, source)
- Formats data in versioned export format
- Returns as downloadable JSON file
- Sets appropriate Content-Disposition header with filename

**POST /api/campaigns/import**
- Accepts JSON export data in request body
- Validates version and required fields
- Checks for duplicate campaign names
- Creates source first if included
- Creates campaign with nested tasks and metrics in single transaction
- Returns success message with import summary

### Database Operations

**Export:**
```typescript
await prisma.campaign.findUnique({
  where: { id },
  include: {
    tasks: {
      include: { metrics: true },
      orderBy: { createdAt: 'asc' }
    },
    source: true
  }
});
```

**Import:**
```typescript
await prisma.campaign.create({
  data: {
    name, description, status, sourceId,
    tasks: {
      create: tasks.map(task => ({
        ...task,
        metrics: {
          create: task.metrics
        }
      }))
    }
  }
});
```

### UI Components

**Modified Files:**
- `app/campaigns/page.tsx` - Added export/import handlers and UI buttons
  - `handleExport()` - Downloads campaign as JSON file
  - `handleImport()` - Processes imported JSON file
  - Import button with hidden file input
  - Export button next to Archive button

**New Icons:**
- `Download` - Export button icon
- `Upload` - Import button icon

---

## Testing

### Integration Tests

**New Test File:** `__tests__/integration/campaign-export-import.test.ts`

**Test Coverage:** 13 new tests
- Campaign Export (5 tests)
  - Export with basic data
  - Export with tasks
  - Export with tasks and metrics
  - Export with source attribution
  - Export with scheduled/posted tasks
- Campaign Import (6 tests)
  - Import basic campaign
  - Import with tasks
  - Import with tasks and metrics
  - Import with source
  - Duplicate name detection
  - Complete round-trip (export → import)
- Export Format Validation (2 tests)
  - Version format validation
  - Property preservation

**Updated Files:**
- `lib/test-utils.ts` - Enhanced helper functions
  - Added `sourceId` support to `createTestCampaign()`
  - Added `scheduledAt`, `postedAt`, `outputJson` support to `createTestTask()`

### Test Results

**Before:** 241 tests passing
**After:** 254 tests passing (+13)
**Regressions:** 0
**Pass Rate:** 100%
**Execution Time:** ~2.6 seconds

---

## Files Changed

### New Files (3)
1. `app/api/campaigns/[id]/export/route.ts` - Export endpoint (77 lines)
2. `app/api/campaigns/import/route.ts` - Import endpoint (133 lines)
3. `__tests__/integration/campaign-export-import.test.ts` - Tests (558 lines)

### Modified Files (2)
1. `app/campaigns/page.tsx` - Added export/import UI (+68 lines)
2. `lib/test-utils.ts` - Enhanced test helpers (+6 lines)

**Total Lines Added:** ~850 lines
**Code Quality:** All tests passing, no regressions

---

## Use Cases

### Backup & Recovery
- Export campaigns regularly for backup
- Restore campaigns if database is lost
- Migrate campaigns between environments (dev → staging → production)

### Campaign Templates
- Export successful campaign as template
- Import template to start new campaign
- Share campaign structures with team members

### Data Portability
- Move campaigns between Navam Marketer instances
- Archive old campaigns to free up UI space
- Keep historical campaign data for analysis

### Testing & Development
- Export production campaigns for testing
- Create test fixtures from real data
- Reproduce bugs with exported data

---

## Known Limitations

1. **Campaign Names Must Be Unique**
   - Import fails if campaign name already exists
   - Workaround: Rename campaign in JSON file before import
   - Future: Could add auto-rename option (e.g., "Campaign Name (1)")

2. **Source Duplication**
   - If source already exists, a duplicate is created on import
   - Workaround: Remove source data from JSON if not needed
   - Future: Could add source deduplication by URL

3. **No Partial Import**
   - Must import entire campaign (can't import just tasks)
   - Workaround: Edit JSON file to modify what's imported
   - Future: Could add selective import options

4. **Version Compatibility**
   - Only supports v1.0.0 export format
   - Future versions may need migration logic
   - Will maintain backward compatibility when possible

---

## Migration Notes

**No database schema changes** - This is a pure feature addition.

**No breaking changes** - All existing functionality preserved.

**Backward compatible** - Works with all existing campaigns and data.

---

## User Documentation

### How to Export a Campaign

1. Open the Campaigns page
2. Select the campaign you want to export from the dropdown
3. Click the "Export" button (download icon)
4. The campaign will download as a JSON file
5. Store the file safely for backup or transfer

**File naming:** `campaign-{name}-{timestamp}.json`
**Example:** `campaign-product-launch-1731513600000.json`

### How to Import a Campaign

1. Open the Campaigns page
2. Click the "Import" button at the top right (upload icon)
3. Select a campaign export JSON file from your computer
4. The campaign will be imported automatically
5. A success message will show the imported campaign details
6. The newly imported campaign will be selected automatically

**Important:** Campaign names must be unique. If a campaign with the same name exists, you'll need to rename it in the JSON file before importing.

---

## Future Enhancements

**Planned for v0.12.2+:**
1. Bulk export/import (multiple campaigns at once)
2. Auto-rename on duplicate (add "(1)", "(2)" suffix)
3. Source deduplication by URL
4. Selective import (choose which tasks to import)
5. Import preview before committing
6. Export filtering (e.g., only posted tasks, only with metrics)

---

## Comparison: Before vs After

### Before v0.12.1
- ❌ No way to backup campaigns
- ❌ No data portability between environments
- ❌ Risk of data loss
- ❌ Can't share campaign structures
- ❌ No campaign templates

### After v0.12.1
- ✅ Export campaigns as JSON with complete data
- ✅ Import campaigns from JSON files
- ✅ Data portability and backup
- ✅ Campaign templates via export/import
- ✅ Safe disaster recovery
- ✅ Team collaboration on campaign structures

---

## Version History

- **v0.12.0** - Prisma Migrations Setup
- **v0.12.1** - Data Export/Import (this release)
- **v0.12.2** - Planned: Enhanced export/import features

---

## Acknowledgments

This feature completes the "Data Management" theme from the improvement phase (P2-7), addressing user feedback about data backup and portability needs. The implementation follows the MLP philosophy: minimal code, maximum value, production-ready testing.

**Test-First Approach:** 13 comprehensive integration tests ensure production reliability and data integrity for export/import operations.

---

**Release Date:** 2025-11-13
**Version:** 0.12.1
**Status:** ✅ Released
**Tests:** 254 passing (100%)
**Quality:** Production-ready
