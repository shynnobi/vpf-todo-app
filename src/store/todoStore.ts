import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CreateTodoParams, Todo, TodoFilter } from '@/types/todoTypes';

/**
 * Valid criteria for sorting todos
 * - title: Alphabetical sorting by todo title
 * - priority: Sort by priority level (high, medium, low)
 * - dueDate: Sort by the due date of todos
 * - creationDate: Sort by when the todo was created
 */
export type SortCriterion = 'title' | 'priority' | 'dueDate' | 'creationDate';

/**
 * Sort direction options
 * - asc: Ascending order (A→Z, low→high, early→late)
 * - desc: Descending order (Z→A, high→low, late→early)
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Configuration object for sorting todos
 */
export interface SortConfig {
	/** The criterion to sort by (title, priority, etc.) */
	criterion: SortCriterion;
	/** The direction to sort (ascending or descending) */
	direction: SortDirection;
}

/**
 * Interface for the Todo state store
 */
export interface TodoState {
	/** Array of all todo items */
	todos: Todo[];
	/** Current filter being applied (All, Active, Completed) */
	filter: TodoFilter;
	/** Current sort configuration */
	sortConfig: SortConfig;

	/**
	 * Creates a new todo item
	 * @param params - Parameters for the new todo
	 * @returns The newly created todo
	 */
	addTodo: (params: CreateTodoParams) => Todo;

	/**
	 * Toggles the completed status of a todo
	 * @param id - ID of the todo to toggle
	 * @returns The updated todo or null if not found
	 */
	toggleTodo: (id: string) => Todo | null;

	/**
	 * Updates properties of an existing todo
	 * @param id - ID of the todo to update
	 * @param updates - Object containing the properties to update
	 * @returns The updated todo or null if not found
	 */
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => Todo | null;

	/**
	 * Deletes a todo from the store
	 * @param id - ID of the todo to delete
	 * @returns The deleted todo or null if not found
	 */
	deleteTodo: (id: string) => Todo | null;

	/**
	 * Sets the current filter for todos
	 * @param filter - The filter to apply (All, Active, Completed)
	 */
	setFilter: (filter: TodoFilter) => void;

	/**
	 * Sets a new sort criterion and applies its default direction
	 * @param criterion - The criterion to sort by
	 */
	setSortConfig: (criterion: SortCriterion) => void;

	/**
	 * Toggles the sort direction between ascending and descending
	 */
	toggleSortDirection: () => void;

	/**
	 * Returns todos filtered by current filter and sorted by current sort config
	 * @returns Filtered and sorted array of todos
	 */
	getFilteredAndSortedTodos: () => Todo[];

	/**
	 * Resets the store to its initial state (clears all todos)
	 */
	reset: () => void;
}

/**
 * Fallback storage for environments without localStorage
 * Provides a compatible API but doesn't actually persist data
 */
const inMemoryStorage = {
	getItem: (_key: string) => null,
	setItem: (_key: string, _value: string) => {},
	removeItem: (_key: string) => {},
};

/**
 * Mapping for priority sorting order
 * Lower numbers are higher priority
 */
const priorityOrder: Record<string, number> = {
	high: 1,
	medium: 2,
	low: 3,
	null: 4,
	undefined: 4,
};

/**
 * Initial sort configuration for the store
 * Defaults to sorting by creation date, newest first
 */
const initialSortConfig: SortConfig = {
	criterion: 'creationDate',
	direction: 'desc',
};

/**
 * Determines the default sort direction based on the criterion
 * Different criteria have naturally intuitive directions
 *
 * @param criterion - The sort criterion to get the default direction for
 * @returns The default sort direction for the given criterion
 */
const getDefaultSortDirection = (criterion: SortCriterion): SortDirection => {
	switch (criterion) {
		case 'creationDate':
		case 'priority':
			return 'desc'; // Newest/Highest first
		case 'title':
		case 'dueDate':
		default:
			return 'asc'; // A-Z / Soonest first
	}
};

/**
 * Zustand store for managing todos with persistence in localStorage
 *
 * Features:
 * - Create, read, update, delete todo items
 * - Filter todos by completion status
 * - Sort todos by various criteria
 * - Persists data between browser sessions
 */
