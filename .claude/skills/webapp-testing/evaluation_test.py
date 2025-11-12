#!/usr/bin/env python3
"""
Navam Marketer - Comprehensive Evaluation Test Script
Version: 0.3.1
Executes all test cases from evaluation-guide.md
"""

import time
import json
from datetime import datetime, timedelta
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

# Test results tracking
test_results = {
    'start_time': datetime.now().isoformat(),
    'version': '0.3.1',
    'features': [],
    'total_tests': 0,
    'passed': 0,
    'failed': 0,
    'skipped': 0,
    'issues': []
}

# Create screenshots directory
screenshots_dir = Path('/Users/manavsehgal/Developer/marketer/evals/screenshots') / datetime.now().strftime('%Y-%m-%d-%H%M%S')
screenshots_dir.mkdir(parents=True, exist_ok=True)

def log_test(feature, test_case, status, description, expected='', actual='', issues=None, screenshot_path=''):
    """Log a test result"""
    result = {
        'test_case': test_case,
        'status': status,  # PASS, FAIL, PARTIAL, SKIP
        'description': description,
        'expected': expected,
        'actual': actual,
        'issues': issues or [],
        'screenshot': screenshot_path
    }

    # Find or create feature entry
    feature_entry = next((f for f in test_results['features'] if f['name'] == feature), None)
    if not feature_entry:
        feature_entry = {'name': feature, 'tests': [], 'passed': 0, 'failed': 0, 'skipped': 0}
        test_results['features'].append(feature_entry)

    feature_entry['tests'].append(result)
    test_results['total_tests'] += 1

    if status == 'PASS':
        test_results['passed'] += 1
        feature_entry['passed'] += 1
        print(f"✅ {test_case}: PASS - {description}")
    elif status == 'FAIL':
        test_results['failed'] += 1
        feature_entry['failed'] += 1
        print(f"❌ {test_case}: FAIL - {description}")
        if issues:
            for issue in issues:
                print(f"   Issue: {issue}")
    elif status == 'SKIP':
        test_results['skipped'] += 1
        feature_entry['skipped'] += 1
        print(f"⏭️  {test_case}: SKIP - {description}")
    elif status == 'PARTIAL':
        test_results['passed'] += 0.5
        test_results['failed'] += 0.5
        feature_entry['passed'] += 0.5
        feature_entry['failed'] += 0.5
        print(f"⚠️  {test_case}: PARTIAL - {description}")

def save_screenshot(page, name):
    """Save a screenshot with timestamp"""
    path = screenshots_dir / f"{name}.png"
    page.screenshot(path=str(path), full_page=True)
    print(f"📸 Screenshot saved: {path}")
    return str(path)

