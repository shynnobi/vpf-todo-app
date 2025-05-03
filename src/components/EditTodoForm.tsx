import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { formatISO, isValid, parseISO } from 'date-fns';
import { Calendar, Clock, Save, Tag, X } from 'lucide-react';

import { DueDatePicker } from '@/components/DueDatePicker';
import { Button } from '@/components/ui/button';
import { PriorityPicker } from '@/components/ui/PriorityPicker';
import { PriorityLevel, Todo } from '@/types/todoTypes';
import { formatDate } from '@/utils/dateUtils';

type EditTodoFormProps = {
	initialData: Pick<
		Todo,
		'id' | 'title' | 'description' | 'dueDate' | 'priority' | 'creationDate' | 'lastModified'
	>;
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

	// Refs for auto-resizing textareas
	const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize title textarea
	const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
		if (!textarea) return;

		// Reset height to get the correct scrollHeight
		textarea.style.height = 'auto';

		// Set the height to match content
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	// Adjust heights on initial render and when content changes
	useEffect(() => {
		adjustTextareaHeight(titleTextareaRef.current);
	}, [editedTitle]);

	const handleTitleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setEditedTitle(e.target.value);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const updates: Partial<Omit<Todo, 'id'>> = {
			title: editedTitle,
			description: editedDescription || undefined,
			dueDate: editedDueDate ? formatISO(editedDueDate) : undefined,
			priority: editedPriority,
			lastModified: new Date().toISOString(),
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
			className="flex flex-col w-full border rounded-md bg-background shadow-sm"
		>
			{/* Main Content Area */}
			<div className="flex flex-col md:flex-row w-full">
				{/* Left Column (Main Content) */}
				<div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200">
					{/* Title Input - replaced with auto-resizing textarea */}
					<div className="mb-4">
						<label
							htmlFor={`edit-title-${initialData.id}`}
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Title
						</label>
						<textarea
							ref={titleTextareaRef}
							id={`edit-title-${initialData.id}`}
							value={editedTitle}
							onChange={handleTitleChange}
							rows={1}
							aria-label="Edit title"
							className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-hidden"
							autoFocus
							onKeyDown={e => {
								// Prevent Enter from creating new lines in title
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
								}
							}}
						/>
					</div>

					{/* Description Textarea */}
					<div>
						<label
							htmlFor={`edit-desc-${initialData.id}`}
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Description
						</label>
						<textarea
							id={`edit-desc-${initialData.id}`}
							value={editedDescription}
							onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
								setEditedDescription(e.target.value)
							}
							placeholder="Add a description..."
							rows={5}
							aria-label="Edit description"
							className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>

				{/* Right Column (Sidebar / Metadata) */}
				<div className="w-full md:w-64 p-4 bg-gray-50 space-y-4">
					{/* Due Date Picker */}
					<div>
						<label className="flex items-center text-sm font-medium text-gray-700 mb-1">
							<Calendar className="h-4 w-4 mr-1" />
							Due Date
						</label>
						<DueDatePicker
							key={editedDueDate ? editedDueDate.toISOString() : 'no-date'}
							value={editedDueDate}
							onChange={handleDateChange}
						/>
					</div>

					{/* Priority Dropdown */}
					<div>
						<label className="flex items-center text-sm font-medium text-gray-700 mb-1">
							<Tag className="h-4 w-4 mr-1" />
							Priority
						</label>
						<PriorityPicker
							value={editedPriority}
							onPriorityChange={handlePrioritySelect}
							ariaLabel="Select priority for this task"
						/>
					</div>

					{/* Creation Date (Read-only) */}
					<div className="pt-4 border-t border-gray-200">
						<label className="flex items-center text-sm font-medium text-gray-700 mb-1">
							<Clock className="h-4 w-4 mr-1" />
							Created
						</label>
						<div className="text-sm text-gray-500">{formatDate(initialData.creationDate)}</div>
					</div>

					{/* Last Modified Date (if available) */}
					{initialData.lastModified && (
						<div>
							<label className="flex items-center text-sm font-medium text-gray-700 mb-1">
								<Clock className="h-4 w-4 mr-1" />
								Last Modified
							</label>
							<div className="text-sm text-gray-500">{formatDate(initialData.lastModified)}</div>
						</div>
					)}
				</div>
			</div>

			{/* Footer with Actions */}
			<div className="border-t border-gray-200 p-3 bg-gray-50 flex justify-end space-x-2">
				<Button
					type="button"
					variant="ghost"
					onClick={onCancel}
					className="cursor-pointer text-gray-600"
					size="sm"
				>
					<X className="mr-1 h-4 w-4" /> Cancel
				</Button>
				<Button type="submit" size="sm" className="cursor-pointer">
					<Save className="mr-1 h-4 w-4" />
					Save Changes
				</Button>
			</div>
		</form>
	);
}
