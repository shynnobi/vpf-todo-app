import React from 'react';

/**
 * A "Skip to main content" link that's only visible when focused,
 * allowing keyboard users to bypass navigation and go straight to the main content.
 */
export const SkipLink: React.FC = () => {
	return (
		<a
			href="#main-content"
			className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none"
			aria-label="Skip to main content"
		>
			Skip to main content
		</a>
	);
};
