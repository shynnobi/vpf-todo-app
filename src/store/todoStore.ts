import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CreateTodoParams, Todo, TodoFilter, UpdateTodoParams } from '@/lib/todos';

/**
 * Interface defining the Todo store state and actions
 */
interface TodoStore {
	// State
	todos: Todo[];
	filter: TodoFilter;

	// Actions
	addTodo: (params: CreateTodoParams) => Todo;
	updateTodo: (id: string, params: UpdateTodoParams) => Todo | null;
	toggleTodo: (id: string) => Todo | null;
	deleteTodo: (id: string) => boolean;
	clearCompleted: () => void;
	setFilter: (filter: TodoFilter) => void;

	// Selectors
	filteredTodos: Todo[];
	activeTodos: Todo[];
	completedTodos: Todo[];
	todoCount: number;
	activeTodoCount: number;
	completedTodoCount: number;
}

/**
 * Zustand store for Todo management with persistence
 */
export const useTodoStore = create<TodoStore>()(
	persist(
		(set, get) => ({
			// Initial state
			todos: [],
			filter: TodoFilter.All,

			// Actions
			addTodo: params => {
				const newTodo: Todo = {
					id: uuidv4(),
					title: params.title,
					completed: params.completed ?? false,
					createdAt: new Date(),
					updatedAt: new Date(),
					notes: params.notes,
					priority: params.priority,
				};

				set(state => ({
					todos: [...state.todos, newTodo],
				}));

				return newTodo;
			},

			updateTodo: (id, params) => {
				let updatedTodo: Todo | null = null;

				set(state => {
					const updatedTodos = state.todos.map(todo => {
						if (todo.id === id) {
							updatedTodo = {
								...todo,
								...params,
								updatedAt: new Date(),
							};
							return updatedTodo;
						}
						return todo;
					});

					return { todos: updatedTodos };
				});

				return updatedTodo;
			},

			toggleTodo: id => {
				return get().updateTodo(id, {
					completed: !get().todos.find(todo => todo.id === id)?.completed,
				});
			},

			deleteTodo: id => {
				let deleted = false;

				set(state => {
					const filteredTodos = state.todos.filter(todo => {
						if (todo.id === id) {
							deleted = true;
							return false;
						}
						return true;
					});

					return { todos: filteredTodos };
				});

				return deleted;
			},

			clearCompleted: () => {
				set(state => ({
					todos: state.todos.filter(todo => !todo.completed),
				}));
			},

			setFilter: filter => {
				set({ filter });
			},

			// Computed values (selectors)
			get filteredTodos() {
				const { todos, filter } = get();

				switch (filter) {
					case TodoFilter.Active:
						return todos.filter(todo => !todo.completed);
					case TodoFilter.Completed:
						return todos.filter(todo => todo.completed);
					default:
						return todos;
				}
			},

			get activeTodos() {
				return get().todos.filter(todo => !todo.completed);
			},

			get completedTodos() {
				return get().todos.filter(todo => todo.completed);
			},

			get todoCount() {
				return get().todos.length;
			},

			get activeTodoCount() {
				return get().activeTodos.length;
			},

			get completedTodoCount() {
				return get().completedTodos.length;
			},
		}),
		{
			name: 'todo-storage', // localStorage key
			partialize: state => ({ todos: state.todos }), // Only persist todos, not filter
		}
	)
);
