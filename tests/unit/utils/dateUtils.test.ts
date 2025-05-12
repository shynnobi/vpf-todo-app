import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatDate } from '@/utils/dateUtils';

describe('dateUtils', () => {
	describe('formatDate', () => {
		// Spy on console.error to check error handling
		beforeEach(() => {
			vi.spyOn(console, 'error').mockImplementation(() => {});
		});

		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('should format a Date object correctly', () => {
			const date = new Date('2024-01-15T12:00:00Z');
			expect(formatDate(date)).toBe('15 January 2024');
		});

		it('should format an ISO date string correctly', () => {
			const dateString = '2024-02-20T14:30:00Z';
			expect(formatDate(dateString)).toBe('20 February 2024');
		});

		it('should return empty string for null input', () => {
			expect(formatDate(null)).toBe('');
		});

		it('should return empty string for undefined input', () => {
			expect(formatDate(undefined)).toBe('');
		});

		it('should return empty string and log error for invalid date string input', () => {
			const invalidDateString = 'not-a-date';
			expect(formatDate(invalidDateString)).toBe('');
			expect(console.error).toHaveBeenCalled();
		});

		it('should return empty string and log error for invalid Date object', () => {
			// Create an invalid Date object
			const invalidDate = new Date('invalid-date');
			expect(formatDate(invalidDate)).toBe('');
			expect(console.error).toHaveBeenCalled();
		});

		it('should handle error thrown during parsing', () => {
			// Create a scenario where an error might be thrown
			vi.spyOn(Date.prototype, 'getTime').mockImplementation(() => {
				throw new Error('Simulated error');
			});

			expect(formatDate(new Date())).toBe('');
			expect(console.error).toHaveBeenCalled();
		});
	});
});
