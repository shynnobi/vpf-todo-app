import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { TodoState } from '@/types/storeTypes';
import { Todo } from '@/types/todoTypes';

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

			addTodo: params => {
				const newTodo: Todo = {
					id: uuidv4(),
					title: params.title,
					completed: params.completed ?? false,
				};

				set(state => ({
					todos: [newTodo, ...state.todos],
				}));

				return newTodo;
			},

			toggleTodo: id => {
				const { todos } = get();
				const todoIndex = todos.findIndex(todo => todo.id === id);

				if (todoIndex === -1) {
					return null;
				}

				const newTodos = [...todos];
				newTodos[todoIndex] = {
					...newTodos[todoIndex],
					completed: !newTodos[todoIndex].completed,
				};

				set({
					todos: newTodos,
				});

				return newTodos[todoIndex];
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
