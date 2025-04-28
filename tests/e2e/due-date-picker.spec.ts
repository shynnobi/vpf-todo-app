import { expect, test } from '@playwright/test';
import { format, subDays } from 'date-fns';

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

	test('should disable past dates in the calendar', async ({ page }) => {
		// Given: The AddTodoForm is visible and the date picker is closed
		const dueDateButton = page.getByRole('button', { name: /due date/i });
		const calendarGrid = page.getByRole('grid');
		const prevMonthButton = page.locator('button[aria-label="Go to previous month"]'); // Selector for prev month button
		await expect(calendarGrid).toBeHidden();

		// When: The due date button is clicked to open the calendar
		await dueDateButton.click();
		await expect(calendarGrid).toBeVisible();

		// Then: The previous month button should be disabled when viewing the current month
		await expect(prevMonthButton).toBeDisabled();

		// And: We calculate yesterday's date
		const today = new Date();
		const yesterday = subDays(today, 1);
		const yesterdayDay = format(yesterday, 'd'); // Get the day number (e.g., '15')

		// Then: The button for yesterday (if visible in the current month view) should be disabled
		// This is a secondary check now that we confirm the prev month button is disabled.
		const yesterdayButton = calendarGrid.getByRole('button', {
			name: yesterdayDay, // Shadcn uses just the day number as the accessible name
			exact: true,
		});

		// Check if the button for yesterday exists and is disabled
		if (await yesterdayButton.isVisible()) {
			await expect(yesterdayButton).toBeDisabled();
		}
		// No warning needed here anymore, the primary check is the prevMonthButton state.

		// Cleanup: Close the calendar
		await dueDateButton.click(); // Click again to close
		await expect(calendarGrid).toBeHidden();
	});

	test('should disable previous month navigation only for the current month', async ({ page }) => {
		// Given: The AddTodoForm is visible and the date picker is closed
		const dueDateButton = page.getByRole('button', { name: /due date/i });
		const calendarGrid = page.getByRole('grid');
		const prevMonthButton = page.locator('button[aria-label="Go to previous month"]');
		const nextMonthButton = page.locator('button[aria-label="Go to next month"]');
		await expect(calendarGrid).toBeHidden();

		// When: The due date button is clicked to open the calendar (shows current month)
		await dueDateButton.click();
		await expect(calendarGrid).toBeVisible();

		// Then: Previous month button is disabled, Next month button is enabled
		await expect(prevMonthButton).toBeDisabled();
		await expect(nextMonthButton).toBeEnabled();

		// When: Clicking the next month button
		await nextMonthButton.click();

		// Then: Previous month button should now be enabled
		await expect(prevMonthButton).toBeEnabled();
		await expect(nextMonthButton).toBeEnabled(); // Next should still be enabled

		// When: Clicking the previous month button to go back to the current month
		await prevMonthButton.click();

		// Then: Previous month button should be disabled again
		await expect(prevMonthButton).toBeDisabled();
		await expect(nextMonthButton).toBeEnabled();

		// Cleanup: Close the calendar
		await dueDateButton.click(); // Click again to close
		await expect(calendarGrid).toBeHidden();
	});
});
