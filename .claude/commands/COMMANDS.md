# Custom Slash Commands for Navam Marketer

This document describes all custom slash commands available for this project.

## Available Commands

### `/code:evaluate`
**Purpose:** Automated web application evaluation using browser testing

**Description:** 
Reads the evaluation guide from `evals/evaluation-guide.md`, dynamically identifies all features and test cases, activates the webapp-testing skill, executes all documented tests, and generates a comprehensive timestamped evaluation report.

**Usage:**
```
/code:evaluate
```

**How It Works:**
1. Reads `evals/evaluation-guide.md` to discover current features and test cases
2. Extracts version from `package.json`
3. Activates `webapp-testing` skill for browser automation
4. Executes all test cases documented in the guide
5. Generates comprehensive report: `evals/evaluation-report-YYYY-MM-DD-HHmmss.md`

**Key Features:**
- ✅ **Dynamic:** Adapts to whatever features are in the evaluation guide
- ✅ **No Hardcoding:** Discovers test cases automatically
- ✅ **Future-Proof:** Works with new releases as guide is updated
- ✅ **Comprehensive:** Tests everything documented, skips nothing

**Prerequisites:**
- App running at `http://localhost:3000`
- Database initialized and clean
- `ANTHROPIC_API_KEY` configured in `.env`
- `evals/evaluation-guide.md` up to date with current release

**Output:**
- Timestamped evaluation report: `evals/evaluation-report-YYYY-MM-DD-HHmmss.md`
- Test results for all features documented in guide
- Screenshots and performance metrics
- Issues categorized by severity
- Actionable recommendations
- Pass/fail statistics

**Report Includes:**
- Executive summary with pass rate
- Detailed results for each test case
- Critical and non-critical issues
- Performance observations
- UX feedback
- Feature validation checklists
- Test coverage summary
- Recommendations prioritized by urgency

---

### `/code:issue`
**Purpose:** Resolve issues from the backlog

**Description:**
Reads issues from `backlog/issues.md`, resolves them with code and tests, runs all tests, determines semver increment, and creates release notes.

**Usage:**
```
/code:issue
```

**What it does:**
1. Reads `backlog/issues.md`
2. Understands current project state
3. Identifies and resolves the next issue
4. Creates comprehensive tests
5. Runs all tests and fixes regressions
6. Determines semver increment (major/minor/patch)
7. Marks issue complete and creates release notes

**Output:**
- Fixed code
- New or updated tests
- Updated `package.json` version
- Release notes in `backlog/release-X.Y.Z.md`
- Updated `backlog/issues.md`

---

### `/code:commit`
**Purpose:** Commit and push changes to git

**Description:**
Stages all changes, creates an appropriate commit message, commits to git, and pushes to remote repository.

**Usage:**
```
/code:commit
```

**What it does:**
1. Runs `git add .`
2. Analyzes changes
3. Creates descriptive commit message
4. Commits with proper formatting
5. Pushes to remote repository

**Commit Format:**
```
[Type]: [Description]

- Detailed change 1
- Detailed change 2

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### `/code:develop`
**Purpose:** Development workflow automation

**Description:**
Helps with feature development, bug fixes, and code improvements following the project's MLP philosophy.

**Usage:**
```
/code:develop
```

---

### `/code:metrics`
**Purpose:** Generate comprehensive code metrics report

**Description:**
Analyzes the codebase and generates static code analysis metrics for the navam-invest Python package.

**Usage:**
```
/code:metrics
```

**Output:**
Detailed metrics report including:
- Code complexity
- Test coverage
- Code quality scores
- Technical debt analysis

---

### `/code:memory`
**Purpose:** Save important project context

**Description:**
Saves key information about the project for future reference and context.

**Usage:**
```
/code:memory
```

---

### `/code:readme`
**Purpose:** Create or update README.md

**Description:**
Creates or updates a professionally designed README.md based on popular GitHub repos, with advanced markdown formatting.

**Usage:**
```
/code:readme
```

**Features:**
- Advanced GitHub markdown
- Updated project information
- Prioritizes readability and usability
- Progressive disclosure of information
- Visual appeal

---

## Recommended Workflows

### After Resolving an Issue
```bash
# 1. Work on issue
/code:issue

# 2. Update evaluation guide if needed
# Edit evals/evaluation-guide.md to include new feature tests

# 3. Verify with evaluation
/code:evaluate

# 4. Review reports
# - Release notes: backlog/release-X.Y.Z.md
# - Evaluation: evals/evaluation-report-[timestamp].md

# 5. Fix any issues found
# Make necessary changes

# 6. Re-evaluate if needed
/code:evaluate

# 7. Commit when tests pass
/code:commit
```

### Release Workflow
```bash
# 1. Complete feature development
/code:issue

# 2. Update evaluation guide with new tests
# Add test cases for new features to evals/evaluation-guide.md

# 3. Run comprehensive evaluation
/code:evaluate

# 4. Review evaluation report
# Check evals/evaluation-report-[timestamp].md

# 5. Address any critical issues
/code:develop

# 6. Re-evaluate
/code:evaluate

# 7. Commit release
/code:commit

# 8. Tag release
git tag v0.X.Y
git push origin v0.X.Y
```

### Regression Testing
```bash
# Before making changes
/code:evaluate  # Baseline evaluation

# Make changes
# ... development work ...

