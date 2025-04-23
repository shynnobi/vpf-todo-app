import { ArrowUpDown, CalendarClock } from 'lucide-react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { filterPriorityOptions } from '@/constants/priorities';
import { DueDateFilter, useTodoStore } from '@/store/todoStore';
import { PriorityLevel } from '@/types/todoTypes';

// Helper to map DueDateFilter to string for Select value
const dueDateFilterToString = (filter: DueDateFilter): string => {
	return filter ?? 'all';
};

// Helper to map string from Select back to DueDateFilter
const stringToDueDateFilter = (value: string): DueDateFilter => {
	if (value === 'all') return undefined;
	return value as DueDateFilter; // Assume 'overdue', 'no-due-date'
};

export function AdvancedFilters() {
	// Use atomic selectors for state and actions
	const priorityFilter = useTodoStore(state => state.priorityFilter);
	const dueDateFilter = useTodoStore(state => state.dueDateFilter);
	const setPriorityFilter = useTodoStore(state => state.setPriorityFilter);
	const setDueDateFilter = useTodoStore(state => state.setDueDateFilter);

	const handlePriorityChange = (value: string) => {
		const selectedPriority: PriorityLevel | null | undefined =
			value === 'all' ? undefined : (value as PriorityLevel | null);
		setPriorityFilter(selectedPriority);
	};

	const handleDueDateChange = (value: string) => {
		setDueDateFilter(stringToDueDateFilter(value));
	};

	// Determine the display value for the trigger using the shared options
	const currentPriorityLabel =
		filterPriorityOptions.find(opt => opt.value === (priorityFilter ?? 'all'))?.label ||
		'Filter by priority...';

	return (
		<div className="flex items-center gap-2">
			{/* Priority Filter */}
			<Select value={String(priorityFilter ?? 'all')} onValueChange={handlePriorityChange}>
				<SelectTrigger className="w-[180px] text-muted-foreground">
					<ArrowUpDown className="mr-2 h-4 w-4" />
					<SelectValue placeholder="Filter by priority...">{currentPriorityLabel}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{filterPriorityOptions.map(option => (
						<SelectItem key={String(option.value)} value={String(option.value)}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Due Date Filter */}
			<Select value={dueDateFilterToString(dueDateFilter)} onValueChange={handleDueDateChange}>
				<SelectTrigger className="w-[180px] text-muted-foreground">
					<CalendarClock className="mr-2 h-4 w-4" />
					<SelectValue placeholder="Filter by due date..." />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All Due Dates</SelectItem>
					<SelectItem value="overdue">Overdue</SelectItem>
					<SelectItem value="no-due-date">No Due Date</SelectItem>
					{/* Add more date options here if needed later (e.g., today, tomorrow) */}
				</SelectContent>
			</Select>
		</div>
	);
}
