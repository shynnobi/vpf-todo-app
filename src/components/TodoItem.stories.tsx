import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { Decorator } from '@storybook/react';
import { fn } from '@storybook/test';

import { TodoItem } from './TodoItem';

// Interactive decorator that manages todo state
const InteractiveTodoDecorator: Decorator = (_Story, context) => {
	// Extract typed properties from context
	const todo = { ...(context.args.todo as { id: string; title: string; completed: boolean }) };
	const [completed, setCompleted] = useState(todo.completed);

	// Create an interactive version of the todo
	const interactiveTodo = {
		...todo,
		completed: completed,
	};

	// Handler that updates local state
	const handleToggle = (id: string) => {
		setCompleted(!completed);
		(context.args.onToggle as (id: string) => void)(id);
	};

	// Handler for delete
	const handleDelete = (id: string) => {
		(context.args.onDelete as (id: string) => void)(id);
	};

	return (
		<ul className="w-80 border rounded-md p-2">
			<TodoItem todo={interactiveTodo} onToggle={handleToggle} onDelete={handleDelete} />
		</ul>
	);
};

const meta = {
	title: 'Todo/TodoItem',
	component: TodoItem,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	// Default args that will be applied to all stories
	args: {
		onToggle: fn((id: string) => console.log(`Toggle todo with ID: ${id}`)),
		onDelete: fn((id: string) => console.log(`Delete todo with ID: ${id}`)),
	},
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
	},
	decorators: [InteractiveTodoDecorator],
};

export const Completed: Story = {
	args: {
		todo: {
			id: '2',
			title: 'Build a todo app',
			completed: true,
		},
	},
	decorators: [InteractiveTodoDecorator],
};

export const LongTitle: Story = {
	args: {
		todo: {
			id: '3',
			title:
				'This is a very long todo title that should wrap gracefully within the container and still look good',
			completed: false,
		},
	},
	decorators: [InteractiveTodoDecorator],
};
