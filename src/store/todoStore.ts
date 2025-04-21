import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CreateTodoParams, PriorityLevel, Todo, TodoFilter, TodoState } from '@/types/todoTypes';

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
			todos: [],
			filter: TodoFilter.All,

			addTodo: (params: CreateTodoParams): Todo => {
				const newTodo: Todo = {
					id: uuidv4(),
					title: params.title,
					completed: params.completed ?? false,
					description: params.description,
					dueDate: params.dueDate,
					priority: params.priority ?? 'medium',
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

			setFilter: (filter: TodoFilter): void => {
				set({ filter });
			},

			getSortedTodosByPriority: (): Todo[] => {
				const todos = get().todos;
				// Define the sort order for priorities
				const priorityOrder: Record<PriorityLevel, number> = {
					high: 1,
					medium: 2,
					low: 3,
				};
				// Create a new sorted array (do not mutate the original state)
				return [...todos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
			},

			reset: () => {
				set({
					todos: [],
					filter: TodoFilter.All,
				});
			},
		}),
		{
			name: 'todo-storage',
			storage: createJSONStorage(() =>
				typeof window !== 'undefined' ? window.localStorage : inMemoryStorage
			),
			partialize: state => ({
				todos: state.todos,
				filter: state.filter,
			}),
		}
	)
);
