import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AddTodoForm } from './AddTodoForm';

import { CreateTodoParams } from '@/types/todoTypes';

/**
 * The AddTodoForm component allows users to add new todos to the application.
 * It provides a simple input field and submit button.
 */
const meta = {
	title: 'Components/AddTodoForm',
	component: AddTodoForm,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Form for adding new todos with validation and submission handling',
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
 * Default state of the AddTodoForm component
 */
export const Default: Story = {};
