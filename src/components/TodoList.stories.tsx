import type { Meta, StoryObj } from '@storybook/react';

import { TodoList } from './TodoList';

const meta = {
	title: 'Todo/TodoList',
	component: TodoList,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	args: {
		todos: [],
		onToggleTodo: (id: string) => {
			console.log(`Toggle todo with ID: ${id}`);
		},
	},
};

export const WithTodos: Story = {
	args: {
		todos: [
			{ id: '1', title: 'Learn React', completed: false },
			{ id: '2', title: 'Build a todo app', completed: true },
			{ id: '3', title: 'Master TypeScript', completed: false },
		],
		onToggleTodo: (id: string) => {
			console.log(`Toggle todo with ID: ${id}`);
		},
	},
};

export const ManyTodos: Story = {
	args: {
		todos: [
			{ id: '1', title: 'Learn React', completed: false },
			{ id: '2', title: 'Build a todo app', completed: true },
			{ id: '3', title: 'Master TypeScript', completed: false },
			{ id: '4', title: 'Implement new features', completed: false },
			{ id: '5', title: 'Fix bugs', completed: true },
			{ id: '6', title: 'Deploy application', completed: false },
		],
		onToggleTodo: (id: string) => {
			console.log(`Toggle todo with ID: ${id}`);
		},
	},
};
