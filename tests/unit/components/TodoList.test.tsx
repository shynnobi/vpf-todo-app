import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TodoList } from '@/components/TodoList';
import { Todo } from '@/types/todoTypes';

/**
 * Unit tests for the TodoList component.
 *
 * Tests the rendering and interactions of a list of todo items.
 * Following the BDD approach with Given-When-Then format.
 */
describe('TodoList Component', () => {
	const mockTodos: Todo[] = [
		{
			id: '1',
			title: 'Learn React',
			completed: false,
			priority: 'medium',
			creationDate: '2023-01-01T10:00:00Z',
		},
		{
			id: '2',
			title: 'Build a todo app',
			completed: true,
			priority: 'high',
			creationDate: '2023-01-02T11:00:00Z',
		},
		{
			id: '3',
			title: 'Master TypeScript',
			completed: false,
			priority: 'low',
			creationDate: '2023-01-03T12:00:00Z',
		},
	];

	describe('Initial Rendering', () => {
		it('should render a list of todos', () => {
			// Given: A list of todos
			// When: The component is rendered with the todos
			render(
				<TodoList
					todos={mockTodos}
					onToggleTodo={() => {}}
					onDeleteTodo={() => {}}
					onSaveTodo={() => {}}
					editingTodoId={null}
					onSetEditingTodo={() => {}}
				/>
			);

			// Then: It should display all todo items
			expect(screen.getByText('Learn React')).toBeInTheDocument();
			expect(screen.getByText('Build a todo app')).toBeInTheDocument();
			expect(screen.getByText('Master TypeScript')).toBeInTheDocument();
		});

		it('should render an empty message when no todos exist', () => {
			// Given: No todos
			// When: The component is rendered with an empty array
			render(
				<TodoList
					todos={[]}
					onToggleTodo={() => {}}
					onDeleteTodo={() => {}}
					onSaveTodo={() => {}}
					editingTodoId={null}
					onSetEditingTodo={() => {}}
				/>
			);

			// Then: It should display an empty message
			expect(screen.getByText(/no todos to display/i)).toBeInTheDocument();
		});

		it('should display completion status for each todo', () => {
			// Given: A list of todos with different completion statuses
			// When: The component is rendered
			render(
				<TodoList
					todos={mockTodos}
					onToggleTodo={() => {}}
					onDeleteTodo={() => {}}
					onSaveTodo={() => {}}
					editingTodoId={null}
					onSetEditingTodo={() => {}}
				/>
			);

			// Then: Each todo should show its completion status
			const checkboxes = screen.getAllByRole('checkbox');
			expect(checkboxes).toHaveLength(3);
			expect(checkboxes[0]).not.toBeChecked();
			expect(checkboxes[1]).toBeChecked();
			expect(checkboxes[2]).not.toBeChecked();
		});
	});

	describe('Todo Interaction', () => {
		it('should call onToggleTodo with correct id when a todo is clicked', () => {
			// Given: A spy function and the component is rendered
			const mockToggleTodo = vi.fn();
			render(
				<TodoList
					todos={mockTodos}
					onToggleTodo={mockToggleTodo}
					onDeleteTodo={() => {}}
					onSaveTodo={() => {}}
					editingTodoId={null}
					onSetEditingTodo={() => {}}
				/>
			);

			// When: A todo's checkbox is clicked
			const checkboxes = screen.getAllByRole('checkbox');
			fireEvent.click(checkboxes[0]);

			// Then: onToggleTodo should be called with the correct todo id
			expect(mockToggleTodo).toHaveBeenCalledWith('1');
		});

		it('should open confirmation dialog when delete button is clicked, and call onDeleteTodo when confirmed', async () => {
			// Given: A spy function and the component is rendered
			const mockDeleteTodo = vi.fn();
			render(
				<TodoList
					todos={mockTodos}
					onToggleTodo={() => {}}
					onDeleteTodo={mockDeleteTodo}
					onSaveTodo={() => {}}
					editingTodoId={null}
					onSetEditingTodo={() => {}}
				/>
			);

			// When: A todo's delete button is clicked to open the dialog
			const deleteButtons = screen.getAllByTestId('delete-todo-trigger');
			fireEvent.click(deleteButtons[0]);

			// Then: The confirmation dialog should be visible
			const dialogTitle = await screen.findByText('Are you sure?');
			expect(dialogTitle).toBeInTheDocument();

			// When: The confirm button is clicked
			const confirmButton = screen.getByTestId('confirm-delete-todo');
			fireEvent.click(confirmButton);

			// Then: onDeleteTodo should be called with the correct todo id
			expect(mockDeleteTodo).toHaveBeenCalledWith('1');
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes for accessibility', () => {
			// Given: The component is rendered with todos
			render(
				<TodoList
					todos={mockTodos}
					onToggleTodo={() => {}}
					onDeleteTodo={() => {}}
					onSaveTodo={() => {}}
					editingTodoId={null}
					onSetEditingTodo={() => {}}
				/>
			);

			// Then: The list should have proper accessibility attributes
			const list = screen.getByRole('list');
			expect(list).toHaveAttribute('aria-label', 'Todo list');

			// And: Each list item should be properly labeled
			const listItems = screen.getAllByRole('listitem');
			expect(listItems).toHaveLength(3);
			listItems.forEach(item => {
				expect(item).toHaveAttribute('aria-labelledby');
			});
		});
	});
});
