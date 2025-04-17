import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TodoContainer } from '@/components/TodoContainer';
import { useTodoStore } from '@/store/todoStore';

// Helper to get the storage key if needed, though direct interaction is avoided
const STORAGE_KEY = 'todo-storage';

/**
 * Integration tests for the TodoContainer component following BDD approach.
 */
describe('TodoContainer Component - Integration Tests', () => {
	// Reset the store and clear localStorage before each test for isolation
	beforeEach(() => {
		// Reset Zustand store state
		useTodoStore.setState(useTodoStore.getInitialState(), true);
		// Clear localStorage to ensure no leakage between tests
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(STORAGE_KEY);
		}
	});

	// Optional: Clean up after each test as well
	afterEach(() => {
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(STORAGE_KEY);
		}
	});

	describe('Initial Rendering', () => {
		it('should display empty state when no todos exist', () => {
			// Given: The store is empty

			// When: The component is rendered
			render(<TodoContainer />);

			// Then: It should display the empty state message
			expect(screen.getByText(/No todos to display/i)).toBeInTheDocument();

			// And: The todo count should be 0
			expect(screen.getByText('0 tasks total')).toBeInTheDocument();
		});
	});

	describe('Todo Addition', () => {
		it('should add a todo to the store when the form is submitted', () => {
			// Given: The component is rendered
			render(<TodoContainer />);

			// When: A new todo is added through the form
			const inputElement = screen.getByPlaceholderText(/add a new todo/i);
			fireEvent.change(inputElement, { target: { value: 'Test Todo' } });

			const addButton = screen.getByRole('button', { name: /add/i });
			fireEvent.click(addButton);

			// Then: The todo count should be updated
			expect(screen.getByText('1 tasks total')).toBeInTheDocument();

			// And: The todo should be visible in the list
			expect(screen.getByText('Test Todo')).toBeInTheDocument();

			// And: A checkbox should be present
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).toBeInTheDocument();
			expect(checkbox).not.toBeChecked();
		});

		it('should be able to add multiple todos', () => {
			// Given: The component is rendered
			render(<TodoContainer />);

			// When: Multiple todos are added
			const inputElement = screen.getByPlaceholderText(/add a new todo/i);
			const addButton = screen.getByRole('button', { name: /add/i });

			// Add first todo
			fireEvent.change(inputElement, { target: { value: 'First Todo' } });
			fireEvent.click(addButton);

			// Add second todo
			fireEvent.change(inputElement, { target: { value: 'Second Todo' } });
			fireEvent.click(addButton);

			// Then: The todo count should reflect the number of todos
			expect(screen.getByText('2 tasks total')).toBeInTheDocument();

			// And: Both todos should be visible in the list
			expect(screen.getByText('First Todo')).toBeInTheDocument();
			expect(screen.getByText('Second Todo')).toBeInTheDocument();

			// And: Two checkboxes should be present
			const checkboxes = screen.getAllByRole('checkbox');
			expect(checkboxes).toHaveLength(2);
		});
	});

	describe('Todo Interaction', () => {
		it('should toggle todo completion when checkbox is clicked', () => {
			// Given: The component is rendered with a todo
			render(<TodoContainer />);

			// And: A todo is added
			const inputElement = screen.getByPlaceholderText(/add a new todo/i);
			fireEvent.change(inputElement, { target: { value: 'Toggle Test Todo' } });

			const addButton = screen.getByRole('button', { name: /add/i });
			fireEvent.click(addButton);

			// When: The checkbox is clicked
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).not.toBeChecked();
			fireEvent.click(checkbox);

			// Then: The todo should be marked as completed
			expect(checkbox).toBeChecked();

			// And: The todo text should have the completed style
			const todoText = screen.getByText('Toggle Test Todo');
			expect(todoText).toHaveClass('line-through');
		});

		it('should delete a todo when the delete button is clicked', () => {
			// Given: The component is rendered with a todo
			render(<TodoContainer />);

			// And: A todo is added
			const inputElement = screen.getByPlaceholderText(/add a new todo/i);
			fireEvent.change(inputElement, { target: { value: 'Todo to Delete' } });

			const addButton = screen.getByRole('button', { name: /add/i });
			fireEvent.click(addButton);

			// Verify the todo was added
			expect(screen.getByText('Todo to Delete')).toBeInTheDocument();
			expect(screen.getByText('1 tasks total')).toBeInTheDocument();

			// When: The delete button is clicked
			const deleteButton = screen.getByRole('button', { name: /delete todo: todo to delete/i });
			fireEvent.click(deleteButton);

			// Then: The todo should be removed
			expect(screen.queryByText('Todo to Delete')).not.toBeInTheDocument();
			expect(screen.getByText('0 tasks total')).toBeInTheDocument();
			expect(screen.getByText(/No todos to display/i)).toBeInTheDocument();
		});

		it('should be able to delete one of multiple todos', () => {
			// Given: The component is rendered with multiple todos
			render(<TodoContainer />);

			// And: Multiple todos are added
			const inputElement = screen.getByPlaceholderText(/add a new todo/i);
			const addButton = screen.getByRole('button', { name: /add/i });

			// Add first todo
			fireEvent.change(inputElement, { target: { value: 'Keep this todo' } });
			fireEvent.click(addButton);

			// Add second todo
			fireEvent.change(inputElement, { target: { value: 'Delete this todo' } });
			fireEvent.click(addButton);

			// Verify both todos were added
			expect(screen.getByText('Keep this todo')).toBeInTheDocument();
			expect(screen.getByText('Delete this todo')).toBeInTheDocument();
			expect(screen.getByText('2 tasks total')).toBeInTheDocument();

			// When: The delete button for the second todo is clicked
			const deleteButtons = screen.getAllByRole('button', { name: /delete todo/i });
			// Find the delete button for "Delete this todo"
			const deleteButtonForSecondTodo = deleteButtons.find(button =>
				button.getAttribute('aria-label')?.includes('Delete this todo')
			);

			// Vérifier que le bouton existe avant de cliquer dessus
			expect(deleteButtonForSecondTodo).toBeDefined();
			if (deleteButtonForSecondTodo) {
				fireEvent.click(deleteButtonForSecondTodo);
			}

			// Then: Only the second todo should be removed
			expect(screen.getByText('Keep this todo')).toBeInTheDocument();
			expect(screen.queryByText('Delete this todo')).not.toBeInTheDocument();
			expect(screen.getByText('1 tasks total')).toBeInTheDocument();
		});
	});

	describe('Persistence Integration', () => {
		it('should load persisted todos when the component remounts', async () => {
			// First render
			const { unmount } = render(<TodoContainer />);

			// Add a todo
			const inputElement = screen.getByPlaceholderText(/add a new todo/i);
			fireEvent.change(inputElement, { target: { value: 'Persisted Task' } });

			const addButton = screen.getByRole('button', { name: /add/i });
			fireEvent.click(addButton);

			// Verify todo is added
			await waitFor(() => {
				expect(screen.getByText('Persisted Task')).toBeInTheDocument();
			});
			await waitFor(() => {
				expect(screen.getByText('1 tasks total')).toBeInTheDocument();
			});

			// Unmount and remount to test persistence
			unmount();
			render(<TodoContainer />);

			// Verify todo persists after remount
			await waitFor(() => {
				expect(screen.getByText('Persisted Task')).toBeInTheDocument();
			});
			await waitFor(() => {
				expect(screen.getByText('1 tasks total')).toBeInTheDocument();
			});

			// Input should be empty after remount
			const inputAfterRemount = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement;
			expect(inputAfterRemount.value).toBe('');
		});
	});
});
