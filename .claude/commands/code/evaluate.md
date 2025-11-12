You are evaluating the Navam Marketer web application using automated browser testing.

## Steps to Follow:

### 1. Read the Evaluation Guide
First, read the complete evaluation guide to understand what needs to be tested:
```
Read evals/evaluation-guide.md
```

The evaluation guide contains:
- All test cases for current released features
- Expected behaviors and UI states
- Selectors for elements
- Timing guidelines
- Validation checklists

**Important:** Use the guide as the source of truth for what features exist and what tests to run. Do not assume features - only test what is documented in the guide.

### 2. Activate the webapp-testing Skill
Launch the webapp-testing skill to interact with the web application:
```
Use the Skill tool with skill="webapp-testing"
```

### 3. Test Execution Instructions

Execute ALL test cases documented in the evaluation guide:

**Approach:**
1. Parse the evaluation guide to identify all features and test cases
2. For each feature section found in the guide:
   - Execute all test cases listed
   - Follow the steps exactly as specified
   - Use the selectors provided
   - Verify expected results
3. Execute any end-to-end workflow tests if present
4. Test any additional scenarios documented in the guide

**Key Principle:** Let the evaluation guide drive what gets tested. If a feature is documented in the guide, test it. If it's not documented, skip it.

### 4. Collect Test Results

For each test case executed, record:
- ✅ PASS: Test executed successfully, all assertions met
- ❌ FAIL: Test failed, with specific error details
- ⚠️ PARTIAL: Test partially passed, with notes on issues
- ⏭️ SKIP: Test skipped, with reason

Document:
- Screenshots of key UI states
- Any errors encountered
- Performance observations
- UX issues noticed
- Deviations from expected behavior

### 5. Generate Evaluation Report

After completing all tests, create a comprehensive evaluation report.

**Report Filename:**
```
evals/evaluation-report-YYYY-MM-DD-HHmmss.md
```

Use current timestamp for the filename (Year-Month-Day-HourMinuteSecond format).

**Report Structure:**

