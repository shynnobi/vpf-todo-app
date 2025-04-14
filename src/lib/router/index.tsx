import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import App from '@/App';
// Pages
import TodoPage from '@/pages/TodoPage';

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
				path: 'todos',
				element: <TodoPage />,
			},
			{
				path: '*',
				element: <Navigate to="/todos" replace />,
			},
		],
	},
]);
