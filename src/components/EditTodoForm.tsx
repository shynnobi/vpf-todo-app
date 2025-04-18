import { ChangeEvent, FormEvent, useState } from 'react';

import { Todo } from '@/types/todoTypes';

type EditTodoFormProps = {
	initialData: Pick<Todo, 'id' | 'title' | 'description' | 'dueDate'>; // Include id for context if needed
	onSave: (id: string, updates: Partial<Omit<Todo, 'title' | 'description' | 'dueDate'>>) => void;
	onCancel: () => void;
};

export function EditTodoForm({ initialData, onSave, onCancel }: EditTodoFormProps) {
	const [editedTitle, setEditedTitle] = useState(initialData.title);
	const [editedDescription, setEditedDescription] = useState(initialData.description ?? '');
	const [editedDueDate, setEditedDueDate] = useState(initialData.dueDate ?? '');

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Consolidate updates, only include fields that changed if necessary, or send all
		const updates: Partial<Omit<Todo, 'id'>> = {
			title: editedTitle,
			description: editedDescription || undefined, // Send undefined if empty
			dueDate: editedDueDate || undefined, // Send undefined if empty
		};
		onSave(initialData.id, updates);
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
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
					aria-label="Edit title" // Keep aria-label for tests
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
					aria-label="Edit description" // Keep aria-label for tests
					className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			{/* Due Date Input */}
			<div>
				<label htmlFor={`edit-date-${initialData.id}`} className="text-xs text-gray-600 mr-2">
					Edit due date
				</label>
				<input
					id={`edit-date-${initialData.id}`}
					type="date"
					value={editedDueDate}
					onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedDueDate(e.target.value)}
					className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-end gap-2 mt-2">
				<button
					type="submit"
					className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
					aria-label="Save changes"
				>
					Save
				</button>
				<button
					type="button" // Important: type="button" to prevent form submission
					onClick={onCancel}
					className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
					aria-label="Cancel edit"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}
