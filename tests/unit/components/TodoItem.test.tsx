import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the NewDueDatePicker component to simplify testing
vi.mock('@/components/NewDueDatePicker', () => ({
	NewDueDatePicker: ({ onChange, value }: { onChange: (date?: Date) => void; value?: Date }) => (
		<div data-testid="mocked-new-due-date-picker">
			<button onClick={() => onChange(new Date('2025-05-13T00:00:00Z'))} data-testid="select-date">
				Select Date
			</button>
			{/* Display something based on value to ensure it's usable by the test if needed */}
			<span>{value ? value.toISOString() : 'No date'}</span>
		</div>
	),
}));

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
		onSetEditing: (id: string | null) => void;
	};

	beforeEach(() => {
		// Assign vi.fn() here. TS should infer the mock capabilities.
		mockHandlers = {
			onToggle: vi.fn(),
			onDelete: vi.fn(),
			onSave: vi.fn(),
			onSetEditing: vi.fn(),
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
					isEditing={false}
					onSetEditing={() => {}}
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
					isEditing={false}
					onSetEditing={() => {}}
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
					isEditing={false}
					onSetEditing={() => {}}
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
					isEditing={false}
					onSetEditing={() => {}}
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
					isEditing={false}
					onSetEditing={() => {}}
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
					isEditing={false}
					onSetEditing={() => {}}
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
					isEditing={false}
					onSetEditing={() => {}}
				/>
			);

			// When: The checkbox is clicked
			const checkbox = screen.getByRole('checkbox');
			fireEvent.click(checkbox);

			// Then: onToggle should be called with the todo id
			expect(mockToggle).toHaveBeenCalledWith('1');
		});

		it('should open a confirmation dialog when delete button is clicked', async () => {
			// Given: The component is rendered
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={() => {}}
					onSave={() => {}}
					isEditing={false}
					onSetEditing={() => {}}
				/>
			);

			// When: The delete button is clicked
			const deleteButton = screen.getByTestId('delete-todo-trigger');
			fireEvent.click(deleteButton);

			// Then: The confirmation dialog should be visible
			const dialogTitle = await screen.findByText('Are you sure?');
			expect(dialogTitle).toBeInTheDocument();

			const dialogDescription = screen.getByText(/This will permanently delete the task/i);
			expect(dialogDescription).toBeInTheDocument();

			// And: The dialog should have cancel and confirm buttons
			expect(screen.getByText('Cancel')).toBeInTheDocument();
			expect(screen.getByText('Delete')).toBeInTheDocument();
		});

		it('should call onDelete with the correct id when confirmation button is clicked', async () => {
			// Given: A spy function and the component is rendered
			const mockDelete = vi.fn();
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={mockDelete}
					onSave={() => {}}
					isEditing={false}
					onSetEditing={() => {}}
				/>
			);

			// When: The delete button is clicked to open the dialog
			const deleteButton = screen.getByTestId('delete-todo-trigger');
			fireEvent.click(deleteButton);

			// And: The confirm delete button is clicked
			const confirmButton = await screen.findByTestId('confirm-delete-todo');
			fireEvent.click(confirmButton);

			// Then: onDelete should be called with the todo id
			expect(mockDelete).toHaveBeenCalledWith('1');
		});

		it('should not call onDelete when cancel button is clicked', async () => {
			// Given: A spy function and the component is rendered
			const mockDelete = vi.fn();
			render(
				<TodoItem
					todo={mockIncompleteTodo}
					onToggle={() => {}}
					onDelete={mockDelete}
					onSave={() => {}}
					isEditing={false}
					onSetEditing={() => {}}
				/>
			);

			// When: The delete button is clicked to open the dialog
			const deleteButton = screen.getByTestId('delete-todo-trigger');
			fireEvent.click(deleteButton);

			// And: The cancel button is clicked
			const cancelButton = await screen.findByText('Cancel');
			fireEvent.click(cancelButton);

			// Then: onDelete should not be called
			expect(mockDelete).not.toHaveBeenCalled();
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
					isEditing={false}
					onSetEditing={() => {}}
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
					isEditing={false}
					onSetEditing={() => {}}
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
			const Wrapper = () => {
				const [editingId, setEditingId] = useState<string | null>(null);
				return (
					<TodoItem
						todo={mockIncompleteTodo}
						{...mockHandlers}
						isEditing={mockIncompleteTodo.id === editingId}
						onSetEditing={setEditingId}
					/>
				);
			};
			render(<Wrapper />);
			const editButtons = screen.getAllByLabelText(/edit todo/i);
			const editButton = editButtons.find(
				el => el.tagName === 'BUTTON' && el.classList.contains('h-7')
			);
			expect(editButton).toBeInTheDocument();

			// When: The edit button is clicked
			if (editButton) {
				await userEvent.click(editButton);
			} else {
				throw new Error('Edit button not found');
			}

			// Then: The edit form should be displayed
			expect(screen.getByRole('textbox', { name: /edit title/i })).toBeInTheDocument();
			expect(screen.getByRole('textbox', { name: /edit description/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /cancel$/i })).toBeInTheDocument();
		});

		it('should call onSave and exit edit mode when save button is clicked', async () => {
			// Given: The component is in edit mode
			let currentEditingId: string | null = mockIncompleteTodo.id; // Start in edit mode
			const setEditingIdMock = vi.fn((id: string | null) => {
				currentEditingId = id;
			});

			const Wrapper = () => {
				return (
					<TodoItem
						todo={mockIncompleteTodo}
						{...mockHandlers}
						isEditing={mockIncompleteTodo.id === currentEditingId}
						onSetEditing={setEditingIdMock}
					/>
				);
			};

			const { rerender } = render(<Wrapper />);

			// When: Data is entered and saved
			const titleInput = screen.getByLabelText(/edit title/i);
			const newTitle = 'Updated Title';
			const descriptionInput = screen.getByLabelText(/edit description/i);
			const newDescription = 'Updated Description';
			await userEvent.clear(titleInput);
			await userEvent.type(titleInput, newTitle);
			await userEvent.clear(descriptionInput);
			await userEvent.type(descriptionInput, newDescription);

			// Use the mocked date picker to set a date
			const mockDatePicker = screen.getByTestId('mocked-new-due-date-picker');
			const selectDateButton = within(mockDatePicker).getByTestId('select-date');
			await userEvent.click(selectDateButton);

			// When: The priority is changed
			const priorityButton = screen.getByRole('button', { name: /select priority for this task/i });
			await userEvent.click(priorityButton);
			const lowOption = await screen.findByRole('menuitemradio', { name: /low/i });
			await userEvent.click(lowOption);

			// And: The save button is clicked
			const saveButton = screen.getByRole('button', { name: /save changes/i });
			await userEvent.click(saveButton);

			// Then: onSave should be called with the correct id and updated fields
			expect(mockHandlers.onSave).toHaveBeenLastCalledWith(
				mockIncompleteTodo.id,
				expect.objectContaining({
					title: newTitle,
					description: newDescription,
					dueDate: '2025-05-13T00:00:00Z',
					priority: 'low',
				})
			);

			// And: onSetEditing should be called with null
			expect(setEditingIdMock).toHaveBeenCalledWith(null);

			// Rerender the wrapper with the new state to simulate exit
			rerender(<Wrapper />);

			// And: The component should exit edit mode
			expect(screen.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();
		});

		it('should cancel editing and revert changes when cancel button is clicked', async () => {
			// Given: The component is in edit mode
			let currentEditingId_cancel: string | null = mockIncompleteTodo.id; // Start in edit mode
			const setEditingIdMock_cancel = vi.fn((id: string | null) => {
				currentEditingId_cancel = id;
			});

			const WrapperCancel = () => {
				return (
					<TodoItem
						todo={mockIncompleteTodo}
						{...mockHandlers}
						isEditing={mockIncompleteTodo.id === currentEditingId_cancel}
						onSetEditing={setEditingIdMock_cancel}
					/>
				);
			};

			const { rerender: rerenderCancel } = render(<WrapperCancel />);

			// When: Some changes are made
			const titleInput = screen.getByLabelText(/edit title/i);
			await userEvent.type(titleInput, 'Temporary Change');
			const descriptionInput = screen.getByLabelText(/edit description/i);
			await userEvent.type(descriptionInput, 'Temp Desc');
			// No need to interact with date picker for cancel test

			// And: The cancel button is clicked
			const cancelButton = screen.getByRole('button', { name: /cancel$/i });
			await userEvent.click(cancelButton);

			// Then: onSetEditing should be called with null
			expect(setEditingIdMock_cancel).toHaveBeenCalledWith(null);

			// Rerender the wrapper with the new state to simulate exit
			rerenderCancel(<WrapperCancel />);

			// Then: The component should exit edit mode
			expect(screen.queryByRole('textbox', { name: /edit title/i })).not.toBeInTheDocument();

			// And: onSave should not have been called
			expect(mockHandlers.onSave).not.toHaveBeenCalled();

			// And: The displayed title should be the original title
			expect(screen.getByText(mockIncompleteTodo.title)).toBeInTheDocument();
		});
	});
});
