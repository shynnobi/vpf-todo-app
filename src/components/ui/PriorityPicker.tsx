import React from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getPriorityLabel, standardPriorityOptions } from '@/constants/priorities';
import { PriorityLevel } from '@/types/todoTypes';

interface PriorityPickerProps {
	value: PriorityLevel | null;
	onPriorityChange: (value: PriorityLevel | null) => void;
	ariaLabel?: string;
	className?: string;
}

/**
 * A reusable dropdown component for selecting a task priority level.
 */
export const PriorityPicker: React.FC<PriorityPickerProps> = ({
	value,
	onPriorityChange,
	ariaLabel = 'Select priority',
	className,
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
					className={`flex items-center gap-1 px-3 py-1 h-auto text-sm cursor-pointer ${className ?? ''}`}
					aria-label={ariaLabel}
				>
					<ArrowUpDown className="mr-1 h-4 w-4" />
					{getPriorityLabel(value)}
					<ChevronDown className="h-4 w-4" />
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
							className="cursor-pointer"
						>
							{option.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