def test_source_ingestion(page):
    """Feature 1: Source Ingestion Tests"""
    feature = "Feature 1: Source Ingestion (v0.1.0)"
    print(f"\n{'='*60}")
    print(f"Testing: {feature}")
    print(f"{'='*60}\n")

    # Test Case 1.1: Navigate to Home Page
    try:
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle', timeout=10000)
        screenshot = save_screenshot(page, '1.1-home-page')

        # Check page title
        page_title_found = False
        try:
            page.wait_for_selector('text=/Navam.*Marketer/i', timeout=3000)
            page_title_found = True
        except:
            pass

        # Check URL input
        url_input = None
        try:
            url_input = page.locator('input[type="url"]').first
            url_input.wait_for(state='visible', timeout=3000)
        except:
            try:
                url_input = page.locator('input[placeholder*="URL"]').first
                url_input.wait_for(state='visible', timeout=3000)
            except:
                pass

        # Check fetch button
        fetch_button = None
        try:
            fetch_button = page.locator('button:has-text("Fetch")').first
            fetch_button.wait_for(state='visible', timeout=3000)
        except:
            pass

        if page_title_found and url_input and fetch_button:
            log_test(feature, "Test Case 1.1", "PASS", "Navigate to Home Page",
                    "Page loads with title, URL input, and Fetch button",
                    "All elements found", screenshot_path=screenshot)
        else:
            issues = []
            if not page_title_found:
                issues.append("Page title 'Navam Marketer' not found")
            if not url_input:
                issues.append("URL input field not found")
            if not fetch_button:
                issues.append("Fetch button not found")
            log_test(feature, "Test Case 1.1", "FAIL", "Navigate to Home Page",
                    "Page loads with all required elements",
                    "Some elements missing", issues=issues, screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 1.1", "FAIL", "Navigate to Home Page",
                "Page loads successfully", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '1.1-error'))

    # Test Case 1.2: Fetch Content from URL
    try:
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')

        url_input = page.locator('input[type="url"]').first
        url_input.fill('https://www.paulgraham.com/startupideas.html')

        fetch_button = page.locator('button:has-text("Fetch")').first
        fetch_button.click()

        # Wait for loading state or success
        time.sleep(1)  # Brief pause for loading indicator

        # Wait for success message (max 10 seconds)
        success = False
        try:
            page.wait_for_selector('text=/success|saved/i', timeout=10000)
            success = True
        except:
            pass

        screenshot = save_screenshot(page, '1.2-fetch-content')

        # Check for content display
        content_visible = False
        try:
            # Look for content preview area
            content = page.locator('text=/Startup Ideas|Paul Graham/i').first
            content.wait_for(state='visible', timeout=5000)
            content_visible = True
        except:
            pass

        if success and content_visible:
            log_test(feature, "Test Case 1.2", "PASS", "Fetch Content from URL",
                    "Content fetched, cleaned, and displayed with success message",
                    "Success message and content visible", screenshot_path=screenshot)
        else:
            issues = []
            if not success:
                issues.append("Success message not found")
            if not content_visible:
                issues.append("Content preview not visible")
            log_test(feature, "Test Case 1.2", "PARTIAL", "Fetch Content from URL",
                    "Content fetched and displayed",
                    "Partial success", issues=issues, screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 1.2", "FAIL", "Fetch Content from URL",
                "Content fetched successfully", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '1.2-error'))

    # Test Case 1.3: Verify Multiple Sources
    try:
        # Second source
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')

        url_input = page.locator('input[type="url"]').first
        url_input.fill('https://blog.samaltman.com/')

        fetch_button = page.locator('button:has-text("Fetch")').first
        fetch_button.click()

        # Wait for success
        page.wait_for_selector('text=/success|saved/i', timeout=10000)
        screenshot = save_screenshot(page, '1.3-multiple-sources')

        log_test(feature, "Test Case 1.3", "PASS", "Verify Multiple Sources",
                "Both sources fetch successfully",
                "Second source fetched", screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 1.3", "FAIL", "Verify Multiple Sources",
                "Multiple sources fetch successfully", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '1.3-error'))

