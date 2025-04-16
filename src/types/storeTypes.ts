import { CreateTodoParams, Todo } from './todoTypes';

/**
 * Interface for the Todo store state and actions
 */
export interface TodoState {
	/**
	 * Array of all todos
	 */
	todos: Todo[];

	/**
	 * Adds a new todo to the store
	 * @param params Todo creation parameters
	 * @returns The newly created todo
	 */
	addTodo: (params: CreateTodoParams) => Todo;

	/**
	 * Toggles the completed status of a todo
	 * @param id ID of the todo to toggle
	 * @returns The updated todo or null if not found
	 */
	toggleTodo: (id: string) => Todo | null;

	/**
	 * Resets the store to its initial state (for testing purposes)
	 */
	reset: () => void;
}

/**
 * Interface for the Counter store state and actions
 */
export interface CounterState {
	/**
	 * Current count value
	 */
	count: number;

	/**
	 * Increment count by 1
	 */
	increment: () => void;

	/**
	 * Decrement count by 1
	 */
	decrement: () => void;

	/**
	 * Reset count to 0
	 */
	reset: () => void;
}
