import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { TodoFilter as FilterType } from '../types/todoTypes'; // Adjust path if needed
import { TodoFilter } from './TodoFilter'; // Adjust path if needed

const mockCounts = {
	[FilterType.All]: 10,
	[FilterType.Active]: 7,
	[FilterType.Completed]: 3,
};

const mockCountsZero = {
	[FilterType.All]: 0,
	[FilterType.Active]: 0,
	[FilterType.Completed]: 0,
};

const meta: Meta<typeof TodoFilter> = {
	title: 'Todo/TodoFilter',
	component: TodoFilter,
	tags: ['autodocs'],
	argTypes: {
		onFilterChange: {
			action: 'filterChanged',
			description: 'Callback when filter button is clicked',
		},
		currentFilter: {
			control: { type: 'radio' },
			options: Object.values(FilterType),
			description: 'The currently selected filter',
		},
		counts: {
			control: { type: 'object' },
			description: 'Object containing counts for each filter type',
		},
	},
	// Default args for all stories
	args: {
		counts: mockCounts,
		onFilterChange: action('filterChanged'), // Log actions in Storybook UI
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories ---

export const DefaultAllSelected: Story = {
	args: {
		currentFilter: FilterType.All,
	},
};

export const ActiveSelected: Story = {
	args: {
		currentFilter: FilterType.Active,
	},
};

export const CompletedSelected: Story = {
	args: {
		currentFilter: FilterType.Completed,
	},
};

export const ZeroCounts: Story = {
	args: {
		currentFilter: FilterType.All,
		counts: mockCountsZero, // Override default counts
	},
	name: 'With Zero Counts', // Custom name for the story
};
