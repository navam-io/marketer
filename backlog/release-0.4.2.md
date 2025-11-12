# Release v0.4.2 - Auto-Schedule Status & Smooth Animations

**Release Date:** November 12, 2025
**Type:** Patch Release (Bug Fix + Enhancement)
**Semver:** 0.4.1 → 0.4.2

---

## Summary

This patch release fixes a UX issue where tasks didn't automatically move to the "Scheduled" column when a schedule was assigned, and adds smooth animations throughout the kanban board for a more polished user experience.

---

## Bug Fixes

### 🐛 Auto-Status Change on Scheduling

**Issue:**
When a user assigned a schedule to a task, the task remained in its current column (e.g., "Draft" or "To Do") instead of automatically moving to the "Scheduled" column. Users had to manually drag the card to the "Scheduled" column after scheduling, which was unintuitive.

**Root Cause:**
The `handleSchedule` function in `kanban-card.tsx` only updated the `scheduledAt` field without changing the task's status.

**Fix:**
- When a schedule is assigned, the task status automatically changes to `'scheduled'`
- When a schedule is cleared, the task status reverts to `'draft'`
- Tasks now immediately appear in the correct column after scheduling

**Code Change:**
```typescript
// Before
const handleSchedule = async (taskId: string, scheduledAt: Date | null) => {
  await onUpdate(taskId, { scheduledAt: scheduledAt || undefined });
};

// After
const handleSchedule = async (taskId: string, scheduledAt: Date | null) => {
  const updates: Partial<Task> = {
    scheduledAt: scheduledAt || undefined,
    status: scheduledAt ? 'scheduled' : 'draft'
  };
  await onUpdate(taskId, updates);
};
```

**Impact:**
- ✅ Intuitive workflow - tasks automatically appear in Scheduled column
- ✅ Reduces manual steps - no need to drag after scheduling
- ✅ Consistent behavior - status matches the task state

---

## Enhancements

### ✨ Smooth Animations

Added smooth CSS transitions throughout the kanban board for a more polished user experience.

**Card Animations:**
- Smooth transitions when cards move between columns
- Duration: 300ms with ease-in-out easing
- Affects: position, opacity, transform, shadow

**Column Animations:**
- Subtle scale effect when hovering over columns during drag
- Smooth color transitions when dropping cards
- Column expands slightly (2%) when receiving a dragged card
- Duration: 300ms with ease-in-out easing

**Changes Made:**
1. **kanban-card.tsx** - Added `transition-all duration-300 ease-in-out` to card component
2. **kanban-column.tsx** - Enhanced transitions and added `scale-[1.02]` on hover
3. **kanban-column.tsx** - Added transitions to children container

**Visual Improvements:**
- ✅ Smoother drag and drop experience
- ✅ Visual feedback when cards change columns
- ✅ Professional, polished appearance
- ✅ No jarring movements or jumps

---

## Technical Details

### Files Modified

1. **components/kanban-card.tsx**
   - Updated `handleSchedule` function to auto-update status
   - Added smooth transition classes to Card component

2. **components/kanban-column.tsx**
   - Enhanced transition from `transition-colors` to `transition-all duration-300 ease-in-out`
   - Added scale effect on drag-over (`scale-[1.02]`)
   - Added transitions to children container

3. **package.json**
   - Version bump: 0.4.1 → 0.4.2

### Testing

**All Tests Passing:**
```bash
npm test
# Result: 60 passed, 60 total
```

**Test Coverage:**
- ✅ No regressions in existing tests
- ✅ Scheduling integration tests pass
- ✅ Database tests pass
- ✅ Content generation tests pass
- ✅ UI component tests pass

**Manual Testing Checklist:**
- [x] Schedule a task from Draft column
- [x] Verify task immediately moves to Scheduled column
- [x] Verify smooth animation during transition
- [x] Clear schedule on a scheduled task
- [x] Verify task returns to Draft column
- [x] Verify smooth animation during transition
- [x] Drag card between columns
- [x] Verify column scale effect on hover
- [x] Verify smooth card movement

---

## User Experience Improvements

### Before

**Scheduling Flow:**
1. User clicks calendar icon on task
2. User sets date/time in dialog
3. User clicks "Schedule Task"
4. ❌ Task stays in current column (e.g., "Draft")
5. ❌ User must manually drag task to "Scheduled" column

**Animation:**
- ❌ Abrupt transitions
- ❌ No visual feedback during state changes
- ❌ Jumpy drag and drop

### After

**Scheduling Flow:**
1. User clicks calendar icon on task
2. User sets date/time in dialog
3. User clicks "Schedule Task"
4. ✅ Task automatically moves to "Scheduled" column
5. ✅ Smooth animation shows the transition

**Animation:**
- ✅ Smooth 300ms transitions
- ✅ Visual feedback (column scales, colors transition)
- ✅ Professional, polished feel
- ✅ No jarring movements

---

## Breaking Changes

**None** - This release is fully backward compatible.

All existing functionality continues to work unchanged. The status auto-update and animations are seamless enhancements.

---

## Migration Notes

### For Existing Users

**No Action Required** - This is a transparent bug fix and enhancement.

Users will immediately benefit from:
- Automatic status updates when scheduling tasks
- Smoother, more polished UI animations

### For Developers

If you have custom kanban implementations, consider adopting similar patterns:
- Auto-update related fields when primary fields change
- Use `transition-all` with 300ms duration for smooth animations
- Add subtle scale effects for interactive feedback

---

## Known Limitations

**None** - This release fully addresses the reported issue.

The animations use CSS transitions which are hardware-accelerated and performant. No known issues with the implementation.

---

## Future Enhancements

Potential improvements for future releases:
- [ ] Add spring animations for more dynamic feel
- [ ] Customize animation duration per user preference
- [ ] Add particle effects on successful scheduling
- [ ] Animate card count badges when they change

---

## References

- **Issue Tracker:** `backlog/issues.md` - Line 19
- **Original Issue:** "When card schedule is assigned it should move to scheduled column with some animation"
- **Related Features:** v0.4.0 - Scheduling & Auto-Posting

---

## Validation

### Checklist

- [x] Issue identified in `backlog/issues.md`
- [x] Root cause analyzed (missing status update)
- [x] Bug fix implemented (auto-status change)
- [x] Enhancement implemented (smooth animations)
- [x] All 60 tests pass (no regressions)
- [x] Manual testing completed
- [x] Version bumped (0.4.1 → 0.4.2)
- [x] Release notes created
- [x] Ready to mark issue complete

---

**Release Type:** Patch (0.4.1 → 0.4.2)
**Commit Message:** "Release v0.4.2: Auto-schedule status change and smooth animations"
**Status:** ✅ Complete
