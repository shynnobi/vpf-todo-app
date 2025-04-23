import { ChangeEvent, FormEvent, useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PriorityPicker } from '@/components/ui/PriorityPicker';
import { PriorityLevel, Todo } from '@/types/todoTypes';

type EditTodoFormProps = {
	initialData: Pick<Todo, 'id' | 'title' | 'description' | 'dueDate' | 'priority'>;
	onSave: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void;
	onCancel: () => void;
};

export function EditTodoForm({ initialData, onSave, onCancel }: EditTodoFormProps) {
	const [editedTitle, setEditedTitle] = useState(initialData.title);
	const [editedDescription, setEditedDescription] = useState(initialData.description ?? '');
	const [editedDueDate, setEditedDueDate] = useState(initialData.dueDate ?? '');
	const [editedPriority, setEditedPriority] = useState<PriorityLevel | null>(initialData.priority);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const updates: Partial<Omit<Todo, 'id'>> = {
			title: editedTitle,
			description: editedDescription || undefined,
			dueDate: editedDueDate || undefined,
			priority: editedPriority,
		};
		onSave(initialData.id, updates);
	};

	const handlePrioritySelect = (selectedPriority: PriorityLevel | null) => {
		setEditedPriority(selectedPriority);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-2 w-full p-2 border rounded-md bg-background shadow-sm"
		>
			{/* Title Input */}
			<div>
				<label htmlFor={`edit-title-${initialData.id}`} className="sr-only">
					Edit title
				</label>
				<input
					id={`edit-title-${initialData.id}`}
					type="text"
					value={editedTitle}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedTitle(e.target.value)}
					aria-label="Edit title"
					className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
					autoFocus
				/>
			</div>

			{/* Description Textarea */}
			<div>
				<label htmlFor={`edit-desc-${initialData.id}`} className="sr-only">
					Edit description
				</label>
				<textarea
					id={`edit-desc-${initialData.id}`}
					value={editedDescription}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditedDescription(e.target.value)}
					placeholder="Add a description..."
					rows={3}
					aria-label="Edit description"
					className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			{/* Due Date and Priority Row */}
			<div className="flex items-center gap-4">
				{/* Due Date Input */}
				<div className="relative">
					<label htmlFor={`edit-date-${initialData.id}`} className="text-xs text-gray-600 mr-1">
						Due Date
					</label>
					<input
						id={`edit-date-${initialData.id}`}
						type="date"
						value={editedDueDate}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedDueDate(e.target.value)}
						className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
					/>
					{editedDueDate && (
						<button
							type="button"
							onClick={() => setEditedDueDate('')}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive cursor-pointer"
							aria-label="Clear due date"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				{/* Priority Dropdown */}
				<div>
					{/* <label className="text-xs text-gray-600 mr-1">Priority</label> */}
					<PriorityPicker
						value={editedPriority}
						onPriorityChange={handlePrioritySelect}
						ariaLabel="Select priority for this task"
					/>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="mt-4 flex justify-end space-x-2">
				<button
					type="button"
					onClick={onCancel}
					className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
				>
					Cancel
				</button>
				<Button type="submit" size="sm">
					Save Changes
				</Button>
			</div>
		</form>
	);
}
