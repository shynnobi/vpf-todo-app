import { useState } from 'react';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, fireEvent, userEvent, within } from '@storybook/test';

import { TodoItem } from './TodoItem';

import { PriorityLevel, Todo } from '@/types/todoTypes';

const meta: Meta<typeof TodoItem> = {
	title: 'Todo/TodoItem',
	component: TodoItem,
	tags: ['autodocs'],
	argTypes: {
		todo: { control: 'object' },
		onToggle: { action: 'toggled' },
		onDelete: { action: 'deleted' },
		onSave: { action: 'saved' },
	},
	decorators: [
		(Story: () => React.ReactNode) => (
			<ul className="w-80 border rounded-md p-2 list-none m-0">
				<Story />
			</ul>
		),
	],
	args: {
		onToggle: fn(),
		onDelete: fn(),
		onSave: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		todo: {
			id: '1',
			title: 'Default Todo Item',
			completed: false,
			description: 'This is a default todo item',
			dueDate: undefined,
			priority: 'medium',
		},
	},
};

export const Completed: Story = {
	args: {
		todo: {
			id: '2',
			title: 'Completed Todo Item',
			completed: true,
			description: 'This task is done!',
			dueDate: new Date().toISOString(),
			priority: 'low',
		},
	},
};

export const Minimal: Story = {
	args: {
		todo: {
			id: '4',
			title: 'Minimal Todo (No Desc/Date)',
			completed: false,
			priority: 'medium',
		},
	},
};

export const NoPriority: Story = {
	args: {
		todo: {
			id: '5',
			title: 'Task Without Priority',
			completed: false,
			description: 'This task has null priority.',
			dueDate: undefined,
			priority: null,
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.queryByText('high')).not.toBeInTheDocument();
		await expect(canvas.queryByText('medium')).not.toBeInTheDocument();
		await expect(canvas.queryByText('low')).not.toBeInTheDocument();
	},
};

export const Interactive: Story = {
	render: args => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [interactiveTodo, setInteractiveTodo] = useState<Todo>(args.todo);

		const handleToggle = (id: string) => {
			args.onToggle(id);
			setInteractiveTodo(prev => ({ ...prev, completed: !prev.completed }));
		};

		const handleDelete = (id: string) => {
			args.onDelete(id);
			console.log('Delete action triggered in Storybook for ID:', id);
		};

		const handleSave = (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
			args.onSave(id, updates);
			setInteractiveTodo(prev => ({ ...prev, ...updates }));
		};

		return (
			<TodoItem
				todo={interactiveTodo}
				onToggle={handleToggle}
				onDelete={handleDelete}
				onSave={handleSave}
			/>
		);
	},
	args: {
		todo: {
			id: '3',
			title: 'Interactive Todo',
			completed: false,
			description: 'Try editing me!',
			priority: 'high',
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		const checkbox = canvas.getByRole('checkbox');
		await expect(checkbox).not.toBeChecked();
		await userEvent.click(checkbox);
		await expect(checkbox).toBeChecked();
		await expect(args.onToggle).toHaveBeenCalledTimes(1);
		await userEvent.click(checkbox);
		await expect(args.onToggle).toHaveBeenCalledTimes(2);

		const editButton = canvas.getByRole('button', { name: /edit todo/i });
		await userEvent.click(editButton);

		const titleInput = canvas.getByRole('textbox', { name: /edit title/i });
		const descriptionInput = canvas.getByRole('textbox', { name: /edit description/i });
		const dueDateInput = canvas.getByLabelText(/edit due date/i);
		const priorityButton = canvas.getByRole('button', { name: /priority/i });

		await expect(priorityButton).toHaveTextContent('High');

		const newTitle = 'Updated Title via Play';
		const newDescription = 'Updated description via Play';
		const newDueDate = '2025-11-22';
		const newPriority: PriorityLevel = 'low';

		await userEvent.clear(titleInput);
		await userEvent.type(titleInput, newTitle);
		await userEvent.clear(descriptionInput);
		await userEvent.type(descriptionInput, newDescription);
		await fireEvent.change(dueDateInput, { target: { value: newDueDate } });

		await userEvent.click(priorityButton);
		const lowOption = await canvas.findByRole('radio', { name: /low/i });
		await userEvent.click(lowOption);
		await expect(priorityButton).toHaveTextContent('Low');

		const saveButton = canvas.getByRole('button', { name: /save changes/i });
		await userEvent.click(saveButton);

		await expect(canvas.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();
		await expect(canvas.getByText(newTitle)).toBeInTheDocument();
		await expect(canvas.getByText(newDescription)).toBeInTheDocument();
		await expect(
			canvas.getByText(`Due: ${new Date(newDueDate).toLocaleDateString()}`)
		).toBeInTheDocument();
		await expect(canvas.getByText(newPriority)).toBeInTheDocument();

		await expect(args.onSave).toHaveBeenCalledTimes(1);
		await expect(args.onSave).toHaveBeenCalledWith(args.todo?.id, {
			title: newTitle,
			description: newDescription,
			dueDate: newDueDate,
			priority: newPriority,
		});

		await userEvent.click(canvas.getByRole('button', { name: /edit todo/i }));
		const priorityButtonAgain = canvas.getByRole('button', { name: /priority/i });
		await userEvent.click(priorityButtonAgain);
		const noneOption = await canvas.findByRole('radio', { name: /none/i });
		await userEvent.click(noneOption);
		await expect(priorityButtonAgain).toHaveTextContent('Priority');
		await userEvent.click(canvas.getByRole('button', { name: /save changes/i }));
		await expect(canvas.queryByText('low')).not.toBeInTheDocument();
		await expect(canvas.queryByText('medium')).not.toBeInTheDocument();
		await expect(canvas.queryByText('high')).not.toBeInTheDocument();
		await expect(args.onSave).toHaveBeenCalledTimes(2);
		await expect(args.onSave).toHaveBeenLastCalledWith(
			args.todo?.id,
			expect.objectContaining({
				priority: null,
			})
		);

		await userEvent.click(canvas.getByRole('button', { name: /edit todo/i }));
		const titleInputAgain = canvas.getByRole('textbox', { name: /edit title/i });
		await userEvent.type(titleInputAgain, ' - more changes');
		const cancelButton = canvas.getByRole('button', { name: /cancel edit/i });
		await userEvent.click(cancelButton);
		await expect(canvas.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();
		await expect(canvas.getByText(newTitle)).toBeInTheDocument();
		await expect(canvas.queryByText('low')).not.toBeInTheDocument();
		await expect(args.onSave).toHaveBeenCalledTimes(2);

		const deleteButton = canvas.getByRole('button', { name: /delete todo/i });
		await userEvent.click(deleteButton);
		await expect(args.onDelete).toHaveBeenCalledTimes(1);
	},
};
