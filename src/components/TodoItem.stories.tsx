import type { Meta, StoryObj } from '@storybook/react';

import { TodoItem } from './TodoItem';

const meta = {
	title: 'Todo/TodoItem',
	component: TodoItem,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	decorators: [
		Story => (
			<ul className="w-80 border rounded-md p-2">
				<Story />
			</ul>
		),
	],
} satisfies Meta<typeof TodoItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Incomplete: Story = {
	args: {
		todo: {
			id: '1',
			title: 'Learn React',
			completed: false,
		},
		onToggle: (id: string) => {
			console.log(`Toggle todo with ID: ${id}`);
		},
	},
};

export const Completed: Story = {
	args: {
		todo: {
			id: '2',
			title: 'Build a todo app',
			completed: true,
		},
		onToggle: (id: string) => {
			console.log(`Toggle todo with ID: ${id}`);
		},
	},
};

export const LongTitle: Story = {
	args: {
		todo: {
			id: '3',
			title:
				'This is a very long todo title that should wrap gracefully within the container and still look good',
			completed: false,
		},
		onToggle: (id: string) => {
			console.log(`Toggle todo with ID: ${id}`);
		},
	},
};