```markdown
# Navam Marketer - Evaluation Report

**Evaluation Date:** [Current Date and Time]
**Version Tested:** [version from package.json]
**Test Environment:** http://localhost:3000
**Total Test Cases:** [count]
**Test Cases Passed:** [count]
**Test Cases Failed:** [count]

---

## Executive Summary

- **Overall Status:** [PASS/FAIL/PARTIAL]
- **Pass Rate:** [X/Y] ([percentage]%)
- **Critical Issues:** [count]
- **Non-Critical Issues:** [count]
- **Key Findings:** [brief summary]
- **Recommendation:** [Ready for release / Needs fixes / Blocked]

---

## Test Results by Feature

[For each feature found in the evaluation guide, create a section:]

### Feature [N]: [Feature Name] ([version if specified])

**Status:** [PASS/FAIL/PARTIAL]
**Tests Executed:** [count]
**Tests Passed:** [count]
**Tests Failed:** [count]
**Tests Skipped:** [count]

#### Test Case [N.M]: [Test Case Name]
- **Status:** [✅ PASS / ❌ FAIL / ⚠️ PARTIAL / ⏭️ SKIP]
- **Description:** [what was tested]
- **Expected:** [from guide]
- **Actual:** [what happened]
- **Issues:** [if any, otherwise "None"]
- **Screenshots:** [if captured]
- **Notes:** [additional observations]

[Repeat for all test cases in this feature]

[Repeat feature section for all features tested]

---

## End-to-End Testing

[If E2E tests were performed, document results here]

**Status:** [PASS/FAIL/PARTIAL]
**Scenario:** [describe the workflow tested]
**Results:** [detailed results]

---

## Issues Found

### Critical Issues

[If none found, state "No critical issues found"]

[For each critical issue:]
1. **[Issue Title]**
   - **Severity:** Critical
   - **Feature:** [feature name]
   - **Test Case:** [test case ID]
   - **Description:** [detailed description]
   - **Steps to Reproduce:**
     1. [step]
     2. [step]
   - **Expected Behavior:** [what should happen]
   - **Actual Behavior:** [what actually happened]
   - **Impact:** [how this affects users]
   - **Screenshot:** [if available]

### Non-Critical Issues

[If none found, state "No non-critical issues found"]

[Same structure as critical issues, but with Severity: Non-Critical]

---

## Performance Observations

### Page Load Times
- Home page: [time] ms
- [Other pages tested]: [time] ms

### Operation Response Times
- [Operation 1]: [time] seconds
- [Operation 2]: [time] seconds
- [etc.]

### UI Responsiveness
- Animations: [smooth/laggy/acceptable]
- Drag and drop: [smooth/laggy/acceptable]
- Dialog transitions: [smooth/laggy/acceptable]
- Overall: [assessment]

### Performance Issues
[List any performance issues found, or state "No performance issues found"]

---

## User Experience Observations

### Positive Aspects
1. [what worked well]
2. [what worked well]
[or state "See detailed test results"]

### Areas for Improvement
1. [what could be better]
2. [what could be better]
[or state "No major UX issues found"]

### Usability Issues
1. [any confusion or difficulty]
2. [any confusion or difficulty]
[or state "No usability issues found"]

---

## Feature Validation Checklists

[For each feature tested, include the validation checklist from the guide]
[Mark each item as checked or unchecked based on test results]

### Feature [N]: [Feature Name] ✓/⚠️/✗

- [x] [validation item that passed]
- [ ] [validation item that failed]
- [x] [validation item that passed]

[Repeat for all features]

---

## Browser Environment

- **Browser:** [browser name and version]
- **Operating System:** [OS]
- **Screen Resolution:** [resolution]
- **Viewport Size:** [viewport dimensions]
- **User Agent:** [if relevant]

---

## Test Coverage Summary

| Feature | Test Cases | Passed | Failed | Skipped | Pass Rate |
|---------|-----------|--------|--------|---------|----------|
| [Feature 1] | [count] | [count] | [count] | [count] | [%] |
| [Feature 2] | [count] | [count] | [count] | [count] | [%] |
| [Feature N] | [count] | [count] | [count] | [count] | [%] |
| **Total** | **[count]** | **[count]** | **[count]** | **[count]** | **[%]** |

---

## Recommendations

### Immediate Action Required (High Priority)
[List recommendations based on critical issues]
[If none: "No immediate actions required"]

### Should Address (Medium Priority)
[List recommendations based on non-critical issues and improvements]
[If none: "No medium priority items"]

### Nice to Have (Low Priority)
[List optional improvements]
[If none: "No low priority items"]

---

## Regression Analysis

[If this is a follow-up evaluation, compare with previous reports]

- **Previous Evaluation:** [date and version, if applicable]
- **New Issues:** [issues not present before]
- **Fixed Issues:** [issues that were resolved]
- **Persistent Issues:** [issues still present]
- **Status Change:** [better/worse/stable]

[If first evaluation: "This is the baseline evaluation. No regression analysis available."]

---

## Screenshots

[Include or reference screenshots captured during testing]

### Key UI States
1. [Screenshot 1 description]
2. [Screenshot 2 description]
3. [etc.]

[Note: Screenshots saved to: evals/screenshots/[timestamp]/]

---

## Detailed Test Logs

[Provide detailed logs for failed or problematic tests]
[For passed tests, brief summary is sufficient]

```
[timestamp] Starting evaluation
[timestamp] Reading evaluation guide: evals/evaluation-guide.md
[timestamp] Identified [N] features with [M] total test cases
[timestamp] Starting Feature 1 tests...
[timestamp] Test Case 1.1: [result]
[detailed logs for important events]
```

---

## Test Execution Metadata

- **Start Time:** [timestamp]
- **End Time:** [timestamp]
- **Duration:** [total time]
- **Tester:** Claude Code with webapp-testing skill
- **Evaluation Guide Version:** [from guide]
- **App Version:** [from package.json]

---

## Conclusion

[Provide overall assessment including:]
- Summary of test results
- Application quality and stability
- Readiness for deployment/release
- Key strengths observed
- Main concerns or blockers
- Overall confidence level in the release

**Release Recommendation:** [Ready / Not Ready / Ready with caveats]

**Sign-off:**
- Evaluation conducted by: Claude Code with webapp-testing skill
- Report generated: [timestamp]
- Next evaluation recommended: [when/under what conditions]

---

**End of Evaluation Report**
```

### 6. Important Guidelines

**Dynamic Approach:**
- Do NOT hardcode feature names or versions
- Read everything from the evaluation guide
- Adapt to whatever features are documented
- Test new features as they are added to the guide
- Remove tests for deprecated features not in the guide

**Before Starting:**
- Verify the app is running at http://localhost:3000
- Check that the database is initialized and clean
- Confirm ANTHROPIC_API_KEY is configured
- Review package.json for current version

**During Testing:**
- Follow the evaluation guide exactly
- Take screenshots of important states and errors
- Document any deviations from expected behavior
- Note all performance and timing observations
- Record both successes and failures

**After Testing:**
- Save the report with timestamped filename
- Review all test results for accuracy and completeness
- Ensure report is comprehensive and actionable
- Include specific, reproducible steps for any issues
- Provide clear recommendations based on findings

**Report Quality:**
- Be objective and fact-based
- Include specific details, not vague descriptions
- Provide context for all issues found
- Use evidence (screenshots, logs) to support findings
- Make recommendations actionable and prioritized

### 7. Execute the Evaluation

Now proceed with the evaluation:

1. Read `evals/evaluation-guide.md` to understand current features
2. Note the version from `package.json`
3. Activate the `webapp-testing` skill
4. Execute all test cases found in the guide
5. Collect comprehensive results
6. Generate and save the timestamped report to `evals/`

**Remember:** 
- Be thorough and systematic
- Document everything you observe
- Provide actionable insights
- Make the report useful for decision-making
- Let the evaluation guide define what gets tested
