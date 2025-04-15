import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import App from '@/App';
import { TodoContainer } from '@/components/TodoContainer';

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
				element: <TodoContainer />,
			},
			{
				path: '*',
				element: <Navigate to="/todos" replace />,
			},
		],
	},
]);
