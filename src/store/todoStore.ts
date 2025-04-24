import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CreateTodoParams, Todo, TodoFilter } from '@/types/todoTypes';

export type SortCriterion = 'title' | 'priority' | 'dueDate' | 'creationDate';
export type SortDirection = 'asc' | 'desc';
export interface SortConfig {
	criterion: SortCriterion;
	direction: SortDirection;
}

export interface TodoState {
	todos: Todo[];
	filter: TodoFilter;
	sortConfig: SortConfig;
	addTodo: (params: CreateTodoParams) => Todo;
	toggleTodo: (id: string) => Todo | null;
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => Todo | null;
	deleteTodo: (id: string) => Todo | null;
	setFilter: (filter: TodoFilter) => void;
	setSortConfig: (criterion: SortCriterion) => void;
	toggleSortDirection: () => void;
	getFilteredAndSortedTodos: () => Todo[];
	reset: () => void;
}

// Fallback for environments without localStorage
const inMemoryStorage = {
	getItem: (_key: string) => null,
	setItem: (_key: string, _value: string) => {},
	removeItem: (_key: string) => {},
};

// Helper for priority sorting order
const priorityOrder: Record<string, number> = {
	high: 1,
	medium: 2,
	low: 3,
	null: 4,
	undefined: 4,
};

const initialSortConfig: SortConfig = {
	criterion: 'creationDate',
	direction: 'desc',
};

// Helper to determine default sort direction based on criterion
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
 * Zustand store for managing todos, with localStorage persistence.
 */
export const useTodoStore = create<TodoState>()(
	persist(
		(set, get) => ({
			todos: [],
			filter: TodoFilter.All,
			sortConfig: initialSortConfig,

			// Actions implementation
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

			toggleTodo: (id: string): Todo | null => {
				const todo = get().todos.find(t => t.id === id);
				if (!todo) return null;
				const updatedTodo = { ...todo, completed: !todo.completed };
				set(state => ({ todos: state.todos.map(t => (t.id === id ? updatedTodo : t)) }));
				return updatedTodo;
			},

			updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>): Todo | null => {
				const todo = get().todos.find(t => t.id === id);
				if (!todo) return null;
				const updatedTodo: Todo = { ...todo, ...updates };
				set(state => ({ todos: state.todos.map(t => (t.id === id ? updatedTodo : t)) }));
				return updatedTodo;
			},

			deleteTodo: (id: string): Todo | null => {
				const todo = get().todos.find(t => t.id === id);
				if (!todo) return null;
				set(state => ({ todos: state.todos.filter(t => t.id !== id) }));
				return todo;
			},

			setFilter: (filter: TodoFilter): void => {
				set({ filter });
			},

			// Sets a new sort criterion and applies its default direction
			setSortConfig: (criterion: SortCriterion): void => {
				const newDirection = getDefaultSortDirection(criterion);
				set({ sortConfig: { criterion, direction: newDirection } });
			},

			// Toggles the sort direction for the current criterion
			toggleSortDirection: (): void => {
				set(state => ({
					sortConfig: {
						...state.sortConfig,
						direction: state.sortConfig.direction === 'asc' ? 'desc' : 'asc',
					},
				}));
			},

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
