import { expect, test } from '@playwright/test';

/**
 * Helper function to get the selector for a specific day in the Shadcn calendar.
 * Assumes the calendar grid is visible.
 */
// ... existing code ...

/**
 * E2E tests for the DueDatePicker component interactions within the application,
 * specifically within the context of the AddTodoForm.
 */
test.describe('DueDatePicker in AddTodoForm', () => {
	// Navigate to the homepage before each test
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should open and close the date picker popover', async ({ page }) => {
		// Given: The AddTodoForm is visible
		const dueDateButton = page.getByRole('button', { name: /due date/i });
		const todoInput = page.getByPlaceholder(/what's on your mind/i);
		const calendarGrid = page.getByRole('grid'); // Locator for the calendar grid

		// Initially, the calendar should not be visible
		await expect(calendarGrid).toBeHidden();

		// When: The due date button is clicked
		await dueDateButton.click();

		// Then: The calendar grid should become visible
		await expect(calendarGrid).toBeVisible();

		// When: Clicking outside the popover (e.g., on the input field)
		await todoInput.click();

		// Then: The calendar grid should close
		await expect(calendarGrid).toBeHidden();
	});

	// Placeholder for the next test
	// test('should select a date and update the button', async ({ page }) => {
	// 	// ...
	// });
});
