import { useState } from 'react';

import { EditTodoForm } from './EditTodoForm';

import { Todo, TodoItemProps } from '@/types/todoTypes';

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
				<EditTodoForm
					initialData={todo} // Pass the whole todo or necessary fields
					onSave={handleSave} // Pass the wrapper save handler
					onCancel={handleCancel} // Pass the cancel handler
				/>
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
						<span
							id={`todo-title-${todo.id}`}
							className={`${todo.completed ? 'text-gray-500 line-through' : ''}`}
						>
							{todo.title}
						</span>
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
							className="text-blue-500 hover:text-blue-700 focus:outline-none"
							aria-label={`Edit todo: ${todo.title}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
								<path
									fillRule="evenodd"
									d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
						<button
							onClick={handleDelete}
							className="text-red-500 hover:text-red-700 focus:outline-none"
							aria-label={`Delete todo: ${todo.title}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			)}
		</li>
	);
}
