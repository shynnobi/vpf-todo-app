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
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} />);

			// Then: It should display the todo title
			expect(screen.getByText('Learn React')).toBeInTheDocument();
		});

		it('should render a checkbox with the correct checked state for an incomplete todo', () => {
			// Given: An incomplete todo
			// When: The component is rendered
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} />);

			// Then: The checkbox should not be checked
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).not.toBeChecked();
		});

		it('should render a checkbox with the correct checked state for a completed todo', () => {
			// Given: A completed todo
			// When: The component is rendered
			render(<TodoItem todo={mockCompletedTodo} onToggle={() => {}} />);

			// Then: The checkbox should be checked
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).toBeChecked();
		});

		it('should apply different styles based on completion status', () => {
			// Given: A completed todo
			// When: The component is rendered
			const { rerender } = render(<TodoItem todo={mockCompletedTodo} onToggle={() => {}} />);

			// Then: The text should have a line-through style for completed todos
			const titleElement = screen.getByText('Build a todo app');
			expect(titleElement).toHaveClass('line-through');

			// Given: An incomplete todo
			// When: The component is rerendered with an incomplete todo
			rerender(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} />);

			// Then: The text should not have a line-through style
			const incompleteTitle = screen.getByText('Learn React');
			expect(incompleteTitle).not.toHaveClass('line-through');
		});
	});

	describe('Interaction', () => {
		it('should call onToggle with the correct id when checkbox is clicked', () => {
			// Given: A spy function and the component is rendered
			const mockToggle = vi.fn();
			render(<TodoItem todo={mockIncompleteTodo} onToggle={mockToggle} />);

			// When: The checkbox is clicked
			const checkbox = screen.getByRole('checkbox');
			fireEvent.click(checkbox);

			// Then: onToggle should be called with the todo id
			expect(mockToggle).toHaveBeenCalledWith('1');
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes for accessibility', () => {
			// Given: The component is rendered
			render(<TodoItem todo={mockIncompleteTodo} onToggle={() => {}} />);

			// Then: The list item should have proper accessibility attributes
			const listItem = screen.getByRole('listitem');
			expect(listItem).toHaveAttribute('aria-labelledby');
		});
	});
});
