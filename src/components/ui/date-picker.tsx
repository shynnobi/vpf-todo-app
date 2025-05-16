'use client';

import * as React from 'react';
import { CalendarIcon, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/dateUtils';

interface DatePickerProps {
	value?: Date;
	onChange: (date?: Date) => void;
	placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = 'Due date' }: DatePickerProps) {
	const [isOpen, setIsOpen] = React.useState(false);

	const handleSelect = (selectedDate?: Date) => {
		onChange(selectedDate);
		setIsOpen(false);
	};

	const handleClear = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation();
		onChange(undefined);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'justify-start text-left font-normal relative w-full sm:w-auto cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2', // Added focus styles
						!value && 'text-muted-foreground'
					)}
					aria-label={
						value ? `Selected date: ${formatDate(value)}` : `Select ${placeholder.toLowerCase()}`
					}
					aria-expanded={isOpen}
					aria-haspopup="dialog"
				>
					<CalendarIcon className="mr-1 h-4 w-4 flex-shrink-0" aria-hidden="true" />
					<span className="flex-grow">
						{value ? formatDate(value) : <span>{placeholder}</span>} {/* Used formatDate */}
					</span>
					{value && (
						<span
							role="button"
							aria-label="Clear date"
							className="ml-auto p-1 rounded-full cursor-pointer flex-shrink-0 bg-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
							onClick={handleClear}
							tabIndex={0}
							onKeyDown={e => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleClear(e as unknown as React.MouseEvent<HTMLSpanElement>);
								}
							}}
						>
							<X className="h-4 w-4" aria-hidden="true" />
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={value}
					onSelect={handleSelect}
					autoFocus
					initialFocus
					aria-label="Select a date"
				/>
			</PopoverContent>
		</Popover>
	);
}
