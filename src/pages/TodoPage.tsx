import { TodoContainer } from '@/components/TodoContainer';

/**
 * Page component for displaying the main Todo application interface.
 */
export function TodoPage() {
	return (
		<div className="container mx-auto py-8">
			<TodoContainer />
		</div>
	);
}
