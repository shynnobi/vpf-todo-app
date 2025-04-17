import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AddTodoFormProps } from '@/types/todoTypes';

/**
 * A form component for adding new todos
 */
export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
	const [title, setTitle] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Don't submit if the title is empty
		if (!title.trim()) return;

		// Call the callback with the new todo
		onAddTodo({ title });

		// Clear the input field
		setTitle('');
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex gap-2 mb-4"
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
			<Button type="submit" variant="default">
				Add
			</Button>
		</form>
	);
}
