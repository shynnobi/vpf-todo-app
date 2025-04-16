import { Todo } from '@/types/todoTypes';

/**
 * Props for the TodoItem component
 */
interface TodoItemProps {
	/**
	 * The todo to display
	 */
	todo: Todo;

	/**
	 * Callback function when todo completion is toggled
	 */
	onToggle: (id: string) => void;
}

/**
 * A component that renders a single todo item with checkbox
 */
export function TodoItem({ todo, onToggle }: TodoItemProps) {
	const handleToggle = () => {
		onToggle(todo.id);
	};

	return (
		<li
			className="py-2 flex items-center gap-2 border-b border-gray-100 last:border-0"
			aria-labelledby={`todo-title-${todo.id}`}
			role="listitem"
		>
			<input
				type="checkbox"
				checked={todo.completed}
				onChange={handleToggle}
				className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
				aria-labelledby={`todo-title-${todo.id}`}
			/>
			<span
				id={`todo-title-${todo.id}`}
				className={`flex-1 text-sm ${todo.completed ? 'text-gray-500 line-through' : ''}`}
			>
				{todo.title}
			</span>
		</li>
	);
}
