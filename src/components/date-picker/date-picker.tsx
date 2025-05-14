'use client';

import * as React from 'react';
// import { format } from 'date-fns'; // No longer needed directly
import { CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/dateUtils'; // Import project's formatDate

// Define props for the controlled component
interface DatePickerProps {
	value?: Date;
	onChange: (date?: Date) => void;
	placeholder?: string; // Optional placeholder
	// We can add other DayPickerProps here if we want to pass them down to the internal Calendar
	// e.g. fromYear, toYear, captionLayout, etc.
	// For now, let's keep it simple and assume Luca's Calendar component handles these well by default
	// or that they can be passed via its own props if this DatePicker becomes a simple wrapper.
}

export default function DatePicker({
	value,
	onChange,
	placeholder = 'Due date', // Default placeholder updated for consistency
	// other props like fromYear, toYear, etc. could be destructured here if passed down
}: DatePickerProps) {
	// const [date, setDate] = React.useState<Date>() // Remove internal state

	// The Popover open state can still be managed internally if not needed outside
	const [isOpen, setIsOpen] = React.useState(false);

	const handleSelect = (selectedDate?: Date) => {
		onChange(selectedDate);
		setIsOpen(false); // Close popover on select
	};

	const handleClear = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation(); // Prevent PopoverTrigger from re-opening
		onChange(undefined);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'justify-start text-left font-normal relative w-full sm:w-auto cursor-pointer', // Added cursor-pointer
						!value && 'text-muted-foreground'
					)}
				>
					<CalendarIcon className="mr-1 h-4 w-4 flex-shrink-0" />
					<span className="flex-grow">
						{value ? formatDate(value) : <span>{placeholder}</span>} {/* Used formatDate */}
					</span>
					{value && (
						<span
							role="button"
							aria-label="Clear date"
							className="ml-auto p-1 rounded-full cursor-pointer flex-shrink-0 bg-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100" // Updated clear button style
							onClick={handleClear}
						>
							<X className="h-4 w-4" />
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar mode="single" selected={value} onSelect={handleSelect} autoFocus />
			</PopoverContent>
		</Popover>
	);
}
