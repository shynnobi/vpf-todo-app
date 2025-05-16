import React from 'react';
import { ChevronDown, Flame } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getPriorityLabel, standardPriorityOptions } from '@/constants/priorities';
import { cn } from '@/lib/utils';
import { PriorityLevel } from '@/types/todoTypes';

interface PriorityPickerProps {
	value: PriorityLevel | null;
	onPriorityChange: (value: PriorityLevel | null) => void;
	ariaLabel?: string;
	className?: string;
	placeholderLabel?: string;
}

// Renamed to priorityBadges and updated to use colored span elements
const priorityBadges: Record<string, React.ReactNode> = {
	null: null, // No badge for "None"
	low: <span className="h-3 w-3 rounded-full bg-blue-500 inline-block"></span>,
	medium: <span className="h-3 w-3 rounded-full bg-yellow-500 inline-block"></span>,
	high: <span className="h-3 w-3 rounded-full bg-red-500 inline-block"></span>,
};

/**
 * A reusable dropdown component for selecting a task priority level.
 */
export const PriorityPicker: React.FC<PriorityPickerProps> = ({
	value,
	onPriorityChange,
	ariaLabel = 'Select priority',
	className,
	placeholderLabel,
}) => {
	const handleValueChange = (selectedValue: string) => {
		const newPriority = selectedValue === 'null' ? null : (selectedValue as PriorityLevel);
		onPriorityChange(newPriority);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'flex items-center justify-start text-left font-normal text-sm relative w-full sm:w-auto cursor-pointer gap-x-2 px-3',
						className
					)}
					aria-label={ariaLabel}
				>
					<Flame className="h-4 w-4 flex-shrink-0" />
					{priorityBadges[String(value)] &&
						(priorityBadges[String(value)] !== null ? (
							<span className="">{priorityBadges[String(value)]}</span>
						) : null)}
					<span className="flex-grow">
						{value === null && placeholderLabel ? placeholderLabel : getPriorityLabel(value)}
					</span>
					<ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40">
				<DropdownMenuRadioGroup
					value={value === null ? 'null' : value}
					onValueChange={handleValueChange}
				>
					{standardPriorityOptions.map(option => (
						<DropdownMenuRadioItem
							key={String(option.value)}
							value={String(option.value)}
							className="cursor-pointer flex items-center"
						>
							{priorityBadges[String(option.value)]}
							<span className="ml-1">{option.label}</span>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
