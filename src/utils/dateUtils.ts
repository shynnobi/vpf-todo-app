import { format, parseISO } from 'date-fns';

/**
 * Formats a date string or Date object into 'd MMMM yyyy' format (e.g., 1 January 2024).
 * Handles potential string inputs by parsing them first.
 *
 * @param dateInput The date to format, can be a Date object, ISO string, or timestamp string.
 * @returns The formatted date string, or an empty string if the input is invalid.
 */
export const formatDate = (dateInput: Date | string | null | undefined): string => {
	if (!dateInput) {
		return '';
	}

	try {
		// Handle string inputs (assuming ISO 8601 or common formats parseISO handles)
		const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;

		// Check if the parsed date is valid before formatting
		if (date instanceof Date && !isNaN(date.getTime())) {
			return format(date, 'd MMMM yyyy');
		}
		console.error('Invalid date input provided to formatDate:', dateInput);
		return ''; // Return empty for invalid dates
	} catch (error) {
		console.error('Error formatting date:', error, 'Input:', dateInput);
		return ''; // Return empty string in case of parsing errors
	}
};
