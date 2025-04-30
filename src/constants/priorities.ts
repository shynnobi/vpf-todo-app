import { PriorityLevel } from '@/types/todoTypes';

/**
 * Represents a single priority option for display and selection.
 */
export interface PriorityOption {
	value: PriorityLevel | null; // null represents 'None'
	label: string;
}

/**
 * Represents a priority filter option, including 'All'.
 */
export interface PriorityFilterOption {
	value: PriorityLevel | null | 'all'; // 'all' represents no filter
	label: string;
}

/**
 * Shared list of standard priority levels (excluding 'all').
 */
export const standardPriorityOptions: ReadonlyArray<PriorityOption> = [
	{ value: null, label: 'None' },
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' },
] as const;

/**
 * Shared list of priority filter options (including 'all').
 */
export const filterPriorityOptions: ReadonlyArray<PriorityFilterOption> = [
	{ value: 'all', label: 'All Priorities' },
	...standardPriorityOptions,
] as const;

/**
 * Helper function to get the label for a given priority value.
 */
export const getPriorityLabel = (priority: PriorityLevel | null): string => {
	const option = standardPriorityOptions.find(opt => opt.value === priority);
	return option?.label ?? 'None'; // Default to 'None' if not found (shouldn't happen)
};
