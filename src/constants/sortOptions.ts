import React from 'react'; // Import React for type
import { CalendarCheck, CalendarPlus, CaseSensitive, Flame } from 'lucide-react'; // Import chosen icons

import { SortCriterion } from '@/store/todoStore';

// Define sort options with labels and icons for the Select component
// Each option represents a sortable criterion.
// The direction (asc/desc) will be handled separately by a toggle button.
export const sortCriteriaOptions: {
	value: SortCriterion;
	label: string;
	icon: React.ComponentType<{ className?: string }>; // Add icon property
}[] = [
	{ value: 'creationDate', label: 'By Creation Date', icon: CalendarPlus },
	{ value: 'priority', label: 'By Priority', icon: Flame },
	{ value: 'title', label: 'By Title', icon: CaseSensitive },
	{ value: 'dueDate', label: 'By Due Date', icon: CalendarCheck },
];
