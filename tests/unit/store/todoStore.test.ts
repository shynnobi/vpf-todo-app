import { act } from '@testing-library/react';
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

		it('should provide todos sorted by priority (high > medium > low > null)', () => {
			// Given: Todos with different priorities, including null, added in a mixed order
			useTodoStore.getState().addTodo({ title: 'Medium Task 1', priority: 'medium' });
			useTodoStore.getState().addTodo({ title: 'High Task 1', priority: 'high' });
			useTodoStore.getState().addTodo({ title: 'No Priority Task 1', priority: null });
			useTodoStore.getState().addTodo({ title: 'Low Task 1', priority: 'low' });
			useTodoStore.getState().addTodo({ title: 'High Task 2', priority: 'high' });
			useTodoStore.getState().addTodo({ title: 'No Priority Task 2', priority: null });

			// When: Getting the sorted list
			const sortedTodos = useTodoStore.getState().getSortedTodosByPriority();

			// Then: The getter should return todos sorted by high > medium > low > null
			expect(sortedTodos).toBeDefined();
			const sortedTitles = sortedTodos.map((t: Todo) => t.title);
			expect(sortedTitles).toEqual([
				'High Task 1',
				'High Task 2',
				'Medium Task 1',
				'Low Task 1',
				'No Priority Task 1',
				'No Priority Task 2',
			]);
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

	describe('Filtering Todos', () => {
		let todos: Todo[];
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		beforeEach(() => {
			// Setup: Add diverse todos before each filtering test
			todos = [
				useTodoStore.getState().addTodo({ title: 'Task High', priority: 'high', completed: false }),
				useTodoStore
					.getState()
					.addTodo({ title: 'Task Medium 1', priority: 'medium', completed: false }),
				useTodoStore
					.getState()
					.addTodo({ title: 'Task Medium 2', priority: 'medium', completed: true }),
				useTodoStore.getState().addTodo({ title: 'Task Low', priority: 'low', completed: false }),
				useTodoStore.getState().addTodo({ title: 'Task Null 1', priority: null, completed: false }),
				useTodoStore.getState().addTodo({ title: 'Task Null 2', priority: null, completed: true }),
				useTodoStore.getState().addTodo({
					title: 'Overdue Task',
					priority: 'medium',
					completed: false,
					dueDate: yesterday.toISOString().split('T')[0],
				}),
				useTodoStore.getState().addTodo({
					title: 'Future Task',
					priority: 'low',
					completed: false,
					dueDate: tomorrow.toISOString().split('T')[0],
				}),
				useTodoStore.getState().addTodo({
					title: 'Completed Overdue Task',
					priority: 'high',
					completed: true,
					dueDate: yesterday.toISOString().split('T')[0],
				}),
			];
			// Reset filters to default before each filtering test run
			act(() => {
				useTodoStore.getState().setFilter(TodoFilter.All);
				// Assuming a reset for potential advanced filters (to be implemented)
				useTodoStore.getState().setPriorityFilter(undefined);
				useTodoStore.getState().setDueDateFilter(undefined);
			});
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

		it('Given todos exist, When filter is "All", Then getFilteredTodos should return all todos', () => {
			// Given: Filter is already All by default in beforeEach
			// When: Getting filtered todos
			const filteredTodos = useTodoStore.getState().getFilteredAndSortedTodos();
			// Then: All todos should be returned
			expect(filteredTodos).toHaveLength(todos.length);
		});

		it('Given todos exist, When filter is "Active", Then getFilteredTodos should return only active todos', () => {
			// Given: Set filter to Active
			act(() => {
				useTodoStore.getState().setFilter(TodoFilter.Active);
			});
			// When: Getting filtered todos
			const filteredTodos = useTodoStore.getState().getFilteredAndSortedTodos();
			// Then: Only active todos should be returned
			const activeTodos = todos.filter((t: Todo) => !t.completed);
			expect(filteredTodos).toHaveLength(activeTodos.length);
			expect(filteredTodos.every((t: Todo) => !t.completed)).toBe(true);
		});

		it('Given todos exist, When filter is "Completed", Then getFilteredTodos should return only completed todos', () => {
			// Given: Set filter to Completed
			act(() => {
				useTodoStore.getState().setFilter(TodoFilter.Completed);
			});
			// When: Getting filtered todos
			const filteredTodos = useTodoStore.getState().getFilteredAndSortedTodos();
			// Then: Only completed todos should be returned
			const completedTodos = todos.filter((t: Todo) => t.completed);
			expect(filteredTodos).toHaveLength(completedTodos.length);
			expect(filteredTodos.every((t: Todo) => t.completed)).toBe(true);
		});

		describe('Advanced Filtering', () => {
			// Setup a shorthand for the filter setter function (assuming it will exist)
			const setPriorityFilter = (priority?: PriorityLevel | null | undefined) => {
				act(() => {
					// Check if function exists before calling (for initial test run)
					if (useTodoStore.getState().setPriorityFilter) {
						useTodoStore.getState().setPriorityFilter(priority);
					}
				});
			};
			// Use inline type for the filterType parameter
			const setDueDateFilter = (filterType?: 'overdue' | 'no-due-date' | undefined) => {
				act(() => {
					// Check if function exists before calling
					if (useTodoStore.getState().setDueDateFilter) {
						useTodoStore.getState().setDueDateFilter(filterType);
					}
				});
			};

			describe('by Priority', () => {
				it('should return only high priority todos when priority filter is "high"', () => {
					// Given: Priority filter is set to 'high'
					setPriorityFilter('high');

					// When: Getting filtered todos (assuming default status filter 'All')
					const filtered = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Only high priority todos should be returned
					const expected = todos.filter((t: Todo) => t.priority === 'high');
					expect(filtered).toHaveLength(expected.length);
					expect(filtered.every((t: Todo) => t.priority === 'high')).toBe(true);
				});

				it('should return only medium priority todos when priority filter is "medium"', () => {
					// Given: Priority filter is set to 'medium'
					setPriorityFilter('medium');
					// When: Getting filtered todos
					const filtered = useTodoStore.getState().getFilteredAndSortedTodos();
					// Then: Only medium priority todos should be returned
					const expected = todos.filter((t: Todo) => t.priority === 'medium');
					expect(filtered).toHaveLength(expected.length);
					expect(filtered.every((t: Todo) => t.priority === 'medium')).toBe(true);
				});

				it('should return only low priority todos when priority filter is "low"', () => {
					// Given: Priority filter is set to 'low'
					setPriorityFilter('low');
					// When: Getting filtered todos
					const filtered = useTodoStore.getState().getFilteredAndSortedTodos();
					// Then: Only low priority todos should be returned
					const expected = todos.filter((t: Todo) => t.priority === 'low');
					expect(filtered).toHaveLength(expected.length);
					expect(filtered.every((t: Todo) => t.priority === 'low')).toBe(true);
				});

				it('should return only null priority todos when priority filter is null', () => {
					// Given: Priority filter is set to null
					setPriorityFilter(null);
					// When: Getting filtered todos
					const filtered = useTodoStore.getState().getFilteredAndSortedTodos();
					// Then: Only null priority todos should be returned
					const expected = todos.filter((t: Todo) => t.priority === null);
					expect(filtered).toHaveLength(expected.length);
					expect(filtered.every((t: Todo) => t.priority === null)).toBe(true);
				});

				it('should return all todos (respecting status filter) when priority filter is reset', () => {
					// Given: Priority filter is set to 'high' initially
					setPriorityFilter('high');
					const filteredHigh = useTodoStore.getState().getFilteredAndSortedTodos();
					expect(filteredHigh.every((t: Todo) => t.priority === 'high')).toBe(true);
					expect(filteredHigh.length).toBeLessThan(todos.length);

					// When: Priority filter is reset (set to undefined)
					setPriorityFilter(undefined);
					const filteredAll = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: All todos (respecting default status filter 'All') should be returned
					expect(filteredAll).toHaveLength(todos.length);
				});

				it('should combine priority filter and status filter (e.g., Active High)', () => {
					// Given: Priority filter is 'high' and status filter is 'Active'
					setPriorityFilter('high');
					act(() => {
						useTodoStore.getState().setFilter(TodoFilter.Active);
					});

					// When: Getting filtered todos
					const filtered = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Only Active High todos should be returned
					const expected = todos.filter((t: Todo) => t.priority === 'high' && !t.completed);
					expect(filtered).toHaveLength(expected.length);
					expect(filtered.every((t: Todo) => t.priority === 'high' && !t.completed)).toBe(true);
				});
			});

			// --- Tests for Due Date Filtering ---
			describe('by Due Date', () => {
				// Make todayStr accessible within this scope
				const todayStr = new Date().toISOString().split('T')[0];

				it('should return only active overdue todos when due date filter is "overdue" and status is "All" or "Active"', () => {
					// Given: Due date filter is 'overdue'
					setDueDateFilter('overdue');

					// When: Getting filtered todos (Status Filter: All)
					act(() => {
						useTodoStore.getState().setFilter(TodoFilter.All);
					});
					let filteredAll = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Only active overdue todos should be returned
					let expectedAll = todos.filter(
						(t: Todo) => !t.completed && t.dueDate && t.dueDate < todayStr
					);
					expect(filteredAll).toHaveLength(expectedAll.length);
					expect(
						filteredAll.every((t: Todo) => !t.completed && t.dueDate && t.dueDate < todayStr)
					).toBe(true);
					expect(filteredAll.some((t: Todo) => t.title === 'Overdue Task')).toBe(true); // Check specific task

					// When: Getting filtered todos (Status Filter: Active)
					act(() => {
						useTodoStore.getState().setFilter(TodoFilter.Active);
					});
					let filteredActive = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Should still only return active overdue todos
					expect(filteredActive).toHaveLength(expectedAll.length); // Same result as 'All'
					expect(
						filteredActive.every((t: Todo) => !t.completed && t.dueDate && t.dueDate < todayStr)
					).toBe(true);

					// When: Getting filtered todos (Status Filter: Completed)
					act(() => {
						useTodoStore.getState().setFilter(TodoFilter.Completed);
					});
					let filteredCompleted = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Should return no todos
					expect(filteredCompleted).toHaveLength(0);
				});

				it('should return only todos with no due date when due date filter is "no-due-date"', () => {
					// Given: Due date filter is 'no-due-date'
					setDueDateFilter('no-due-date');

					// When: Getting filtered todos (Status Filter: All)
					act(() => {
						useTodoStore.getState().setFilter(TodoFilter.All);
					});
					const filtered = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Only todos without due dates should be returned
					const expected = todos.filter((t: Todo) => !t.dueDate);
					expect(filtered).toHaveLength(expected.length);
					expect(filtered.every((t: Todo) => !t.dueDate)).toBe(true);
				});

				it('should combine due date filter and status filter (e.g., Completed No-Due-Date)', () => {
					// Given: Due date filter is 'no-due-date', Status filter is 'Completed'
					setDueDateFilter('no-due-date');
					act(() => {
						useTodoStore.getState().setFilter(TodoFilter.Completed);
					});

					// When: Getting filtered todos
					const filtered = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Only completed todos without due dates should be returned
					const expected = todos.filter((t: Todo) => t.completed && !t.dueDate);
					expect(filtered).toHaveLength(expected.length);
					expect(filtered.every((t: Todo) => t.completed && !t.dueDate)).toBe(true);
				});

				it('should combine due date filter and priority filter (e.g., High Overdue)', () => {
					// Given: Due date filter 'overdue', Priority filter 'high'
					setDueDateFilter('overdue');
					setPriorityFilter('high');
					act(() => {
						useTodoStore.getState().setFilter(TodoFilter.All);
					}); // Ensure status filter is All

					// When: Getting filtered todos
					const filtered = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Should return only active High overdue todos
					const expected = todos.filter(
						(t: Todo) => !t.completed && t.priority === 'high' && t.dueDate && t.dueDate < todayStr
					);
					expect(filtered).toHaveLength(expected.length); // Should be 0 based on our test data
					expect(
						filtered.every(
							(t: Todo) =>
								!t.completed && t.priority === 'high' && t.dueDate && t.dueDate < todayStr
						)
					).toBe(true);
				});

				it('should combine all filters (e.g., Active Medium Overdue)', () => {
					// Given: Status 'Active', Priority 'medium', Due date 'overdue'
					act(() => {
						useTodoStore.getState().setFilter(TodoFilter.Active);
					});
					setPriorityFilter('medium');
					setDueDateFilter('overdue');

					// When: Getting filtered todos
					const filtered = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Should return only active medium overdue todos
					const expected = todos.filter(
						(t: Todo) =>
							!t.completed && t.priority === 'medium' && t.dueDate && t.dueDate < todayStr
					);
					expect(filtered).toHaveLength(expected.length); // Should be 1 ('Overdue Task')
					expect(filtered[0]?.title).toBe('Overdue Task');
					expect(
						filtered.every(
							(t: Todo) =>
								!t.completed && t.priority === 'medium' && t.dueDate && t.dueDate < todayStr
						)
					).toBe(true);
				});

				it('should return all todos (respecting other filters) when due date filter is reset', () => {
					// Given: Filters are set initially
					act(() => {
						useTodoStore.getState().setFilter(TodoFilter.Active);
					});
					setPriorityFilter('medium');
					setDueDateFilter('overdue');
					const initiallyFiltered = useTodoStore.getState().getFilteredAndSortedTodos();
					expect(initiallyFiltered.length).toBe(1); // Active Medium Overdue

					// When: Due date filter is reset
					setDueDateFilter(undefined);
					const afterReset = useTodoStore.getState().getFilteredAndSortedTodos();

					// Then: Should return all Active Medium todos
					const expected = todos.filter((t: Todo) => !t.completed && t.priority === 'medium');
					expect(afterReset).toHaveLength(expected.length); // Should be 1 ('Task Medium 1')
					expect(afterReset.every((t: Todo) => !t.completed && t.priority === 'medium')).toBe(true);
				});
			});
		});
	});
});
