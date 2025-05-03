import { Pencil, Trash } from 'lucide-react';

import { EditTodoForm } from './EditTodoForm';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriorityLevel, Todo, TodoItemProps } from '@/types/todoTypes';
import { formatDate } from '@/utils/dateUtils';

// Return type is string (classes) or null (no badge)
const getPriorityBadgeClasses = (priority: PriorityLevel | null): string | null => {
	if (priority === null) {
		// No specific classes if priority is null
		return null;
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
export function TodoItem({
	todo,
	onToggle,
	onDelete,
	onSave,
	isEditing, // Receive isEditing from props
	onSetEditing, // Receive onSetEditing from props
}: TodoItemProps) {
	const handleToggle = () => {
		onToggle(todo.id);
	};

	const handleDelete = () => {
		onDelete(todo.id);
	};

	const handleEdit = () => {
		onSetEditing(todo.id); // Call prop function to set this ID as editing
	};

	const handleCancelEdit = () => {
		onSetEditing(null); // Call prop function to clear editing ID
	};

	const handleSaveEdit = (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
		onSave(id, updates);
		onSetEditing(null); // Call prop function to clear editing ID after save
	};

	// Determine badge classes based on priority, handling null/undefined
	const badgeClasses = getPriorityBadgeClasses(todo.priority ?? null);

	return (
		<>
			{isEditing ? (
				<li className="py-2 border-b border-gray-100 last:border-0 bg-slate-50 shadow-sm rounded-xl">
					<EditTodoForm initialData={todo} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
				</li>
			) : (
				<li
					className="py-2 flex flex-col gap-1 border-b border-gray-100 last:border-0 hover:bg-slate-50 hover:border-blue-100 hover:shadow-sm transition-all duration-150 rounded-xl group cursor-pointer"
					aria-labelledby={`todo-title-${todo.id}`}
					role="listitem"
					data-testid={`todo-item-${todo.id}`}
					onClick={handleEdit}
				>
					<div className="flex items-center gap-2 w-full px-2">
						<input
							type="checkbox"
							checked={todo.completed}
							onChange={e => {
								e.stopPropagation();
								handleToggle();
							}}
							className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer"
							aria-labelledby={`todo-title-${todo.id}`}
							onClick={e => e.stopPropagation()}
						/>
						<div className="flex-1 flex flex-col text-sm py-1 cursor-default">
							<div className="flex items-center gap-2 flex-wrap">
								<span
									id={`todo-title-${todo.id}`}
									className={`${todo.completed ? 'text-gray-500 line-through' : ''}`}
								>
									{todo.title}
								</span>

								{/* Display Priority Badge */}
								{badgeClasses && (
									<Badge className={`px-1.5 py-0.5 text-xs font-medium ${badgeClasses}`}>
										{todo.priority}
									</Badge>
								)}
							</div>
							{/* Display description snippet if it exists */}
							{/* Display description if it exists */}
							{/* We might display a snippet here if needed, or just in edit mode */}
							{/* Display due date if it exists */}
							{todo.dueDate && (
								<span className="text-xs text-muted-foreground mt-1">
									Due: {formatDate(todo.dueDate)}
								</span>
							)}
						</div>
						{/* Action Buttons */}
						<div className="flex items-center">
							<Button
								variant="ghost"
								size="icon"
								onClick={e => {
									e.stopPropagation();
									handleEdit();
								}}
								aria-label={`Edit todo: ${todo.title}`}
								className="h-7 w-7 text-muted-foreground hover:text-blue-600 cursor-pointer"
							>
								<Pencil className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={e => {
									e.stopPropagation();
									handleDelete();
								}}
								aria-label={`Delete todo: ${todo.title}`}
								className="h-7 w-7 text-muted-foreground hover:text-red-600 cursor-pointer"
							>
								<Trash className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</li>
			)}
		</>
	);
}
