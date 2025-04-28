import { ChangeEvent, FormEvent, useState } from 'react';
import { formatISO, isValid, parseISO } from 'date-fns';
import { Save, X } from 'lucide-react';

import { DueDatePicker } from '@/components/DueDatePicker';
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
	const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(() => {
		const initialDate = initialData.dueDate ? parseISO(initialData.dueDate) : undefined;
		return initialDate && isValid(initialDate) ? initialDate : undefined;
	});
	const [editedPriority, setEditedPriority] = useState<PriorityLevel | null>(
		initialData.priority ?? null
	);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const updates: Partial<Omit<Todo, 'id'>> = {
			title: editedTitle,
			description: editedDescription || undefined,
			dueDate: editedDueDate ? formatISO(editedDueDate) : undefined,
			priority: editedPriority,
		};
		onSave(initialData.id, updates);
	};

	const handlePrioritySelect = (selectedPriority: PriorityLevel | null) => {
		setEditedPriority(selectedPriority);
	};

	const handleDateChange = (date?: Date) => {
		setEditedDueDate(date);
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
			<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
				{/* Due Date Picker */}
				<div className="w-full sm:w-auto">
					<DueDatePicker value={editedDueDate} onChange={handleDateChange} />
				</div>

				{/* Priority Dropdown */}
				<div className="w-full sm:w-auto">
					<PriorityPicker
						value={editedPriority}
						onPriorityChange={handlePrioritySelect}
						ariaLabel="Select priority for this task"
					/>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="mt-4 flex justify-end space-x-2">
				<Button
					type="button"
					variant="ghost"
					onClick={onCancel}
					className="cursor-pointer text-gray-600"
					size="sm"
				>
					<X /> Cancel
				</Button>
				<Button type="submit" size="sm" className="cursor-pointer">
					<Save />
					Save Changes
				</Button>
			</div>
		</form>
	);
}
