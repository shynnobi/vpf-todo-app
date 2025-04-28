import { expect, Page, test } from '@playwright/test';
import { format } from 'date-fns';

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
		const calendarPopover = page.getByRole('dialog');
		const calendarGrid = calendarPopover.locator('[role="grid"]').first();
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

	test('should allow selecting a future date and display it on the picker button', async ({
		page,
	}) => {
		// Given: A todo exists and the edit form is open
		await page.goto('/');
		const todoInput = page.getByPlaceholder(/what's on your mind/i);
		await todoInput.fill('E2E-SELECT-CURRENT-DATE'); // Changed todo name for clarity
		await page.getByRole('button', { name: /add/i }).click();
		await page.getByText('E2E-SELECT-CURRENT-DATE').waitFor();

		await page
			.getByRole('button', { name: /edit todo/i })
			.first()
			.click();

		// When: The user opens the date picker and selects a date in the current month
		const editForm = page.locator('form').filter({ hasText: 'Edit title' });
		const dateButton = editForm.locator(
			'button[aria-label*="Select due date"], button[aria-label*="Selected due date"]'
		);
		await dateButton.click();

		// --- SIMPLIFICATION: Select a date in the CURRENT month ---
		// Ensure the target date is not in the past relative to today if today is after the 15th
		const targetDate = new Date();
		targetDate.setDate(targetDate.getDate() + 2);
		const dayLabel = targetDate.getDate().toString();

		// Selectors
		const calendarPopover = page.getByRole('dialog');
		const calendarGrid = calendarPopover.locator('[role="grid"]').first();

		// Wait for the grid to be visible
		await calendarGrid.waitFor({ state: 'visible', timeout: 5000 });

		// Click the day (should be enabled as it's current month + 2 days)
		const dayButton = calendarGrid
			.locator('button[role="gridcell"]:not([disabled]):not(.day-outside)')
			.filter({ hasText: dayLabel })
			.first();
		await dayButton.click();

		// Then: Wait for the picker button to display the selected date
		const expectedFormattedDate = format(targetDate, 'd MMMM yyyy'); // e.g., "17 April 2024"
		const dateDisplaySpan = dateButton.locator('span').filter({ hasNotText: 'Due date' }).first();
		await expect(dateDisplaySpan).toHaveText(new RegExp(expectedFormattedDate, 'i'), {
			timeout: 5000,
		});
	});

	// --- Placeholder for subsequent tests (will need similar setup) ---
	// test('should allow selecting a new future date', async ({ page }) => { ... });
	// test('should allow clearing the due date', async ({ page }) => { ... });
	// test('should save the updated date', async ({ page }) => { ... });
});
