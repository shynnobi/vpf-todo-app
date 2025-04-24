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

			// When: Searching for the due date button
			const calendarButton = screen.getByRole('button', { name: /open calendar/i });

			// Then: The button should be present
			expect(calendarButton).toBeInTheDocument();
		});
	});

	describe('Form Interaction', () => {
		it('should call onAddTodo with entered title when form is submitted', async () => {
			// Given
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await userEvent.type(inputElement, 'Test Todo');
			const buttonElement = screen.getByRole('button', { name: /add/i });

			// When
			await userEvent.click(buttonElement);

			// Then
			expect(mockAddTodo).toHaveBeenCalledWith({ title: 'Test Todo', priority: null });
		});

		it('should not call onAddTodo when form is submitted with empty input', () => {
			// Given
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const buttonElement = screen.getByRole('button', { name: /add/i });

			// When
			fireEvent.click(buttonElement);

			// Then
			expect(mockAddTodo).not.toHaveBeenCalled();
		});

		it('should clear input field after successful submission', () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
			const buttonElement = screen.getByRole('button', { name: /add/i });

			// When
			fireEvent.click(buttonElement);

			// Then
			expect(inputElement).toHaveValue('');
		});

		it('should open date picker popover when calendar button is clicked', async () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const calendarButton = screen.getByRole('button', { name: /open calendar/i });

			// When
			await user.click(calendarButton);

			// Then: Popover with calendar should be visible
			const calendarElement = await screen.findByRole('grid');
			expect(calendarElement).toBeVisible();
		});

		it('should update button text and close popover upon date selection', async () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const calendarButton = screen.getByRole('button', { name: /open calendar/i });
			await user.click(calendarButton);
			const calendarGrid = await screen.findByRole('grid');
			expect(calendarGrid).toBeVisible();

			// When: Selecting a date
			const dateToSelect = screen.getByRole('gridcell', { name: '15' });
			await user.click(dateToSelect);

			// Then: Popover closes
			expect(screen.queryByRole('grid')).not.toBeInTheDocument();

			// And: Button displays selected date
			const expectedDate = new Date();
			expectedDate.setDate(15);
			const expectedFormat = format(expectedDate, 'd MMMM yyyy');
			expect(calendarButton).toHaveTextContent(expectedFormat);
		});

		it('should call onAddTodo with title and selected due date when submitted', async () => {
			// Given
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);
			const user = userEvent.setup();
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const calendarButton = screen.getByRole('button', { name: /open calendar/i });
			const submitButton = screen.getByRole('button', { name: /add/i });

			// Select a date
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', { name: '20' });
			await user.click(dateToSelect);
			await user.type(inputElement, 'Todo with due date');

			// When
			await user.click(submitButton);

			// Then
			expect(mockAddTodo).toHaveBeenCalledTimes(1);
			expect(mockAddTodo).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'Todo with due date',
					priority: null,
					dueDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}/),
				})
			);
			if (mockAddTodo.mock.calls[0][0].dueDate) {
				const submittedDate = new Date(mockAddTodo.mock.calls[0][0].dueDate);
				expect(submittedDate.getDate()).toBe(20);
			}
		});

		it('should clear due date selection after successful submission', async () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const calendarButton = screen.getByRole('button', { name: /open calendar/i });
			const submitButton = screen.getByRole('button', { name: /add/i });

			// Select a date and enter title
			await user.type(inputElement, 'Another Todo');
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', { name: '25' });
			await user.click(dateToSelect);
			const expectedDate = new Date();
			expectedDate.setDate(25);
			const expectedFormat = format(expectedDate, 'd MMMM yyyy');
			expect(calendarButton).toHaveTextContent(expectedFormat);

			// When
			await user.click(submitButton);

			// Then
			expect(calendarButton).not.toHaveTextContent(expectedFormat);
			expect(calendarButton).toHaveTextContent(/due date/i);
		});

		it('should allow clearing the selected due date', async () => {
			// Given
			render(<AddTodoForm onAddTodo={() => {}} />);
			const user = userEvent.setup();
			const calendarButton = screen.getByRole('button', { name: /open calendar/i });
			await user.click(calendarButton);
			const dateToSelect = await screen.findByRole('gridcell', { name: '18' });
			await user.click(dateToSelect);
			const expectedDate = new Date();
			expectedDate.setDate(18);
			const expectedFormat = format(expectedDate, 'd MMMM yyyy');
			expect(calendarButton).toHaveTextContent(expectedFormat);
			const clearButton = screen.getByRole('button', { name: /clear due date/i });

			// When
			await user.click(clearButton);

			// Then
			expect(calendarButton).not.toHaveTextContent(expectedFormat);
			expect(calendarButton).toHaveTextContent(/due date/i);
			expect(screen.queryByRole('button', { name: /clear due date/i })).not.toBeInTheDocument();
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
