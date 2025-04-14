import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import App from '@/App';

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Navigate to="/todos" replace />,
			},
			{
				path: '*',
				element: <Navigate to="/todos" replace />,
			},
		],
	},
]);
