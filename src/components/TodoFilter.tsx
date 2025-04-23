import { TodoFilter as FilterType, TodoFilterProps } from '@/types/todoTypes';

/**
 * Component displaying filter options for the todo list.
 */
export function TodoFilter({ currentFilter, onFilterChange, counts }: TodoFilterProps) {
	const filterButtons = [
		{ label: 'All', value: FilterType.All, count: counts[FilterType.All], aria: 'Show all todos' },
		{
			label: 'Active',
			value: FilterType.Active,
			count: counts[FilterType.Active],
			aria: 'Show active todos',
		},
		{
			label: 'Completed',
			value: FilterType.Completed,
			count: counts[FilterType.Completed],
			aria: 'Show completed todos',
		},
	];

	return (
		<div className="flex items-center justify-center space-x-2 rounded-md text-muted-foreground">
			{filterButtons.map(({ label, value, count, aria }) => {
				const isPressed = currentFilter === value;
				const buttonClass = isPressed
					? 'px-4 py-2 rounded-md bg-blue-500 text-white text-sm cursor-pointer'
					: 'px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm cursor-pointer';

				return (
					<button
						key={value}
						aria-label={aria}
						aria-pressed={isPressed}
						className={buttonClass}
						onClick={() => onFilterChange(value)}
					>
						{label}
						<span className="ml-1 text-sm font-bold">{count}</span>
					</button>
				);
			})}
		</div>
	);
}
