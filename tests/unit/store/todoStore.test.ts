import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useTodoStore } from '@/store/todoStore';
import { Todo } from '@/types/todoTypes';

// Define the storage key for potential manual cleanup if needed
const STORAGE_KEY = 'todo-storage';

/**
 * Helper functions to abstract the implementation details for behavior-focused testing.
 */
const TodoStoreTestHelpers = {
	// Get current state for assertions
	getTodos: () => useTodoStore.getState().todos,
	getTodosCount: () => useTodoStore.getState().todos.length,

	// Actions that mimic user behavior
	addTodo: (title: string, completed = false) =>
		useTodoStore.getState().addTodo({ title, completed }),
	toggleTodoCompletion: (id: string) => useTodoStore.getState().toggleTodo(id),
	resetStore: () => useTodoStore.getState().reset(),

	// Storage cleanup
	cleanupStorage: () => {
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(STORAGE_KEY);
		}
	},
};

/**
 * BDD style tests for the Todo store.
 * Tests are written from the perspective of behavior, not implementation.
 */
describe('Todo Store - Behavior', () => {
	// Reset the store state before each test
	beforeEach(() => {
		TodoStoreTestHelpers.cleanupStorage();
		TodoStoreTestHelpers.resetStore();
	});

	// Clean up localStorage after each test
	afterEach(() => {
		TodoStoreTestHelpers.cleanupStorage();
	});

	describe('Adding Todos', () => {
		it('Given the store is empty, When a new todo is added, Then it should appear in the store with default values', () => {
			// Given
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);

			// When
			const newTodo = TodoStoreTestHelpers.addTodo('Buy groceries');

			// Then
			const todos = TodoStoreTestHelpers.getTodos();
			expect(todos).toHaveLength(1);
			expect(todos[0].title).toBe('Buy groceries');
			expect(todos[0].completed).toBe(false);
			expect(todos[0]).toEqual(newTodo);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(1);
		});

		it('Given the store is empty, When a todo is added as completed, Then it should be stored with completed=true', () => {
			// Given
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);

			// When
			TodoStoreTestHelpers.addTodo('Task already done', true);

			// Then
			const todos = TodoStoreTestHelpers.getTodos();
			expect(todos).toHaveLength(1);
			expect(todos[0].title).toBe('Task already done');
			expect(todos[0].completed).toBe(true);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(1);
		});

		it('Given the store has todos, When more todos are added, Then the count should update accordingly', () => {
			// Given
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);

			// When adding first todo
			TodoStoreTestHelpers.addTodo('First task');

			// Then
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(1);

			// When adding second todo
			TodoStoreTestHelpers.addTodo('Second task');

			// Then
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(2);
		});
	});

	describe('Toggling Todo Status', () => {
		let initialTodo: Todo;

		// Setup: Add a todo before each test in this block
		beforeEach(() => {
			initialTodo = TodoStoreTestHelpers.addTodo('Todo to toggle');
			expect(TodoStoreTestHelpers.getTodos()).toHaveLength(1);
			expect(TodoStoreTestHelpers.getTodos()[0].completed).toBe(false);
		});

		it('Given a todo exists, When its status is toggled, Then the completed status should be inverted', () => {
			// Given
			const todoId = initialTodo.id;
			const initialCount = TodoStoreTestHelpers.getTodosCount();

			// When toggling the first time
			const toggledTodo = TodoStoreTestHelpers.toggleTodoCompletion(todoId);

			// Then
			expect(TodoStoreTestHelpers.getTodos()[0].completed).toBe(true);
			expect(toggledTodo?.completed).toBe(true);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(initialCount);

			// When toggling again
			const toggledAgainTodo = TodoStoreTestHelpers.toggleTodoCompletion(todoId);

			// Then
			expect(TodoStoreTestHelpers.getTodos()[0].completed).toBe(false);
			expect(toggledAgainTodo?.completed).toBe(false);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(initialCount);
		});

		it('Given a todo exists, When toggling with a non-existent ID, Then nothing should change and null should be returned', () => {
			// Given
			const todosBefore = [...TodoStoreTestHelpers.getTodos()];
			const countBefore = TodoStoreTestHelpers.getTodosCount();

			// When
			const result = TodoStoreTestHelpers.toggleTodoCompletion('non-existent-id');

			// Then
			expect(result).toBeNull();
			expect(TodoStoreTestHelpers.getTodos()).toEqual(todosBefore);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(countBefore);
		});
	});

	describe('Resetting the Store', () => {
		it('Given the store has todos, When reset is called, Then the store should be empty', () => {
			// Given
			TodoStoreTestHelpers.addTodo('Todo 1');
			TodoStoreTestHelpers.addTodo('Todo 2');
			expect(TodoStoreTestHelpers.getTodos()).toHaveLength(2);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(2);

			// When
			TodoStoreTestHelpers.resetStore();

			// Then
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(0);
		});
	});
});
