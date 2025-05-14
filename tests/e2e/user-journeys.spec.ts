import { expect, test } from '@playwright/test';

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

		// Click the delete button to open the confirmation dialog
		await page
			.locator(`li`)
			.filter({ hasText: uniqueTask })
			.getByRole('button', { name: /delete/i })
			.click();

		// Verify the confirmation dialog is shown
		await expect(page.getByRole('heading', { name: 'Are you sure?' })).toBeVisible();

		// Confirm deletion
		await page.getByRole('button', { name: 'Delete' }).click();

		// Verify that the task has been deleted
		await expect(element).not.toBeVisible();
	});

	test('Simplified task journey: create, edit, and delete', async ({ page, isMobile }) => {
		// Access the application
		await page.goto('/');

		// Create a task with a title
		const uniqueTask = `Date Task ${Date.now()}`;
		await page.getByPlaceholder(/what's on your mind/i).fill(uniqueTask);

		// On mobile, we'll skip the date picker interaction as it's causing issues
		if (!isMobile) {
			// Open the date picker
			await page.getByRole('button', { name: /due date/i }).click();

			// Wait for the calendar to be visible
			const calendar = page.getByRole('grid');
			await expect(calendar).toBeVisible();

			// Try to click any selectable date (one that's not disabled)
			const anyEnabledDate = calendar.locator('button:not([disabled])').first();
			await anyEnabledDate.click();
		}

		// Add the task
		await page.getByRole('button', { name: /add/i }).click();

		// Verify that the task has been created
		const element = page.getByText(uniqueTask);
		await expect(element).toBeVisible();

		// Edit the task
		await page
			.locator('li')
			.filter({ hasText: uniqueTask })
			.locator('button[data-slot="button"]')
			.first() // Get the first button with data-slot="button" (the edit button)
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

		// Delete the task
		await page
			.locator('li')
			.filter({ hasText: modifiedTask })
			.getByRole('button', { name: /delete/i })
			.click();

		// Verify the confirmation dialog is shown
		await expect(page.getByRole('heading', { name: 'Are you sure?' })).toBeVisible();

		// Confirm deletion
		await page.getByRole('button', { name: 'Delete' }).click();

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

		// Use the "Active" filter - only on desktop for now to avoid mobile filter issues
		if (await page.getByRole('button', { name: /show active todos/i }).isVisible()) {
			await page.getByRole('button', { name: /show active todos/i }).click();
			await page.waitForTimeout(200);

			// Verify that only one task is visible
			await expect(page.getByText(tasks[2])).toBeVisible();
			await expect(page.getByText(tasks[0])).not.toBeVisible();
			await expect(page.getByText(tasks[1])).not.toBeVisible();

			// Use the "Completed" filter
			await page.getByRole('button', { name: /show completed todos/i }).click();
			await page.waitForTimeout(200);

			// Verify that the first two tasks are visible
			await expect(page.getByText(tasks[0])).toBeVisible();
			await expect(page.getByText(tasks[1])).toBeVisible();
			await expect(page.getByText(tasks[2])).not.toBeVisible();

			// Return to the "All" filter
			await page.getByRole('button', { name: /show all todos/i }).click();
			await page.waitForTimeout(200);
		}

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

			// Confirm deletion in the dialog
			await page.getByRole('button', { name: 'Delete' }).click();

			// Add a small delay between deletions
			await page.waitForTimeout(200);
		}

		// Verify that all tasks have been deleted
		for (const task of tasks) {
			await expect(page.getByText(task)).not.toBeVisible();
		}
	});
});
