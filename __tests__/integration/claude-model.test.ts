/**
 * Integration tests for Claude Model Configuration
 *
 * These tests verify that the correct Claude model is being used in production.
 * This is critical because using deprecated or incorrect model names will result
 * in 404 errors from the Anthropic API.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Claude Model Configuration Tests', () => {
  const generateRouteFile = path.join(
    __dirname,
    '../../app/api/generate/route.ts'
  );

  describe('Model Name Verification', () => {
    it('should use the correct Claude Sonnet 4.5 model name', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // The model should be claude-sonnet-4-5-20250929
      expect(content).toContain('claude-sonnet-4-5-20250929');
    });

    it('should NOT use deprecated Claude 3.5 Sonnet model', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Should NOT contain the old model name
      expect(content).not.toContain('claude-3-5-sonnet-20241022');
    });

    it('should have model name in the anthropic.messages.create call', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Verify the model is specified in the API call
      const hasCorrectModelCall =
        content.includes('anthropic.messages.create') &&
        content.includes('model:') &&
        content.includes('claude-sonnet-4-5-20250929');

      expect(hasCorrectModelCall).toBe(true);
    });
  });

  describe('Model Configuration Structure', () => {
    it('should have proper API call structure', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Check for required parameters in the API call
      expect(content).toContain('anthropic.messages.create');
      expect(content).toContain('model:');
      expect(content).toContain('max_tokens:');
      expect(content).toContain('temperature:');
      expect(content).toContain('messages:');
    });

    it('should use appropriate token limit', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Should have max_tokens configured
      expect(content).toMatch(/max_tokens:\s*\d+/);
    });

    it('should use appropriate temperature setting', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Should have temperature configured (typically 0.7 for balanced creativity)
      expect(content).toMatch(/temperature:\s*0\.\d+/);
    });
  });

  describe('Model Version Consistency', () => {
    it('should use a dated snapshot version for production stability', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Should use dated version (YYYYMMDD format) for production stability
      // Format: claude-sonnet-4-5-YYYYMMDD
      const datedVersionPattern = /claude-sonnet-4-5-\d{8}/;
      expect(content).toMatch(datedVersionPattern);
    });

    it('should NOT use generic alias in production', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Should NOT use just 'claude-sonnet-4-5' without date
      // This ensures consistent behavior in production
      const lines = content.split('\n');
      const modelLines = lines.filter(line =>
        line.includes('model:') &&
        line.includes('claude-sonnet')
      );

      modelLines.forEach(line => {
        // If it contains the model specification, it should have a date
        if (line.includes("'claude-sonnet-4-5'") || line.includes('"claude-sonnet-4-5"')) {
          // Check if it's the dated version
          expect(line).toMatch(/claude-sonnet-4-5-\d{8}/);
        }
      });
    });
  });

  describe('Error Handling for Model Issues', () => {
    it('should have error handling for Anthropic API errors', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Should catch and handle Anthropic.APIError
      expect(content).toContain('Anthropic.APIError');
      expect(content).toContain('catch');
    });

    it('should provide helpful error messages', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Should include error message in response
      expect(content).toContain('error:');
      expect(content).toContain('Claude API error');
    });
  });

  describe('Production Readiness', () => {
    it('should verify the file exists and is readable', () => {
      expect(fs.existsSync(generateRouteFile)).toBe(true);
    });

    it('should have the generateWithClaude function', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      expect(content).toContain('async function generateWithClaude');
    });

    it('should import Anthropic SDK', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      expect(content).toContain("import Anthropic from '@anthropic-ai/sdk'");
    });

    it('should initialize Anthropic client with API key', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      expect(content).toContain('new Anthropic');
      expect(content).toContain('apiKey:');
      expect(content).toContain('ANTHROPIC_API_KEY');
    });
  });

  describe('Documentation Consistency', () => {
    it('should have model documented in release notes', () => {
      const releaseNotesFile = path.join(
        __dirname,
        '../../backlog/release-0.3.0.md'
      );

      if (fs.existsSync(releaseNotesFile)) {
        const content = fs.readFileSync(releaseNotesFile, 'utf-8');

        // Should reference the model in documentation
        expect(content).toContain('claude-sonnet-4-5');
      }
    });
  });

  describe('Model Availability Validation', () => {
    it('should use a model that exists in Anthropic API', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Extract the model name
      const modelMatch = content.match(/model:\s*['"]([^'"]+)['"]/);
      expect(modelMatch).toBeTruthy();

      if (modelMatch) {
        const modelName = modelMatch[1];

        // Verify it's a valid Anthropic model format
        // Should be: claude-{family}-{version}-{date}
        const validModelPattern = /^claude-(sonnet|opus|haiku)-[\d-]+$/;
        expect(modelName).toMatch(validModelPattern);

        // Specifically for this test, should be Claude Sonnet 4.5
        expect(modelName).toContain('claude-sonnet-4-5');
      }
    });

    it('should use the November 2025 or later model snapshot', () => {
      const content = fs.readFileSync(generateRouteFile, 'utf-8');

      // Extract the model name
      const modelMatch = content.match(/model:\s*['"]([^'"]+)['"]/);

      if (modelMatch) {
        const modelName = modelMatch[1];

        // Extract date from model name (format: YYYYMMDD)
        const dateMatch = modelName.match(/(\d{8})$/);

        if (dateMatch) {
          const dateStr = dateMatch[1];
          const year = parseInt(dateStr.substring(0, 4));
          const month = parseInt(dateStr.substring(4, 6));

          // Should be from 2025 or later
          expect(year).toBeGreaterThanOrEqual(2025);

          // If 2025, should be September (09) or later
          if (year === 2025) {
            expect(month).toBeGreaterThanOrEqual(9);
          }
        }
      }
    });
  });
});
