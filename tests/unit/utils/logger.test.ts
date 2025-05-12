import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { logger } from '@/utils/logger';

describe('logger', () => {
	// Spy on console methods
	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'info').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	// Store the original NODE_ENV
	const originalNodeEnv = process.env.NODE_ENV;

	// Reset NODE_ENV after all tests
	afterAll(() => {
		process.env.NODE_ENV = originalNodeEnv;
	});

	describe('warn', () => {
		it('should call console.warn with prefix in development mode', () => {
			// Set to development mode
			process.env.NODE_ENV = 'development';

			logger.warn('Test warning');

			expect(console.warn).toHaveBeenCalledWith('⚠️ Test warning');
		});

		it('should not call console.warn in production mode', () => {
			// Set to production mode
			process.env.NODE_ENV = 'production';

			logger.warn('Test warning');

			expect(console.warn).not.toHaveBeenCalled();
		});

		it('should include additional arguments in the log', () => {
			// Set to development mode
			process.env.NODE_ENV = 'development';

			const additionalArg = { test: 'data' };
			logger.warn('Test warning', additionalArg);

			expect(console.warn).toHaveBeenCalledWith('⚠️ Test warning', additionalArg);
		});
	});

	describe('error', () => {
		it('should call console.error with prefix in development mode', () => {
			// Set to development mode
			process.env.NODE_ENV = 'development';

			logger.error('Test error');

			expect(console.error).toHaveBeenCalledWith('🔴 Test error');
		});

		it('should call console.error with prefix in production mode', () => {
			// Set to production mode
			process.env.NODE_ENV = 'production';

			logger.error('Test error');

			expect(console.error).toHaveBeenCalledWith('🔴 Test error');
		});

		it('should include additional arguments in the log', () => {
			const additionalArg = { test: 'data' };
			logger.error('Test error', additionalArg);

			expect(console.error).toHaveBeenCalledWith('🔴 Test error', additionalArg);
		});
	});

	describe('info', () => {
		it('should call console.info with prefix in development mode', () => {
			// Set to development mode
			process.env.NODE_ENV = 'development';

			logger.info('Test info');

			expect(console.info).toHaveBeenCalledWith('ℹ️ Test info');
		});

		it('should not call console.info in production mode', () => {
			// Set to production mode
			process.env.NODE_ENV = 'production';

			logger.info('Test info');

			expect(console.info).not.toHaveBeenCalled();
		});

		it('should include additional arguments in the log', () => {
			// Set to development mode
			process.env.NODE_ENV = 'development';

			const additionalArg = { test: 'data' };
			logger.info('Test info', additionalArg);

			expect(console.info).toHaveBeenCalledWith('ℹ️ Test info', additionalArg);
		});
	});
});
