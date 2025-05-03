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

const defaultInitialData: Pick<
	Todo,
	'id' | 'title' | 'description' | 'dueDate' | 'priority' | 'creationDate' | 'lastModified'
> = {
	id: 'edit-1',
	title: 'Initial Title',
	description: 'Initial Description',
	dueDate: '2024-10-20',
	priority: 'medium',
	creationDate: '2024-09-01T10:00:00Z',
	lastModified: '2024-10-01T15:30:00Z',
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
			priority: 'low',
		},
	},
};

export const MinimalData: Story = {
	args: {
		initialData: {
			id: 'edit-3',
			title: 'Only Title',
			priority: null,
			creationDate: '2024-10-05T08:15:00Z',
		},
	},
};

export const EditingNoPriority: Story = {
	args: {
		initialData: {
			id: 'edit-4',
			title: 'Task with No Priority',
			description: 'Try setting a priority',
			dueDate: '',
			priority: null,
			creationDate: '2024-10-10T12:00:00Z',
		},
	},
};

export const LongTitle: Story = {
	args: {
		initialData: {
			...defaultInitialData,
			id: 'edit-5',
			title:
				'This is a very long task title that should demonstrate how the auto-resizing textarea works with longer content spanning multiple lines',
			creationDate: '2024-09-15T09:30:00Z',
		},
	},
};

// TODO: Add interactive tests using the play function if needed
// Example: test typing in fields and clicking save/cancel
