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
