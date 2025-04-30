import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { formatISO } from 'date-fns';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TodoItem } from '@/components/TodoItem';
import { Todo } from '@/types/todoTypes';

/**
 * Unit tests for the TodoItem component.
 *
 * Tests the rendering and interactions of a single todo item.
 * Following the BDD approach with Given-When-Then format.
 */
describe('TodoItem Component', () => {
	const mockIncompleteTodo: Todo = {
		id: '1',
		title: 'Incomplete Task',
		completed: false,
		priority: 'medium',
		creationDate: '2023-01-01T10:00:00Z',
	};

	const mockCompletedTodo: Todo = {
		id: '2',
		title: 'Completed Task',
		completed: true,
		priority: 'high',
		creationDate: '2023-01-02T11:00:00Z',
	};

	// Define mock handlers once, typed as functions
	let mockHandlers: {
		onToggle: (id: string) => void;
		onDelete: (id: string) => void;
		onSave: (id: string, updates: Partial<Omit<Todo, 'id'>>) => void;
	};

	beforeEach(() => {
		// Assign vi.fn() here. TS should infer the mock capabilities.
		mockHandlers = {
			onToggle: vi.fn(),
			onDelete: vi.fn(),
			onSave: vi.fn(),
		};
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('Initial Rendering', () => {
		it('should render a todo item with its title', () => {
			// Given: A todo item
			// When: The component is rendered
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={() => {}}
					onSave={() => {}}
				/>
			);

			// Then: It should display the todo title
			expect(screen.getByText('Incomplete Task')).toBeInTheDocument();
		});

		it('should render a checkbox with the correct checked state for an incomplete todo', () => {
			// Given: An incomplete todo
			// When: The component is rendered
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={() => {}}
					onSave={() => {}}
				/>
			);

			// Then: The checkbox should not be checked
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).not.toBeChecked();
		});

		it('should render a checkbox with the correct checked state for a completed todo', () => {
			// Given: A completed todo
			// When: The component is rendered
			render(
				<TodoItem
					todo={mockCompletedTodo}
					onToggle={() => {}}
					onDelete={() => {}}
					onSave={() => {}}
				/>
			);

			// Then: The checkbox should be checked
			const checkbox = screen.getByRole('checkbox');
			expect(checkbox).toBeChecked();
		});

		it('should apply different styles based on completion status', () => {
			// Given: A completed todo
			// When: The component is rendered
			const { rerender } = render(
				<TodoItem
					todo={mockCompletedTodo}
					onToggle={() => {}}
					onDelete={() => {}}
					onSave={() => {}}
				/>
			);

			// Then: The text should have a line-through style for completed todos
			const titleElement = screen.getByText('Completed Task');
			expect(titleElement).toHaveClass('line-through');

			// Given: An incomplete todo
			// When: The component is rerendered with an incomplete todo
			rerender(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={() => {}}
					onSave={() => {}}
				/>
			);

			// Then: The text should not have a line-through style
			const incompleteTitle = screen.getByText('Incomplete Task');
			expect(incompleteTitle).not.toHaveClass('line-through');
		});

		it('should render a delete button', () => {
			// Given: A todo item
			// When: The component is rendered
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={() => {}}
					onSave={() => {}}
				/>
			);

			// Then: It should display a delete button
			const deleteButton = screen.getByRole('button', { name: /delete todo: incomplete task/i });
			expect(deleteButton).toBeInTheDocument();
		});
	});

	describe('Interaction', () => {
		it('should call onToggle with the correct id when checkbox is clicked', () => {
			// Given: A spy function and the component is rendered
			const mockToggle = vi.fn();
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={mockToggle}
					onDelete={() => {}}
					onSave={() => {}}
				/>
			);

			// When: The checkbox is clicked
			const checkbox = screen.getByRole('checkbox');
			fireEvent.click(checkbox);

			// Then: onToggle should be called with the todo id
			expect(mockToggle).toHaveBeenCalledWith('1');
		});

		it('should call onDelete with the correct id when delete button is clicked', () => {
			// Given: A spy function and the component is rendered
			const mockDelete = vi.fn();
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={mockDelete}
					onSave={() => {}}
				/>
			);

			// When: The delete button is clicked
			const deleteButton = screen.getByRole('button', { name: /delete todo: incomplete task/i });
			fireEvent.click(deleteButton);

			// Then: onDelete should be called with the todo id
			expect(mockDelete).toHaveBeenCalledWith('1');
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes for accessibility', () => {
			// Given: The component is rendered
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={() => {}}
					onSave={() => {}}
				/>
			);

			// Then: The list item should have proper accessibility attributes
			const listItem = screen.getByRole('listitem');
			expect(listItem).toHaveAttribute('aria-labelledby');
		});

		it('should have proper ARIA label for delete button', () => {
			// Given: The component is rendered
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={() => {}}
					onSave={() => {}}
				/>
			);

			// Then: The delete button should have a descriptive ARIA label
			const deleteButton = screen.getByRole('button', { name: /delete todo: incomplete task/i });
			expect(deleteButton).toHaveAttribute('aria-label', 'Delete todo: Incomplete Task');
		});
	});

	// Add tests for editing mode
	describe('Editing Mode', () => {
		it('should switch to edit mode when the edit button is clicked', async () => {
			// Given: A todo item rendered
			render(<TodoItem todo={mockIncompleteTodo} {...mockHandlers} />);
			const editButton = screen.getByLabelText(/edit todo/i);

			// When: The edit button is clicked
			await userEvent.click(editButton);

			// Then: The edit form should be displayed
			expect(screen.getByRole('textbox', { name: /edit title/i })).toBeInTheDocument();
			expect(screen.getByRole('textbox', { name: /edit description/i })).toBeInTheDocument();
			expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /cancel$/i })).toBeInTheDocument();
		});

		it('should call onSave with updated data when save button is clicked', async () => {
			// Given: The component is in edit mode
			render(<TodoItem todo={mockIncompleteTodo} {...mockHandlers} />);
			const editButton = screen.getByLabelText(/edit todo/i);
			await userEvent.click(editButton);

			// When: Fields are changed (title, description, date, priority)
			const titleInput = screen.getByRole('textbox', { name: /edit title/i });
			const newTitle = 'Updated Title';
			await userEvent.clear(titleInput);
			await userEvent.type(titleInput, newTitle);

			const descriptionInput = screen.getByRole('textbox', { name: /edit description/i });
			const newDescription = 'Updated Description';
			await userEvent.clear(descriptionInput);
			await userEvent.type(descriptionInput, newDescription);

			// When: A date is selected from the date picker
			const dueDateButton = screen.getByRole('button', { name: /due date/i });
			await userEvent.click(dueDateButton);
			const calendarGrid = await screen.findByRole('grid');

			// Select a specific date that we know is enabled (today's date to be safe)
			// First, format today's date as a string to find in the calendar
			const today = new Date();
			const dayOfMonth = today.getDate().toString(); // get current day number as string

			// Find the correct day button: role='gridcell', not disabled, contains the day number
			const dayCells = await within(calendarGrid).findAllByRole('gridcell');
			const targetCell = dayCells.find(cell => {
				// Check if the button inside the cell is not disabled and has the correct text content
				const button = cell as HTMLButtonElement; // Cast needed for disabled check
				return !button.disabled && button.textContent === dayOfMonth;
			});

			if (!targetCell) {
				throw new Error(`Could not find an enabled gridcell button for day ${dayOfMonth}`);
			}

			await userEvent.click(targetCell);

			// Extract the selected date for assertion
			const expectedDate = new Date();
			expectedDate.setHours(0, 0, 0, 0); // Set to start of day
			const expectedIsoDate = formatISO(expectedDate);

			// When: The priority is changed
			const priorityButton = screen.getByRole('button', { name: /select priority for this task/i });
			await userEvent.click(priorityButton);
			const lowOption = await screen.findByRole('menuitemradio', { name: /low/i });
			await userEvent.click(lowOption);

			// And: The save button is clicked
			const saveButton = screen.getByRole('button', { name: /save changes/i });
			await userEvent.click(saveButton);

			// Then: onSave should be called with the correct id and updated fields
			expect(mockHandlers.onSave).toHaveBeenCalledWith(mockIncompleteTodo.id, {
				title: newTitle,
				description: newDescription,
				dueDate: expectedIsoDate, // Use the dynamically determined ISO date
				priority: 'low',
			});

			// And: The component should exit edit mode
			expect(screen.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();
		});

		it('should cancel editing and revert changes when cancel button is clicked', async () => {
			// Given: The component is in edit mode
			render(<TodoItem todo={mockIncompleteTodo} {...mockHandlers} />);
			const editButton = screen.getByLabelText(/edit todo/i);
			await userEvent.click(editButton);

			// When: Some changes are made
			const titleInput = screen.getByRole('textbox', { name: /edit title/i });
			await userEvent.type(titleInput, 'Temporary Change');
			const descriptionInput = screen.getByRole('textbox', { name: /edit description/i });
			await userEvent.type(descriptionInput, 'Temp Desc');
			// No need to interact with date picker for cancel test

			// And: The cancel button is clicked
			const cancelButton = screen.getByRole('button', { name: /cancel$/i });
			await userEvent.click(cancelButton);

			// Then: The component should exit edit mode
			expect(screen.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();

			// And: onSave should not have been called
			expect(mockHandlers.onSave).not.toHaveBeenCalled();

			// And: The displayed title should be the original title
			expect(screen.getByText(mockIncompleteTodo.title)).toBeInTheDocument();
		});
	});
});
