import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getDate } from 'date-fns';
import { describe, expect, it, vi } from 'vitest';

import { AddTodoForm } from '@/components/AddTodoForm';

/**
 * Unit tests for the AddTodoForm component.
 * Verifies rendering and interactions for adding new todos.
 */
describe('AddTodoForm Component', () => {
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

			// When: Searching for the due date button by its accessible name
			const calendarButton = screen.getByRole('button', { name: /due date/i });

			// Then: The button should be present in the document
			expect(calendarButton).toBeInTheDocument();
		});
	});

	describe('Form Interaction without Due Date', () => {
		it('should call onAddTodo with entered title when form is submitted', async () => {
			// Given: A mock addTodo function and the rendered form with user input
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const user = userEvent.setup();
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await user.type(inputElement, 'Test Todo');
			const buttonElement = screen.getByRole('button', { name: /add/i });

			// When: The submit button is clicked
			await user.click(buttonElement);

			// Then: onAddTodo should be called with the title and null for other fields
			await waitFor(() => {
				expect(mockAddTodo).toHaveBeenCalledWith({
					title: 'Test Todo',
					priority: null,
					dueDate: null,
				});
			});
		});

		it('should not call onAddTodo when form is submitted with empty input', async () => {
			// Given: A mock addTodo function and the rendered form with empty input
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const user = userEvent.setup();
			const buttonElement = screen.getByRole('button', { name: /add/i });

			// When: The submit button is clicked
			await user.click(buttonElement);

			// Then: onAddTodo should not have been called
			expect(mockAddTodo).not.toHaveBeenCalled();
		});

		it('should clear input field after successful submission', async () => {
			// Given: The rendered form with user input
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await user.type(inputElement, 'Test Todo');
			const buttonElement = screen.getByRole('button', { name: /add/i });

			// When: The submit button is clicked
			await user.click(buttonElement);

			// Then: The input field should be empty
			await waitFor(() => {
				expect(inputElement).toHaveValue('');
			});
		});
	});

	describe('Form Interaction with Due Date', () => {
		it('should open date picker popover when calendar button is clicked', async () => {
			// Given: The rendered form
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const calendarButton = screen.getByRole('button', { name: /due date/i });

			// When: The calendar button is clicked
			await user.click(calendarButton);

			// Then: The calendar grid should become visible
			const calendarElement = await screen.findByRole('grid');
			expect(calendarElement).toBeVisible();
		});

		it('should update button text and close popover upon date selection', async () => {
			// Given: The rendered form with the calendar opened
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const calendarButton = screen.getByRole('button', { name: /due date/i });
			await user.click(calendarButton);
			const calendarGrid = await screen.findByRole('grid');
			expect(calendarGrid).toBeVisible(); // Ensure grid is open before selecting
			const dateToSelectValue = 20;

			// When: A date is selected from the calendar
			const dateToSelect = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateToSelect);

			// Then: The popover (calendar grid) should close
			await waitFor(() => {
				expect(screen.queryByRole('grid')).not.toBeInTheDocument();
			});

			// And: The button text should update to show the selected date number
			await waitFor(() => {
				expect(calendarButton.textContent).toContain(dateToSelectValue.toString());
				expect(calendarButton).not.toHaveTextContent(/due date/i);
			});
		});

		it('should call onAddTodo with title and selected due date when submitted', async () => {
			// Given: The form rendered, a date selected, and title entered
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const user = userEvent.setup();
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const calendarButton = screen.getByRole('button', { name: /due date/i });
			const submitButton = screen.getByRole('button', { name: /add/i });
			const dateToSelectValue = 20;

			// Action: Select a date
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateToSelect);

			// Action: Enter title
			await user.type(inputElement, 'Todo with due date');

			// When: The form is submitted
			await user.click(submitButton);

			// Then: onAddTodo is called with title and formatted dueDate
			await waitFor(() => {
				expect(mockAddTodo).toHaveBeenCalledTimes(1);
				expect(mockAddTodo).toHaveBeenCalledWith(
					expect.objectContaining({
						title: 'Todo with due date',
						priority: null,
						dueDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
					})
				);
				// And: The date part of the submitted dueDate matches the selected day
				const submittedArg = mockAddTodo.mock.calls[0][0];
				expect(submittedArg.dueDate).toBeDefined();
				// Parse the date string, ensuring timezone doesn't shift the day
				const submittedDate = new Date(submittedArg.dueDate + 'T00:00:00Z'); // Assume UTC if no TZ
				expect(getDate(submittedDate)).toBe(dateToSelectValue);
			});
		});

		it('should clear due date selection after successful submission', async () => {
			// Given: The form with a date selected and title entered
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const calendarButton = screen.getByRole('button', { name: /due date/i });
			const submitButton = screen.getByRole('button', { name: /add/i });
			const dateToSelectValue = 25;
			const initialButtonText = calendarButton.textContent;

			// Action: Enter title and select date
			await user.type(inputElement, 'Another Todo');
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateToSelect);
			await waitFor(() => {
				expect(calendarButton.textContent).not.toBe(initialButtonText);
			}); // Wait for update

			// When: The form is submitted
			await user.click(submitButton);

			// Then: Input and date fields should be cleared (button text resets)
			await waitFor(() => {
				expect(inputElement).toHaveValue('');
				expect(calendarButton).toHaveTextContent(/due date/i);
				expect(screen.queryByRole('button', { name: /clear due date/i })).not.toBeInTheDocument();
			});
		});

		it('should allow clearing the selected due date using the clear button', async () => {
			// Given: The form with a date selected
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const calendarButton = screen.getByRole('button', { name: /due date/i });
			const dateToSelectValue = 18;
			const initialButtonText = calendarButton.textContent;

			// Action: Select a date
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateToSelect);
			const clearButton = await screen.findByRole('button', { name: /clear due date/i }); // Wait for clear button

			// When: The clear button is clicked
			await user.click(clearButton);

			// Then: The date selection should be cleared (button text resets)
			await waitFor(() => {
				expect(calendarButton.textContent).toBe(initialButtonText);
				expect(calendarButton).toHaveTextContent(/due date/i);
				expect(screen.queryByRole('button', { name: /clear due date/i })).not.toBeInTheDocument();
			});
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes for accessibility', () => {
			// Given: The component is rendered
			render(<AddTodoForm onAddTodo={() => {}} />);

			// Then: The main interactive elements should have accessible names
			expect(screen.getByPlaceholderText(/what's on your mind/i)).toHaveAccessibleName(
				/todo title/i
			);
			expect(screen.getByRole('button', { name: /add/i })).toHaveAccessibleName(/add/i);
			// Consider a more descriptive label like "Select due date" if possible
			expect(screen.getByRole('button', { name: /due date/i })).toHaveAccessibleName(/due date/i);
		});
	});
});
