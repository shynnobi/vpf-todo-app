import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarClock, Image, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PriorityPicker } from '@/components/ui/PriorityPicker';
import { AddTodoFormProps, CreateTodoParams, PriorityLevel } from '@/types/todoTypes';

/**
 * A form component for adding new todos, including priority selection and due date.
 */
export function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
	const [title, setTitle] = useState('');
	const [priority, setPriority] = useState<PriorityLevel | null>(null);
	const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) return;

		const newTodoParams: CreateTodoParams = {
			title: title.trim(),
			priority: priority,
			dueDate: dueDate ? dueDate.toISOString() : undefined,
		};

		onAddTodo(newTodoParams);

		setTitle('');
		setPriority(null);
		setDueDate(undefined);
	};

	const handlePrioritySelect = (selectedPriority: PriorityLevel | null) => {
		setPriority(selectedPriority);
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
				className="flex h-10 w-full rounded-md border-2 border-amber-200 dark:border-blue-300 bg-background dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
				aria-label="Todo title"
			/>

			<div className="flex gap-2 w-full justify-end">
				<Button variant="outline" className="cursor-pointer">
					<Image />
				</Button>
				<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="cursor-pointer w-[160px] justify-start text-left font-normal"
							aria-label="Open calendar to select due date"
						>
							<CalendarClock className="mr-2 h-4 w-4" />
							{dueDate ? format(dueDate, 'PPP') : <span>Due date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={dueDate}
							onSelect={date => {
								setDueDate(date);
								setIsCalendarOpen(false);
							}}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
				<PriorityPicker
					value={priority}
					onPriorityChange={handlePrioritySelect}
					ariaLabel="Select priority for new task"
				/>
				<Button type="submit" variant="default" className="flex items-center gap-1 cursor-pointer">
					<Plus className="h-4 w-4" /> <span className="mr-1">Add</span>
				</Button>
			</div>
		</form>
	);
}
