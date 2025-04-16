/**
 * Todo item interface representing a single task
 */
export interface Todo {
	/**
	 * Unique identifier for the todo
	 */
	id: string;

	/**
	 * The title/description of the todo task
	 */
	title: string;

	/**
	 * Whether the todo is completed
	 */
	completed: boolean;
}

/**
 * Filter options for todo list view
 */
export enum TodoFilter {
	All = 'all',
	Active = 'active',
	Completed = 'completed',
}

/**
 * Parameters for creating a new Todo
 */
export type CreateTodoParams = {
	/**
	 * The title/description of the todo task
	 */
	title: string;

	/**
	 * Whether the todo is completed (defaults to false if not provided)
	 */
	completed?: boolean;
};
