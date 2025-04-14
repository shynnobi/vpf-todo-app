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
 */

/* eslint-disable no-undef */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const TEST_DIRS = ['tests/unit', 'tests/integration', 'tests/e2e'];
const KEEP_FILES = [
	'tests/unit/app/App.test.tsx', // Basic smoke test for App
	'tests/unit/store/todoStore.test.tsx', // Basic smoke test for store
	'tests/config/**/*', // Test configuration
	'tests/README.md', // Documentation
];

// Helper to check if a file should be kept
const shouldKeepFile = file => {
	return KEEP_FILES.some(keepFile => {
		// Handle glob patterns in KEEP_FILES
		if (keepFile.includes('*')) {
			return glob.sync(keepFile).includes(file);
		}
		return file === keepFile;
	});
};

// Main function to reset tests
async function resetTests() {
	console.log('🧪 Resetting test files to minimal state...');

	let processedFiles = 0;
	let keptFiles = 0;
	let removedFiles = 0;

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

					// Create directories if needed
					const dirName = path.dirname(file);
					if (!fs.existsSync(dirName)) {
						fs.mkdirSync(dirName, { recursive: true });
					}
				}
			}
		} catch (error) {
			console.error(`Error processing directory ${dir}:`, error);
		}
	}

	console.log('\n🏁 Reset complete!');
	console.log(`  📊 Processed: ${processedFiles} files`);
	console.log(`  🟩 Kept: ${keptFiles} files`);
	console.log(`  🟥 Removed: ${removedFiles} files`);
	console.log('\n🚀 The test environment is now ready for your new project!');
}

// Run the script
resetTests().catch(error => {
	console.error('Failed to reset tests:', error);
	process.exit(1);
});
