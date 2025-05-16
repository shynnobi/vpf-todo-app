import React from 'react';
import { CheckSquare, LayoutList, ListTodo } from 'lucide-react';

import { TodoFilter as FilterType, TodoFilterProps } from '@/types/todoTypes';

/**
 * Component displaying filter options for the todo list.
 */
export function TodoFilter({ currentFilter, onFilterChange, counts }: TodoFilterProps) {
	const filterButtons: {
		label: string;
		value: FilterType;
		count: number;
		aria: string;
		icon: React.ComponentType<{ className?: string }>;
	}[] = [
		{
			label: 'All',
			value: FilterType.All,
			count: counts[FilterType.All],
			aria: 'Show all todos',
			icon: ListTodo,
		},
		{
			label: 'Active',
			value: FilterType.Active,
			count: counts[FilterType.Active],
			aria: 'Show active todos',
			icon: LayoutList,
		},
		{
			label: 'Completed',
			value: FilterType.Completed,
			count: counts[FilterType.Completed],
			aria: 'Show completed todos',
			icon: CheckSquare,
		},
	];

	return (
		<div
			className="flex items-center justify-center space-x-2 rounded-md text-muted-foreground"
			role="toolbar"
			aria-label="Filter todos"
			aria-orientation="horizontal"
		>
			{filterButtons.map(({ label, value, count, aria, icon: Icon }) => {
				const isPressed = currentFilter === value;
				const buttonClass =
					'flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-md text-xs sm:text-sm ' +
					(isPressed
						? 'bg-blue-500 text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700');

				return (
					<button
						key={value}
						aria-label={`${aria} (${count})`}
						aria-pressed={isPressed}
						aria-current={isPressed ? 'page' : undefined}
						className={buttonClass}
						onClick={() => onFilterChange(value)}
					>
						<Icon className="h-5 w-5 mb-0.5 sm:mb-0" aria-hidden="true" />
						<span className="text-center">
							{label}
							<span className="ml-1 font-bold">{count}</span>
						</span>
					</button>
				);
			})}
		</div>
	);
}
