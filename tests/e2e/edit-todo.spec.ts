import { expect, Page, test } from '@playwright/test';

// Helper function to format date as YYYY-MM-DD for input[type="date"] comparison if needed,
// though DueDatePicker uses Date objects primarily.
// const formatDateForInput = (date: Date) => format(date, 'yyyy-MM-dd');

test.describe('Edit Todo Form - Due Date Picker', () => {
	test('should open date picker with no date selected and restrictions applied', async ({
		page,
	}: {
		page: Page;
	}) => {
		// Increase the default timeout for all assertions
		test.setTimeout(30000);

		// Given: The user is on the homepage
		await page.goto('/');

		// Given: A unique todo item exists
		const todoInput = page.getByPlaceholder(/what's on your mind/i);
		await todoInput.waitFor({ state: 'visible' });
		await todoInput.fill('TEST-UNIQUE-TODO-NAME-123');
		const addButton = page.getByRole('button', { name: /add/i });
		await addButton.waitFor({ state: 'visible' });
		await addButton.click();
		await page.waitForSelector('li[role="listitem"]');
		const todoElement = page.getByText('TEST-UNIQUE-TODO-NAME-123');
		await todoElement.waitFor({ timeout: 5000 });

		// When: The user clicks the edit button for the todo item
		const editButton = page.getByRole('button', { name: /edit todo/i }).first();
		await editButton.waitFor({ state: 'visible', timeout: 5000 });
		await editButton.click();

		// When: The user clicks the due date button within the edit form
		const editForm = page.locator('form').filter({ hasText: 'Edit title' });
		await editForm.waitFor({ state: 'visible', timeout: 5000 });
		const dateButton = editForm.getByRole('button').filter({ hasText: 'Due date' });
		await dateButton.waitFor({ state: 'visible', timeout: 5000 });
		await dateButton.click();

		// Then: The calendar popover should become visible
		const calendarGrid = page.locator('[role="grid"]').first(); // Target the first grid (the calendar)
		await calendarGrid.waitFor({ state: 'visible', timeout: 5000 });

		// Then: The previous month button should be disabled (as it's the current month)
		const prevMonthButton = page.getByRole('button', { name: 'Go to previous month' });
		expect(await prevMonthButton.isDisabled()).toBeTruthy();

		// Cleanup: Close the calendar
		await dateButton.click();

		// Cleanup: Cancel the edit
		const cancelButton = page.getByRole('button', { name: 'Cancel' });
		await cancelButton.click();
	});

	// --- Placeholder for subsequent tests (will need similar setup) ---
	// test('should allow selecting a new future date', async ({ page }) => { ... });
	// test('should allow clearing the due date', async ({ page }) => { ... });
	// test('should save the updated date', async ({ page }) => { ... });
});
