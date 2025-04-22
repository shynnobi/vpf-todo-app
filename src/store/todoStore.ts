import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define specific type for due date filters
export type DueDateFilter = 'overdue' | 'no-due-date' | undefined;

import {
	CreateTodoParams,
	PriorityLevel,
	Todo,
	TodoFilter,
	// TodoState // Let's define TodoState here for clarity
} from '@/types/todoTypes';

// Define the state shape including new filters and actions
export interface TodoState {
	todos: Todo[];
	filter: TodoFilter;
	priorityFilter: PriorityLevel | null | undefined; // Undefined means no priority filter
	dueDateFilter: DueDateFilter; // Undefined means no date filter
	addTodo: (params: CreateTodoParams) => Todo;
	toggleTodo: (id: string) => Todo | null;
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => Todo | null;
	deleteTodo: (id: string) => Todo | null;
	setFilter: (filter: TodoFilter) => void;
	setPriorityFilter: (priority?: PriorityLevel | null | undefined) => void;
	setDueDateFilter: (filterType?: DueDateFilter) => void;
	getSortedTodosByPriority: () => Todo[]; // Keep original sort function
	getFilteredAndSortedTodos: () => Todo[]; // New selector combining filter+sort
	reset: () => void;
}

// Fallback for environments without localStorage
const inMemoryStorage = {
	getItem: (_key: string) => null,
	setItem: (_key: string, _value: string) => {},
	removeItem: (_key: string) => {},
};

/**
 * Zustand store for managing todos, with localStorage persistence.
 */
export const useTodoStore = create<TodoState>()(
	persist(
		(set, get) => ({
			// Initial State
			todos: [],
			filter: TodoFilter.All,
			priorityFilter: undefined, // Default: no priority filter
			dueDateFilter: undefined, // Default: no due date filter

			// Actions (addTodo, toggleTodo, updateTodo, deleteTodo remain the same)
			addTodo: (params: CreateTodoParams): Todo => {
				const newTodo: Todo = {
					id: uuidv4(),
					title: params.title,
					completed: params.completed ?? false,
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

				if (!todo) {
					return null;
				}

				const updatedTodo = { ...todo, completed: !todo.completed };

				set(state => ({
					todos: state.todos.map(t => (t.id === id ? updatedTodo : t)),
				}));

				return updatedTodo;
			},

			updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>): Todo | null => {
				const todo = get().todos.find(t => t.id === id);

				if (!todo) {
					return null;
				}

				const updatedTodo: Todo = { ...todo, ...updates };

				set(state => ({
					todos: state.todos.map(t => (t.id === id ? updatedTodo : t)),
				}));

				return updatedTodo;
			},

			deleteTodo: (id: string): Todo | null => {
				const todo = get().todos.find(t => t.id === id);

				if (!todo) {
					return null;
				}

				set(state => ({
					todos: state.todos.filter(t => t.id !== id),
				}));

				return todo;
			},

			// Filter Actions
			setFilter: (filter: TodoFilter): void => {
				set({ filter });
			},
			setPriorityFilter: (priority?: PriorityLevel | null | undefined): void => {
				set({ priorityFilter: priority });
			},
			setDueDateFilter: (filterType?: DueDateFilter): void => {
				set({ dueDateFilter: filterType });
			},

			// Selectors/Getters
			getSortedTodosByPriority: (): Todo[] => {
				const todos = get().todos;
				const priorityOrder: Record<PriorityLevel | string, number> = {
					high: 1,
					medium: 2,
					low: 3,
					null: 4,
				};
				return [...todos].sort((a, b) => {
					const orderA = priorityOrder[String(a.priority)];
					const orderB = priorityOrder[String(b.priority)];
					return orderA - orderB;
				});
			},

			// New combined selector
			getFilteredAndSortedTodos: (): Todo[] => {
				const { todos, filter, priorityFilter, dueDateFilter } = get();
				let filteredTodos = [...todos]; // Start with a copy of all todos

				// 1. Apply Status Filter
				if (filter === TodoFilter.Active) {
					filteredTodos = filteredTodos.filter((todo: Todo) => !todo.completed);
				} else if (filter === TodoFilter.Completed) {
					filteredTodos = filteredTodos.filter((todo: Todo) => todo.completed);
				}
				// No action needed for TodoFilter.All

				// 2. Apply Priority Filter (if active)
				if (priorityFilter !== undefined) {
					// Check if filter is set (could be null)
					filteredTodos = filteredTodos.filter((todo: Todo) => todo.priority === priorityFilter);
				}

				// 3. Apply Due Date Filter (if active)
				if (dueDateFilter === 'overdue') {
					const todayStr = new Date().toISOString().split('T')[0];
					// Overdue = has due date, date is in the past, AND is not completed
					filteredTodos = filteredTodos.filter(
						(todo: Todo) => !todo.completed && todo.dueDate && todo.dueDate < todayStr
					);
				} else if (dueDateFilter === 'no-due-date') {
					filteredTodos = filteredTodos.filter((todo: Todo) => !todo.dueDate);
				}

				// 4. Sort the final filtered list by priority
				const priorityOrder: Record<PriorityLevel | string, number> = {
					high: 1,
					medium: 2,
					low: 3,
					null: 4,
				};
				filteredTodos.sort((a, b) => {
					const orderA = priorityOrder[String(a.priority)];
					const orderB = priorityOrder[String(b.priority)];
					return orderA - orderB;
				});

				return filteredTodos;
			},

			// Reset Action
			reset: () => {
				set({
					todos: [],
					filter: TodoFilter.All,
					priorityFilter: undefined, // Reset advanced filters
					dueDateFilter: undefined,
				});
			},
		}),
		{
			name: 'todo-storage',
			storage: createJSONStorage(() =>
				typeof window !== 'undefined' ? window.localStorage : inMemoryStorage
			),
			// Only persist todos and basic filter, not advanced filters
			partialize: state => ({
				todos: state.todos,
				filter: state.filter,
			}),
		}
	)
);
