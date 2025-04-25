import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDate } from 'date-fns';
import { describe, expect, it, vi } from 'vitest';

import { AddTodoForm } from '@/components/AddTodoForm';

/**
 * Unit tests for the AddTodoForm component.
 *
 * Tests the rendering and interactions of the form used to add new todos.
 * Following the BDD approach with Given-When-Then format.
 */
describe('AddTodoForm Component', () => {
	// REMOVED global beforeEach/afterEach for fake timers

	describe('Initial Rendering', () => {
		it('should render a form with input and submit button', () => {
			// Given: The component is rendered
			render(<AddTodoForm onAddTodo={() => {}} />);

			// Then: It should display an input field for the todo title
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			expect(inputElement).toBeInTheDocument();

			// And: It should display a submit button
			const buttonElement = screen.getByRole('button', { name: /add/i });
			expect(buttonElement).toBeInTheDocument();
		});

		it('should render a button to open the due date picker', () => {
			// Given: The component is rendered
			render(<AddTodoForm onAddTodo={() => {}} />);

			// When: Searching for the due date button
			const calendarButton = screen.getByRole('button', { name: /due date/i });

			// Then: The button should be present
			expect(calendarButton).toBeInTheDocument();
		});
	});

	describe('Form Interaction without Due Date', () => {
		it('should call onAddTodo with entered title (and null date/priority) when form is submitted', async () => {
			// Given
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const user = userEvent.setup(); // Use real timers
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await user.type(inputElement, 'Test Todo');
			const buttonElement = screen.getByRole('button', { name: /add/i });

			// When
			await user.click(buttonElement);

			// Then
			await waitFor(() => {
				expect(mockAddTodo).toHaveBeenCalledWith({
					title: 'Test Todo',
					priority: null,
					dueDate: null, // Expect null when no date is selected
				});
			});
		});

		it('should not call onAddTodo when form is submitted with empty input', async () => {
			// Given
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const user = userEvent.setup(); // Use real timers
			const buttonElement = screen.getByRole('button', { name: /add/i });

			// When
			await user.click(buttonElement);

			// Then
			expect(mockAddTodo).not.toHaveBeenCalled();
		});

		it('should clear input field after successful submission', async () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup(); // Use real timers
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await user.type(inputElement, 'Test Todo');
			const buttonElement = screen.getByRole('button', { name: /add/i });

			// When
			await user.click(buttonElement);

			// Then
			await waitFor(() => {
				expect(inputElement).toHaveValue('');
			});
		});
	});

	describe('Form Interaction with Due Date', () => {
		it('should open date picker popover when calendar button is clicked', async () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup(); // Use real timers
			const calendarButton = screen.getByRole('button', { name: /due date/i });

			// When
			await user.click(calendarButton);

			// Then: Popover with calendar should be visible
			const calendarElement = await screen.findByRole('grid');
			expect(calendarElement).toBeVisible();
		});

		it('should update button text and close popover upon date selection', async () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup(); // Use real timers
			const calendarButton = screen.getByRole('button', { name: /due date/i });
			await user.click(calendarButton);
			const calendarGrid = await screen.findByRole('grid');
			expect(calendarGrid).toBeVisible();
			const dateToSelectValue = 20; // Select the 20th of the current month

			// When: Selecting a date
			// Find the 20th within the current calendar view
			const dateToSelect = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateToSelect);

			// Then: Popover closes
			await waitFor(() => {
				expect(screen.queryByRole('grid')).not.toBeInTheDocument();
			});

			// And: Button displays the selected day number and no longer default text
			await waitFor(() => {
				// Check it contains the day number (more robust than exact format)
				expect(calendarButton.textContent).toContain(dateToSelectValue.toString());
				// Check it no longer contains the default placeholder text
				expect(calendarButton).not.toHaveTextContent(/due date/i);
			});
		});

		it('should call onAddTodo with title and selected due date when submitted', async () => {
			// Given
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const user = userEvent.setup(); // Use real timers
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const calendarButton = screen.getByRole('button', { name: /due date/i });
			const submitButton = screen.getByRole('button', { name: /add/i });
			const dateToSelectValue = 20; // Select 20th

			// Select a date
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateToSelect);

			// Enter title
			await user.type(inputElement, 'Todo with due date');

			// When
			await user.click(submitButton);

			// Then
			await waitFor(() => {
				expect(mockAddTodo).toHaveBeenCalledTimes(1);
				// Check the shape and types/format of the argument
				expect(mockAddTodo).toHaveBeenCalledWith(
					expect.objectContaining({
						title: 'Todo with due date',
						priority: null,
						// Check if dueDate is a string in YYYY-MM-DD format
						dueDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
					})
				);
				// Additionally, verify the day of the month if possible and needed
				const submittedArg = mockAddTodo.mock.calls[0][0];
				expect(submittedArg.dueDate).toBeDefined();
				const submittedDate = new Date(submittedArg.dueDate + 'T00:00:00'); // Ensure correct parsing
				expect(getDate(submittedDate)).toBe(dateToSelectValue);
			});
		});

		it('should clear due date selection after successful submission', async () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup(); // Use real timers
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const calendarButton = screen.getByRole('button', { name: /due date/i });
			const submitButton = screen.getByRole('button', { name: /add/i });
			const dateToSelectValue = 25; // Select 25th

			// Store initial button text for later comparison
			const initialButtonText = calendarButton.textContent;

			// Select a date and enter title
			await user.type(inputElement, 'Another Todo');
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateToSelect);

			// Wait for the button text to update after selection
			let selectedButtonText = '';
			await waitFor(() => {
				expect(calendarButton.textContent).not.toBe(initialButtonText);
				selectedButtonText = calendarButton.textContent ?? ''; // Store the updated text
				expect(selectedButtonText).toContain(dateToSelectValue.toString());
			});

			// When
			await user.click(submitButton);

			// Then: Input cleared, date cleared (button text resets to initial)
			await waitFor(() => {
				expect(inputElement).toHaveValue('');
				expect(calendarButton).toHaveTextContent(/due date/i); // This check is sufficient
				expect(screen.queryByRole('button', { name: /clear due date/i })).not.toBeInTheDocument();
			});
		});

		it('should allow clearing the selected due date using the clear button', async () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup(); // Use real timers
			const calendarButton = screen.getByRole('button', { name: /due date/i });
			const dateToSelectValue = 18; // Select 18th
			const initialButtonText = calendarButton.textContent;

			// Select a date
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateToSelect);

			// Wait for button text update and clear button appearance
			let selectedButtonText = '';
			await waitFor(() => {
				expect(calendarButton.textContent).not.toBe(initialButtonText);
				selectedButtonText = calendarButton.textContent ?? '';
				expect(selectedButtonText).toContain(dateToSelectValue.toString());
			});
			const clearButton = await screen.findByRole('button', { name: /clear due date/i });
			expect(clearButton).toBeInTheDocument();

			// When
			await user.click(clearButton);

			// Then
			await waitFor(() => {
				expect(calendarButton.textContent).toBe(initialButtonText); // Check reset
				expect(calendarButton).toHaveTextContent(/due date/i); // Double check default
				expect(screen.queryByRole('button', { name: /clear due date/i })).not.toBeInTheDocument();
			});
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes for accessibility', () => {
			// Given: The component is rendered
			render(<AddTodoForm onAddTodo={() => {}} />);

			// Then: The form should have proper accessibility attributes
			expect(screen.getByPlaceholderText(/what's on your mind/i)).toHaveAccessibleName(
				/todo title/i
			);
			expect(screen.getByRole('button', { name: /add/i })).toHaveAccessibleName(/add/i);
			expect(screen.getByRole('button', { name: /due date/i })).toHaveAccessibleName(/due date/i);
		});
	});
});