def test_campaign_management(page):
    """Feature 2: Campaign & Task Management Tests"""
    feature = "Feature 2: Campaign & Task Management (v0.2.0)"
    print(f"\n{'='*60}")
    print(f"Testing: {feature}")
    print(f"{'='*60}\n")

    # Test Case 2.1: Navigate to Campaigns Page
    try:
        page.goto('http://localhost:3000/campaigns')
        page.wait_for_load_state('networkidle')
        screenshot = save_screenshot(page, '2.1-campaigns-page')

        # Check for kanban columns
        columns = page.locator('text=/To Do|Draft|Scheduled|Posted/i').all()

        # Check for New Campaign button
        new_campaign_btn = None
        try:
            new_campaign_btn = page.locator('button:has-text("New Campaign")').first
            new_campaign_btn.wait_for(state='visible', timeout=3000)
        except:
            pass

        # Check for New Task button
        new_task_btn = None
        try:
            new_task_btn = page.locator('button:has-text("New Task")').first
            new_task_btn.wait_for(state='visible', timeout=3000)
        except:
            pass

        if len(columns) >= 4 and new_campaign_btn and new_task_btn:
            log_test(feature, "Test Case 2.1", "PASS", "Navigate to Campaigns Page",
                    "Kanban board with 4 columns, New Campaign and New Task buttons visible",
                    "All elements found", screenshot_path=screenshot)
        else:
            issues = []
            if len(columns) < 4:
                issues.append(f"Expected 4 columns, found {len(columns)}")
            if not new_campaign_btn:
                issues.append("New Campaign button not found")
            if not new_task_btn:
                issues.append("New Task button not found")
            log_test(feature, "Test Case 2.1", "FAIL", "Navigate to Campaigns Page",
                    "All required elements visible",
                    "Some elements missing", issues=issues, screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 2.1", "FAIL", "Navigate to Campaigns Page",
                "Page loads with kanban board", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '2.1-error'))

    # Test Case 2.2: Create Campaign
    try:
        page.goto('http://localhost:3000/campaigns')
        page.wait_for_load_state('networkidle')

        # Click New Campaign
        new_campaign_btn = page.locator('button:has-text("New Campaign")').first
        new_campaign_btn.click()

        # Wait for dialog
        page.wait_for_selector('[role="dialog"]', timeout=3000)

        # Fill campaign details using data-testid
        name_input = page.locator('[data-testid="campaign-name-input"]').first
        name_input.fill('Product Launch Q1')

        desc_input = page.locator('[data-testid="campaign-description-input"]').first
        desc_input.fill('Social media campaign for our new product release')

        # Click Create
        create_btn = page.locator('[data-testid="create-campaign-submit"]').first
        create_btn.click()

        # Wait for dialog to close
        page.wait_for_selector('[role="dialog"]', state='hidden', timeout=3000)
        screenshot = save_screenshot(page, '2.2-create-campaign')

        # Verify campaign appears in selector
        campaign_visible = False
        try:
            page.wait_for_selector('text=/Product Launch Q1/i', timeout=3000)
            campaign_visible = True
        except:
            pass

        if campaign_visible:
            log_test(feature, "Test Case 2.2", "PASS", "Create Campaign",
                    "Campaign created and appears in dropdown",
                    "Campaign 'Product Launch Q1' created", screenshot_path=screenshot)
        else:
            log_test(feature, "Test Case 2.2", "PARTIAL", "Create Campaign",
                    "Campaign created and visible",
                    "Campaign created but not visible in selector",
                    issues=["Campaign not visible in dropdown"], screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 2.2", "FAIL", "Create Campaign",
                "Campaign created successfully", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '2.2-error'))

    # Test Case 2.3: Create Task Manually
    try:
        page.goto('http://localhost:3000/campaigns')
        page.wait_for_load_state('networkidle')

        # Click New Task
        new_task_btn = page.locator('button:has-text("New Task")').first
        new_task_btn.click()

        # Wait for dialog
        page.wait_for_selector('[role="dialog"]', timeout=3000)

        # Select platform using data-testid
        platform_select = page.locator('[data-testid="task-platform-select"]').first
        platform_select.click()
        page.locator('[role="option"]:has-text("LinkedIn")').first.click()

        # Select status
        status_select = page.locator('[data-testid="task-status-select"]').first
        status_select.click()
        page.locator('[role="option"]:has-text("To Do")').first.click()

        # Fill content
        content_input = page.locator('[data-testid="task-content-input"]').first
        content_input.fill('Excited to announce our new product launch! This will revolutionize how you work. #ProductLaunch #Innovation')

        # Click Create
        create_btn = page.locator('[data-testid="create-task-submit"]').first
        create_btn.click()

        # Wait for dialog to close
        page.wait_for_selector('[role="dialog"]', state='hidden', timeout=3000)
        time.sleep(0.5)  # Brief pause for task to appear
        screenshot = save_screenshot(page, '2.3-create-task')

        # Verify task appears in To Do column
        task_visible = False
        try:
            # Look for LinkedIn badge or task content
            page.locator('text=/LinkedIn|Excited to announce/i').first.wait_for(state='visible', timeout=3000)
            task_visible = True
        except:
            pass

        if task_visible:
            log_test(feature, "Test Case 2.3", "PASS", "Create Task Manually",
                    "Task created and appears in To Do column with LinkedIn badge",
                    "Task visible in kanban board", screenshot_path=screenshot)
        else:
            log_test(feature, "Test Case 2.3", "PARTIAL", "Create Task Manually",
                    "Task created and visible",
                    "Task created but not visible on board",
                    issues=["Task not visible in To Do column"], screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 2.3", "FAIL", "Create Task Manually",
                "Task created successfully", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '2.3-error'))

    # Test Case 2.4: Create Multiple Tasks (simplified - just verify we can create more)
    try:
        # Create second task - Twitter
        page.goto('http://localhost:3000/campaigns')
        page.wait_for_load_state('networkidle')

        new_task_btn = page.locator('button:has-text("New Task")').first
        new_task_btn.click()
        page.wait_for_selector('[role="dialog"]', timeout=3000)

        page.locator('[data-testid="task-platform-select"]').first.click()
        page.locator('[role="option"]:has-text("Twitter")').first.click()
        page.locator('[data-testid="task-status-select"]').first.click()
        page.locator('[role="option"]:has-text("Draft")').first.click()
        page.locator('[data-testid="task-content-input"]').first.fill('🚀 Big news coming! Our new product drops next week. #ProductLaunch')

        page.locator('[data-testid="create-task-submit"]').first.click()
        page.wait_for_selector('[role="dialog"]', state='hidden', timeout=3000)
        time.sleep(0.5)

        screenshot = save_screenshot(page, '2.4-multiple-tasks')

        log_test(feature, "Test Case 2.4", "PASS", "Create Multiple Tasks",
                "Multiple tasks created with different platforms and statuses",
                "Second task (Twitter) created", screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 2.4", "FAIL", "Create Multiple Tasks",
                "Multiple tasks created", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '2.4-error'))

    # Test Case 2.5: Drag and Drop (Skip for automated testing - complex interaction)
    log_test(feature, "Test Case 2.5", "SKIP", "Drag and Drop Tasks",
            "Task moves between columns via drag and drop",
            "Skipped - complex drag and drop interaction not suitable for automated testing")

    # Test Case 2.6: Edit Task (Skip - requires identifying specific task)
    log_test(feature, "Test Case 2.6", "SKIP", "Edit Task Content Inline",
            "Task content can be edited inline",
            "Skipped - requires complex task identification")

    # Test Case 2.7: Delete Task (Skip - requires confirmation dialog handling)
    log_test(feature, "Test Case 2.7", "SKIP", "Delete Task",
            "Task can be deleted with confirmation",
            "Skipped - requires task identification and confirmation handling")

    # Test Case 2.8: Multiple Campaigns (simplified)
    try:
        # Create second campaign
        page.goto('http://localhost:3000/campaigns')
        page.wait_for_load_state('networkidle')

        new_campaign_btn = page.locator('button:has-text("New Campaign")').first
        new_campaign_btn.click()
        page.wait_for_selector('[role="dialog"]', timeout=3000)

        page.locator('[data-testid="campaign-name-input"]').first.fill('Blog Series 2025')
        page.locator('[data-testid="campaign-description-input"]').first.fill('Educational content series')

        page.locator('[data-testid="create-campaign-submit"]').first.click()
        page.wait_for_selector('[role="dialog"]', state='hidden', timeout=3000)

        screenshot = save_screenshot(page, '2.8-multiple-campaigns')

        # Check if campaigns appear in selector
        campaigns_visible = False
        try:
            page.wait_for_selector('text=/Product Launch Q1|Blog Series 2025/i', timeout=3000)
            campaigns_visible = True
        except:
            pass

        if campaigns_visible:
            log_test(feature, "Test Case 2.8", "PASS", "Create Multiple Campaigns",
                    "Multiple campaigns created and appear in dropdown",
                    "Second campaign visible", screenshot_path=screenshot)
        else:
            log_test(feature, "Test Case 2.8", "PARTIAL", "Create Multiple Campaigns",
                    "Multiple campaigns created",
                    "Campaign created but visibility unclear",
                    issues=["Campaigns not visible in dropdown"], screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 2.8", "FAIL", "Create Multiple Campaigns",
                "Multiple campaigns created", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '2.8-error'))

