import { describe, expect, it } from 'vitest';

import { SortConfig } from '@/store/todoStore';
import { Todo, TodoFilter } from '@/types/todoTypes';
import { getFilteredAndSortedTodosUtil } from '@/utils/todoUtils';

describe('todoUtils', () => {
	describe('getFilteredAndSortedTodosUtil', () => {
		// Sample todo items for testing
		const sampleTodos: Todo[] = [
			{
				id: '1',
				title: 'Buy groceries',
				completed: false,
				creationDate: '2024-01-01T10:00:00Z',
				priority: 'high',
				dueDate: '2024-01-05T10:00:00Z',
			},
			{
				id: '2',
				title: 'Call mom',
				completed: true,
				creationDate: '2024-01-02T10:00:00Z',
				priority: 'medium',
				dueDate: '2024-01-03T10:00:00Z',
			},
			{
				id: '3',
				title: 'Finish report',
				completed: false,
				creationDate: '2024-01-03T10:00:00Z',
				priority: 'low',
				dueDate: undefined,
			},
			{
				id: '4',
				title: 'Walk the dog',
				completed: false,
				creationDate: '2024-01-04T10:00:00Z',
				priority: null,
				dueDate: '2024-01-06T10:00:00Z',
			},
		];

		// Tests for filtering
		it('should return all todos when filter is All', () => {
			const filter = TodoFilter.All;
			const sortConfig: SortConfig = { criterion: 'creationDate', direction: 'asc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result.length).toBe(4);
		});

		it('should return only active todos when filter is Active', () => {
			const filter = TodoFilter.Active;
			const sortConfig: SortConfig = { criterion: 'creationDate', direction: 'asc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result.length).toBe(3);
			expect(result.every(todo => !todo.completed)).toBe(true);
		});

		it('should return only completed todos when filter is Completed', () => {
			const filter = TodoFilter.Completed;
			const sortConfig: SortConfig = { criterion: 'creationDate', direction: 'asc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result.length).toBe(1);
			expect(result.every(todo => todo.completed)).toBe(true);
		});

		// Tests for sorting by title
		it('should sort todos by title in ascending order', () => {
			const filter = TodoFilter.All;
			const sortConfig: SortConfig = { criterion: 'title', direction: 'asc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result[0].title).toBe('Buy groceries');
			expect(result[1].title).toBe('Call mom');
			expect(result[2].title).toBe('Finish report');
			expect(result[3].title).toBe('Walk the dog');
		});

		it('should sort todos by title in descending order', () => {
			const filter = TodoFilter.All;
			const sortConfig: SortConfig = { criterion: 'title', direction: 'desc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result[0].title).toBe('Walk the dog');
			expect(result[1].title).toBe('Finish report');
			expect(result[2].title).toBe('Call mom');
			expect(result[3].title).toBe('Buy groceries');
		});

		// Tests for sorting by priority
		it('should sort todos by priority in ascending order (low to high)', () => {
			const filter = TodoFilter.All;
			const sortConfig: SortConfig = { criterion: 'priority', direction: 'asc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result[0].priority).toBe(null);
			expect(result[1].priority).toBe('low');
			expect(result[2].priority).toBe('medium');
			expect(result[3].priority).toBe('high');
		});

		it('should sort todos by priority in descending order (high to low)', () => {
			const filter = TodoFilter.All;
			const sortConfig: SortConfig = { criterion: 'priority', direction: 'desc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result[0].priority).toBe('high');
			expect(result[1].priority).toBe('medium');
			expect(result[2].priority).toBe('low');
			expect(result[3].priority).toBe(null);
		});

		// Tests for sorting by due date
		it('should sort todos by due date in ascending order', () => {
			const filter = TodoFilter.All;
			const sortConfig: SortConfig = { criterion: 'dueDate', direction: 'asc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result[0].id).toBe('2'); // earliest due date
			expect(result[1].id).toBe('1');
			expect(result[2].id).toBe('4');
			expect(result[3].id).toBe('3'); // no due date, should be last
		});

		it('should sort todos by due date in descending order', () => {
			const filter = TodoFilter.All;
			const sortConfig: SortConfig = { criterion: 'dueDate', direction: 'desc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result[0].id).toBe('3'); // no due date first in desc mode
			expect(result[1].id).toBe('4'); // latest due date
			expect(result[2].id).toBe('1');
			expect(result[3].id).toBe('2'); // earliest due date
		});

		// Tests for sorting by creation date
		it('should sort todos by creation date in ascending order', () => {
			const filter = TodoFilter.All;
			const sortConfig: SortConfig = { criterion: 'creationDate', direction: 'asc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result[0].id).toBe('1'); // earliest creation date
			expect(result[1].id).toBe('2');
			expect(result[2].id).toBe('3');
			expect(result[3].id).toBe('4'); // latest creation date
		});

		it('should sort todos by creation date in descending order', () => {
			const filter = TodoFilter.All;
			const sortConfig: SortConfig = { criterion: 'creationDate', direction: 'desc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result[0].id).toBe('4'); // latest creation date
			expect(result[1].id).toBe('3');
			expect(result[2].id).toBe('2');
			expect(result[3].id).toBe('1'); // earliest creation date
		});

		// Test combination of filtering and sorting
		it('should filter and sort simultaneously', () => {
			const filter = TodoFilter.Active;
			const sortConfig: SortConfig = { criterion: 'priority', direction: 'desc' };

			const result = getFilteredAndSortedTodosUtil(sampleTodos, filter, sortConfig);

			expect(result.length).toBe(3); // only active todos
			expect(result[0].priority).toBe('high'); // sorted by priority
			expect(result[1].priority).toBe('low');
			expect(result[2].priority).toBe(null);
		});
	});
});
