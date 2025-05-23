import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useTodoStore } from '@/store/todoStore';
import { CreateTodoParams, PriorityLevel, Todo, TodoFilter } from '@/types/todoTypes';

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

		it('Given the store is empty, When a new todo is added without specifying priority, Then it should be added with priority set to null', () => {
			// Given: Store is empty
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);

			// When: Add a todo without priority
			const newTodo = useTodoStore.getState().addTodo({ title: 'No priority task' });
			// Note: We are explicitly NOT passing priority field here

			// Then: Priority should be null
			const todos = TodoStoreTestHelpers.getTodos();
			expect(todos).toHaveLength(1);
			expect(todos[0].title).toBe('No priority task');
			expect(todos[0].priority).toBeNull();
			expect(todos[0]).toEqual(newTodo);
		});

		it('Given the store is empty, When a new todo is added with priority explicitly set to null, Then it should be added with priority as null', () => {
			// Given: Store is empty
			expect(TodoStoreTestHelpers.getTodos()).toEqual([]);

			// When: Add a todo with priority explicitly null
			const newTodo = useTodoStore.getState().addTodo({
				title: 'Explicit null priority task',
				priority: null,
			});

			// Then: Priority should be null
			const todos = TodoStoreTestHelpers.getTodos();
			expect(todos).toHaveLength(1);
			expect(todos[0].title).toBe('Explicit null priority task');
			expect(todos[0].priority).toBeNull();
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

	describe('Updating Todos', () => {
		let initialTodo: Todo;

		beforeEach(() => {
			TodoStoreTestHelpers.resetStore();
			initialTodo = TodoStoreTestHelpers.addTodo('Task to update');
			expect(TodoStoreTestHelpers.getTodos()).toHaveLength(1);
		});

		it('should allow updating the description and due date of an existing todo', () => {
			// Given: An existing todo
			const todoId = initialTodo.id;
			const newDescription = 'Updated description';
			const newDueDate = new Date(Date.now() + 86400000).toISOString();

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
			expect(todoInStore?.description).toBe(newDescription);
			expect(todoInStore?.dueDate).toBe(newDueDate);
			expect(updatedTodo).toEqual(todoInStore);
		});

		it('should allow updating the priority of an existing todo, including setting it to null', () => {
			// Given: An existing todo
			const todoId = initialTodo.id;

			// When: Updating the priority to 'high'
			let updatedTodo = useTodoStore.getState().updateTodo(todoId, { priority: 'high' });

			// Then: The priority should be 'high'
			expect(updatedTodo?.priority).toBe('high');
			expect(TodoStoreTestHelpers.getTodos().find(t => t.id === todoId)?.priority).toBe('high');

			// When: Updating the priority to null
			updatedTodo = useTodoStore.getState().updateTodo(todoId, { priority: null });

			// Then: The priority should be null
			expect(updatedTodo?.priority).toBeNull();
			expect(TodoStoreTestHelpers.getTodos().find(t => t.id === todoId)?.priority).toBeNull();
		});
	});

	describe('Prioritizing Todos', () => {
		beforeEach(() => {
			TodoStoreTestHelpers.cleanupStorage();
			TodoStoreTestHelpers.resetStore();
		});

		it('should add a new todo with the specified priority', () => {
			// Given: Store is empty
			expect(TodoStoreTestHelpers.getTodosCount()).toBe(0);

			// When: Adding todos with specific priorities
			const lowPriorityParams: CreateTodoParams = { title: 'Low Prio Task', priority: 'low' };
			const highPriorityParams: CreateTodoParams = { title: 'High Prio Task', priority: 'high' };
			const lowTodo = useTodoStore.getState().addTodo(lowPriorityParams);
			const highTodo = useTodoStore.getState().addTodo(highPriorityParams);

			// Then: The todos should have the correct priorities stored
			expect(lowTodo).toBeDefined();
			expect(highTodo).toBeDefined();
			expect(lowTodo.priority).toBe<PriorityLevel>('low');
			expect(highTodo.priority).toBe<PriorityLevel>('high');

			const todos = TodoStoreTestHelpers.getTodos();
			expect(todos).toHaveLength(2);
			expect(todos.find(t => t.id === lowTodo.id)?.priority).toBe('low');
			expect(todos.find(t => t.id === highTodo.id)?.priority).toBe('high');
		});
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
});
