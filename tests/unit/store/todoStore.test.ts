import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useTodoStore } from '@/store/todoStore';

/**
 * Behavioral tests for the Todo store.
 *
 * These tests follow the BDD (Behavior-Driven Development) approach using
 * Given-When-Then (Gherkin) format to clearly define expected behaviors.
 */
describe('Todo Store - Behavioral Tests', () => {
	// Reset the store before each test
	beforeEach(() => {
		// We still use setState here, but only for test setup
		useTodoStore.setState({ todos: [], todosCount: 0 });
	});

	describe('Todo Management', () => {
		it('should allow adding a new todo', () => {
			// Given: a component using the todo store
			const { result } = renderHook(() => useTodoStore());

			// When: the component adds a new todo
			act(() => {
				result.current.addTodo({ title: 'Buy milk' });
			});

			// Then: the todo should be added to the store with correct default values
			expect(result.current.todos.length).toBe(1);
			expect(result.current.todos[0].title).toBe('Buy milk');
			expect(result.current.todos[0].completed).toBe(false);
		});

		it('should allow creating an already completed todo', () => {
			// Given: a component using the todo store
			const { result } = renderHook(() => useTodoStore());

			// When: the component adds a todo with completed=true
			act(() => {
				result.current.addTodo({ title: 'Already done task', completed: true });
			});

			// Then: the todo should be added with completed status set to true
			expect(result.current.todos[0].completed).toBe(true);
		});

		it('should increment the todo counter when adding todos', () => {
			// Given: a component using the todo store with initial empty state
			const { result } = renderHook(() => useTodoStore());
			expect(result.current.todosCount).toBe(0);

			// When: the component adds one todo
			act(() => {
				result.current.addTodo({ title: 'First todo' });
			});

			// Then: the counter should be incremented to 1
			expect(result.current.todosCount).toBe(1);

			// When: the component adds another todo
			act(() => {
				result.current.addTodo({ title: 'Second todo' });
			});

			// Then: the counter should be incremented to 2
			expect(result.current.todosCount).toBe(2);
		});
	});

	describe('Todo Modification', () => {
		it('should allow toggling the completion state of a todo', () => {
			// Given: a component with a todo in the store
			const { result } = renderHook(() => useTodoStore());
			act(() => {
				result.current.addTodo({ title: 'Todo to toggle' });
			});
			const todoId = result.current.todos[0].id;
			expect(result.current.todos[0].completed).toBe(false);

			// When: the component toggles the todo's completed status
			act(() => {
				result.current.toggleTodo(todoId);
			});

			// Then: the todo should be marked as completed
			expect(result.current.todos[0].completed).toBe(true);

			// When: the component toggles the todo's status again
			act(() => {
				result.current.toggleTodo(todoId);
			});

			// Then: the todo should be marked as not completed
			expect(result.current.todos[0].completed).toBe(false);
		});

		it('should not modify the state when attempting to toggle a non-existent todo', () => {
			// Given: a store with an existing todo
			const { result } = renderHook(() => useTodoStore());
			act(() => {
				result.current.addTodo({ title: 'An existing todo' });
			});
			const todosBefore = [...result.current.todos];

			// When: attempting to toggle a todo with a non-existent ID
			let returnValue;
			act(() => {
				returnValue = result.current.toggleTodo('non-existent-id');
			});

			// Then: the function should return null
			expect(returnValue).toBeNull();

			// And: the state should remain unchanged
			expect(result.current.todos).toEqual(todosBefore);
		});
	});

	describe('Reset Functionality', () => {
		it('should allow completely resetting the state', () => {
			// Given: a store with multiple todos
			const { result } = renderHook(() => useTodoStore());
			act(() => {
				result.current.addTodo({ title: 'Todo 1' });
				result.current.addTodo({ title: 'Todo 2' });
			});
			expect(result.current.todos.length).toBe(2);
			expect(result.current.todosCount).toBe(2);

			// When: the reset function is called
			act(() => {
				result.current.reset();
			});

			// Then: the store should be reset to its initial empty state
			expect(result.current.todos.length).toBe(0);
			expect(result.current.todosCount).toBe(0);
		});
	});
});
