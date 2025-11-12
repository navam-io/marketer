# Issues

[x] Fix Claude API error: 404 {"type":"error","error":{"type":"not_found_error","message":"model: claude-3-5-sonnet-20241022"},"request_id":"req_011CV3USnQGM4CQ6CJrSF4Rs"}. Use claude-sonnet-4-5 model. ✅ **Completed in v0.3.1**

[x] I used Playwright to test this web app. The evaulation guide and resulting evaluation report is present in evals/ folder. Note the issues which blocked Playwright from performing automated browser testing of the web app and fix these issues. ✅ **Completed in v0.3.2** - Added data-testid attributes to all form components for reliable automated testing

[x] When in Campaigns kanban board with active campaign and few task cards, if user drags and drops a card to another column over another card, the dragged card disappears. Ideal behaviour is that as the user drags the card over another card, the cards ease animate up and/or down (like rubberband effect) to make an empty space for the card being dragged to drop and as card is dropped it appears in the space created for it. If it is instead dragged back to the original position then all cards return to their original position. The columns receiving/sending cards should also animate ease in/out expand/contract unless cards are being moved within same column to change sequencing. ✅ **Completed in v0.5.0** - Implemented smooth drag-and-drop animations with `onDragOver` handler, optimistic UI updates using local state, and proper animation configurations. Cards now animate elegantly to make space, never disappear, and return to original position if drag is cancelled.

[x] Fix this build warning  ⚠ Invalid next.config.ts options detected:
 ⚠     Unrecognized key(s) in object: 'instrumentationHook' at "experimental"
 ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
 ⚠ `experimental.instrumentationHook` is no longer needed to be configured in Next.js
 ✅ **Completed in v0.4.1** - Removed deprecated experimental.instrumentationHook from next.config.ts as it's now a stable feature in Next.js 15

[x] When in Campaigns kanban board fix UI refresh when state refreshes for:
1. number of tasks listed in campaign name
2. when post schedule reaches published time and moves to published column
✅ **Completed in v0.4.3 & v0.4.4** - v0.4.3: Fixed task updates/deletes and added 60-second polling for scheduled posts. v0.4.4: Fixed task creation (manual & AI-generated) to also refresh campaign counts. NOW FULLY FIXED.

[x] When card schedule is assigned it should move to scheduled column with some animation. ✅ **Completed in v0.4.2** - Tasks now automatically move to "Scheduled" column when a schedule is assigned, with smooth 300ms CSS transitions throughout the kanban board