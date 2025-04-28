import React, { useState } from 'react';
import { isBefore, startOfDay, startOfMonth } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/dateUtils';

interface DueDatePickerProps {
	value?: Date;
	onChange: (date?: Date) => void;
}

/**
 * A reusable component for selecting a due date using a calendar popover.
 */
export function DueDatePicker({ value, onChange }: DueDatePickerProps) {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	console.log('[DueDatePicker] Rendering with value:', value);

	const handleSelect = (date?: Date) => {
		onChange(date);
		setIsCalendarOpen(false); // Close popover on selection
	};

	const handleClear = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation(); // Prevent triggering the PopoverTrigger
		onChange(undefined);
	};

	return (
		<Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="cursor-pointer justify-start text-left font-normal relative w-full sm:w-auto" // Added responsive width
					aria-label={
						value ? `Selected due date: ${formatDate(value)}. Change due date.` : 'Select due date'
					} // Improved ARIA label
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					<span className={cn(!value && 'text-muted-foreground')}>
						{value ? formatDate(value) : <span>Due date</span>}
					</span>
					{value && (
						<span
							role="button"
							aria-label="Clear due date"
							className="ml-auto p-1 rounded-full cursor-pointer flex-shrink-0 bg-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100" // Added dark mode styles
							onClick={handleClear}
						>
							<X className="h-4 w-4" />
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={value}
					onSelect={handleSelect}
					disabled={date => isBefore(date, startOfDay(new Date()))}
					fromDate={startOfMonth(new Date())}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
