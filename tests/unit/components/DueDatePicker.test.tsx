import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format, getDate } from 'date-fns';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DueDatePicker } from '@/components/DueDatePicker';

/**
 * Unit tests for the DueDatePicker component.
 * Focuses on rendering, popover interaction, date selection, and clearing.
 */
describe('DueDatePicker Component', () => {
	const mockOnChange = vi.fn();

	beforeEach(() => {
		// Reset mocks before each test
		mockOnChange.mockClear();
	});

	describe('Initial Rendering', () => {
		it('should render the button with default text when no date is provided', () => {
			// Given: Rendered without a value
			render(<DueDatePicker onChange={mockOnChange} />);

			// Then: The button shows default text and has correct aria-label
			const button = screen.getByRole('button', { name: /select due date/i });
			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent(/due date/i);
		});

		it('should render the button with formatted date when a date is provided', () => {
			// Given: A specific date
			const testDate = new Date(2024, 5, 15); // June 15, 2024
			const formattedDate = format(testDate, 'd MMMM yyyy');

			// When: Rendered with the date value
			render(<DueDatePicker value={testDate} onChange={mockOnChange} />);

			// Then: The button shows the formatted date
			const button = screen.getByRole('button', {
				name: new RegExp(`Selected due date: ${formattedDate}`, 'i'),
			});
			expect(button).toBeInTheDocument();
			expect(button).toHaveTextContent(formattedDate);
		});
	});

	describe('Popover Interaction', () => {
		it('should open the calendar popover when the button is clicked', async () => {
			// Given: The component is rendered
			render(<DueDatePicker onChange={mockOnChange} />);
			const user = userEvent.setup();
			const button = screen.getByRole('button');

			// When: The button is clicked
			await user.click(button);

			// Then: The calendar grid should become visible
			const calendarGrid = await screen.findByRole('grid');
			expect(calendarGrid).toBeVisible();
		});

		it('should close the calendar popover when a date is selected', async () => {
			// Given: The component is rendered and popover is opened
			render(<DueDatePicker onChange={mockOnChange} />);
			const user = userEvent.setup();
			const button = screen.getByRole('button');
			await user.click(button);
			const calendarGrid = await screen.findByRole('grid');
			expect(calendarGrid).toBeVisible(); // Ensure open
			const dateToSelectValue = 15;

			// When: A date is selected
			const dateCell = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateCell);

			// Then: The popover should close
			await waitFor(() => {
				expect(screen.queryByRole('grid')).not.toBeInTheDocument();
			});
		});
	});

	describe('Date Selection', () => {
		it('should call onChange with the selected date when a date is clicked', async () => {
			// Given: Component rendered and popover opened
			render(<DueDatePicker onChange={mockOnChange} />);
			const user = userEvent.setup();
			const button = screen.getByRole('button');
			await user.click(button);
			const dateToSelectValue = 15;

			// When: A date is selected
			const dateCell = await screen.findByRole('gridcell', {
				name: dateToSelectValue.toString(),
			});
			await user.click(dateCell);

			// Then: onChange is called with a Date object matching the day
			await waitFor(() => {
				expect(mockOnChange).toHaveBeenCalledTimes(1);
				expect(mockOnChange).toHaveBeenCalledWith(expect.any(Date));
				const selectedDate = mockOnChange.mock.calls[0][0];
				expect(getDate(selectedDate)).toBe(dateToSelectValue);
			});
		});
	});

	describe('Date Clearing', () => {
		it('should display the clear button when a date is selected', () => {
			// Given: A date is provided
			render(<DueDatePicker value={new Date()} onChange={mockOnChange} />);

			// Then: The clear button is visible
			const clearButton = screen.getByRole('button', { name: /clear due date/i });
			expect(clearButton).toBeInTheDocument();
		});

		it('should not display the clear button when no date is selected', () => {
			// Given: No date is provided
			render(<DueDatePicker onChange={mockOnChange} />);

			// Then: The clear button is not present
			const clearButton = screen.queryByRole('button', { name: /clear due date/i });
			expect(clearButton).not.toBeInTheDocument();
		});

		it('should call onChange with undefined when clear button is clicked', async () => {
			// Given: A date is selected
			render(<DueDatePicker value={new Date()} onChange={mockOnChange} />);
			const user = userEvent.setup();
			const clearButton = screen.getByRole('button', { name: /clear due date/i });

			// When: The clear button is clicked
			await user.click(clearButton);

			// Then: onChange is called with undefined
			await waitFor(() => {
				expect(mockOnChange).toHaveBeenCalledTimes(1);
				expect(mockOnChange).toHaveBeenCalledWith(undefined);
			});
		});

		it('should reset button text after clearing the date', async () => {
			// Given: A date is selected and then cleared
			const { rerender } = render(<DueDatePicker value={new Date()} onChange={mockOnChange} />);
			const user = userEvent.setup();
			const clearButton = screen.getByRole('button', { name: /clear due date/i });
			await user.click(clearButton);

			// When: The component re-renders with no value (simulating state update)
			rerender(<DueDatePicker value={undefined} onChange={mockOnChange} />);

			// Then: The button text reverts to default
			await waitFor(() => {
				const button = screen.getByRole('button', { name: /select due date/i });
				expect(button).toHaveTextContent(/due date/i);
			});
		});
	});
});
