import { type ReactElement } from 'react';
import { Link, Outlet } from 'react-router-dom';

import { SkipLink } from '@/components/SkipLink';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ReactQueryProvider } from '@/lib/react-query/provider';

/**
 * Main application layout component
 */
export default function App(): ReactElement {
	return (
		<ReactQueryProvider>
			<>
				<SkipLink />
				<nav className="fixed top-0 w-full bg-background p-4 shadow-md" role="navigation">
					<div className="container mx-auto flex items-center justify-between">
						<div className="flex gap-4">
							<Link
								to="/todos"
								className="text-foreground hover:text-foreground/80 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-2 py-1"
							>
								Todo App
							</Link>
						</div>
						<ThemeToggle />
					</div>
				</nav>
				<div className="pt-16 min-h-screen bg-background">
					<main id="main-content" tabIndex={-1}>
						<Outlet />
					</main>
				</div>
			</>
		</ReactQueryProvider>
	);
}
