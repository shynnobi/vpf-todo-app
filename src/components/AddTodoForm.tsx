import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

import { NewDueDatePicker } from './NewDueDatePicker';

import { Button } from '@/components/ui/button';
import { PriorityPicker } from '@/components/ui/PriorityPicker';
import { AddTodoFormProps, CreateTodoParams, PriorityLevel } from '@/types/todoTypes';

/**
 * A form component for adding new todos, including priority selection and due date.
 */
export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
	const [title, setTitle] = useState('');
	const [priority, setPriority] = useState<PriorityLevel | null>(null);
	const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		const newTodoParams: CreateTodoParams = {
			title: title.trim(),
			priority: priority,
			dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
		};

		onAddTodo(newTodoParams);

		setTitle('');
		setPriority(null);
		setDueDate(undefined);
	};

	const handlePrioritySelect = (selectedPriority: PriorityLevel | null) => {
		setPriority(selectedPriority);
	};

	const handleDateChange = (date?: Date) => {
		setDueDate(date);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center gap-3 mb-8 p-3 bg-amber-100 dark:bg-blue-800 rounded-md border-2 border-amber-200 dark:border-blue-900 shadow-md"
			aria-label="Add todo form"
			role="form"
		>
			<input
				type="text"
				value={title}
				onChange={e => setTitle(e.target.value)}
				placeholder="What's on your mind?"
				className="flex h-10 w-full rounded-md border-2 border-amber-200 dark:border-blue-300 bg-background dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
				aria-label="Todo title"
				aria-required="true"
				autoFocus
				id="new-todo-title"
			/>

			<div className="flex flex-wrap gap-2 w-full justify-end" aria-label="Additional options">
				<NewDueDatePicker value={dueDate} onChange={handleDateChange} />
				<PriorityPicker
					value={priority}
					onPriorityChange={handlePrioritySelect}
					ariaLabel="Select priority for new task"
				/>
				<Button
					type="submit"
					variant="default"
					className="flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
					aria-label="Add new todo"
					disabled={!title.trim()}
				>
					<Plus className="h-4 w-4" aria-hidden="true" /> <span className="mr-1">Add</span>
				</Button>
			</div>
		</form>
	);
}
