import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddTodoFormProps, CreateTodoParams, PriorityLevel } from '@/types/todoTypes';

/**
 * A form component for adding new todos, including priority selection.
 */
export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
	const [title, setTitle] = useState('');
	const [priority, setPriority] = useState<PriorityLevel>('medium');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		const newTodoParams: CreateTodoParams = {
			title: title.trim(),
			priority: priority,
		};

		onAddTodo(newTodoParams);

		setTitle('');
		setPriority('medium');
	};

	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="flex items-center gap-1 px-3">
						{capitalize(priority)}
						<ChevronDown className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-40">
					<DropdownMenuRadioGroup
						value={priority}
						onValueChange={(value: string) => setPriority(value as PriorityLevel)}
					>
						<DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<Button type="submit" variant="default" className="px-4">
				Add
			</Button>
		</form>
	);
}
