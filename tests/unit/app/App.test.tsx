import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from '@/App';

/**
 * Unit tests for the App component.
 *
 * Basic smoke test to verify the application renders without crashing.
 * Following the BDD approach with Given-When-Then format.
 */
describe('App Component', () => {
	it('renders without crashing', () => {
		// Given: The App component with its required router wrapper
		// When: The component is rendered
		// Then: No errors should be thrown during rendering
		expect(() =>
			render(
				<BrowserRouter>
					<App />
				</BrowserRouter>
			)
		).not.toThrow();
	});
});
