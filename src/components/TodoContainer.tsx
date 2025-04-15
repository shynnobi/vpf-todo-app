import { AddTodoForm } from '@/components/AddTodoForm';
import { useTodoStore } from '@/store/todoStore';
import { CreateTodoParams } from '@/types/todoTypes';

/**
 * Main container component for the Todo application
 * Integrates the TodoStore with UI components
 */
export function TodoContainer() {
	const { addTodo, todos, todosCount } = useTodoStore();

	const handleAddTodo = (todoParams: CreateTodoParams) => {
		addTodo(todoParams);
	};

	return (
		<div className="max-w-md mx-auto p-6">
			<header className="mb-6 text-center">
				<h1 className="text-2xl font-bold mb-2">Todo App</h1>
				<p className="text-sm text-gray-500">
					{todosCount} {todosCount === 1 ? 'task' : 'tasks'} total
				</p>
			</header>

			<AddTodoForm onAddTodo={handleAddTodo} />

			{/* Placeholder for TodoList which will be implemented in the next feature */}
			<div className="border rounded-md p-4">
				{todos.length === 0 ? (
					<p className="text-center text-gray-500">No todos yet. Add one above!</p>
				) : (
					<p className="text-center text-gray-500">
						You have {todosCount} todos. List component coming soon!
					</p>
				)}
			</div>
		</div>
	);
}
