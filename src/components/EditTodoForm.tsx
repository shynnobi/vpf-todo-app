import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { formatISO, isValid, parseISO } from 'date-fns';
import { Calendar, CalendarPlus, Flame, History, Save, X } from 'lucide-react';

import { PriorityPicker } from '@/components/PriorityPicker';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
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
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

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
			className="flex flex-col w-full border rounded-md bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm"
			data-testid="edit-todo-form"
		>
			{/* Main Content Area */}
			<div className="flex flex-col w-full">
				{/* Title Input */}
				<div className="p-4 border-b border-gray-200 dark:border-slate-700">
					<label
						htmlFor={`edit-title-${initialData.id}`}
						className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
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
						className="w-full text-sm border border-gray-300 dark:border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-hidden min-h-[44px] dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400"
						autoFocus
						onKeyDown={e => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
							}
						}}
					/>
				</div>

				{/* Description Textarea */}
				<div className="p-4 border-b border-gray-200 dark:border-slate-700">
					<label
						htmlFor={`edit-desc-${initialData.id}`}
						className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
					>
						Description
					</label>
					<textarea
						id={`edit-desc-${initialData.id}`}
						value={editedDescription}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditedDescription(e.target.value)}
						placeholder="Add a description..."
						rows={5}
						aria-label="Edit description"
						className="w-full text-sm border border-gray-300 dark:border-slate-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400"
					/>
				</div>

				{/* Controls Section - Metadata */}
				<div className="p-4 bg-slate-100 dark:bg-slate-900 space-y-5">
					{/* Due Date and Priority in a flex container on medium+ screens */}
					<div className="flex flex-col sm:flex-row sm:gap-4">
						{/* Due Date Picker */}
						<div className="mb-5 sm:mb-0 sm:flex-1">
							<label className="flex items-center text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
								<Calendar className="h-4 w-4 mr-1" />
								Due Date
							</label>
							<div className="flex items-end">
								<DatePicker
									key={editedDueDate ? editedDueDate.toISOString() : 'no-date'}
									value={editedDueDate}
									onChange={handleDateChange}
									placeholder="Due date"
									className={editedDueDate ? 'rounded-r-none' : ''}
								/>
								{editedDueDate && (
									<Button
										size="icon"
										aria-label="Clear due date"
										onClick={() => setEditedDueDate(undefined)}
										className="h-9 w-9 p-2 rounded-l-none  bg-black text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>

						{/* Priority Dropdown */}
						<div className="sm:flex-1">
							<label className="flex items-center text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
								<Flame className="h-4 w-4 mr-1" />
								Priority
							</label>
							<div className="flex items-end">
								<PriorityPicker
									value={editedPriority}
									onPriorityChange={handlePrioritySelect}
									ariaLabel="Select priority for this task"
									className={editedPriority !== null ? 'rounded-r-none' : ''}
								/>
								{editedPriority !== null && (
									<Button
										size="icon"
										aria-label="Clear priority"
										onClick={() => setEditedPriority(null)}
										className="h-9 w-9 p-2 rounded-l-none bg-black text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>
					</div>

					{/* Creation and Modified Date Info */}
					<div className="pt-4 border-t border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:gap-4">
						{/* Creation Date (Read-only) */}
						<div className="mb-2 sm:mb-0">
							<label className="flex items-center text-xs font-medium text-muted-foreground mb-1">
								<CalendarPlus className="h-3 w-3 mr-1" />
								Created
							</label>
							<div className="text-xs text-muted-foreground">
								{formatDate(initialData.creationDate)}
							</div>
						</div>

						{/* Last Modified Date (if available) */}
						{initialData.lastModified && (
							<div>
								<label className="flex items-center text-xs font-medium text-muted-foreground mb-1">
									<History className="h-3 w-3 mr-1" />
									Last Modified
								</label>
								<div className="text-xs text-muted-foreground">
									{formatDate(initialData.lastModified)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Footer with Actions */}
			<div className="border-t border-gray-200 dark:border-slate-700 p-4 bg-slate-100 dark:bg-slate-900 flex justify-end gap-3">
				<Button
					type="button"
					variant="ghost"
					onClick={onCancel}
					className="h-10 px-4 cursor-pointer text-gray-600 dark:text-slate-400"
				>
					<X className="mr-1 h-4 w-4" /> Cancel
				</Button>
				<Button type="submit" className="h-10 px-4 cursor-pointer">
					<Save className="mr-1 h-4 w-4" />
					Save Changes
				</Button>
			</div>
		</form>
	);
}
