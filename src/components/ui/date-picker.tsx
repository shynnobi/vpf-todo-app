'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/dateUtils';

interface DatePickerProps {
	value?: Date;
	onChange: (date?: Date) => void;
	placeholder?: string;
	className?: string;
}

export default function DatePicker({
	value,
	onChange,
	placeholder = 'Pick a date',
	className,
}: DatePickerProps) {
	const [isOpen, setIsOpen] = React.useState(false);

	const handleSelect = (selectedDate?: Date) => {
		onChange(selectedDate);
		setIsOpen(false);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'flex items-center justify-start text-left font-normal text-sm relative w-full sm:w-auto cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 gap-x-2 px-3',
						!value && 'text-muted-foreground',
						className
					)}
					aria-label={
						value ? `Selected date: ${formatDate(value)}` : `Select ${placeholder.toLowerCase()}`
					}
					aria-expanded={isOpen}
					aria-haspopup="dialog"
				>
					<CalendarIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
					<span className="flex-grow">
						{value ? formatDate(value) : <span>{placeholder}</span>}
					</span>
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
