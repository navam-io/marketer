# Release v0.4.1 - Fix Build Warning

**Release Date:** November 12, 2025
**Type:** Patch Release (Bug Fix)
**Semver:** 0.4.0 → 0.4.1

---

## Summary

This patch release fixes a build warning related to deprecated Next.js configuration. The `experimental.instrumentationHook` option is no longer needed in Next.js 15, as instrumentation hooks are now a stable feature supported by default.

---

## Bug Fixes

### 🔧 Next.js Configuration Warning

**Issue:**
Build process showed the following warning:
```
⚠ Invalid next.config.ts options detected:
⚠     Unrecognized key(s) in object: 'instrumentationHook' at "experimental"
⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
⚠ `experimental.instrumentationHook` is no longer needed to be configured in Next.js
```

**Root Cause:**
In Next.js 15, the `instrumentation.ts` file is now a stable feature and works automatically without requiring the experimental flag in configuration.

**Fix:**
- Removed `experimental.instrumentationHook: true` from `next.config.ts`
- Instrumentation file (`instrumentation.ts`) continues to work as expected
- Background scheduler still initializes correctly on server start

**Files Changed:**
- `next.config.ts` - Removed deprecated experimental configuration

---

## Technical Details

### What Changed

**Before (`next.config.ts`):**
```typescript
const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: true,
  },
};
```

**After (`next.config.ts`):**
```typescript
const nextConfig: NextConfig = {
  /* config options here */
};
```

### Why This Works

In Next.js 15.0.3:
- Instrumentation hooks are now a stable API feature
- The `instrumentation.ts` file at the project root is automatically detected
- No configuration flag is needed
- The `register()` function is called on server initialization as expected

### Verification

**Build Output:**
- ✅ Clean build with no warnings
- ✅ Optimized production build successful
- ✅ All routes compiled correctly

**Test Results:**
- ✅ All 60 tests passing
- ✅ No regressions detected
- ✅ Scheduler integration tests pass
- ✅ Background scheduler initializes correctly

---

## Impact

### User Impact
**None** - This is a configuration-only change with no user-facing impact.

### Developer Impact
- Cleaner build output (no warnings)
- Configuration aligned with Next.js 15 best practices
- No code changes required

---

## Testing

### Regression Testing

**Build Test:**
```bash
npm run build
# Result: ✅ Clean build, no warnings
```

**Unit/Integration Tests:**
```bash
npm test
# Result: 60 passed, 60 total
```

**Scheduler Functionality:**
- ✅ Background scheduler starts on server init
- ✅ Instrumentation register() function executes
- ✅ Console log confirms: "[Instrumentation] Background scheduler initialized"

---

## Files Modified

1. **next.config.ts**
   - Removed `experimental` configuration block
   - Cleaned up deprecated option

2. **package.json**
   - Version bump: 0.4.0 → 0.4.1

---

## Migration Notes

### For Existing Users

**No Action Required** - This is a transparent bug fix.

The build will now be cleaner without warnings. All existing functionality continues to work exactly as before.

### For Developers

If you see similar warnings in your Next.js 15 projects:
- Remove `experimental.instrumentationHook` from your `next.config.ts`
- The `instrumentation.ts` file works automatically in Next.js 15
- See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

---

## References

- **Next.js Instrumentation Docs:** https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
- **Next.js 15 Release Notes:** Instrumentation hooks are now stable
- **Issue Tracker:** `backlog/issues.md`

---

## Validation

### Checklist

- [x] Issue identified in `backlog/issues.md`
- [x] Root cause analyzed (deprecated config option)
- [x] Fix implemented (removed experimental flag)
- [x] Build runs clean with no warnings
- [x] All 60 tests pass (no regressions)
- [x] Scheduler functionality verified
- [x] Version bumped (0.4.0 → 0.4.1)
- [x] Release notes created
- [x] Issue marked complete in backlog

---

## Next Steps

This patch release is complete and ready for deployment. No further action required.

---

**Release Type:** Patch (0.4.0 → 0.4.1)
**Commit Message:** "Release v0.4.1: Fix Next.js 15 build warning"
**Status:** ✅ Complete
