import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@context/theme/ThemeProvider';

import './index.css';

import App from '@/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
	throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
	<StrictMode>
		<BrowserRouter>
			<ThemeProvider storageKey="vite-ui-theme">
				<App />
			</ThemeProvider>
		</BrowserRouter>
	</StrictMode>
);
