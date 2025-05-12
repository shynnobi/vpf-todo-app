import { expect, Page, test } from '@playwright/test';

// Helper function for applying filters that works on both mobile and desktop
async function applyFilter(page: Page, filterName: string) {
	// Check if we're on mobile by checking viewport width
	const viewportSize = page.viewportSize();
	const isMobile = viewportSize && viewportSize.width < 640; // sm breakpoint in Tailwind

	if (isMobile) {
		// On mobile, use the data-testid attributes
		// 1. Open the dropdown
		await page.locator('[data-testid="mobile-filter-trigger"]').click();

		// 2. Wait for the dropdown content to be visible
		await page.waitForSelector('[data-testid="mobile-filter-content"]', { state: 'visible' });

		// 3. Click on the appropriate option
		const testId = `mobile-filter-${filterName.toLowerCase()}`;
		await page.locator(`[data-testid="${testId}"]`).click();

		// 4. Wait for the UI to update
		await page.waitForTimeout(300);
	} else {
		// On desktop, use the buttons
		await page.getByRole('button', { name: new RegExp(`show ${filterName} todos`, 'i') }).click();
		await page.waitForTimeout(300);
	}
}

test.describe('Complete User Journeys', () => {
	test('Basic journey: create, mark as completed, then delete a task', async ({ page }) => {
		// Access the application
		await page.goto('/');

		// Create a new task
		const uniqueTask = `Test Task ${Date.now()}`;
		await page.getByPlaceholder(/what's on your mind/i).fill(uniqueTask);
		await page.getByRole('button', { name: /add/i }).click();

		// Verify that the task has been created
		const element = page.getByText(uniqueTask);
		await expect(element).toBeVisible();

		// Mark the task as completed
		const checkbox = page.locator(`li`).filter({ hasText: uniqueTask }).getByRole('checkbox');
		await checkbox.check();

		// Verify that the task is marked as completed
		await expect(checkbox).toBeChecked();

		// Delete the task
		await page
			.locator(`li`)
			.filter({ hasText: uniqueTask })
			.getByRole('button', { name: /delete/i })
			.click();

		// Verify that the task has been deleted
		await expect(element).not.toBeVisible();
	});

	test('Complete journey: create a task with due date, verify date restrictions, edit, and filter', async ({
		page,
	}) => {
		// Increase test timeout to handle potential slowness
		test.setTimeout(60000);

		// Access the application
		await page.goto('/');

		// 1. Create a task with a title
		const uniqueTask = `Date Task ${Date.now()}`;
		await page.getByPlaceholder(/what's on your mind/i).fill(uniqueTask);

		// Open the date picker to verify date restrictions
		await page.getByRole('button', { name: /due date/i }).click();

		// Wait for the calendar to be visible
		const calendar = page.getByRole('grid');
		await expect(calendar).toBeVisible();

		// Verify that the previous month button is disabled (critical business rule: no past dates)
		const prevMonthButton = page.getByRole('button', { name: 'Go to previous month' });
		await expect(prevMonthButton).toBeDisabled();

		// Select a date in the future (current date + 3 days)
		const targetDate = new Date();
		targetDate.setDate(targetDate.getDate() + 3);
		const dayLabel = targetDate.getDate().toString();

		// Click the day button
		const dayButton = calendar
			.locator('button[role="gridcell"]:not([disabled]):not(.day-outside)')
			.filter({ hasText: dayLabel })
			.first();
		await dayButton.click();

		// Add the task
		await page.getByRole('button', { name: /add/i }).click();

		// Verify that the task has been created
		const element = page.getByText(uniqueTask);
		await expect(element).toBeVisible();

		// Verify that the due date is present
		await expect(
			page.locator('li').filter({ hasText: uniqueTask }).locator('span').filter({ hasText: /due/i })
		).toBeVisible();

		// 2. Edit the task
		await page
			.locator('li')
			.filter({ hasText: uniqueTask })
			.getByRole('button', { name: /edit/i })
			.click();

		// Modify the title in the edit form
		const modifiedTask = `${uniqueTask} - modified`;
		await page.getByRole('textbox', { name: 'Edit title' }).fill(modifiedTask);

		// Save the changes
		await page.getByRole('button', { name: /save/i }).click();

		// Wait for the changes to be processed
		await page.waitForTimeout(500);

		// Verify that the changes have been applied
		await expect(page.getByText(modifiedTask)).toBeVisible();

		// 3. Filter tasks
		// Use a more robust approach that works on both mobile and desktop
		// Try to find the desktop filter buttons first, if not found use the mobile dropdown

		// Activate the filter for active tasks
		await applyFilter(page, 'active');

		// Verify that the task is visible in active filter
		await expect(page.getByText(modifiedTask)).toBeVisible();

		// Go to All filter
		await applyFilter(page, 'all');
		await page.waitForTimeout(300);

		// 4. Delete the task
		await page
			.locator('li')
			.filter({ hasText: modifiedTask })
			.getByRole('button', { name: /delete/i })
			.click();

		// Verify that the task has been deleted
		await expect(page.getByText(modifiedTask)).not.toBeVisible();
	});

	test('Managing multiple tasks and using filters', async ({ page }) => {
		// Access the application
		await page.goto('/');

		// Create three tasks
		const taskPrefix = `MultiTask ${Date.now()}`;
		const tasks = [`${taskPrefix} - 1`, `${taskPrefix} - 2`, `${taskPrefix} - 3`];

		for (const task of tasks) {
			await page.getByPlaceholder(/what's on your mind/i).fill(task);
			await page.getByRole('button', { name: /add/i }).click();
			await expect(page.getByText(task)).toBeVisible();
		}

		// Verify the task counter (format: "X tasks total")
		await expect(page.getByText(/tasks total/i)).toBeVisible();

		// Mark two tasks as completed
		for (let i = 0; i < 2; i++) {
			await page.locator('li').filter({ hasText: tasks[i] }).getByRole('checkbox').check();
			// Add a small delay between actions
			await page.waitForTimeout(200);
		}

		// Use the "Active" filter
		await applyFilter(page, 'active');
		await page.waitForTimeout(200);

		// Verify that only one task is visible
		await expect(page.getByText(tasks[2])).toBeVisible();
		await expect(page.getByText(tasks[0])).not.toBeVisible();
		await expect(page.getByText(tasks[1])).not.toBeVisible();

		// Use the "Completed" filter
		await applyFilter(page, 'completed');
		await page.waitForTimeout(200);

		// Verify that the first two tasks are visible
		await expect(page.getByText(tasks[0])).toBeVisible();
		await expect(page.getByText(tasks[1])).toBeVisible();
		await expect(page.getByText(tasks[2])).not.toBeVisible();

		// Return to the "All" filter
		await applyFilter(page, 'all');
		await page.waitForTimeout(200);

		// Verify that all tasks are visible
		await expect(page.getByText(tasks[0])).toBeVisible();
		await expect(page.getByText(tasks[1])).toBeVisible();
		await expect(page.getByText(tasks[2])).toBeVisible();

		// Cleanup - Delete all tasks
		for (const task of tasks) {
			await page
				.locator('li')
				.filter({ hasText: task })
				.getByRole('button', { name: /delete/i })
				.click();
			// Add a small delay between deletions
			await page.waitForTimeout(200);
		}

		// Verify that all tasks have been deleted
		for (const task of tasks) {
			await expect(page.getByText(task)).not.toBeVisible();
		}
	});
});
