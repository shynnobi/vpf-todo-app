#!/usr/bin/env node

/**
 * Reset Tests Script
 *
 * This script resets all test files to a minimal state while preserving the testing infrastructure.
 * It keeps the basic smoke tests and removes application-specific test implementations.
 *
 * Usage:
 *   node scripts/reset-tests.js
 *   # or if added to package.json scripts:
 *   pnpm reset-tests
 *
 * ========== CUSTOMIZATION GUIDE ==========
 *
 * To adapt this script for different project types:
 *
 * 1. KEEP_PATTERNS: Modify this array to specify which test files to keep.
 *    You can use exact file paths or glob patterns.
 *
 * 2. APP_TEST_PATH & APP_TEST_CONTENT: Change these to match your application's
 *    entry component and adjust the test content appropriately.
 *
 * 3. Add custom test generators: Follow the pattern of createBasicAppTest()
 *    to create additional baseline tests for your specific needs.
 *
 * 4. TEST_DIRS: Update if your project uses a different test folder structure.
 *
 * This script is designed to be framework-agnostic but may need adjustments
 * for specific project structures or testing libraries.
 *
 * ==========================================
 */

/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration - Edit these constants to customize what gets preserved
const TEST_DIRS = ['tests/unit', 'tests/integration', 'tests/e2e'];
const KEEP_PATTERNS = [
	// Basic infrastructure tests
	'tests/unit/app/App.test.tsx', // Basic smoke test for App
	// Configuration and documentation
	'tests/config/**/*',
	'tests/README.md',
	// Add other patterns if needed
];

// Path to generate basic App smoke test if it doesn't exist
const APP_TEST_PATH = 'tests/unit/app/App.test.tsx';
const APP_TEST_CONTENT = `import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

/**
 * Minimal test to verify the application renders without crashing
 * This serves as a basic smoke test for the application
 */
describe('App', () => {
	it('renders without crashing', () => {
		// This test simply verifies that the App component mounts without throwing any errors
		expect(() =>
			render(
				<BrowserRouter>
					<App />
				</BrowserRouter>
			)
		).not.toThrow();
	});
});
`;

// Helper to check if a file should be kept
const shouldKeepFile = file => {
	return KEEP_PATTERNS.some(pattern => {
		// Handle glob patterns
		if (pattern.includes('*')) {
			return glob.sync(pattern).includes(file);
		}
		return file === pattern;
	});
};

// Ensure directory exists
const ensureDirectoryExists = dirPath => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
};

// Create basic App test if it doesn't exist
const createBasicAppTest = () => {
	const appTestDir = path.dirname(APP_TEST_PATH);
	ensureDirectoryExists(appTestDir);

	if (!fs.existsSync(APP_TEST_PATH)) {
		console.log(`  📝 Creating basic App test: ${APP_TEST_PATH}`);
		fs.writeFileSync(APP_TEST_PATH, APP_TEST_CONTENT);
		return true;
	}
	return false;
};

// Main function to reset tests
async function resetTests() {
	console.log('🧪 Resetting test files to minimal state...');

	let processedFiles = 0;
	let keptFiles = 0;
	let removedFiles = 0;
	let createdFiles = 0;

	// Process each test directory
	for (const dir of TEST_DIRS) {
		try {
			if (!fs.existsSync(dir)) {
				console.log(`  ⚠️ Directory not found: ${dir}`);
				continue;
			}

			// Find all test files recursively
			const files = glob.sync(`${dir}/**/*.{ts,tsx,js,jsx}`);

			for (const file of files) {
				processedFiles++;

				if (shouldKeepFile(file)) {
					console.log(`  ✅ Keeping: ${file}`);
					keptFiles++;
				} else {
					console.log(`  🗑️  Removing: ${file}`);
					fs.unlinkSync(file);
					removedFiles++;
				}
			}
		} catch (error) {
			console.error(`Error processing directory ${dir}:`, error);
		}
	}

	// Create basic tests if they don't exist
	if (createBasicAppTest()) {
		createdFiles++;
	}

	console.log('\n🏁 Reset complete!');
	console.log(`  📊 Processed: ${processedFiles} files`);
	console.log(`  🟩 Kept: ${keptFiles} files`);
	console.log(`  🟥 Removed: ${removedFiles} files`);
	console.log(`  🆕 Created: ${createdFiles} files`);
	console.log('\n🚀 The test environment is now ready for your new project!');
}

// Run the script
resetTests().catch(error => {
	console.error('Failed to reset tests:', error);
	process.exit(1);
});
