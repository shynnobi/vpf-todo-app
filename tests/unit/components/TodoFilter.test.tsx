import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TodoFilter } from '@/components/TodoFilter';
import { TodoFilter as FilterType } from '@/types/todoTypes';

describe('TodoFilter Component', () => {
	const mockCounts = {
		[FilterType.All]: 5,
		[FilterType.Active]: 3,
		[FilterType.Completed]: 2,
	};

	it('should render all filter buttons with correct counts', () => {
		// Given: A TodoFilter component with mock counts
		const mockOnFilterChange = vi.fn();

		// When: The component is rendered
		render(
			<TodoFilter
				currentFilter={FilterType.All}
				onFilterChange={mockOnFilterChange}
				counts={mockCounts}
			/>
		);

		// Then: All buttons should be rendered with correct text and counts
		const allButton = screen.getByRole('button', { name: /show all todos/i });
		expect(allButton).toBeInTheDocument();
		expect(within(allButton).getByText('All')).toBeInTheDocument();
		expect(within(allButton).getByText('5', { exact: false })).toBeInTheDocument();

		const activeButton = screen.getByRole('button', { name: /show active todos/i });
		expect(activeButton).toBeInTheDocument();
		expect(within(activeButton).getByText('Active')).toBeInTheDocument();
		expect(within(activeButton).getByText('3', { exact: false })).toBeInTheDocument();

		const completedButton = screen.getByRole('button', { name: /show completed todos/i });
		expect(completedButton).toBeInTheDocument();
		expect(within(completedButton).getByText('Completed')).toBeInTheDocument();
		expect(within(completedButton).getByText('2', { exact: false })).toBeInTheDocument();
	});

	it('should apply correct styling to the currently selected filter', () => {
		// Given: A TodoFilter component with Active filter selected
		const mockOnFilterChange = vi.fn();

		// When: The component is rendered
		render(
			<TodoFilter
				currentFilter={FilterType.Active}
				onFilterChange={mockOnFilterChange}
				counts={mockCounts}
			/>
		);

		// Then: Active filter should indicate it's pressed/active (via aria-pressed)
		const activeButton = screen.getByRole('button', { name: /show active todos/i });
		expect(activeButton).toHaveAttribute('aria-pressed', 'true');

		// And: Other buttons should indicate they are not pressed/active (via aria-pressed)
		const allButton = screen.getByRole('button', { name: /show all todos/i });
		expect(allButton).toHaveAttribute('aria-pressed', 'false');

		const completedButton = screen.getByRole('button', { name: /show completed todos/i });
		expect(completedButton).toHaveAttribute('aria-pressed', 'false');
	});

	it('should call onFilterChange when a filter button is clicked', () => {
		// Given: A TodoFilter component with a mock filter change handler
		const mockOnFilterChange = vi.fn();

		// When: The component is rendered
		render(
			<TodoFilter
				currentFilter={FilterType.All}
				onFilterChange={mockOnFilterChange}
				counts={mockCounts}
			/>
		);

		// When: Clicking on the Active filter button
		fireEvent.click(screen.getByRole('button', { name: /show active todos/i }));

		// Then: The handler should be called with Active filter
		expect(mockOnFilterChange).toHaveBeenCalledWith(FilterType.Active);

		// When: Clicking on the Completed filter button
		fireEvent.click(screen.getByRole('button', { name: /show completed todos/i }));

		// Then: The handler should be called with Completed filter
		expect(mockOnFilterChange).toHaveBeenCalledWith(FilterType.Completed);

		// When: Clicking on the All filter button
		fireEvent.click(screen.getByRole('button', { name: /show all todos/i }));

		// Then: The handler should be called with All filter
		expect(mockOnFilterChange).toHaveBeenCalledWith(FilterType.All);
	});
});
