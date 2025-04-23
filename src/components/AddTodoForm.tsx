import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PriorityPicker } from '@/components/ui/PriorityPicker';
import { AddTodoFormProps, CreateTodoParams, PriorityLevel } from '@/types/todoTypes';

/**
 * A form component for adding new todos, including priority selection.
 */
export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
	const [title, setTitle] = useState('');
	const [priority, setPriority] = useState<PriorityLevel | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		const newTodoParams: CreateTodoParams = {
			title: title.trim(),
			priority: priority,
		};

		onAddTodo(newTodoParams);

		setTitle('');
		setPriority(null);
	};

	const handlePrioritySelect = (selectedPriority: PriorityLevel | null) => {
		setPriority(selectedPriority);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex items-center gap-2 mb-4"
			aria-label="Add todo form"
			role="form"
		>
			<input
				type="text"
				value={title}
				onChange={e => setTitle(e.target.value)}
				placeholder="Add a new todo"
				className="flex-1 text-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
				aria-label="Todo title"
			/>

			<PriorityPicker
				value={priority}
				onPriorityChange={handlePrioritySelect}
				ariaLabel="Select priority for new task"
			/>

			<Button type="submit" variant="default" className="flex items-center gap-1 cursor-pointer">
				<Plus className="h-4 w-4" /> <span className="mr-1">Add</span>
			</Button>
		</form>
	);
}