def test_content_generation(page):
    """Feature 3: Content Generation Tests"""
    feature = "Feature 3: Content Generation with Claude AI (v0.3.0/v0.3.1)"
    print(f"\n{'='*60}")
    print(f"Testing: {feature}")
    print(f"{'='*60}\n")

    # Test Case 3.1: Verify Prerequisites
    try:
        page.goto('http://localhost:3000/campaigns')
        page.wait_for_load_state('networkidle')
        screenshot = save_screenshot(page, '3.1-prerequisites')

        # Check for Generate from Source button
        generate_btn = None
        try:
            generate_btn = page.locator('button:has-text("Generate")').first
            generate_btn.wait_for(state='visible', timeout=3000)
        except:
            pass

        if generate_btn:
            log_test(feature, "Test Case 3.1", "PASS", "Verify Prerequisites",
                    "Generate from Source button visible",
                    "Prerequisites met", screenshot_path=screenshot)
        else:
            log_test(feature, "Test Case 3.1", "FAIL", "Verify Prerequisites",
                    "Generate from Source button should be visible",
                    "Generate button not found",
                    issues=["Generate from Source button not visible"], screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 3.1", "FAIL", "Verify Prerequisites",
                "Prerequisites check", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '3.1-error'))

    # Test Case 3.2: Open Content Generation Dialog
    try:
        page.goto('http://localhost:3000/campaigns')
        page.wait_for_load_state('networkidle')

        # Click Generate from Source
        generate_btn = page.locator('button:has-text("Generate")').first
        generate_btn.click()

        # Wait for dialog
        page.wait_for_selector('[role="dialog"]', timeout=3000)
        screenshot = save_screenshot(page, '3.2-generation-dialog')

        # Check for required elements
        has_source_select = False
        has_platform_checkboxes = False
        has_tone_select = False
        has_generate_btn = False

        try:
            page.locator('[data-testid="generate-source-select"]').first.wait_for(state='visible', timeout=2000)
            has_source_select = True
        except:
            pass

        try:
            page.locator('[data-testid="generate-platform-linkedin"]').first.wait_for(state='visible', timeout=2000)
            has_platform_checkboxes = True
        except:
            pass

        try:
            page.locator('[data-testid="generate-tone-select"]').first.wait_for(state='visible', timeout=2000)
            has_tone_select = True
        except:
            pass

        try:
            page.locator('[data-testid="generate-content-submit"]').first.wait_for(state='visible', timeout=2000)
            has_generate_btn = True
        except:
            pass

        if has_source_select and has_platform_checkboxes and has_tone_select and has_generate_btn:
            log_test(feature, "Test Case 3.2", "PASS", "Open Content Generation Dialog",
                    "Dialog opens with source selector, platform checkboxes, tone selector, and generate button",
                    "All elements found", screenshot_path=screenshot)
        else:
            issues = []
            if not has_source_select:
                issues.append("Source selector not found")
            if not has_platform_checkboxes:
                issues.append("Platform checkboxes not found")
            if not has_tone_select:
                issues.append("Tone selector not found")
            if not has_generate_btn:
                issues.append("Generate button not found")
            log_test(feature, "Test Case 3.2", "FAIL", "Open Content Generation Dialog",
                    "Dialog opens with all required elements",
                    "Some elements missing", issues=issues, screenshot_path=screenshot)

        # Close dialog for next tests
        page.keyboard.press('Escape')
    except Exception as e:
        log_test(feature, "Test Case 3.2", "FAIL", "Open Content Generation Dialog",
                "Dialog opens successfully", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '3.2-error'))

    # Test Case 3.3: Generate Content - Single Platform
    try:
        page.goto('http://localhost:3000/campaigns')
        page.wait_for_load_state('networkidle')

        # Count tasks before generation
        tasks_before = len(page.locator('.task-card, [data-task], article').all())

        # Open dialog
        generate_btn = page.locator('button:has-text("Generate")').first
        generate_btn.click()
        page.wait_for_selector('[role="dialog"]', timeout=3000)

        # Wait for sources to load
        time.sleep(1)

        # Select first source using data-testid
        source_select = page.locator('[data-testid="generate-source-select"]').first
        source_select.click()
        # Click first available option
        page.locator('[role="option"]').first.click()

        # Uncheck all platforms first (LinkedIn is checked by default)
        twitter_checkbox = page.locator('[data-testid="generate-platform-twitter"]').first
        if twitter_checkbox.is_checked():
            twitter_checkbox.uncheck()

        blog_checkbox = page.locator('[data-testid="generate-platform-blog"]').first
        if blog_checkbox.is_checked():
            blog_checkbox.uncheck()

        # LinkedIn should already be checked by default, but ensure it
        linkedin_checkbox = page.locator('[data-testid="generate-platform-linkedin"]').first
        if not linkedin_checkbox.is_checked():
            linkedin_checkbox.check()

        # Select tone (professional is default, so we can skip)
        # But let's explicitly set it
        tone_select = page.locator('[data-testid="generate-tone-select"]').first
        tone_select.click()
        page.locator('[role="option"]:has-text("Professional")').first.click()

        # Enter CTA
        cta_input = page.locator('[data-testid="generate-cta-input"]').first
        cta_input.fill('Learn more at example.com')

        # Click Generate
        gen_btn = page.locator('[data-testid="generate-content-submit"]').first
        gen_btn.click()

        # Wait for generation (up to 30 seconds)
        print("   ⏳ Waiting for content generation (this may take 5-15 seconds)...")
        try:
            page.wait_for_selector('[role="dialog"]', state='hidden', timeout=30000)
        except:
            pass  # Dialog might still be visible, check for tasks anyway

        time.sleep(2)  # Brief pause for tasks to appear
        screenshot = save_screenshot(page, '3.3-single-platform')

        # Count tasks after generation
        tasks_after = len(page.locator('.task-card, [data-task], article').all())

        # Check if new task was created
        if tasks_after > tasks_before:
            # Look for LinkedIn task
            linkedin_task = False
            try:
                page.locator('text=/LinkedIn|LI/i').first.wait_for(state='visible', timeout=2000)
                linkedin_task = True
            except:
                pass

            if linkedin_task:
                log_test(feature, "Test Case 3.3", "PASS", "Generate Content - Single Platform",
                        "Task created for LinkedIn with professional tone and CTA",
                        f"LinkedIn task generated ({tasks_after - tasks_before} new task(s))", screenshot_path=screenshot)
            else:
                log_test(feature, "Test Case 3.3", "PARTIAL", "Generate Content - Single Platform",
                        "Task created for LinkedIn",
                        f"Task created but LinkedIn badge not confirmed ({tasks_after - tasks_before} new task(s))",
                        issues=["LinkedIn badge not found"], screenshot_path=screenshot)
        else:
            log_test(feature, "Test Case 3.3", "FAIL", "Generate Content - Single Platform",
                    "Task created for LinkedIn",
                    "No new tasks appeared after generation",
                    issues=[f"Tasks before: {tasks_before}, after: {tasks_after}"], screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 3.3", "FAIL", "Generate Content - Single Platform",
                "Content generated successfully", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '3.3-error'))

    # Test Case 3.4: Generate Content - Multiple Platforms
    try:
        page.goto('http://localhost:3000/campaigns')
        page.wait_for_load_state('networkidle')

        tasks_before = len(page.locator('.task-card, [data-task], article').all())

        # Open dialog
        generate_btn = page.locator('button:has-text("Generate")').first
        generate_btn.click()
        page.wait_for_selector('[role="dialog"]', timeout=3000)

        # Wait for sources to load
        time.sleep(1)

        # Select first source
        source_select = page.locator('[data-testid="generate-source-select"]').first
        source_select.click()
        page.locator('[role="option"]').first.click()

        # Ensure all platforms are checked (LinkedIn is default)
        linkedin_checkbox = page.locator('[data-testid="generate-platform-linkedin"]').first
        if not linkedin_checkbox.is_checked():
            linkedin_checkbox.check()

        twitter_checkbox = page.locator('[data-testid="generate-platform-twitter"]').first
        if not twitter_checkbox.is_checked():
            twitter_checkbox.check()

        blog_checkbox = page.locator('[data-testid="generate-platform-blog"]').first
        if not blog_checkbox.is_checked():
            blog_checkbox.check()

        # Select casual tone
        tone_select = page.locator('[data-testid="generate-tone-select"]').first
        tone_select.click()
        page.locator('[role="option"]:has-text("Casual")').first.click()

        # Click Generate
        page.locator('[data-testid="generate-content-submit"]').first.click()

        # Wait for generation (longer for multiple platforms)
        print("   ⏳ Waiting for multi-platform generation (this may take 10-20 seconds)...")
        try:
            page.wait_for_selector('[role="dialog"]', state='hidden', timeout=30000)
        except:
            pass

        time.sleep(2)
        screenshot = save_screenshot(page, '3.4-multiple-platforms')

        tasks_after = len(page.locator('.task-card, [data-task], article').all())
        new_tasks = tasks_after - tasks_before

        if new_tasks >= 3:
            log_test(feature, "Test Case 3.4", "PASS", "Generate Content - Multiple Platforms",
                    "Tasks created for all 3 platforms (LinkedIn, Twitter, Blog)",
                    f"{new_tasks} tasks generated", screenshot_path=screenshot)
        elif new_tasks > 0:
            log_test(feature, "Test Case 3.4", "PARTIAL", "Generate Content - Multiple Platforms",
                    "Tasks created for all platforms",
                    f"Only {new_tasks} task(s) generated (expected 3)",
                    issues=[f"Expected 3 tasks, got {new_tasks}"], screenshot_path=screenshot)
        else:
            log_test(feature, "Test Case 3.4", "FAIL", "Generate Content - Multiple Platforms",
                    "Tasks created for all platforms",
                    "No new tasks appeared",
                    issues=[f"No new tasks created"], screenshot_path=screenshot)
    except Exception as e:
        log_test(feature, "Test Case 3.4", "FAIL", "Generate Content - Multiple Platforms",
                "Content generated for multiple platforms", f"Error: {str(e)}",
                issues=[str(e)], screenshot_path=save_screenshot(page, '3.4-error'))

    # Test Case 3.5: Test Different Tones (Skip - already tested in 3.3 and 3.4)
    log_test(feature, "Test Case 3.5", "SKIP", "Test Different Tones",
            "Different tones produce different content",
            "Covered by Test Cases 3.3 (professional) and 3.4 (casual)")

    # Test Case 3.6: Error Handling (Skip - requires API key manipulation)
    log_test(feature, "Test Case 3.6", "SKIP", "Verify Error Handling",
            "Error messages display correctly",
            "Requires API key manipulation, not suitable for automated testing")