# After making changes
/code:evaluate  # New evaluation

# Compare reports to identify regressions
# Check new issues vs baseline
```

---

## Evaluation Guide Maintenance

**Important:** Keep `evals/evaluation-guide.md` up to date with each release.

### When to Update the Guide

**Add New Test Cases When:**
- New features are released
- New UI components are added
- New workflows are implemented
- New API endpoints are created

**Update Existing Test Cases When:**
- UI changes affect selectors
- Expected behaviors change
- Timing requirements change
- New edge cases are discovered

**Remove Test Cases When:**
- Features are deprecated
- Functionality is removed
- Tests are no longer relevant

### Guide Update Checklist

After each release, review and update:
- [ ] Test case descriptions match current UI
- [ ] Selectors are accurate for current implementation
- [ ] Expected results reflect current behavior
- [ ] Timing guidelines are realistic
- [ ] New features have complete test coverage
- [ ] Deprecated features are removed
- [ ] Version number is updated in guide header

---

## Command File Locations

All command files are located in:
```
.claude/commands/code/
├── commit.md           # Git commit automation
├── develop.md          # Development workflow
├── evaluate.md         # Web app evaluation (generalized)
├── issue.md            # Issue resolution
├── memory.md           # Context saving
├── metrics.md          # Code metrics
└── readme.md           # README generation
```

---

## Creating New Commands

To create a new slash command:

1. Create a markdown file in `.claude/commands/code/`:
   ```
   .claude/commands/code/your-command.md
   ```

2. Write the command prompt/instructions in the file

3. Use the command:
   ```
   /code:your-command
   ```

4. Document it in this file (COMMANDS.md)

**Best Practices:**
- Make commands generalized and reusable
- Don't hardcode versions or specific feature names
- Read from configuration files when possible
- Generate timestamped outputs
- Include comprehensive error handling

---

## Related Files

### Evaluation & Testing
- **Evaluation Guide:** `evals/evaluation-guide.md` (updated with each release)
- **Evaluation Reports:** `evals/evaluation-report-*.md` (timestamped)

### Development & Planning
- **Issues Backlog:** `backlog/issues.md`
- **Active Backlog:** `backlog/active.md`
- **Release Notes:** `backlog/release-X.Y.Z.md`
- **Project Instructions:** `CLAUDE.md`

### Configuration
- **Package:** `package.json` (version source)
- **Environment:** `.env` (API keys, database)

---

## Skills Used by Commands

### webapp-testing
**Used by:** `/code:evaluate`

**Purpose:** Interact with and test local web applications using Playwright

**Capabilities:**
- Browser automation (Chrome, Firefox, Safari)
- UI interaction testing
- Screenshot capture
- Browser log viewing
- Element inspection
- Network monitoring
- Performance profiling

**Requirements:**
- App running at `http://localhost:3000`
- Browser drivers installed

### skill-creator
**Used for:** Creating new skills

**Purpose:** Guide for creating effective skills that extend Claude's capabilities

---

## Tips for Using Commands

### 1. Maintain the Evaluation Guide
```bash
# After each release, update the guide
vim evals/evaluation-guide.md

# Add test cases for new features
# Update changed UI elements
# Remove deprecated features
```

### 2. Run Evaluations Frequently
```bash
# Before major changes (baseline)
/code:evaluate

# After implementation
/code:evaluate

# Before committing
/code:evaluate

# Before releasing
/code:evaluate
```

### 3. Chain Commands Effectively
```bash
# Full cycle
/code:issue       # Implement feature
/code:evaluate    # Test it
/code:commit      # Save it
```

### 4. Keep Database Clean for Tests
```bash
# Reset database before evaluation
rm prisma/dev.db
npm run db:push
npm run dev

# Then evaluate
/code:evaluate
```

### 5. Review Generated Reports
- **Evaluation Reports:** Check test results and issues
- **Release Notes:** Verify changes are documented
- **Git Diff:** Review code changes before commit

### 6. Track Evaluation History
```bash
# List all evaluation reports
ls -lt evals/evaluation-report-*.md

# Compare with previous
diff evals/evaluation-report-2025-01-11-*.md evals/evaluation-report-2025-01-10-*.md

# Track progress over time
```

---

## Troubleshooting

### `/code:evaluate` Issues

**Problem:** Tests fail with timeout errors
**Solution:** 
- Check if app is running: `http://localhost:3000`
- Increase timeout in evaluation guide
- Check for slow API responses (Claude generation)

**Problem:** Selectors not found
**Solution:**
- Update selectors in evaluation guide
- Inspect actual DOM elements
- Use browser DevTools to find correct selectors

**Problem:** Database state issues
**Solution:**
- Reset database: `rm prisma/dev.db && npm run db:push`
- Ensure clean state before evaluation
- Check for data conflicts

**Problem:** Screenshots not captured
**Solution:**
- Check evals/ directory permissions
- Ensure webapp-testing skill has screenshot capability
- Verify browser headless mode settings

---

## Version History

- **2025-01-11:** Created `/code:evaluate` command (generalized, no hardcoded features)
- **2025-01-11:** Added COMMANDS.md documentation
- **Earlier:** Original commands (commit, issue, develop, etc.)

---

**Last Updated:** 2025-01-11
**Maintained By:** Development Team
**For Questions:** See CLAUDE.md or project documentation
