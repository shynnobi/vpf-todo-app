import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

import { TodoState } from '@/types/storeTypes';
import { Todo } from '@/types/todoTypes';

/**
 * Zustand store for managing todos
 */
export const useTodoStore = create<TodoState>()((set, get) => ({
	todos: [],
	todosCount: 0,

	addTodo: params => {
		const newTodo: Todo = {
			id: uuidv4(),
			title: params.title,
			completed: params.completed ?? false,
		};

		set(state => ({
			todos: [newTodo, ...state.todos],
			todosCount: state.todosCount + 1,
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

		set({ todos: newTodos });

		return newTodos[todoIndex];
	},

	reset: () => {
		set({ todos: [], todosCount: 0 });
	},
}));
