import { TodoItem } from '@/components/TodoItem';
import { Todo } from '@/types/todoTypes';

/**
 * Props for the TodoList component
 */
interface TodoListProps {
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
 * A component that renders a list of todo items
 */
export function TodoList({ todos, onToggleTodo, onDeleteTodo }: TodoListProps) {
	if (todos.length === 0) {
		return <div className="text-center py-4 text-gray-500">No todos to display</div>;
	}

	return (
		<ul className="mt-4" aria-label="Todo list" role="list">
			{todos.map(todo => (
				<TodoItem key={todo.id} todo={todo} onToggle={onToggleTodo} onDelete={onDeleteTodo} />
			))}
		</ul>
	);
}
