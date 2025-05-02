import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Pencil } from 'lucide-react';

import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { PriorityPicker } from './ui/PriorityPicker';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { PriorityLevel, Todo } from '@/types/todoTypes';
import { formatDate } from '@/utils/dateUtils';

interface TodoDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	todo: Todo;
	onSave: (updatedTodo: Todo) => void;
	initialEditMode?: boolean;
}

export const TodoDetailModal = ({
	isOpen,
	onClose,
	todo,
	onSave,
	initialEditMode = false,
}: TodoDetailModalProps) => {
	const [isEditing, setIsEditing] = useState(initialEditMode);
	const [formData, setFormData] = useState(todo);
	const [date, setDate] = useState<Date | undefined>(
		todo.dueDate ? new Date(todo.dueDate) : undefined
	);

	// Reset form when modal is opened or todo changes
	useEffect(() => {
		setFormData(todo);
		setDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
		setIsEditing(initialEditMode);
	}, [todo, isOpen, initialEditMode]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setFormData(todo);
		setDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
	};

	const handleSave = () => {
		onSave({
			...formData,
			dueDate: date?.toISOString() || null,
		});
		setIsEditing(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handlePriorityChange = (priority: PriorityLevel | null) => {
		setFormData({
			...formData,
			priority,
		});
	};

	if (!isOpen) return null;

	return (
		<Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{isEditing ? 'Edit Task' : 'Task Details'}</DialogTitle>
					<DialogDescription>
						{isEditing
							? 'Modify the task information in the form below.'
							: 'View all details of the task.'}
					</DialogDescription>
				</DialogHeader>

				{isEditing ? (
					// Edit mode
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<label htmlFor="title" className="text-sm font-medium">
								Title
							</label>
							<Input
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								placeholder="Task title"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="description" className="text-sm font-medium">
								Description
							</label>
							<Textarea
								id="description"
								name="description"
								value={formData.description || ''}
								onChange={handleChange}
								placeholder="Task description"
								className="min-h-24"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Priority</label>
							<PriorityPicker
								value={formData.priority || null}
								onPriorityChange={handlePriorityChange}
								className="w-full"
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">Due Date</label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											'w-full justify-start text-left font-normal cursor-pointer',
											!date && 'text-muted-foreground'
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{date ? format(date, 'PPP') : <span>Select a date</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
								</PopoverContent>
							</Popover>
						</div>
					</div>
				) : (
					// View mode
					<div className="space-y-4 py-4">
						<div>
							<h3 className="text-lg font-semibold">{todo.title}</h3>
						</div>

						{todo.description && (
							<div className="mt-2">
								<p className="text-sm text-gray-700 whitespace-pre-wrap">{todo.description}</p>
							</div>
						)}

						<div className="flex flex-wrap gap-3 mt-4">
							{todo.priority && (
								<div className="flex items-center gap-2">
									<span className="text-xs font-medium text-gray-500">Priority:</span>
									<Badge variant="outline" className="text-xs">
										{todo.priority === 'high'
											? 'High'
											: todo.priority === 'medium'
												? 'Medium'
												: 'Low'}
									</Badge>
								</div>
							)}

							{todo.dueDate && (
								<div className="flex items-center gap-2">
									<span className="text-xs font-medium text-gray-500">Due date:</span>
									<Badge variant="outline" className="text-xs">
										{formatDate(todo.dueDate)}
									</Badge>
								</div>
							)}

							<div className="flex items-center gap-2">
								<span className="text-xs font-medium text-gray-500">Status:</span>
								<Badge variant={todo.completed ? 'default' : 'secondary'} className="text-xs">
									{todo.completed ? 'Completed' : 'In progress'}
								</Badge>
							</div>
						</div>
					</div>
				)}

				<DialogFooter className="pt-4">
					{isEditing ? (
						<>
							<Button variant="outline" onClick={handleCancel} className="cursor-pointer">
								Cancel
							</Button>
							<Button onClick={handleSave} className="cursor-pointer">
								Save
							</Button>
						</>
					) : (
						<>
							<Button variant="outline" onClick={onClose} className="cursor-pointer">
								Close
							</Button>
							<Button
								variant="default"
								onClick={handleEdit}
								className="flex items-center gap-1 cursor-pointer"
							>
								<Pencil className="h-4 w-4 mr-1" /> Edit
							</Button>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
