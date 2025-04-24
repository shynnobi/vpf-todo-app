import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import { describe, expect, it, vi } from 'vitest';

import { AddTodoForm } from '@/components/AddTodoForm';

/**
 * Unit tests for the AddTodoForm component.
 *
 * Tests the rendering and interactions of the form used to add new todos.
 * Following the BDD approach with Given-When-Then format.
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

			// When: Searching for the due date button (initially by accessible name or icon presence)
			// Note: The actual button might not have text initially, so we might need a more robust selector later (e.g., aria-label)
			// For now, let's assume we can find it by a test-id or role if needed, or check for the icon.
			// Let's look for the parent button of the CalendarClock icon for now.
			const calendarButton = screen.getByRole('button', { name: /open calendar/i }); // Placeholder name, needs implementation

			// Then: The button should be present
			expect(calendarButton).toBeInTheDocument();
		});
	});

	describe('Form Interaction', () => {
		it('should call onAddTodo with entered title when form is submitted', async () => {
			// Given: A spy function for onAddTodo and the component is rendered
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);

			// And: A todo title is entered in the input
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await userEvent.type(inputElement, 'Test Todo');

			// When: The form is submitted
			const buttonElement = screen.getByRole('button', { name: /add/i });
			await userEvent.click(buttonElement);

			// Then: onAddTodo should be called with the entered title and default priority (null)
			expect(mockAddTodo).toHaveBeenCalledWith({ title: 'Test Todo', priority: null });
		});

		it('should not call onAddTodo when form is submitted with empty input', () => {
			// Given: A spy function for onAddTodo and the component is rendered
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);

			// When: The form is submitted without entering a title
			const buttonElement = screen.getByRole('button', { name: /add/i });
			fireEvent.click(buttonElement);

			// Then: onAddTodo should not be called
			expect(mockAddTodo).not.toHaveBeenCalled();
		});

		it('should clear input field after successful submission', () => {
			// Given: The component is rendered
			render(<AddTodoForm onAddTodo={() => {}} />);

			// And: A todo title is entered in the input
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			fireEvent.change(inputElement, { target: { value: 'Test Todo' } });

			// When: The form is submitted
			const buttonElement = screen.getByRole('button', { name: /add/i });
			fireEvent.click(buttonElement);

			// Then: The input field should be cleared
			expect(inputElement).toHaveValue('');
		});

		it('should open date picker popover when calendar button is clicked', async () => {
			// Given: The component is rendered
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();

			// When: The calendar button is clicked
			const calendarButton = screen.getByRole('button', { name: /open calendar/i }); // Assumes accessible name is added
			await user.click(calendarButton);

			// Then: A popover containing the calendar should be visible
			// We check for an element typically found within the react-day-picker calendar
			const calendarElement = await screen.findByRole('grid'); // react-day-picker uses role="grid"
			expect(calendarElement).toBeVisible();
		});

		it('should update button text and close popover upon date selection', async () => {
			// Given: The component is rendered and the calendar popover is open
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const calendarButton = screen.getByRole('button', { name: /open calendar/i });
			await user.click(calendarButton);
			const calendarGrid = await screen.findByRole('grid');
			expect(calendarGrid).toBeVisible(); // Ensure calendar is open

			// When: A date is selected from the calendar (e.g., the 15th of the current month)
			// Note: Selecting a specific date robustly might require knowledge of the current month displayed.
			// We'll select the button with role 'gridcell' and name '15'.
			const dateToSelect = screen.getByRole('gridcell', { name: '15' });
			await user.click(dateToSelect);

			// Then: The popover should close (calendar grid is no longer present)
			expect(screen.queryByRole('grid')).not.toBeInTheDocument();

			// And: The calendar button should display the selected date formatted
			// We need to calculate the expected format based on the selected date (15th)
			const expectedDate = new Date();
			expectedDate.setDate(15);
			const expectedFormat = format(expectedDate, 'PPP'); // e.g., Jul 15th, 2024
			expect(calendarButton).toHaveTextContent(expectedFormat);
		});

		it('should call onAddTodo with title and selected due date when submitted', async () => {
			// Given: A spy function, the component rendered, and a date selected
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const user = userEvent.setup();
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const calendarButton = screen.getByRole('button', { name: /open calendar/i });
			const submitButton = screen.getByRole('button', { name: /add/i });

			// Select a date (e.g., 20th)
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', { name: '20' });
			await user.click(dateToSelect);

			// Enter a title
			await user.type(inputElement, 'Todo with due date');

			// When: The form is submitted
			await user.click(submitButton);

			// Then: onAddTodo should be called with title, null priority, and the selected date
			// The date object passed might be tricky to match exactly due to time component.
			// We will check the properties are correct, especially the date part.
			const expectedDate = new Date();
			expectedDate.setDate(20);
			expectedDate.setHours(0, 0, 0, 0); // Normalize time for comparison if needed, though type is string

			expect(mockAddTodo).toHaveBeenCalledTimes(1);
			expect(mockAddTodo).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'Todo with due date',
					priority: null,
					// Since the type is string, we expect an ISO string. Let's adjust the expectation.
					// We'll check if it's a string starting with the correct YYYY-MM-DD part.
					// Note: This assumes the component converts Date to ISO string before calling onAddTodo.
					dueDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}/), // Basic check for ISO date string format
					// A more precise check might involve parsing the date string from the call arguments
				})
			);

			// Optional: More precise check on the date passed
			if (mockAddTodo.mock.calls[0][0].dueDate) {
				const submittedDate = new Date(mockAddTodo.mock.calls[0][0].dueDate);
				expect(submittedDate.getDate()).toBe(20);
				// Potentially check month and year too if needed for robustness
			}
		});

		it('should clear due date selection after successful submission', async () => {
			// Given: The component is rendered
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const calendarButton = screen.getByRole('button', { name: /open calendar/i });
			const submitButton = screen.getByRole('button', { name: /add/i });

			// Enter title and select a date
			await user.type(inputElement, 'Another Todo');
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', { name: '25' });
			await user.click(dateToSelect);

			// Verify date is selected initially
			const expectedDate = new Date();
			expectedDate.setDate(25);
			const expectedFormat = format(expectedDate, 'PPP');
			expect(calendarButton).toHaveTextContent(expectedFormat);

			// When: The form is submitted
			await user.click(submitButton);

			// Then: The calendar button should reset to its default state ("Due date")
			expect(calendarButton).not.toHaveTextContent(expectedFormat);
			expect(calendarButton).toHaveTextContent(/due date/i);
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes for accessibility', () => {
			// Given: The component is rendered
			render(<AddTodoForm onAddTodo={() => {}} />);

			// Then: The form should have proper accessibility attributes
			const form = screen.getByRole('form');
			expect(form).toHaveAttribute('aria-label', 'Add todo form');
		});
	});
});
