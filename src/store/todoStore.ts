import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CreateTodoParams, Todo, TodoState } from '@/types/todoTypes';

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

			addTodo: (params: CreateTodoParams): Todo => {
				const newTodo: Todo = {
					id: uuidv4(),
					title: params.title,
					completed: params.completed ?? false,
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

			reset: () => {
				set({ todos: [] });
			},
		}),
		{
			name: 'todo-storage',
			storage: createJSONStorage(() =>
				typeof window !== 'undefined' ? window.localStorage : inMemoryStorage
			),
			partialize: state => ({
				todos: state.todos,
			}),
		}
	)
);
