/**
 * Priority levels for todo items
 * - low: Lowest priority tasks
 * - medium: Standard priority tasks
 * - high: Highest priority tasks
 */
export type PriorityLevel = 'low' | 'medium' | 'high';

/**
 * Represents a todo item in the application
 */
export interface Todo {
	/** Unique identifier for the todo */
	id: string;
	/** Title/name of the todo */
	title: string;
	/** Whether the todo has been completed */
	completed: boolean;
	/** ISO date string for when the todo was created */
	creationDate: string;
	/** Optional longer description of the todo */
	description?: string;
	/** Optional due date as ISO date string or null if no due date */
	dueDate?: string | null;
	/** Optional priority level of the todo */
	priority?: PriorityLevel | null;
	/** ISO date string for when the todo was last modified */
	lastModified?: string;
}

/**
 * Filter options for displaying todos
 * - All: Show all todos regardless of completion status
 * - Active: Show only incomplete todos
 * - Completed: Show only completed todos
 */
export enum TodoFilter {
	All = 'all',
	Active = 'active',
	Completed = 'completed',
}

/**
 * Parameters required to create a new todo
 */
export type CreateTodoParams = {
	/** Title/name of the todo (required) */
	title: string;
	/** Whether the todo is already completed (defaults to false if not provided) */
	completed?: boolean;
	/** Optional longer description of the todo */
	description?: string;
	/** Optional due date as ISO date string or null if no due date */
	dueDate?: string | null;
	/** Optional priority level of the todo */
	priority?: PriorityLevel | null;
};

/**
 * Interface for the todo state store (deprecated - use TodoState from todoStore.ts)
 * @deprecated Use TodoState from src/store/todoStore.ts instead
 */
export interface TodoState {
	/** Array of all todo items */
	todos: Todo[];
	/** Current filter being applied */
	filter: TodoFilter;
	/** Creates a new todo item */
	addTodo: (params: CreateTodoParams) => Todo;
	/** Toggles the completed status of a todo */
	toggleTodo: (id: string) => Todo | null;
	/** Updates properties of an existing todo */
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => Todo | null;
	/** Deletes a todo from the store */
	deleteTodo: (id: string) => Todo | null;
	/** Sets the current filter for todos */
	setFilter: (filter: TodoFilter) => void;
	/** Returns todos sorted by priority */
	getSortedTodosByPriority: () => Todo[];
	/** Resets the store to its initial state */
	reset: () => void;
}

// Component Prop Types

/**
 * Props for the TodoItem component
 */
export interface TodoItemProps {
	/** The todo item to display */
	todo: Todo;
	/** Callback function for toggling completion status */
	onToggle: (id: string) => void;
	/** Callback function for deleting the todo */
	onDelete: (id: string) => void;
	/** Callback function for saving updates to the todo */
	onSave: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void;
	/** Whether the todo is currently in edit mode */
	isEditing: boolean;
	/** Callback to set which todo is being edited */
	onSetEditing: (id: string | null) => void;
}

/**
 * Props for the TodoList component
 */
export interface TodoListProps {
	/** Array of todos to display */
	todos: Todo[];
	/** Callback function for toggling completion status */
	onToggleTodo: (id: string) => void;
	/** Callback function for deleting a todo */
	onDeleteTodo: (id: string) => void;
	/** Callback function for saving updates to a todo */
	onSaveTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void;
	/** ID of the todo currently being edited, or null if none */
	editingTodoId: string | null;
	/** Callback to set which todo is being edited */
	onSetEditingTodo: (id: string | null) => void;
}

/**
 * Props for the AddTodoForm component
 */
export interface AddTodoFormProps {
	/** Callback function to add a new todo */
	onAddTodo: (todo: CreateTodoParams) => void;
}

/**
 * Props for the TodoFilter component
 */
export interface TodoFilterProps {
	/** The currently active filter */
	currentFilter: TodoFilter;
	/** Callback function to change the current filter */
	onFilterChange: (filter: TodoFilter) => void;
	/** Counts of todos in each filter category */
	counts: {
		[TodoFilter.All]: number;
		[TodoFilter.Active]: number;
		[TodoFilter.Completed]: number;
	};
}
