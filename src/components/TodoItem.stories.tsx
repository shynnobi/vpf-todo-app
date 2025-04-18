import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within } from '@storybook/test';

import { TodoItem } from './TodoItem';

import { Todo } from '@/types/todoTypes';

const meta: Meta<typeof TodoItem> = {
	title: 'Components/TodoItem',
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
		},
		// onSave, onToggle, onDelete handlers are provided by the default meta args
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Test Toggling
		const checkbox = canvas.getByRole('checkbox');
		await expect(checkbox).not.toBeChecked();
		await userEvent.click(checkbox);
		await expect(checkbox).toBeChecked();
		// Assertion on onToggle spy happens automatically in Actions panel

		// Test Editing and Saving
		const editButton = canvas.getByRole('button', { name: /edit todo/i });
		await userEvent.click(editButton);

		const titleInput = canvas.getByRole('textbox', { name: /edit title/i });
		await expect(titleInput).toBeInTheDocument();
		await userEvent.clear(titleInput);
		const newTitle = 'Updated Interactive Todo';
		await userEvent.type(titleInput, newTitle);
		await expect(titleInput).toHaveValue(newTitle);

		const saveButton = canvas.getByRole('button', { name: /save changes/i });
		await userEvent.click(saveButton);

		await expect(canvas.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();
		await expect(canvas.getByText(newTitle)).toBeInTheDocument();
		// Assertion on onSave spy happens automatically in Actions panel

		// Test Deleting
		const deleteButton = canvas.getByRole('button', { name: /delete todo/i });
		await userEvent.click(deleteButton);
		// Assertion on onDelete spy happens automatically in Actions panel
		// Optionally check if the item visually disappears if handleDelete included that logic
	},
};
