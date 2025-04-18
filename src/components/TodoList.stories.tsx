import { useState } from 'react';
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

const mockTodos: Todo[] = [
	{ id: '1', title: 'Learn Storybook', completed: false },
	{ id: '2', title: 'Write stories', completed: true },
	{ id: '3', title: 'Test components', completed: false },
];

export const Default: Story = {
	args: {
		todos: mockTodos,
		// onSaveTodo uses default arg
	},
};

export const Empty: Story = {
	args: {
		todos: [],
		// onSaveTodo uses default arg
	},
};

export const WithTodos: Story = {
	args: {
		todos: [
			{ id: '1', title: 'Learn React', completed: false },
			{ id: '2', title: 'Build a todo app', completed: true },
			{ id: '3', title: 'Master TypeScript', completed: false },
		],
		// onSaveTodo uses default arg
	},
	decorators: [InteractiveTodoListDecorator], // Apply decorator for interactivity
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
		// onSaveTodo uses default arg
	},
	decorators: [InteractiveTodoListDecorator], // Apply decorator for interactivity
};
