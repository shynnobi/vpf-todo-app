import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, fireEvent, userEvent, within } from '@storybook/test';

import { TodoItem } from './TodoItem';

import { Todo } from '@/types/todoTypes';

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

export const Interactive: Story = {
	render: args => {
		// Use state within the render function for interactivity specific to this story
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [interactiveTodo, setInteractiveTodo] = useState<Todo>(args.todo);

		const handleToggle = (id: string) => {
			args.onToggle(id);
			setInteractiveTodo(prev => ({ ...prev, completed: !prev.completed }));
		};

		const handleDelete = (id: string) => {
			args.onDelete(id);
			// Note: State update for deletion is not handled here for simplicity,
			// relies on Storybook action log.
			console.log('Delete action triggered in Storybook for ID:', id);
		};

		const handleSave = (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
			args.onSave(id, updates);
			// Update local state for visual feedback within Storybook
			setInteractiveTodo(prev => ({ ...prev, ...updates }));
		};

		return (
			// Added ul wrapper for visual context in Storybook
			<ul className="w-80 border rounded-md p-2">
				<TodoItem
					todo={interactiveTodo}
					onToggle={handleToggle}
					onDelete={handleDelete}
					onSave={handleSave}
				/>
			</ul>
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
		// onSave, onToggle, onDelete handlers are provided by the default meta args
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);

		// Test Toggling
		const checkbox = canvas.getByRole('checkbox');
		await expect(checkbox).not.toBeChecked();
		await userEvent.click(checkbox);
		await expect(checkbox).toBeChecked();
		await expect(args.onToggle).toHaveBeenCalledTimes(1);
		await userEvent.click(checkbox); // Toggle back
		await expect(args.onToggle).toHaveBeenCalledTimes(2);

		// Test Editing and Saving
		const editButton = canvas.getByRole('button', { name: /edit todo/i });
		await userEvent.click(editButton);

		// Find and edit fields
		const titleInput = canvas.getByRole('textbox', { name: /edit title/i });
		const descriptionInput = canvas.getByRole('textbox', { name: /edit description/i });
		const dueDateInput = canvas.getByLabelText(/edit due date/i);

		await expect(titleInput).toBeInTheDocument();
		await expect(descriptionInput).toBeInTheDocument();
		await expect(dueDateInput).toBeInTheDocument();

		const newTitle = 'Updated Title via Play';
		const newDescription = 'Updated description via Play';
		const newDueDate = '2025-11-22';

		await userEvent.clear(titleInput);
		await userEvent.type(titleInput, newTitle);
		await userEvent.clear(descriptionInput);
		await userEvent.type(descriptionInput, newDescription);
		await fireEvent.change(dueDateInput, { target: { value: newDueDate } }); // Use fireEvent for date input

		await expect(titleInput).toHaveValue(newTitle);
		await expect(descriptionInput).toHaveValue(newDescription);
		await expect(dueDateInput).toHaveValue(newDueDate);

		// Click Save button
		const saveButton = canvas.getByRole('button', { name: /save changes/i });
		await userEvent.click(saveButton);

		// Check it exited edit mode and displayed new values (via local state update)
		await expect(canvas.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();
		await expect(canvas.getByText(newTitle)).toBeInTheDocument();
		await expect(canvas.getByText(newDescription)).toBeInTheDocument();
		await expect(
			canvas.getByText(`Due: ${new Date(newDueDate).toLocaleDateString()}`)
		).toBeInTheDocument();

		// Verify onSave was called correctly
		await expect(args.onSave).toHaveBeenCalledTimes(1);
		await expect(args.onSave).toHaveBeenCalledWith(args.todo?.id, {
			title: newTitle,
			description: newDescription,
			dueDate: newDueDate,
		});

		// Test Cancel
		await userEvent.click(canvas.getByRole('button', { name: /edit todo/i })); // Enter edit mode again
		const titleInputAgain = canvas.getByRole('textbox', { name: /edit title/i });
		await userEvent.type(titleInputAgain, ' - more changes'); // Make a change
		const cancelButton = canvas.getByRole('button', { name: /cancel edit/i });
		await userEvent.click(cancelButton);
		await expect(canvas.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();
		await expect(canvas.getByText(newTitle)).toBeInTheDocument(); // Should revert to last saved state
		await expect(args.onSave).toHaveBeenCalledTimes(1); // Ensure save wasn't called again

		// Test Deleting
		const deleteButton = canvas.getByRole('button', { name: /delete todo/i });
		await userEvent.click(deleteButton);
		await expect(args.onDelete).toHaveBeenCalledTimes(1);
	},
};
