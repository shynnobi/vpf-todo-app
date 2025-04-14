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

	/**
	 * Creation timestamp
	 */
	createdAt: Date;

	/**
	 * Last updated timestamp
	 */
	updatedAt: Date;

	/**
	 * Optional additional notes or description
	 */
	notes?: string;

	/**
	 * Priority level from 1 (highest) to 5 (lowest)
	 */
	priority?: TodoPriority;
}

/**
 * Priority levels for todos
 */
export enum TodoPriority {
	Highest = 1,
	High = 2,
	Medium = 3,
	Low = 4,
	Lowest = 5,
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
export type CreateTodoParams = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Parameters for updating an existing Todo
 */
export type UpdateTodoParams = Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>;
