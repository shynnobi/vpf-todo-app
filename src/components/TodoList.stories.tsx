import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import type { Decorator } from '@storybook/react';
import { fn } from '@storybook/test';

import { TodoList } from './TodoList';

import { Todo } from '@/types/todoTypes';

// Decorator to manage state for interactive TodoList stories
const InteractiveTodoListDecorator: Decorator = (_Story, context) => {
	const initialTodos = [...(context.args.todos as Todo[])];
	const [todos, setTodos] = useState(initialTodos);

	const handleToggleTodo = (id: string) => {
		setTodos(prevTodos =>
			prevTodos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
		);

		(context.args.onToggleTodo as ReturnType<typeof fn>)(id);
	};

	const handleDeleteTodo = (id: string) => {
		setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

		(context.args.onDeleteTodo as ReturnType<typeof fn>)(id);
	};

	const handleSaveTodo = (id: string, updates: Partial<Omit<Todo, 'id'>>) => {
		(context.args.onSaveTodo as ReturnType<typeof fn>)(id, updates);
		// Note: Updating local state for saves is not implemented in this decorator
	};

	return (
		<div className="w-80 border rounded-md p-4">
			<TodoList
				todos={todos}
				onToggleTodo={handleToggleTodo}
				onDeleteTodo={handleDeleteTodo}
				onSaveTodo={handleSaveTodo}
			/>
		</div>
	);
};

const meta: Meta<typeof TodoList> = {
	title: 'Todo/TodoList',
	component: TodoList,
	tags: ['autodocs'],
	argTypes: {
		todos: { control: 'object' },
		onToggleTodo: { action: 'toggled' },
		onDeleteTodo: { action: 'deleted' },
		onSaveTodo: { action: 'saved' },
	},
	args: {
		onToggleTodo: fn(),
		onDeleteTodo: fn(),
		onSaveTodo: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		todos: [
			{
				id: '1',
				title: 'Learn Storybook',
				completed: false,
				priority: 'medium',
				creationDate: new Date().toISOString(),
			},
			{
				id: '2',
				title: 'Write stories',
				completed: true,
				priority: 'high',
				creationDate: new Date(Date.now() - 86400000).toISOString(),
			}, // Yesterday
			{
				id: '3',
				title: 'Test components',
				completed: false,
				priority: 'low',
				creationDate: new Date(Date.now() - 172800000).toISOString(),
			}, // Two days ago
			{
				id: '4',
				title: 'Think about life',
				completed: false,
				priority: null,
				creationDate: new Date(Date.now() - 259200000).toISOString(),
			}, // Three days ago
			{
				id: '5',
				title: 'Take a break',
				completed: true,
				priority: null,
				creationDate: new Date(Date.now() - 345600000).toISOString(),
			}, // Four days ago
		],
		onToggleTodo: action('onToggleTodo'),
		onDeleteTodo: action('onDeleteTodo'),
		onSaveTodo: action('onSaveTodo'),
	},
};

export const Empty: Story = {
	args: {
		todos: [],
		onToggleTodo: action('onToggleTodo'),
		onDeleteTodo: action('onDeleteTodo'),
		onSaveTodo: action('onSaveTodo'),
	},
};

export const WithTodos: Story = {
	args: {
		todos: [
			{
				id: '1',
				title: 'Learn React',
				completed: false,
				priority: 'medium',
				creationDate: '2023-01-10T10:00:00Z',
			},
			{
				id: '2',
				title: 'Build a todo app',
				completed: true,
				priority: 'high',
				creationDate: '2023-01-09T11:00:00Z',
			},
			{
				id: '3',
				title: 'Master TypeScript',
				completed: false,
				priority: 'low',
				creationDate: '2023-01-08T12:00:00Z',
			},
			{
				id: '4',
				title: 'Go shopping',
				completed: false,
				priority: null,
				creationDate: '2023-01-07T13:00:00Z',
			},
		],
		// onSaveTodo uses default arg
	},
	decorators: [InteractiveTodoListDecorator], // Apply decorator for interactivity
};

export const ManyTodos: Story = {
	args: {
		todos: [
			{
				id: '1',
				title: 'Learn React',
				completed: false,
				priority: 'medium',
				creationDate: '2023-01-10T10:00:00Z',
			},
			{
				id: '2',
				title: 'Build a todo app',
				completed: true,
				priority: 'high',
				creationDate: '2023-01-09T11:00:00Z',
			},
			{
				id: '3',
				title: 'Master TypeScript',
				completed: false,
				priority: 'low',
				creationDate: '2023-01-08T12:00:00Z',
			},
			{
				id: '4',
				title: 'Implement new features',
				completed: false,
				priority: 'medium',
				creationDate: '2023-01-07T13:00:00Z',
			},
			{
				id: '5',
				title: 'Fix bugs',
				completed: true,
				priority: 'high',
				creationDate: '2023-01-06T14:00:00Z',
			},
			{
				id: '6',
				title: 'Deploy application',
				completed: false,
				priority: 'low',
				creationDate: '2023-01-05T15:00:00Z',
			},
			{
				id: '7',
				title: 'Read a book',
				completed: false,
				priority: null,
				creationDate: '2023-01-04T16:00:00Z',
			},
			{
				id: '8',
				title: 'Meditate',
				completed: true,
				priority: null,
				creationDate: '2023-01-03T17:00:00Z',
			},
		],
		// onSaveTodo uses default arg
	},
	decorators: [InteractiveTodoListDecorator], // Apply decorator for interactivity
};
