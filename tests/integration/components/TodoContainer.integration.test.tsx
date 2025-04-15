import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { TodoContainer } from '@/components/TodoContainer';
import { useTodoStore } from '@/store/todoStore';

/**
 * Integration tests for the TodoContainer component.
 *
 * Tests the interactions between multiple components and the store:
 * - AddTodoForm component
 * - TodoList component
 * - TodoItem components
 * - TodoStore state management
 *
 * Following the BDD approach with Given-When-Then format.
 */
describe('TodoContainer Component - Integration Tests', () => {
	// Reset the store before each test
	beforeEach(() => {
		useTodoStore.getState().reset();
	});

	describe('Initial Rendering', () => {
		it('should display empty state when no todos exist', () => {
			// Given: The store is empty

			// When: The component is rendered
			render(<TodoContainer />);

			// Then: It should display the empty state message
			expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();

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
			expect(screen.getByText('1 task total')).toBeInTheDocument();

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
});
