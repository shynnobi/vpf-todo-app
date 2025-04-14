import { describe, expect, it } from 'vitest';

import { useTodoStore } from '@/store/todoStore';

/**
 * Minimal test to verify the todoStore is properly initialized
 * This serves as a basic smoke test for the store setup
 */
describe('todoStore', () => {
	it('is properly initialized with default values', () => {
		const state = useTodoStore.getState();

		// Check that the store has the expected structure
		expect(state.todos).toEqual([]);
		expect(state.filteredTodos).toEqual([]);
		expect(state.activeTodos).toEqual([]);
		expect(state.completedTodos).toEqual([]);
		expect(state.todoCount).toBe(0);
		expect(state.activeTodoCount).toBe(0);
		expect(state.completedTodoCount).toBe(0);
	});

	it('has all required store actions', () => {
		const state = useTodoStore.getState();

		// Verify all store methods are functions
		expect(typeof state.addTodo).toBe('function');
		expect(typeof state.updateTodo).toBe('function');
		expect(typeof state.toggleTodo).toBe('function');
		expect(typeof state.deleteTodo).toBe('function');
		expect(typeof state.clearCompleted).toBe('function');
		expect(typeof state.setFilter).toBe('function');
	});
});
