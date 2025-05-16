import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, X } from 'lucide-react';

import { PriorityPicker } from '@/components/PriorityPicker';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
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

			<div
				className="flex flex-wrap gap-2 w-full justify-end items-end"
				aria-label="Additional options"
			>
				<div className="flex items-end">
					<DatePicker
						value={dueDate}
						onChange={setDueDate}
						placeholder="Due date"
						className={dueDate ? 'rounded-r-none' : ''}
					/>
					{dueDate && (
						<Button
							size="icon"
							aria-label="Clear due date"
							onClick={() => setDueDate(undefined)}
							className="h-9 w-9 p-2 rounded-l-none bg-yellow-600 text-white hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer dark:bg-blue-500 dark:hover:bg-blue-400"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>

				<div className="flex items-end">
					<PriorityPicker
						value={priority}
						onPriorityChange={setPriority}
						ariaLabel="Select priority for new task"
						placeholderLabel="Priority"
						className={priority !== null ? 'rounded-r-none' : ''}
					/>
					{priority !== null && (
						<Button
							size="icon"
							aria-label="Clear priority"
							onClick={() => setPriority(null)}
							className="h-9 w-9 p-2 rounded-l-none bg-yellow-600 text-white hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer dark:bg-blue-500 dark:hover:bg-blue-400"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>

				<Button
					type="submit"
					variant="default"
					className="flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 self-end"
					aria-label="Add new todo"
					disabled={!title.trim()}
				>
					<Plus className="h-4 w-4" aria-hidden="true" /> <span className="mr-1">Add</span>
				</Button>
			</div>
		</form>
	);
}
