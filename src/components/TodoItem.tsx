import { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import { EditTodoForm } from './EditTodoForm';

import { Badge } from '@/components/ui/badge';
import { PriorityLevel, Todo, TodoItemProps } from '@/types/todoTypes';

const priorityVariantMap: Record<PriorityLevel, 'destructive' | 'outline' | 'secondary'> = {
	high: 'destructive',
	medium: 'outline',
	low: 'secondary',
};

/**
 * A component that renders a single todo item with checkbox, edit and delete buttons.
 * Can switch to an editing mode using EditTodoForm.
 */
export function TodoItem({ todo, onToggle, onDelete, onSave }: TodoItemProps) {
	const [isEditing, setIsEditing] = useState(false);

	const handleToggle = () => {
		onToggle(todo.id);
	};

	const handleDelete = () => {
		onDelete(todo.id);
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
		onSave(id, updates);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	return (
		<li
			className="py-2 flex flex-col gap-1 border-b border-gray-100 last:border-0"
			aria-labelledby={`todo-title-${todo.id}`}
			role="listitem"
		>
			{isEditing ? (
				<EditTodoForm initialData={todo} onSave={handleSave} onCancel={handleCancel} />
			) : (
				// Display mode
				<div className="flex items-center gap-2 w-full">
					<input
						type="checkbox"
						checked={todo.completed}
						onChange={handleToggle}
						className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
						aria-labelledby={`todo-title-${todo.id}`}
					/>
					<div className="flex-1 flex flex-col text-sm">
						<div className="flex items-center gap-2">
							{' '}
							{/* Wrapper for title and badge */}
							<Badge variant={priorityVariantMap[todo.priority]} className="px-1.5 py-0.5 text-xs">
								{todo.priority}
							</Badge>
							<span
								id={`todo-title-${todo.id}`}
								className={`${todo.completed ? 'text-gray-500 line-through' : ''}`}
							>
								{todo.title}
							</span>
						</div>
						{/* Display description if it exists */}
						{todo.description && (
							<span className="text-xs text-gray-600 mt-1">{todo.description}</span>
						)}
						{/* Display due date if it exists */}
						{todo.dueDate && (
							<span className="text-xs text-gray-500 mt-1">
								Due: {new Date(todo.dueDate).toLocaleDateString()}
							</span>
						)}
					</div>
					{/* Action Buttons in display mode */}
					<div className="flex items-center gap-2">
						<button
							onClick={handleEdit}
							className="text-blue-500 hover:text-blue-700 focus:outline-none p-1"
							aria-label={`Edit todo: ${todo.title}`}
						>
							<FaEdit className="h-4 w-4" />
						</button>
						<button
							onClick={handleDelete}
							className="text-red-500 hover:text-red-700 focus:outline-none p-1"
							aria-label={`Delete todo: ${todo.title}`}
						>
							<FaTrashAlt className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}
		</li>
	);
}
