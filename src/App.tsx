import { type ReactElement } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { ThemeToggle } from '@/components/ThemeToggle';
import { ReactQueryProvider } from '@/lib/react-query/provider';

/**
 * Main application layout component
 */
export default function App(): ReactElement {
	return (
		<ReactQueryProvider>
			<>
				<nav className="fixed top-0 w-full bg-background p-4 shadow-md">
					<div className="container mx-auto flex items-center justify-between">
						<div className="flex gap-4">
							<Link to="/todos" className="text-foreground hover:text-foreground/80 font-bold">
								Todo App
							</Link>
						</div>
						<ThemeToggle />
					</div>
				</nav>
				<div className="pt-16 min-h-screen bg-background">
					<Outlet />
				</div>
			</>
		</ReactQueryProvider>
	);
}
