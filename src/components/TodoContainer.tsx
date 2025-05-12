import { useMemo, useState } from 'react';
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

	// State to track which todo item is being edited
	const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

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
		<div className="max-w-2xl mx-auto p-2 sm:p-4 mt-10">
			{/* <h1 className="text-2xl font-bold text-center mb-6">Todo App</h1> */}
			<AddTodoForm onAddTodo={addTodo} />

			{/* Filter and Sort Controls Row */}
			{/* Version mobile : Select pour le filtre et le tri sur une seule ligne */}
			<div
				className="my-4 flex flex-row gap-2 w-full sm:hidden"
				aria-label="Filter and sort controls (mobile)"
			>
				{/* Select pour le filtre */}
				<Select
					value={filter}
					onValueChange={(value: FilterType) => setFilter(value as FilterType)}
					data-testid="mobile-filter-select"
				>
					<SelectTrigger
						className="flex-1 min-w-0"
						aria-label="Filter todos"
						data-testid="mobile-filter-trigger"
					>
						<SelectValue placeholder="Filter" />
					</SelectTrigger>
					<SelectContent data-testid="mobile-filter-content">
						<SelectItem value={FilterType.All} data-testid="mobile-filter-all">
							All
						</SelectItem>
						<SelectItem value={FilterType.Active} data-testid="mobile-filter-active">
							Active
						</SelectItem>
						<SelectItem value={FilterType.Completed} data-testid="mobile-filter-completed">
							Completed
						</SelectItem>
					</SelectContent>
				</Select>

				{/* Select pour le tri (déjà existant) */}
				<Select
					value={sortConfig.criterion}
					onValueChange={(value: SortCriterion) => setSortConfig(value)}
				>
					<SelectTrigger className="flex-1 min-w-0" aria-label="Sort by">
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
					className="cursor-pointer flex-shrink-0"
				>
					{sortConfig.direction === 'asc' ? (
						<SortAsc className="h-4 w-4" data-testid="SortAsc" />
					) : (
						<SortDesc className="h-4 w-4" data-testid="SortDesc" />
					)}
				</Button>
			</div>

			{/* Version desktop : filtres classiques + tri */}
			<div
				className="my-4 hidden sm:flex flex-col sm:flex-row sm:gap-3 sm:justify-between sm:items-end"
				aria-label="Filter and sort controls (desktop)"
			>
				{/* Status Filter */}
				<div className="flex flex-col w-full sm:w-auto">
					<p className="text-sm text-gray-500 mb-1 hidden sm:block">Filter by status</p>
					<TodoFilter currentFilter={filter} onFilterChange={setFilter} counts={counts} />
				</div>

				{/* Sorting Controls */}

				<div className="flex flex-col w-full sm:w-auto">
					<p className="text-sm text-gray-500 mb-1 hidden sm:block">Sort by</p>
					<div className="flex flex-row items-center gap-2 w-full sm:w-auto">
						<Select
							value={sortConfig.criterion}
							onValueChange={(value: SortCriterion) => setSortConfig(value)}
						>
							<SelectTrigger
								className="flex-1 min-w-0 sm:w-[180px] [&>svg]:hidden cursor-pointer"
								aria-label="Sort by"
							>
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
							className="cursor-pointer flex-shrink-0"
						>
							{sortConfig.direction === 'asc' ? (
								<SortAsc className="h-4 w-4" data-testid="SortAsc" />
							) : (
								<SortDesc className="h-4 w-4" data-testid="SortDesc" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Todo List */}
			<TodoList
				todos={filteredAndSortedTodos}
				onToggleTodo={toggleTodo}
				onDeleteTodo={deleteTodo}
				onSaveTodo={updateTodo}
				editingTodoId={editingTodoId}
				onSetEditingTodo={setEditingTodoId}
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
