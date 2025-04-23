import { useMemo } from 'react';

import { AddTodoForm } from '@/components/AddTodoForm';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { TodoFilter } from '@/components/TodoFilter';
import { TodoList } from '@/components/TodoList';
import { useTodoStore } from '@/store/todoStore';
import { TodoFilter as FilterType } from '@/types/todoTypes';

/**
 * Container component that orchestrates the Todo application UI.
 */
export function TodoContainer() {
	// Use separate atomic selectors instead of object selector to prevent unnecessary re-renders
	const todos = useTodoStore(state => state.todos);
	const filter = useTodoStore(state => state.filter);
	const priorityFilter = useTodoStore(state => state.priorityFilter);
	const dueDateFilter = useTodoStore(state => state.dueDateFilter);

	// Actions selectors (these are stable)
	const addTodo = useTodoStore(state => state.addTodo);
	const toggleTodo = useTodoStore(state => state.toggleTodo);
	const deleteTodo = useTodoStore(state => state.deleteTodo);
	const setFilter = useTodoStore(state => state.setFilter);
	const updateTodo = useTodoStore(state => state.updateTodo);

	const filteredTodos = useMemo(() => {
		let result = todos;

		// 1. Apply status filter (All, Active, Completed)
		if (filter === FilterType.Active) {
			result = result.filter(todo => !todo.completed);
		} else if (filter === FilterType.Completed) {
			result = result.filter(todo => todo.completed);
		}

		// 2. Apply priority filter (if not 'undefined')
		if (priorityFilter !== undefined) {
			result = result.filter(todo => todo.priority === priorityFilter);
		}

		// 3. Apply due date filter (if not 'undefined')
		if (dueDateFilter !== undefined) {
			const now = new Date();
			if (dueDateFilter === 'overdue') {
				result = result.filter(
					todo => todo.dueDate && new Date(todo.dueDate) < now && !todo.completed
				);
			} else if (dueDateFilter === 'no-due-date') {
				result = result.filter(todo => !todo.dueDate);
			}
			// Potential future date filters (e.g., 'today', 'this-week') could be added here
		}

		return result;
	}, [todos, filter, priorityFilter, dueDateFilter]);

	const counts = useMemo(
		() => ({
			[FilterType.All]: todos.length,
			[FilterType.Active]: todos.filter(todo => !todo.completed).length,
			[FilterType.Completed]: todos.filter(todo => todo.completed).length,
		}),
		[todos]
	);

	return (
		<div className="max-w-xl mx-auto p-4 mt-10">
			{/* <h1 className="text-2xl font-bold text-center mb-6">Todo App</h1> */}
			<AddTodoForm onAddTodo={addTodo} />
			<div className="my-4 flex justify-between gap-3 items-center">
				<TodoFilter currentFilter={filter} onFilterChange={setFilter} counts={counts} />
				<AdvancedFilters />
			</div>
			<TodoList
				todos={filteredTodos}
				onToggleTodo={toggleTodo}
				onDeleteTodo={deleteTodo}
				onSaveTodo={updateTodo}
			/>
			<hr className="my-2" />
			<p className="text-center text-sm text-gray-500 mt-4">
				{counts[FilterType.All]} tasks total
				{filter !== FilterType.All && ` (${filteredTodos.length} shown)`}
			</p>
		</div>
	);
}
