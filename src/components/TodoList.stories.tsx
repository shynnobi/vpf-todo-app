import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { Decorator } from '@storybook/react';
import { fn } from '@storybook/test';

import { TodoList } from './TodoList';

import { Todo } from '@/types/todoTypes';

// Interactive decorator that manages todos state
const InteractiveTodoListDecorator: Decorator = (_Story, context) => {
	const initialTodos = [...(context.args.todos as Todo[])];
	const [todos, setTodos] = useState(initialTodos);

	// Handler that updates local state
	const handleToggleTodo = (id: string) => {
		// Update todos state
		setTodos(prevTodos =>
			prevTodos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
		);

		// Call the original callback function for logging
		(context.args.onToggleTodo as ReturnType<typeof fn>)(id);
	};

	return (
		<div className="w-80 border rounded-md p-4">
			<TodoList todos={todos} onToggleTodo={handleToggleTodo} />
		</div>
	);
};

const meta = {
	title: 'Todo/TodoList',
	component: TodoList,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	// Default args that will be applied to all stories
	args: {
		onToggleTodo: fn((id: string) => console.log(`Toggle todo with ID: ${id}`)),
	},
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	args: {
		todos: [],
	},
};

export const WithTodos: Story = {
	args: {
		todos: [
			{ id: '1', title: 'Learn React', completed: false },
			{ id: '2', title: 'Build a todo app', completed: true },
			{ id: '3', title: 'Master TypeScript', completed: false },
		],
	},
	decorators: [InteractiveTodoListDecorator],
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
	},
	decorators: [InteractiveTodoListDecorator],
};
