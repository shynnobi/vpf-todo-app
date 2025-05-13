import type { Meta, StoryObj } from '@storybook/react';

import { TodoContainer } from './TodoContainer';

const meta: Meta<typeof TodoContainer> = {
	title: 'Todo/TodoContainer',
	component: TodoContainer,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Container for the full Todo app (add, filter, sort, list).\n' +
					'This story uses the real Zustand store.\n' +
					'Use the Storybook viewport toolbar to test responsive layouts (mobile, tablet, desktop).',
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TodoContainer>;

export const Default: Story = {
	render: () => <TodoContainer />,
};
