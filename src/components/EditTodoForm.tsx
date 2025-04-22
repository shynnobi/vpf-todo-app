import { ChangeEvent, FormEvent, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

	const getPriorityButtonText = () => {
		if (editedPriority === null) {
			return 'Priority';
		}
		return capitalize(editedPriority);
	};

	const handlePriorityChange = (value: string) => {
		if (value === 'null') {
			setEditedPriority(null);
		} else {
			setEditedPriority(value as PriorityLevel);
		}
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
				<div>
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
				</div>

				{/* Priority Dropdown - Added */}
				<div>
					<label className="text-xs text-gray-600 mr-1">Priority</label>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="flex items-center gap-1 px-3 py-1 h-auto text-sm"
								aria-label="Edit priority"
							>
								{getPriorityButtonText()}
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-40">
							<DropdownMenuRadioGroup
								value={editedPriority === null ? 'null' : editedPriority}
								onValueChange={handlePriorityChange}
							>
								<DropdownMenuRadioItem value="null">None</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
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
					type="button"
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
