import { SortConfig } from '@/store/todoStore';
import { Todo, TodoFilter as FilterType } from '@/types/todoTypes';

// Helper for priority sorting order
const priorityOrder: Record<string, number> = {
	high: 1,
	medium: 2,
	low: 3,
	null: 4,
	undefined: 4,
};

/**
 * Filters and sorts an array of todos based on the provided filter and sort configuration.
 * @param todos - The original array of todos.
 * @param filter - The status filter to apply (All, Active, Completed).
 * @param sortConfig - The sorting configuration (criterion and direction).
 * @returns A new array containing the filtered and sorted todos.
 */
export function getFilteredAndSortedTodosUtil(
	todos: Todo[],
	filter: FilterType,
	sortConfig: SortConfig
): Todo[] {
	let filteredTodos = [...todos];

	// 1. Apply Status Filter
	if (filter === FilterType.Active) {
		filteredTodos = filteredTodos.filter((todo: Todo) => !todo.completed);
	} else if (filter === FilterType.Completed) {
		filteredTodos = filteredTodos.filter((todo: Todo) => todo.completed);
	}

	// 2. Apply Sorting
	const { criterion, direction } = sortConfig;
	const sortMultiplier = direction === 'asc' ? 1 : -1;

	filteredTodos.sort((a, b) => {
		let comparison = 0;
		switch (criterion) {
			case 'title':
				comparison = a.title.localeCompare(b.title);
				break;
			case 'priority': {
				const orderA = priorityOrder[String(a.priority)];
				const orderB = priorityOrder[String(b.priority)];
				comparison = orderA - orderB;
				break;
			}
			case 'dueDate': {
				const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
				const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
				if (dateA === Infinity && dateB === Infinity) comparison = 0;
				else if (dateA === Infinity) comparison = 1;
				else if (dateB === Infinity) comparison = -1;
				else comparison = dateA - dateB;
				break;
			}
			case 'creationDate': {
				const dateA = new Date(a.creationDate).getTime();
				const dateB = new Date(b.creationDate).getTime();
				comparison = dateA - dateB;
				break;
			}
		}
		// Apply multiplier, adjusting for priority where lower number means higher importance
		if (criterion === 'priority') {
			// If 'asc' (Low > High), reverse the natural comparison (orderA - orderB)
			// If 'desc' (High > Low), keep the natural comparison (orderA - orderB)
			return comparison * (direction === 'asc' ? -1 : 1);
		} else {
			// Standard application for other criteria
			return comparison * sortMultiplier;
		}
	});

	return filteredTodos;
}
