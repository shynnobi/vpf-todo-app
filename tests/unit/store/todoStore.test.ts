import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useTodoStore } from '@/store/todoStore';
import { Todo, TodoFilter } from '@/types/todoTypes';

// Define the storage key for potential manual cleanup if needed
const STORAGE_KEY = 'todo-storage';

const TodoStoreTestHelpers = {
	getTodos: () => useTodoStore.getState().todos,
	getTodosCount: () => useTodoStore.getState().todos.length,
	getFilter: () => useTodoStore.getState().filter,
	addTodo: (title: string, completed = false) =>
		useTodoStore.getState().addTodo({ title, completed }),
	toggleTodoCompletion: (id: string) => useTodoStore.getState().toggleTodo(id),
	deleteTodo: (id: string) => useTodoStore.getState().deleteTodo(id),
	setFilter: (filter: TodoFilter) => useTodoStore.getState().setFilter(filter),
	resetStore: () => useTodoStore.getState().reset(),

	/** Removes the persisted todo data from localStorage. */
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
			// Given: The store is empty
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);

			// When: A new todo is added
			const newTodo = TodoStoreTestHelpers.addTodo('Buy groceries');

			// Then: It should appear in the store with default values
			const todos = TodoStoreTestHelpers.getTodos();
			expect(todos).toHaveLength(1);
			expect(todos[0].title).toBe('Buy groceries');
			expect(todos[0].completed).toBe(false);
			expect(todos[0]).toEqual(newTodo);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(1);
		});

		it('Given the store is empty, When a todo is added as completed, Then it should be stored with completed=true', () => {
			// Given: The store is empty
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);

			// When: A todo is added as completed
			TodoStoreTestHelpers.addTodo('Task already done', true);

			// Then: It should be stored with completed=true
			const todos = TodoStoreTestHelpers.getTodos();
			expect(todos).toHaveLength(1);
			expect(todos[0].title).toBe('Task already done');
			expect(todos[0].completed).toBe(true);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(1);
		});

		it('Given the store has todos, When more todos are added, Then the count should update accordingly', () => {
			// Given: The store is empty initially
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);

			// When: Adding first todo
			TodoStoreTestHelpers.addTodo('First task');

			// Then: Count should be 1
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(1);

			// When: Adding second todo
			TodoStoreTestHelpers.addTodo('Second task');

			// Then: Count should update to 2
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(2);
		});

		it('should allow adding a todo with description and due date', () => {
			// Given: The store is empty
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);
			const date = new Date().toISOString();

			// When: A new todo is added with description and due date
			const newTodo = useTodoStore.getState().addTodo({
				title: 'Detailed Task',
				description: 'This is a description',
				dueDate: date,
			});

			// Then: It should appear with the new fields
			const todos = TodoStoreTestHelpers.getTodos();
			expect(todos).toHaveLength(1);
			expect(todos[0].title).toBe('Detailed Task');
			expect(todos[0].description).toBe('This is a description');
			expect(todos[0].dueDate).toBe(date);
			expect(todos[0].completed).toBe(false); // Assuming default completion is false
			expect(todos[0]).toEqual(newTodo);
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
			// Given: A todo exists
			const todoId = initialTodo.id;
			const initialCount = TodoStoreTestHelpers.getTodosCount();

			// When: Its status is toggled the first time
			const toggledTodo = TodoStoreTestHelpers.toggleTodoCompletion(todoId);

			// Then: The completed status should be inverted to true
			expect(TodoStoreTestHelpers.getTodos()[0].completed).toBe(true);
			expect(toggledTodo?.completed).toBe(true);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(initialCount);

			// When: Toggling again
			const toggledAgainTodo = TodoStoreTestHelpers.toggleTodoCompletion(todoId);

			// Then: The completed status should be inverted back to false
			expect(TodoStoreTestHelpers.getTodos()[0].completed).toBe(false);
			expect(toggledAgainTodo?.completed).toBe(false);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(initialCount);
		});

		it('Given a todo exists, When toggling with a non-existent ID, Then nothing should change and null should be returned', () => {
			// Given: A todo exists
			const todosBefore = [...TodoStoreTestHelpers.getTodos()];
			const countBefore = TodoStoreTestHelpers.getTodosCount();

			// When: Toggling with a non-existent ID
			const result = TodoStoreTestHelpers.toggleTodoCompletion('non-existent-id');

			// Then: Nothing should change and null should be returned
			expect(result).toBeNull();
			expect(TodoStoreTestHelpers.getTodos()).toEqual(todosBefore);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(countBefore);
		});
	});

	// New Test Suite for Updating Todos
	describe('Updating Todos', () => {
		let initialTodo: Todo;

		beforeEach(() => {
			// Start clean and add a basic todo
			TodoStoreTestHelpers.resetStore();
			initialTodo = TodoStoreTestHelpers.addTodo('Task to update');
			expect(TodoStoreTestHelpers.getTodos()).toHaveLength(1);
		});

		it('should allow updating the description and due date of an existing todo', () => {
			// Given: An existing todo
			const todoId = initialTodo.id;
			const newDescription = 'Updated description';
			const newDueDate = new Date(Date.now() + 86400000).toISOString(); // Tomorrow

			// When: Updating the todo's details
			const updatedTodo = useTodoStore.getState().updateTodo(todoId, {
				description: newDescription,
				dueDate: newDueDate,
			});

			// Then: The todo in the store should reflect the changes
			const todos = TodoStoreTestHelpers.getTodos();
			expect(todos).toHaveLength(1);
			const todoInStore = todos.find(t => t.id === todoId);
			expect(todoInStore).toBeDefined();
			expect(todoInStore?.title).toBe(initialTodo.title); // Title shouldn't change unless specified
			expect(todoInStore?.description).toBe(newDescription);
			expect(todoInStore?.dueDate).toBe(newDueDate);
			expect(todoInStore?.completed).toBe(initialTodo.completed); // Completion shouldn't change
			expect(updatedTodo).toEqual(todoInStore); // The action should return the updated todo
		});

		// Add more tests here later for updating title, completion status via updateTodo if needed
	});

	describe('Resetting the Store', () => {
		it('Given the store has todos, When reset is called, Then the store should be empty', () => {
			// Given: The store has todos
			TodoStoreTestHelpers.addTodo('Todo 1');
			TodoStoreTestHelpers.addTodo('Todo 2');
			expect(TodoStoreTestHelpers.getTodos()).toHaveLength(2);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(2);

			// When: Reset is called
			TodoStoreTestHelpers.resetStore();

			// Then: The store should be empty
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(0);
		});
	});

	describe('Delete todos', () => {
		beforeEach(() => {
			useTodoStore.getState().reset();
		});

		it('should delete a todo by id', () => {
			// Given: A todo exists in the store
			const todo = useTodoStore.getState().addTodo({ title: 'Test todo' });
			expect(useTodoStore.getState().todos.length).toBe(1);

			// When: The todo is deleted by id
			const result = useTodoStore.getState().deleteTodo(todo.id);

			// Then: The todo should be removed and the deleted todo should be returned
			expect(useTodoStore.getState().todos.length).toBe(0);
			expect(result).toEqual(todo);
		});

		it('should return null when trying to delete a non-existent todo', () => {
			// Given: The store is initialized

			// When: Attempting to delete a non-existent todo
			const result = useTodoStore.getState().deleteTodo('non-existent-id');

			// Then: Null should be returned
			expect(result).toBeNull();
		});

		it('should not change the state when deleting a non-existent todo', () => {
			// Given: The store has a todo
			useTodoStore.getState().addTodo({ title: 'Test todo' });
			const todosBeforeDelete = useTodoStore.getState().todos;

			// When: Attempting to delete a non-existent todo
			useTodoStore.getState().deleteTodo('non-existent-id');

			// Then: The todos list should remain unchanged
			expect(useTodoStore.getState().todos).toEqual(todosBeforeDelete);
		});
	});

	describe('Filtering Todos', () => {
		beforeEach(() => {
			// Start with a clean state for filter tests
			TodoStoreTestHelpers.resetStore();
			// Add a mix of completed and active todos
			TodoStoreTestHelpers.addTodo('Active todo 1');
			TodoStoreTestHelpers.addTodo('Completed todo 1', true);
			TodoStoreTestHelpers.addTodo('Active todo 2');
			TodoStoreTestHelpers.addTodo('Completed todo 2', true);
		});

		it('should have All as the default filter', () => {
			// Given: The store is initialized with todos

			// When: Getting the current filter

			// Then: The filter should be All by default
			expect(TodoStoreTestHelpers.getFilter()).toBe(TodoFilter.All);
		});

		it('should allow setting the filter to Active', () => {
			// Given: The store is initialized with todos

			// When: Setting the filter to Active
			TodoStoreTestHelpers.setFilter(TodoFilter.Active);

			// Then: The filter should be Active
			expect(TodoStoreTestHelpers.getFilter()).toBe(TodoFilter.Active);
		});

		it('should allow setting the filter to Completed', () => {
			// Given: The store is initialized with todos

			// When: Setting the filter to Completed
			TodoStoreTestHelpers.setFilter(TodoFilter.Completed);

			// Then: The filter should be Completed
			expect(TodoStoreTestHelpers.getFilter()).toBe(TodoFilter.Completed);
		});

		it('should allow setting the filter back to All', () => {
			// Given: The filter is set to Active
			TodoStoreTestHelpers.setFilter(TodoFilter.Active);

			// When: Setting the filter back to All
			TodoStoreTestHelpers.setFilter(TodoFilter.All);

			// Then: The filter should be All
			expect(TodoStoreTestHelpers.getFilter()).toBe(TodoFilter.All);
		});
	});
});
