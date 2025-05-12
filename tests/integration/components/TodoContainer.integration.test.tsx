import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TodoContainer } from '@/components/TodoContainer';
import { useTodoStore } from '@/store/todoStore';
import { CreateTodoParams, Todo } from '@/types/todoTypes';

/**
 * Integration tests for the TodoContainer component following BDD approach.
 */
describe('TodoContainer Component - Integration Tests', () => {
	// Get the store actions before each test
	let addTodo: (params: CreateTodoParams) => Todo;

	// Reset the store before each test
	beforeEach(() => {
		// Reset store before each test to ensure isolation
		// Directly call the reset action from the store
		useTodoStore.getState().reset();
		// Mock localStorage for the test environment
		const localStorageMock = (() => {
			let store: Record<string, string> = {};
			return {
				getItem(key: string) {
					return store[key] || null;
				},
				setItem(key: string, value: string) {
					store[key] = value.toString();
				},
				removeItem(key: string) {
					delete store[key];
				},
				clear() {
					store = {};
				},
			};
		})();
		if (typeof window !== 'undefined') {
			Object.defineProperty(window, 'localStorage', {
				value: localStorageMock,
				writable: true, // Allow redefining for subsequent tests if needed
			});
		}

		// Get actions for use within tests
		addTodo = useTodoStore.getState().addTodo;

		if (typeof window !== 'undefined') {
			window.localStorage.removeItem('todo-storage');
		}
	});

	// Clean up after each test as well
	afterEach(() => {
		// Then: Clean up after the test
		useTodoStore.setState(useTodoStore.getInitialState(), true);

		if (typeof window !== 'undefined') {
			window.localStorage.removeItem('todo-storage');
		}
	});

	describe('Initial Rendering', () => {
		it('should display empty state when no todos exist', () => {
			// Given: The store is empty

			// When: The component is rendered
			act(() => {
				render(<TodoContainer />);
			});

			// Then: It should display the empty state message
			expect(screen.getByText(/No todos to display/i)).toBeInTheDocument();

			// And: The todo count should be 0
			expect(screen.getByText('0 tasks total')).toBeInTheDocument();
		});
	});

	describe('Todo Addition', () => {
		it('should add a todo to the store when the form is submitted', async () => {
			// Given: The component is rendered
			act(() => {
				render(<TodoContainer />);
			});

			// When: A new todo is added through the form
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await act(async () => {
				fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
				fireEvent.click(screen.getByRole('button', { name: /add/i }));
			});

			// Then: The todo count should be updated
			expect(screen.getByText('1 tasks total')).toBeInTheDocument();

			// And: The todo should be visible in the list
			expect(screen.getByText('Test Todo')).toBeInTheDocument();

			// And: A checkbox should be present
			const checkbox = screen.getByRole('checkbox', { hidden: true });
			expect(checkbox).toBeInTheDocument();
			expect(checkbox).toHaveAttribute('data-state', 'unchecked');
		});

		it('should be able to add multiple todos', async () => {
			// Given: The component is rendered
			act(() => {
				render(<TodoContainer />);
			});

			// When: Multiple todos are added
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const addButton = screen.getByRole('button', { name: /add/i });

			// When: First todo is added
			await act(async () => {
				fireEvent.change(inputElement, { target: { value: 'First Todo' } });
				fireEvent.click(addButton);
			});

			// When: Second todo is added
			await act(async () => {
				fireEvent.change(inputElement, { target: { value: 'Second Todo' } });
				fireEvent.click(addButton);
			});

			// Then: The todo count should reflect the number of todos
			expect(screen.getByText('2 tasks total')).toBeInTheDocument();

			// And: Both todos should be visible in the list
			expect(screen.getByText('First Todo')).toBeInTheDocument();
			expect(screen.getByText('Second Todo')).toBeInTheDocument();

			// And: Two checkboxes should be present
			const checkboxes = screen.getAllByRole('checkbox', { hidden: true });
			expect(checkboxes).toHaveLength(2);
		});
	});

	describe('Todo Interaction', () => {
		it('should toggle todo completion when checkbox is clicked', async () => {
			// Given: The component is rendered with a todo
			act(() => {
				render(<TodoContainer />);
			});

			// And: A todo is added
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await act(async () => {
				fireEvent.change(inputElement, { target: { value: 'Toggle Test Todo' } });
				fireEvent.click(screen.getByRole('button', { name: /add/i }));
			});

			// When: The checkbox is clicked
			const checkbox = screen.getByRole('checkbox', { hidden: true });
			expect(checkbox).toHaveAttribute('data-state', 'unchecked');
			await act(async () => {
				fireEvent.click(checkbox);
			});

			// Then: The todo should be marked as completed
			expect(checkbox).toHaveAttribute('data-state', 'checked');

			// And: The todo text should have the completed style
			const todoText = screen.getByText('Toggle Test Todo');
			expect(todoText).toHaveClass('line-through');
		});

		it('should delete a todo when the delete button is clicked', async () => {
			// Given: The component is rendered with a todo
			act(() => {
				render(<TodoContainer />);
			});

			// And: A todo is added
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await act(async () => {
				fireEvent.change(inputElement, { target: { value: 'Todo to Delete' } });
				fireEvent.click(screen.getByRole('button', { name: /add/i }));
			});

			// Then: The todo should be visible in the list
			expect(screen.getByText('Todo to Delete')).toBeInTheDocument();
			expect(screen.getByText('1 tasks total')).toBeInTheDocument();

			// When: The delete button is clicked
			const deleteButton = screen.getByRole('button', { name: /delete todo: todo to delete/i });
			await act(async () => {
				fireEvent.click(deleteButton);
			});

			// Then: The todo should be removed
			expect(screen.queryByText('Todo to Delete')).not.toBeInTheDocument();
			expect(screen.getByText('0 tasks total')).toBeInTheDocument();
			expect(screen.getByText(/No todos to display/i)).toBeInTheDocument();
		});

		it('should be able to delete one of multiple todos', async () => {
			// Given: The component is rendered with multiple todos
			act(() => {
				render(<TodoContainer />);
			});

			// And: Multiple todos are added
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			const addButton = screen.getByRole('button', { name: /add/i });

			// When: First todo is added
			await act(async () => {
				fireEvent.change(inputElement, { target: { value: 'Keep this todo' } });
				fireEvent.click(addButton);
			});

			// When: Second todo is added
			await act(async () => {
				fireEvent.change(inputElement, { target: { value: 'Delete this todo' } });
				fireEvent.click(addButton);
			});

			// Then: Both todos should be added to the list
			expect(screen.getByText('Keep this todo')).toBeInTheDocument();
			expect(screen.getByText('Delete this todo')).toBeInTheDocument();
			expect(screen.getByText('2 tasks total')).toBeInTheDocument();

			// When: The delete button for the second todo is clicked
			const deleteButtons = screen.getAllByRole('button', { name: /delete todo/i });
			// Find the delete button for "Delete this todo"
			const deleteButtonForSecondTodo = deleteButtons.find(button =>
				button.getAttribute('aria-label')?.includes('Delete this todo')
			);

			// Then: Verify the button exists before clicking it
			expect(deleteButtonForSecondTodo).toBeDefined();
			if (deleteButtonForSecondTodo) {
				await act(async () => {
					fireEvent.click(deleteButtonForSecondTodo);
				});
			}

			// Then: Only the second todo should be removed
			expect(screen.getByText('Keep this todo')).toBeInTheDocument();
			expect(screen.queryByText('Delete this todo')).not.toBeInTheDocument();
			expect(screen.getByText('1 tasks total')).toBeInTheDocument();
		});
	});

	describe('Persistence Integration', () => {
		it('should load persisted todos when the component remounts', async () => {
			// Given: The component is rendered for the first time
			let unmount: () => void;
			act(() => {
				({ unmount } = render(<TodoContainer />));
			});

			// When: A todo is added
			const inputElement = screen.getByPlaceholderText(/what's on your mind/i);
			await act(async () => {
				fireEvent.change(inputElement, { target: { value: 'Persisted Task' } });
				fireEvent.click(screen.getByRole('button', { name: /add/i }));
			});

			// Then: The todo should be added to the list
			await waitFor(() => {
				expect(screen.getByText('Persisted Task')).toBeInTheDocument();
			});
			await waitFor(() => {
				expect(screen.getByText('1 tasks total')).toBeInTheDocument();
			});

			// When: The component is unmounted and remounted to test persistence
			act(() => {
				unmount();
			});

			act(() => {
				render(<TodoContainer />);
			});

			// Then: The todo should persist after remount
			await waitFor(() => {
				expect(screen.getByText('Persisted Task')).toBeInTheDocument();
			});
			await waitFor(() => {
				expect(screen.getByText('1 tasks total')).toBeInTheDocument();
			});

			// And: Input should be empty after remount
			const inputAfterRemount = screen.getByPlaceholderText(
				/what's on your mind/i
			) as HTMLInputElement;
			expect(inputAfterRemount.value).toBe('');
		});
	});

	it('allows adding, completing, and deleting todos through the UI', async () => {
		// Given: The component is rendered
		act(() => {
			render(<TodoContainer />);
		});
		const input = screen.getByPlaceholderText(/what's on your mind/i);

		// When: Adding a todo
		await act(async () => {
			fireEvent.change(input, { target: { value: 'Test Todo' } });
			fireEvent.click(screen.getByRole('button', { name: /add/i }));
		});

		// Then: The todo should be visible
		const todoItem = await screen.findByText('Test Todo');
		expect(todoItem).toBeInTheDocument();

		// When: Toggling completion
		const checkbox = await screen.findByRole('checkbox', { hidden: true });
		await act(async () => {
			fireEvent.click(checkbox);
		});

		// Then: The todo should be marked as completed
		await waitFor(() => {
			expect(checkbox).toHaveAttribute('data-state', 'checked');
		});

		// When: Deleting the todo
		const deleteButton = await screen.findByRole('button', { name: /delete/i });
		await act(async () => {
			fireEvent.click(deleteButton);
		});

		// Then: The todo should be removed
		await waitFor(() => {
			expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
		});
	});

	it('displays the correct count of todos', async () => {
		// Given: The component is rendered
		act(() => {
			render(<TodoContainer />);
		});
		const input = screen.getByPlaceholderText(/what's on your mind/i);
		const addButton = screen.getByRole('button', { name: /add/i });

		// When: Adding first todo
		await act(async () => {
			fireEvent.change(input, { target: { value: 'First Todo' } });
			fireEvent.click(addButton);
		});
		await screen.findByText('First Todo'); // Wait for first todo

		// When: Adding second todo
		await act(async () => {
			fireEvent.change(input, { target: { value: 'Second Todo' } });
			fireEvent.click(addButton);
		});
		await screen.findByText('Second Todo'); // Wait for second todo

		// Then: The count should be updated to reflect both todos
		expect(await screen.findByText('2 tasks total')).toBeInTheDocument();
	});

	describe('Filtering UI and Logic', () => {
		const ACTIVE_TODO_TEXT = 'Active Todo Item';
		const COMPLETED_TODO_TEXT = 'Completed Todo Item';

		// Helper to add initial todos for filter tests
		const setupTodos = async () => {
			// Given: Input elements to add todos
			const input = screen.getByPlaceholderText(/what's on your mind/i);
			const addButton = screen.getByRole('button', { name: /add/i });

			// When: Adding active todo
			await act(async () => {
				fireEvent.change(input, { target: { value: ACTIVE_TODO_TEXT } });
				fireEvent.click(addButton);
			});
			await screen.findByText(ACTIVE_TODO_TEXT); // Wait for the first todo to appear

			// When: Adding completed todo
			await act(async () => {
				fireEvent.change(input, { target: { value: COMPLETED_TODO_TEXT } });
				fireEvent.click(addButton);
			});
			const addedCompletedTodo = await screen.findByText(COMPLETED_TODO_TEXT); // Wait for the second todo

			// Mark the second todo as completed
			const listItem = addedCompletedTodo.closest('li');
			if (!listItem) throw new Error('List item for completed todo not found');
			const checkbox = listItem.querySelector('button[role="checkbox"]') as HTMLButtonElement;
			if (!checkbox) throw new Error('Checkbox for completed todo not found');

			await act(async () => {
				fireEvent.click(checkbox);
			});
			await waitFor(() => expect(checkbox).toHaveAttribute('data-state', 'checked')); // Confirm it's checked
		};

		it('should filter to show only active todos when Active button is clicked', async () => {
			// Given: The store is initialized with todos
			act(() => {
				render(<TodoContainer />);
			});
			await setupTodos();

			// Given: The activeButton is found after todos are set up
			const activeButton = await screen.findByRole('button', { name: /show active todos/i });

			// When: Clicking the active filter button
			await act(async () => {
				fireEvent.click(activeButton);
			});

			// Then: Only active todos should be visible
			await waitFor(() => {
				expect(screen.getByText(ACTIVE_TODO_TEXT)).toBeInTheDocument();
				expect(screen.queryByText(COMPLETED_TODO_TEXT)).not.toBeInTheDocument();
				expect(activeButton).toHaveAttribute('aria-pressed', 'true');
				expect(screen.getByRole('button', { name: /show all todos/i })).toHaveAttribute(
					'aria-pressed',
					'false'
				);
			});
		});

		it('should filter to show only completed todos when Completed button is clicked', async () => {
			// Given: The store is initialized with todos
			act(() => {
				render(<TodoContainer />);
			});
			await setupTodos();

			// Given: The completedButton is found after todos are set up
			const completedButton = await screen.findByRole('button', { name: /show completed todos/i });

			// When: Clicking the completed filter button
			await act(async () => {
				fireEvent.click(completedButton);
			});

			// Then: Only completed todos should be visible
			await waitFor(() => {
				expect(screen.queryByText(ACTIVE_TODO_TEXT)).not.toBeInTheDocument();
				expect(screen.getByText(COMPLETED_TODO_TEXT)).toBeInTheDocument();
				expect(completedButton).toHaveAttribute('aria-pressed', 'true');
				expect(screen.getByRole('button', { name: /show all todos/i })).toHaveAttribute(
					'aria-pressed',
					'false'
				);
			});
		});

		it('should show all todos when All button is clicked after filtering', async () => {
			// Given: The store is initialized with todos
			act(() => {
				render(<TodoContainer />);
			});
			await setupTodos();

			// When: Active filter is applied first
			const activeButton = await screen.findByRole('button', { name: /show active todos/i });
			await act(async () => {
				fireEvent.click(activeButton);
			});

			// Then: Only active todos should be visible
			await waitFor(() => expect(screen.queryByText(COMPLETED_TODO_TEXT)).not.toBeInTheDocument());

			// When: All filter is applied
			const allButton = await screen.findByRole('button', { name: /show all todos/i });
			await act(async () => {
				fireEvent.click(allButton);
			});

			// Then: All todos should be visible again
			await waitFor(() => {
				expect(screen.getByText(ACTIVE_TODO_TEXT)).toBeInTheDocument();
				expect(screen.getByText(COMPLETED_TODO_TEXT)).toBeInTheDocument();
				expect(allButton).toHaveAttribute('aria-pressed', 'true');
				expect(activeButton).toHaveAttribute('aria-pressed', 'false');
			});
		});

		it('should update filter counts when a todo status changes', async () => {
			// Given: The store is initialized with two active todos
			act(() => {
				render(<TodoContainer />);
			});
			const input = screen.getByPlaceholderText(/what's on your mind/i);
			const addButton = screen.getByRole('button', { name: /add/i });

			// When: Adding two active todos
			await act(async () => {
				fireEvent.change(input, { target: { value: 'First Active' } });
				fireEvent.click(addButton);
			});
			await screen.findByText('First Active');

			await act(async () => {
				fireEvent.change(input, { target: { value: 'Second Active' } });
				fireEvent.click(addButton);
			});
			await screen.findByText('Second Active');

			// Then: Initial counts should reflect two active todos
			const allButton = await screen.findByRole('button', { name: /show all todos/i });
			const activeButton = await screen.findByRole('button', { name: /show active todos/i });
			const completedButton = await screen.findByRole('button', { name: /show completed todos/i });

			expect(allButton).toBeInTheDocument();
			expect(within(allButton).getByText('2', { exact: false })).toBeInTheDocument();

			expect(activeButton).toBeInTheDocument();
			expect(within(activeButton).getByText('2', { exact: false })).toBeInTheDocument();

			expect(completedButton).toBeInTheDocument();
			expect(within(completedButton).getByText('0', { exact: false })).toBeInTheDocument();

			// When: Marking the second todo as completed
			const listItems = screen.getAllByRole('listitem');
			const secondListItem = listItems.find(item => item.textContent?.includes('Second Active'));
			if (!secondListItem) throw new Error('Second list item not found');
			const checkbox = secondListItem.querySelector('button[role="checkbox"]') as HTMLButtonElement;
			if (!checkbox) throw new Error('Checkbox not found in second item');

			await act(async () => {
				fireEvent.click(checkbox);
			});

			// Then: Counts should update to reflect one active and one completed todo
			await waitFor(() => {
				const updatedAllButton = screen.getByRole('button', { name: /show all todos/i });
				const updatedActiveButton = screen.getByRole('button', { name: /show active todos/i });
				const updatedCompletedButton = screen.getByRole('button', {
					name: /show completed todos/i,
				});

				expect(within(updatedAllButton).getByText('2', { exact: false })).toBeInTheDocument();
				expect(within(updatedActiveButton).getByText('1', { exact: false })).toBeInTheDocument();
				expect(within(updatedCompletedButton).getByText('1', { exact: false })).toBeInTheDocument();
			});
		});
	});

	describe('Sorting Logic', () => {
		it('should display sorting controls with default sort (creation date descending)', () => {
			// Given: Directly add todos with specific creation dates to the store
			const firstTodo = addTodo({ title: 'First Task' });
			const secondTodo = addTodo({ title: 'Second Task' });

			// Manually update the creation dates to ensure proper ordering
			useTodoStore.setState({
				todos: [
					{ ...firstTodo, creationDate: '2023-01-01T10:00:00Z' }, // Newer
					{ ...secondTodo, creationDate: '2023-01-01T09:00:00Z' }, // Older
				],
			});

			render(<TodoContainer />);

			// Ensure default sort is applied before checking order
			act(() => {
				useTodoStore.getState().setSortConfig('creationDate');
			});

			// Then: Get the desktop controls container
			const controlsContainer = screen.getByLabelText(/filter and sort controls \(desktop\)/i);
			expect(controlsContainer).toBeInTheDocument();

			// Find the combobox and button *within* that container
			const sortBySelectTrigger = within(controlsContainer).getByRole('combobox', {
				name: /sort by/i,
			});
			expect(sortBySelectTrigger).toBeInTheDocument();

			// And: Default sort option should be selected (Creation Date)
			expect(within(sortBySelectTrigger).getByText(/Creation Date/i)).toBeInTheDocument();

			// And: Sort direction button should be present
			const sortDirectionButton =
				within(controlsContainer).getByLabelText(/change sort direction/i);
			expect(sortDirectionButton).toBeInTheDocument();

			// And: Default direction should be descending (newer first)
			expect(within(sortDirectionButton).queryByTestId('SortAsc')).toBeNull();
			expect(within(sortDirectionButton).queryByTestId('SortDesc')).not.toBeNull();

			// And: The list should be sorted by creation date descending (Newer 'First Task' first)
			const listItems = screen.getAllByRole('listitem');
			expect(listItems[0]).toHaveTextContent('First Task');
			expect(listItems[1]).toHaveTextContent('Second Task');
		});

		it('should sort by Priority descending by default and toggle correctly', async () => {
			// Given: Component is rendered
			act(() => {
				render(<TodoContainer />);
			});

			// When: Adding todos with different priorities (out of order)
			await act(async () => {
				useTodoStore.getState().addTodo({ title: 'Medium Prio', priority: 'medium' });
				useTodoStore.getState().addTodo({ title: 'High Prio', priority: 'high' });
				useTodoStore.getState().addTodo({ title: 'No Prio' });
				useTodoStore.getState().addTodo({ title: 'Low Prio', priority: 'low' });
			});
			await screen.findByText('Low Prio'); // Wait for last todo to render

			// When: Setting sort config directly to Priority
			await act(async () => {
				useTodoStore.getState().setSortConfig('priority');
			});

			// Then: The list should be sorted by priority descending (High > Medium > Low > None)
			await waitFor(() => {
				const listItems = screen.getAllByRole('listitem');
				expect(listItems[0]).toHaveTextContent('High Prio');
				expect(listItems[1]).toHaveTextContent('Medium Prio');
				expect(listItems[2]).toHaveTextContent('Low Prio');
				expect(listItems[3]).toHaveTextContent('No Prio');
			});

			// When: Toggling sort direction directly via store action
			await act(async () => {
				useTodoStore.getState().toggleSortDirection();
			});

			// Then: The list should be sorted by priority ascending (None > Low > Medium > High)
			await waitFor(() => {
				const listItems = screen.getAllByRole('listitem');
				expect(listItems[0]).toHaveTextContent('No Prio');
				expect(listItems[1]).toHaveTextContent('Low Prio');
				expect(listItems[2]).toHaveTextContent('Medium Prio');
				expect(listItems[3]).toHaveTextContent('High Prio');
			});

			// When: Toggling sort direction again directly via store action
			await act(async () => {
				useTodoStore.getState().toggleSortDirection();
			});

			// Then: The list should be sorted by priority descending again
			await waitFor(() => {
				const listItems = screen.getAllByRole('listitem');
				expect(listItems[0]).toHaveTextContent('High Prio');
				expect(listItems[1]).toHaveTextContent('Medium Prio');
				expect(listItems[2]).toHaveTextContent('Low Prio');
				expect(listItems[3]).toHaveTextContent('No Prio');
			});
		});

		// --- Add other sorting tests here ---
	});
});
