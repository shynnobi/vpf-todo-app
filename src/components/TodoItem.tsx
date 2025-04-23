import { useState } from 'react';
import { Pencil, Trash } from 'lucide-react';

import { EditTodoForm } from './EditTodoForm';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriorityLevel, Todo, TodoItemProps } from '@/types/todoTypes';

// Update signature to accept null, return string | null
const getPriorityBadgeClasses = (priority: PriorityLevel | null): string | null => {
	if (priority === null) {
		return null; // Return null if no priority, badge won't render styles properly or we hide it
	}
	switch (priority) {
		case 'high':
			return 'border-transparent bg-red-100 text-red-700 hover:bg-red-100/80';
		case 'medium':
			return 'border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80';
		case 'low':
			return 'border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100/80';
		default:
			// This case should technically not be reachable with PriorityLevel type
			// but returning a default style or null is safer.
			return 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80';
	}
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

	const badgeClasses = getPriorityBadgeClasses(todo.priority);

	return (
		<li
			className="py-2 flex flex-col gap-1 border-b border-gray-100 last:border-0 hover:bg-muted/50 transition-colors duration-150"
			aria-labelledby={`todo-title-${todo.id}`}
			role="listitem"
		>
			{isEditing ? (
				<EditTodoForm initialData={todo} onSave={handleSave} onCancel={handleCancel} />
			) : (
				// Display mode
				<div className="flex items-center gap-2 w-full px-2">
					<input
						type="checkbox"
						checked={todo.completed}
						onChange={handleToggle}
						className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
						aria-labelledby={`todo-title-${todo.id}`}
					/>
					<div className="flex-1 flex flex-col text-sm py-1">
						<div className="flex items-center gap-2">
							<span
								id={`todo-title-${todo.id}`}
								className={`${todo.completed ? 'text-gray-500 line-through' : ''}`}
							>
								{todo.title}
							</span>

							{/* Conditionally render the Badge only if priority is not null and classes exist */}
							{todo.priority && badgeClasses && (
								<Badge className={`px-1.5 py-0.5 text-xs font-medium ${badgeClasses}`}>
									{todo.priority}
								</Badge>
							)}
						</div>
						{/* Display description if it exists */}
						{todo.description && (
							<span className="text-xs text-muted-foreground mt-1">{todo.description}</span>
						)}
						{/* Display due date if it exists */}
						{todo.dueDate && (
							<span className="text-xs text-muted-foreground mt-1">
								Due: {new Date(todo.dueDate).toLocaleDateString()}
							</span>
						)}
					</div>
					{/* Action Buttons in display mode */}
					<div className="flex items-center">
						<Button
							variant="ghost"
							size="icon"
							onClick={handleEdit}
							aria-label={`Edit todo: ${todo.title}`}
							className="h-7 w-7 text-muted-foreground hover:text-blue-600 cursor-pointer"
						>
							<Pencil className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleDelete}
							aria-label={`Delete todo: ${todo.title}`}
							className="h-7 w-7 text-muted-foreground hover:text-red-600 cursor-pointer"
						>
							<Trash className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</li>
	);
}
