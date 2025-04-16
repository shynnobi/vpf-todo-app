import { AddTodoForm } from '@/components/AddTodoForm';
import { TodoList } from '@/components/TodoList';
import { useTodoStore } from '@/store/todoStore';

/**
 * Container component that orchestrates the Todo application UI.
 * It connects the AddTodoForm and TodoList components to the Zustand store.
 */
export function TodoContainer() {
	// Select necessary state and actions from the store
	const { todos, todosCount, addTodo, toggleTodo } = useTodoStore();

	return (
		<div className="max-w-xl mx-auto p-4">
			<h1 className="text-2xl font-bold text-center mb-6">Todo App</h1>
			<AddTodoForm onAddTodo={addTodo} />
			<TodoList todos={todos} onToggleTodo={toggleTodo} />
			<p className="text-center text-sm text-gray-500 mt-4">{todosCount} tasks total</p>
		</div>
	);
}
