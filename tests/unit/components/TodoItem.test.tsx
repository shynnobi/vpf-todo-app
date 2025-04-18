import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TodoItem } from '@/components/TodoItem';
import { Todo } from '@/types/todoTypes';

/**
 * Unit tests for the TodoItem component.
 *
 * Tests the rendering and interactions of a single todo item.
 * Following the BDD approach with Given-When-Then format.
 */
describe('TodoItem Component', () => {
	const mockIncompleteTodo: Todo = {
		id: '1',
		title: 'Learn React',
		completed: false,
	};

	const mockCompletedTodo: Todo = {
		id: '2',
		title: 'Build a todo app',
		completed: true,
	};

	describe('Initial Rendering', () => {
		it('should render a todo item with its title', () => {
			// Given: A todo item
			// When: The component is rendered
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} onDelete={() => {}} />);

			// Then: It should display the todo title
			expect(screen.getByText('Learn React')).toBeInTheDocument();
		});

		it('should render a checkbox with the correct checked state for an incomplete todo', () => {
			// Given: An incomplete todo
			// When: The component is rendered
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} onDelete={() => {}} />);

			// Then: The checkbox should not be checked
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).not.toBeChecked();
		});

		it('should render a checkbox with the correct checked state for a completed todo', () => {
			// Given: A completed todo
			// When: The component is rendered
			render(<TodoItem todo={mockCompletedTodo} onToggle={() => {}} onDelete={() => {}} />);

			// Then: The checkbox should be checked
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).toBeChecked();
		});

		it('should apply different styles based on completion status', () => {
			// Given: A completed todo
			// When: The component is rendered
			const { rerender } = render(
				<TodoItem todo={mockCompletedTodo} onToggle={() => {}} onDelete={() => {}} />
			);

			// Then: The text should have a line-through style for completed todos
			const titleElement = screen.getByText('Build a todo app');
			expect(titleElement).toHaveClass('line-through');

			// Given: An incomplete todo
			// When: The component is rerendered with an incomplete todo
			rerender(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} onDelete={() => {}} />);

			// Then: The text should not have a line-through style
			const incompleteTitle = screen.getByText('Learn React');
			expect(incompleteTitle).not.toHaveClass('line-through');
		});

		it('should render a delete button', () => {
			// Given: A todo item
			// When: The component is rendered
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} onDelete={() => {}} />);

			// Then: It should display a delete button
			const deleteButton = screen.getByRole('button', { name: /delete todo: learn react/i });
			expect(deleteButton).toBeInTheDocument();
		});
	});

	describe('Interaction', () => {
		it('should call onToggle with the correct id when checkbox is clicked', () => {
			// Given: A spy function and the component is rendered
			const mockToggle = vi.fn();
			render(<TodoItem todo={mockIncompleteTodo} onToggle={mockToggle} onDelete={() => {}} />);

			// When: The checkbox is clicked
			const checkbox = screen.getByRole('checkbox');
			fireEvent.click(checkbox);

			// Then: onToggle should be called with the todo id
			expect(mockToggle).toHaveBeenCalledWith('1');
		});

		it('should call onDelete with the correct id when delete button is clicked', () => {
			// Given: A spy function and the component is rendered
			const mockDelete = vi.fn();
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} onDelete={mockDelete} />);

			// When: The delete button is clicked
			const deleteButton = screen.getByRole('button', { name: /delete todo: learn react/i });
			fireEvent.click(deleteButton);

			// Then: onDelete should be called with the todo id
			expect(mockDelete).toHaveBeenCalledWith('1');
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes for accessibility', () => {
			// Given: The component is rendered
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} onDelete={() => {}} />);

			// Then: The list item should have proper accessibility attributes
			const listItem = screen.getByRole('listitem');
			expect(listItem).toHaveAttribute('aria-labelledby');
		});

		it('should have proper ARIA label for delete button', () => {
			// Given: The component is rendered
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} onDelete={() => {}} />);

			// Then: The delete button should have a descriptive ARIA label
			const deleteButton = screen.getByRole('button', { name: /delete todo: learn react/i });
			expect(deleteButton).toHaveAttribute('aria-label', 'Delete todo: Learn React');
		});
	});

	// Add tests for editing mode
	describe('Editing Mode', () => {
		it('should switch to edit mode when the edit button is clicked', () => {
			// Given: A todo item rendered
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} onDelete={() => {}} />);
			const titleDisplay = screen.getByText(mockIncompleteTodo.title); // The normal title display

			// Expect the input field not to be present initially
			expect(screen.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();

			// When: The edit button is clicked
			const editButton = screen.getByRole('button', {
				name: `Edit todo: ${mockIncompleteTodo.title}`,
			});
			fireEvent.click(editButton);

			// Then: The normal title display should disappear (or be hidden)
			expect(titleDisplay).not.toBeInTheDocument(); // Or check for visibility/class change

			// And: An input field for editing the title should appear
			const titleInput = screen.getByRole('textbox', { name: /edit title/i });
			expect(titleInput).toBeInTheDocument();
			expect(titleInput).toHaveValue(mockIncompleteTodo.title);

			// Later, we'll add checks for description/dueDate fields and save/cancel buttons
		});
	});
});
