export interface Todo {
	id: string;
	title: string;
	completed: boolean;
	description?: string;
	dueDate?: string;
}

export enum TodoFilter {
	All = 'all',
	Active = 'active',
	Completed = 'completed',
}

export type CreateTodoParams = {
	title: string;
	completed?: boolean;
	description?: string;
	dueDate?: string;
};

export interface TodoState {
	todos: Todo[];
	filter: TodoFilter;
	addTodo: (params: CreateTodoParams) => Todo;
	toggleTodo: (id: string) => Todo | null;
	updateTodo: (id: string, updates: Partial<Omit<Todo, 'id'>>) => Todo | null;
	deleteTodo: (id: string) => Todo | null;
	setFilter: (filter: TodoFilter) => void;
	reset: () => void;
}

// Component Prop Types

export interface TodoItemProps {
	todo: Todo;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
}

export interface TodoListProps {
	todos: Todo[];
	onToggleTodo: (id: string) => void;
	onDeleteTodo: (id: string) => void;
}

export interface AddTodoFormProps {
	onAddTodo: (todo: CreateTodoParams) => void;
}

export interface TodoFilterProps {
	currentFilter: TodoFilter;
	onFilterChange: (filter: TodoFilter) => void;
	counts: {
		[TodoFilter.All]: number;
		[TodoFilter.Active]: number;
		[TodoFilter.Completed]: number;
	};
}
