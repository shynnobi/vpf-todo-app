import { fireEvent, render, screen } from '@testing-library/react';
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
			const inputElement = screen.getByPlaceholderText(/add a new todo/i);
			expect(inputElement).toBeInTheDocument();

			// And: It should display a submit button
			const buttonElement = screen.getByRole('button', { name: /add/i });
			expect(buttonElement).toBeInTheDocument();
		});
	});

	describe('Form Interaction', () => {
		it('should call onAddTodo with entered title when form is submitted', () => {
			// Given: A spy function for onAddTodo and the component is rendered
			const mockAddTodo = vi.fn();
			render(<AddTodoForm onAddTodo={mockAddTodo} />);

			// And: A todo title is entered in the input
			const inputElement = screen.getByPlaceholderText(/add a new todo/i);
			fireEvent.change(inputElement, { target: { value: 'Test Todo' } });

			// When: The form is submitted
			const buttonElement = screen.getByRole('button', { name: /add/i });
			fireEvent.click(buttonElement);

			// Then: onAddTodo should be called with the entered title and default priority
			expect(mockAddTodo).toHaveBeenCalledWith({ title: 'Test Todo', priority: 'medium' });
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
			const inputElement = screen.getByPlaceholderText(/add a new todo/i);
			fireEvent.change(inputElement, { target: { value: 'Test Todo' } });

			// When: The form is submitted
			const buttonElement = screen.getByRole('button', { name: /add/i });
			fireEvent.click(buttonElement);

			// Then: The input field should be cleared
			expect(inputElement).toHaveValue('');
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
