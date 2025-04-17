import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { TodoContainer } from '@/components/TodoContainer';
import { useTodoStore } from '@/store/todoStore';

const TodoContainerTestHelpers = {
	resetStoreAndStorage: () => {
		act(() => {
			useTodoStore.setState(useTodoStore.getInitialState(), true);
		});
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem('todo-storage');
		}
	},

	addTodo: (title: string, completed = false) => {
		act(() => {
			useTodoStore.getState().addTodo({ title, completed });
		});
	},

	/** Sets up the store with the initial set of todos for filtering tests. */
	setupInitialTodos: () => {
		TodoContainerTestHelpers.addTodo('Active todo 1');
		TodoContainerTestHelpers.addTodo('Active todo 2');
		TodoContainerTestHelpers.addTodo('Completed todo 1', true);
		TodoContainerTestHelpers.addTodo('Completed todo 2', true);
	},
};

describe('TodoContainer - Filtering', () => {
	// Use helpers for setup and teardown
	beforeEach(() => {
		TodoContainerTestHelpers.resetStoreAndStorage();
	});

	it('should render all todos when no filter is applied', async () => {
		// Given: Use the helper to set up todos
		TodoContainerTestHelpers.setupInitialTodos();

		// When: The component is rendered
		render(<TodoContainer />);

		// Then: All 4 todos should be visible
		await waitFor(() => {
			expect(screen.getByText('Active todo 1')).toBeInTheDocument();
			expect(screen.getByText('Active todo 2')).toBeInTheDocument();
			expect(screen.getByText('Completed todo 1')).toBeInTheDocument();
			expect(screen.getByText('Completed todo 2')).toBeInTheDocument();
		});

		// Then: Counter should show all 4 todos
		expect(screen.getByText(/4 tasks total/i)).toBeInTheDocument();
	});

	it('should only display active todos when Active filter is applied', async () => {
		// Given: Use the helper to set up todos
		TodoContainerTestHelpers.setupInitialTodos();

		// When: The component is rendered
		render(<TodoContainer />);

		// When: Clicking on the Active filter button
		const activeButton = await screen.findByRole('button', { name: /show active todos/i });
		// act is needed here because clicking the filter triggers state updates
		await act(async () => {
			fireEvent.click(activeButton);
		});

		// Then: Only active todos should be visible
		await waitFor(() => {
			expect(screen.getByText('Active todo 1')).toBeInTheDocument();
			expect(screen.getByText('Active todo 2')).toBeInTheDocument();
			expect(screen.queryByText('Completed todo 1')).not.toBeInTheDocument();
			expect(screen.queryByText('Completed todo 2')).not.toBeInTheDocument();
		});

		// Then: Counter should show 4 total with 2 shown
		expect(screen.getByText(/4 tasks total \(2 shown\)/i)).toBeInTheDocument();
	});

	it('should only display completed todos when Completed filter is applied', async () => {
		// Given: Use the helper to set up todos
		TodoContainerTestHelpers.setupInitialTodos();

		// When: The component is rendered
		render(<TodoContainer />);

		// When: Clicking on the Completed filter button
		const completedButton = await screen.findByRole('button', { name: /show completed todos/i });
		await act(async () => {
			fireEvent.click(completedButton);
		});

		// Then: Only completed todos should be visible
		await waitFor(() => {
			expect(screen.queryByText('Active todo 1')).not.toBeInTheDocument();
			expect(screen.queryByText('Active todo 2')).not.toBeInTheDocument();
			expect(screen.getByText('Completed todo 1')).toBeInTheDocument();
			expect(screen.getByText('Completed todo 2')).toBeInTheDocument();
		});

		// Then: Counter should show 4 total with 2 shown
		expect(screen.getByText(/4 tasks total \(2 shown\)/i)).toBeInTheDocument();
	});

	it('should return to showing all todos when All filter is clicked', async () => {
		// Given: Use the helper to set up todos
		TodoContainerTestHelpers.setupInitialTodos();

		// When: The component is rendered
		render(<TodoContainer />);

		// When: First applying the Active filter
		const activeButton = await screen.findByRole('button', { name: /show active todos/i });
		// act is needed here
		await act(async () => {
			fireEvent.click(activeButton);
		});

		// When: Then switching back to the All filter
		const allButton = await screen.findByRole('button', { name: /show all todos/i });
		// act is needed here
		await act(async () => {
			fireEvent.click(allButton);
		});

		// Then: All todos should be visible again
		await waitFor(() => {
			expect(screen.getByText('Active todo 1')).toBeInTheDocument();
			expect(screen.getByText('Active todo 2')).toBeInTheDocument();
			expect(screen.getByText('Completed todo 1')).toBeInTheDocument();
			expect(screen.getByText('Completed todo 2')).toBeInTheDocument();
		});

		// Then: Counter should show all 4 todos without the "shown" part
		expect(screen.getByText(/4 tasks total$/i)).toBeInTheDocument();
	});

	it('should update filter counts when todos are added or toggled', async () => {
		// Given: The component is rendered with an empty store (reset by beforeEach)
		render(<TodoContainer />);

		// Then: Initially 0 todos should be shown
		await waitFor(() => {
			expect(screen.getByText(/0 tasks total/i)).toBeInTheDocument();
		});

		// When: Adding a new active todo using the AddTodoForm within TodoContainer
		const addInput = screen.getByPlaceholderText(/add a new todo/i);
		const addButton = screen.getByRole('button', { name: /add/i });

		// act is needed for user interactions triggering state changes
		await act(async () => {
			fireEvent.change(addInput, { target: { value: 'New active todo' } });
			fireEvent.click(addButton);
		});

		// Then: Should now show 1 task, all active
		// waitFor might be needed if state updates are async
		await waitFor(() => {
			expect(screen.getByText(/1 tasks total/i)).toBeInTheDocument();

			// Then: The Active filter button should show (1)
			const activeButton = screen.getByRole('button', { name: /show active todos/i });
			expect(within(activeButton).getByText('1', { exact: false })).toBeInTheDocument();

			// Then: The Completed filter button should show (0)
			const completedButton = screen.getByRole('button', { name: /show completed todos/i });
			expect(within(completedButton).getByText('0', { exact: false })).toBeInTheDocument();
		});

		// When: Toggling the todo to complete it
		const checkbox = screen.getByRole('checkbox');
		// act is needed here
		await act(async () => {
			fireEvent.click(checkbox);
		});

		// Then: Should now show 1 task, all completed
		// waitFor might be needed
		await waitFor(() => {
			expect(screen.getByText(/1 tasks total/i)).toBeInTheDocument();

			// Then: The Active filter button should show (0)
			const activeButton = screen.getByRole('button', { name: /show active todos/i });
			expect(within(activeButton).getByText('0', { exact: false })).toBeInTheDocument();

			// Then: The Completed filter button should show (1)
			const completedButton = screen.getByRole('button', { name: /show completed todos/i });
			expect(within(completedButton).getByText('1', { exact: false })).toBeInTheDocument();
		});
	});
});
