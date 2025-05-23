import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AddTodoForm } from './AddTodoForm';

import { CreateTodoParams } from '@/types/todoTypes';

/**
 * The AddTodoForm component allows users to add new todos to the application.
 * It provides a simple input field and submit button.
 */
const meta = {
	title: 'Todo/AddTodoForm',
	component: AddTodoForm,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Form for adding new todos with title input and priority selection (defaults to no priority). Handles validation and submission.',
			},
		},
	},
	args: {
		onAddTodo: fn((todo: CreateTodoParams) => console.log('Todo added:', todo)),
	},
	tags: ['autodocs'],
} satisfies Meta<typeof AddTodoForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state of the AddTodoForm, ready for input.
 * Priority defaults to 'None' (null).
 */
export const InitialState: Story = {
	args: {
		// No specific args needed, shows default state
	},
};
