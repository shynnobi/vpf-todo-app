import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme/ThemeContext';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Once mounted, we can render the button as useTheme is available client-side
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="outline" size="icon" disabled className="h-9 w-9 sm:h-10 sm:w-10">
				<Moon className="h-[1.2rem] w-[1.2rem] sm:h-[1.4rem] sm:w-[1.4rem]" />
			</Button>
		);
	}

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			className="cursor-pointer h-9 w-9 sm:h-10 sm:w-10 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
		>
			<Moon className="h-[1.2rem] w-[1.2rem] sm:h-[1.4rem] sm:w-[1.4rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Sun className="absolute h-[1.2rem] w-[1.2rem] sm:h-[1.4rem] sm:w-[1.4rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
