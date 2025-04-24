import { useMemo } from 'react';
import { SortAsc, SortDesc } from 'lucide-react';

import { AddTodoForm } from '@/components/AddTodoForm';
import { TodoFilter } from '@/components/TodoFilter';
import { TodoList } from '@/components/TodoList';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { sortCriteriaOptions } from '@/constants/sortOptions';
import { SortCriterion, useTodoStore } from '@/store/todoStore';
import { TodoFilter as FilterType } from '@/types/todoTypes';
import { getFilteredAndSortedTodosUtil } from '@/utils/todoUtils';

/**
 * Container component that orchestrates the Todo application UI.
 */
export function TodoContainer() {
	// Read raw state needed for local computation
	const todos = useTodoStore(state => state.todos);
	const filter = useTodoStore(state => state.filter);
	const sortConfig = useTodoStore(state => state.sortConfig);

	// Actions selectors (these are stable)
	const addTodo = useTodoStore(state => state.addTodo);
	const toggleTodo = useTodoStore(state => state.toggleTodo);
	const deleteTodo = useTodoStore(state => state.deleteTodo);
	const setFilter = useTodoStore(state => state.setFilter);
	const updateTodo = useTodoStore(state => state.updateTodo);
	const setSortConfig = useTodoStore(state => state.setSortConfig);
	const toggleSortDirection = useTodoStore(state => state.toggleSortDirection);

	// Use useMemo to call the utility function only when dependencies change
	const filteredAndSortedTodos = useMemo(() => {
		return getFilteredAndSortedTodosUtil(todos, filter, sortConfig);
	}, [todos, filter, sortConfig]);

	const counts = useMemo(
		() => ({
			[FilterType.All]: todos.length,
			[FilterType.Active]: todos.filter(todo => !todo.completed).length,
			[FilterType.Completed]: todos.filter(todo => todo.completed).length,
		}),
		[todos]
	);

	return (
		<div className="max-w-2xl mx-auto p-4 mt-10">
			{/* <h1 className="text-2xl font-bold text-center mb-6">Todo App</h1> */}
			<AddTodoForm onAddTodo={addTodo} />

			{/* Filter and Sort Controls Row */}
			<div
				className="my-4 flex flex-wrap justify-between gap-3 items-center"
				aria-label="Filter and sort controls"
			>
				{/* Status Filter */}
				<TodoFilter currentFilter={filter} onFilterChange={setFilter} counts={counts} />

				{/* Sorting Controls */}
				<div className="flex items-center gap-2">
					<Select
						value={sortConfig.criterion}
						onValueChange={(value: SortCriterion) => setSortConfig(value)}
					>
						<SelectTrigger className="w-[180px] [&>svg]:hidden cursor-pointer" aria-label="Sort by">
							<SelectValue placeholder="Sort by..." />
						</SelectTrigger>
						<SelectContent>
							{sortCriteriaOptions.map(option => {
								const Icon = option.icon;
								return (
									<SelectItem key={option.value} value={option.value} className="cursor-pointer">
										<div className="flex items-center gap-2">
											<Icon className="h-4 w-4" />
											<span>{option.label}</span>
										</div>
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
					<Button
						variant="outline"
						size="icon"
						onClick={toggleSortDirection}
						aria-label="Change sort direction"
						className="cursor-pointer"
					>
						{sortConfig.direction === 'asc' ? (
							<SortAsc className="h-4 w-4" />
						) : (
							<SortDesc className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>

			{/* Todo List */}
			<TodoList
				todos={filteredAndSortedTodos}
				onToggleTodo={toggleTodo}
				onDeleteTodo={deleteTodo}
				onSaveTodo={updateTodo}
			/>

			{/* Footer Count */}
			<hr className="my-2" />
			<p className="text-center text-sm text-gray-500 mt-4">
				{counts[FilterType.All]} tasks total
				{filter !== FilterType.All && ` (${filteredAndSortedTodos.length} shown)`}
			</p>
		</div>
	);
}