export const useTodoStore = create<TodoState>()(
	persist(
		(set, get) => ({
			todos: [],
			filter: TodoFilter.All,
			sortConfig: initialSortConfig,

			/**
			 * Creates a new todo with the provided parameters
			 * Generates a unique ID and adds creation timestamp
			 */
			addTodo: (params: CreateTodoParams): Todo => {
				const newTodo: Todo = {
					id: uuidv4(),
					title: params.title,
					completed: params.completed ?? false,
					creationDate: new Date().toISOString(),
					description: params.description,
					dueDate: params.dueDate,
					priority: params.priority ?? null,
				};

				set(state => ({
					todos: [...state.todos, newTodo],
				}));

				return newTodo;
			},

			/**
			 * Toggles the completed status of a todo
			 * Returns the updated todo or null if not found
			 */
			toggleTodo: (id: string): Todo | null => {
				const todo = get().todos.find(t => t.id === id);
				if (!todo) return null;
				const updatedTodo = { ...todo, completed: !todo.completed };
				set(state => ({ todos: state.todos.map(t => (t.id === id ? updatedTodo : t)) }));
				return updatedTodo;
			},

			/**
			 * Updates properties of an existing todo
			 * Returns the updated todo or null if not found
			 */
			updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>): Todo | null => {
				const todo = get().todos.find(t => t.id === id);
				if (!todo) return null;
				const updatedTodo: Todo = { ...todo, ...updates };
				set(state => ({ todos: state.todos.map(t => (t.id === id ? updatedTodo : t)) }));
				return updatedTodo;
			},

			/**
			 * Deletes a todo from the store
			 * Returns the deleted todo or null if not found
			 */
			deleteTodo: (id: string): Todo | null => {
				const todo = get().todos.find(t => t.id === id);
				if (!todo) return null;
				set(state => ({ todos: state.todos.filter(t => t.id !== id) }));
				return todo;
			},

			/**
			 * Sets the current filter for todos
			 */
			setFilter: (filter: TodoFilter): void => {
				set({ filter });
			},

			/**
			 * Sets a new sort criterion and applies its default direction
			 * Different criteria have appropriate default directions
			 */
			setSortConfig: (criterion: SortCriterion): void => {
				const newDirection = getDefaultSortDirection(criterion);
				set({ sortConfig: { criterion, direction: newDirection } });
			},

			/**
			 * Toggles the sort direction between ascending and descending
			 */
			toggleSortDirection: (): void => {
				set(state => ({
					sortConfig: {
						...state.sortConfig,
						direction: state.sortConfig.direction === 'asc' ? 'desc' : 'asc',
					},
				}));
			},

			/**
			 * Returns todos filtered by current filter and sorted by current sort config
			 * Implements complex sorting logic for different data types
			 */
			getFilteredAndSortedTodos: (): Todo[] => {
				const { todos, filter, sortConfig } = get();
				let filteredTodos = [...todos];

				// 1. Apply Status Filter
				if (filter === TodoFilter.Active) {
					filteredTodos = filteredTodos.filter((todo: Todo) => !todo.completed);
				} else if (filter === TodoFilter.Completed) {
					filteredTodos = filteredTodos.filter((todo: Todo) => todo.completed);
				}

				// 2. Apply Sorting
				const { criterion, direction } = sortConfig;
				const sortMultiplier = direction === 'asc' ? 1 : -1;

				filteredTodos.sort((a, b) => {
					let comparison = 0;
					switch (criterion) {
						case 'title':
							comparison = a.title.localeCompare(b.title);
							break;
						case 'priority': {
							// Use helper object for priority order (High=1, Medium=2, Low=3, Null=4)
							const orderA = priorityOrder[String(a.priority)];
							const orderB = priorityOrder[String(b.priority)];
							comparison = orderA - orderB;
							break;
						}
						case 'dueDate': {
							// Handle null/undefined dates - typically sort them last
							const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
							const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
							if (dateA === Infinity && dateB === Infinity) comparison = 0;
							else if (dateA === Infinity)
								comparison = 1; // a is greater (put last in asc)
							else if (dateB === Infinity)
								comparison = -1; // b is greater
							else comparison = dateA - dateB;
							break;
						}
						case 'creationDate': {
							const dateA = new Date(a.creationDate).getTime();
							const dateB = new Date(b.creationDate).getTime();
							comparison = dateA - dateB;
							break;
						}
					}
					return comparison * sortMultiplier;
				});

				return filteredTodos;
			},

			/**
			 * Resets the store to its initial state
			 * Clears all todos and resets filter and sort settings
			 */
			reset: () => {
				set({
					todos: [],
					filter: TodoFilter.All,
					sortConfig: initialSortConfig,
				});
			},
		}),
		{
			name: 'todo-storage',
			storage: createJSONStorage(() => {
				// Use localStorage if available, otherwise fallback to in-memory
				try {
					return typeof window !== 'undefined' ? window.localStorage : inMemoryStorage;
				} catch {
					return inMemoryStorage;
				}
			}),
		}
	)
);
