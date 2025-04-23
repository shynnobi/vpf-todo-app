import { SortCriterion } from '@/store/todoStore';

// Define sort options with labels for the Select component
// TODO: Potentially add Lucide icons here later
export const sortOptions: {
	value: string;
	label: string;
	criterion: SortCriterion;
	direction: 'asc' | 'desc';
}[] = [
	{
		value: 'creationDate_desc',
		label: 'Creation Date (Newest)',
		criterion: 'creationDate',
		direction: 'desc',
	},
	{
		value: 'creationDate_asc',
		label: 'Creation Date (Oldest)',
		criterion: 'creationDate',
		direction: 'asc',
	},
	{
		value: 'priority_desc',
		label: 'Priority (High > Low)',
		criterion: 'priority',
		direction: 'desc',
	},
	{
		value: 'priority_asc',
		label: 'Priority (Low > High)',
		criterion: 'priority',
		direction: 'asc',
	},
	{ value: 'title_asc', label: 'Title (A-Z)', criterion: 'title', direction: 'asc' },
	{ value: 'title_desc', label: 'Title (Z-A)', criterion: 'title', direction: 'desc' },
	{ value: 'dueDate_asc', label: 'Due Date (Soonest)', criterion: 'dueDate', direction: 'asc' },
	{ value: 'dueDate_desc', label: 'Due Date (Latest)', criterion: 'dueDate', direction: 'desc' },
];
