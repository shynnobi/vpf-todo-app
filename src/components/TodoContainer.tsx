import { useMemo } from 'react';

import { AddTodoForm } from '@/components/AddTodoForm';
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

	// Actions selectors (these are stable)
	const addTodo = useTodoStore(state => state.addTodo);
	const toggleTodo = useTodoStore(state => state.toggleTodo);
	const deleteTodo = useTodoStore(state => state.deleteTodo);
	const setFilter = useTodoStore(state => state.setFilter);
	const updateTodo = useTodoStore(state => state.updateTodo);

	const filteredTodos = useMemo(() => {
		switch (filter) {
			case FilterType.Active:
				return todos.filter(todo => !todo.completed);
			case FilterType.Completed:
				return todos.filter(todo => todo.completed);
			case FilterType.All:
			default:
				return todos;
		}
	}, [todos, filter]);

	const counts = useMemo(
		() => ({
			[FilterType.All]: todos.length,
			[FilterType.Active]: todos.filter(todo => !todo.completed).length,
			[FilterType.Completed]: todos.filter(todo => todo.completed).length,
		}),
		[todos]
	);

	return (
		<div className="max-w-xl mx-auto p-4">
			<h1 className="text-2xl font-bold text-center mb-6">Todo App</h1>
			<AddTodoForm onAddTodo={addTodo} />
			<TodoFilter currentFilter={filter} onFilterChange={setFilter} counts={counts} />
			<TodoList
				todos={filteredTodos}
				onToggleTodo={toggleTodo}
				onDeleteTodo={deleteTodo}
				onSaveTodo={updateTodo}
			/>
			<p className="text-center text-sm text-gray-500 mt-4">
				{counts[FilterType.All]} tasks total
				{filter !== FilterType.All && ` (${filteredTodos.length} shown)`}
			</p>
		</div>
	);
}
