import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { EditTodoForm } from './EditTodoForm';

import { Todo } from '@/types/todoTypes';

const meta: Meta<typeof EditTodoForm> = {
	title: 'Todo/EditTodoForm',
	component: EditTodoForm,
	tags: ['autodocs'],
	argTypes: {
		initialData: { control: 'object' },
		onSave: { action: 'saved' },
		onCancel: { action: 'cancelled' },
	},
	args: {
		onSave: fn(), // Use fn() for spy capabilities
		onCancel: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories ---

const defaultInitialData: Pick<Todo, 'id' | 'title' | 'description' | 'dueDate'> = {
	id: 'edit-1',
	title: 'Initial Title',
	description: 'Initial Description',
	dueDate: '2024-10-20',
};

export const Default: Story = {
	args: {
		initialData: defaultInitialData,
	},
};

export const WithEmptyOptionalFields: Story = {
	args: {
		initialData: {
			...defaultInitialData,
			id: 'edit-2',
			description: undefined,
			dueDate: undefined,
		},
	},
};

export const MinimalData: Story = {
	args: {
		initialData: {
			id: 'edit-3',
			title: 'Only Title',
			// description and dueDate will default to '' in the component state
		},
	},
};

// TODO: Add interactive tests using the play function if needed
// Example: test typing in fields and clicking save/cancel
