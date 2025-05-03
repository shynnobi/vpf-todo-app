import { TodoItem } from '@/components/TodoItem';
import { TodoListProps } from '@/types/todoTypes';

/**
 * A component that renders a list of todo items
 */
export function TodoList({
	todos,
	onToggleTodo,
	onDeleteTodo,
	onSaveTodo,
	editingTodoId,
	onSetEditingTodo,
}: TodoListProps) {
	if (todos.length === 0) {
		return <div className="text-center py-4 text-gray-500">No todos to display</div>;
	}

	return (
		<ul className="mt-4" aria-label="Todo list" role="list">
			{todos.map(todo => (
				<TodoItem
					key={todo.id}
					todo={todo}
					onToggle={onToggleTodo}
					onDelete={onDeleteTodo}
					onSave={onSaveTodo}
					isEditing={todo.id === editingTodoId}
					onSetEditing={onSetEditingTodo}
				/>
			))}
		</ul>
	);
}
