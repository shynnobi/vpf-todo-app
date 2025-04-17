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
	 * Deletes a todo from the store
	 * @param id ID of the todo to delete
	 * @returns The deleted todo or null if not found
	 */
	deleteTodo: (id: string) => Todo | null;

	/**
	 * Resets the store to its initial state (for testing purposes)
	 */
	reset: () => void;
}

// Component Prop Types

/**
 * Props for the TodoItem component
 */
export interface TodoItemProps {
	/**
	 * The todo to display
	 */
	todo: Todo;

	/**
	 * Callback function when todo completion is toggled
	 */
	onToggle: (id: string) => void;

	/**
	 * Callback function when todo is deleted
	 */
	onDelete: (id: string) => void;
}

/**
 * Props for the TodoList component
 */
export interface TodoListProps {
	/**
	 * Array of todos to display
	 */
	todos: Todo[];

	/**
	 * Callback function when a todo's completion is toggled
	 */
	onToggleTodo: (id: string) => void;

	/**
	 * Callback function when a todo is deleted
	 */
	onDeleteTodo: (id: string) => void;
}

/**
 * Props for the AddTodoForm component
 */
export interface AddTodoFormProps {
	/**
	 * Callback function called when a new todo is submitted
	 */
	onAddTodo: (todo: CreateTodoParams) => void;
}
