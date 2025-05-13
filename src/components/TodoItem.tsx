import { Pencil, Trash } from 'lucide-react';

import { EditTodoForm } from './EditTodoForm';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PriorityLevel, Todo, TodoItemProps } from '@/types/todoTypes';
import { formatDate } from '@/utils/dateUtils';

/**
 * Determines the CSS classes for priority badges based on priority level
 *
 * @param priority - The priority level of the todo
 * @returns A string containing CSS classes for the badge or null if no priority
 */
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
 * TodoItem component that renders a single todo with its details and actions
 *
 * Features:
 * - Display todo title, priority badge, and due date
 * - Toggle completion status with checkbox
 * - Edit todo with inline form
 * - Delete todo
 * - Visual indicators for completed todos
 *
 * @param todo - The todo item to display
 * @param onToggle - Callback function for toggling completion status
 * @param onDelete - Callback function for deleting the todo
 * @param onSave - Callback function for saving updates to the todo
 * @param isEditing - Whether the todo is currently in edit mode
 * @param onSetEditing - Callback to set which todo is being edited
 */
export function TodoItem({
	todo,
	onToggle,
	onDelete,
	onSave,
	isEditing,
	onSetEditing,
}: TodoItemProps) {
	/**
	 * Toggles the completion status of the todo
	 */
	const handleToggle = () => {
		onToggle(todo.id);
	};

	/**
	 * Deletes the todo
	 */
	const handleDelete = () => {
		onDelete(todo.id);
	};

	/**
	 * Puts the todo into edit mode
	 */
	const handleEdit = () => {
		onSetEditing(todo.id);
	};

	/**
	 * Cancels editing mode without saving changes
	 */
	const handleCancelEdit = () => {
		onSetEditing(null);
	};

	/**
	 * Saves changes to the todo and exits edit mode
	 *
	 * @param id - ID of the todo being edited
	 * @param updates - Object containing the updated properties
	 */
	const handleSaveEdit = (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
		onSave(id, updates);
		onSetEditing(null);
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
				>
					<div className="flex items-center gap-3 w-full px-2">
						<Checkbox
							id={`checkbox-${todo.id}`}
							checked={todo.completed}
							onCheckedChange={checked => {
								if (typeof checked === 'boolean') {
									handleToggle();
								}
							}}
							aria-labelledby={`todo-title-${todo.id}`}
							onClick={e => e.stopPropagation()}
							className="cursor-pointer"
						/>
						<div className="flex-1 flex flex-col text-sm py-1 cursor-pointer" onClick={handleEdit}>
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
