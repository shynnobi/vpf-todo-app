import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

/**
 * Minimal test to verify the application renders without crashing
 * This serves as a basic smoke test for the application
 */
describe('App', () => {
	it('renders without crashing', () => {
		// This test simply verifies that the App component mounts without throwing any errors
		expect(() =>
			render(
				<BrowserRouter>
					<App />
				</BrowserRouter>
			)
		).not.toThrow();
	});
});