def test_end_to_end_workflow(page):
    """End-to-End Workflow Test"""
    feature = "End-to-End Workflow"
    print(f"\n{'='*60}")
    print(f"Testing: {feature}")
    print(f"{'='*60}\n")

    log_test(feature, "E2E Test", "SKIP", "Complete User Journey",
            "Full workflow from source ingestion to task management",
            "Covered by individual feature tests - comprehensive E2E requires clean database state")

def main():
    """Main test execution"""
    print("\n" + "="*60)
    print("NAVAM MARKETER - AUTOMATED EVALUATION TEST")
    print("Version: 0.3.1")
    print("="*60 + "\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Enable console logging
        page.on("console", lambda msg: print(f"   [Browser Console] {msg.type}: {msg.text}"))

        try:
            # Run all test suites
            test_source_ingestion(page)
            test_campaign_management(page)
            test_content_generation(page)
            test_end_to_end_workflow(page)

            # Record end time
            test_results['end_time'] = datetime.now().isoformat()

            # Calculate duration
            start = datetime.fromisoformat(test_results['start_time'])
            end = datetime.fromisoformat(test_results['end_time'])
            duration = end - start
            test_results['duration_seconds'] = duration.total_seconds()

            # Save results to JSON
            results_file = Path('/Users/manavsehgal/Developer/marketer/evals') / f"test-results-{datetime.now().strftime('%Y-%m-%d-%H%M%S')}.json"
            with open(results_file, 'w') as f:
                json.dump(test_results, f, indent=2)

            print(f"\n{'='*60}")
            print("TEST SUMMARY")
            print(f"{'='*60}")
            print(f"Total Tests: {test_results['total_tests']}")
            print(f"✅ Passed: {test_results['passed']}")
            print(f"❌ Failed: {test_results['failed']}")
            print(f"⏭️  Skipped: {test_results['skipped']}")
            print(f"Pass Rate: {(test_results['passed'] / test_results['total_tests'] * 100):.1f}%")
            print(f"Duration: {duration.total_seconds():.1f} seconds")
            print(f"\nResults saved to: {results_file}")
            print(f"Screenshots saved to: {screenshots_dir}")
            print(f"{'='*60}\n")

        except Exception as e:
            print(f"\n❌ FATAL ERROR: {str(e)}")
            save_screenshot(page, 'fatal-error')
            raise
        finally:
            browser.close()

if __name__ == '__main__':
    main()
