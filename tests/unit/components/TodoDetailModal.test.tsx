import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { TodoDetailModal } from '@/components/TodoDetailModal';
import { PriorityLevel, Todo } from '@/types/todoTypes';
import { formatDate } from '@/utils/dateUtils';

describe('TodoDetailModal Component', () => {
	// Exemple de tâche pour les tests
	const mockTodo: Todo = {
		id: '123',
		title: 'Test Todo',
		completed: false,
		creationDate: new Date('2023-01-01').toISOString(),
		description: 'This is a test description',
		priority: 'medium' as PriorityLevel,
		dueDate: new Date('2023-12-31').toISOString(),
	};

	const mockOnClose = vi.fn();
	const mockOnSave = vi.fn();

	beforeEach(() => {
		mockOnClose.mockClear();
		mockOnSave.mockClear();
	});

	test('should render the modal with todo details in read-only mode', () => {
		render(
			<TodoDetailModal isOpen={true} onClose={mockOnClose} todo={mockTodo} onSave={mockOnSave} />
		);

		// Vérifier que les détails s'affichent correctement
		expect(screen.getByText('Task Details')).toBeInTheDocument();
		expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
		expect(screen.getByText(mockTodo.description as string)).toBeInTheDocument();
		expect(screen.getByText('Medium')).toBeInTheDocument(); // Le niveau de priorité moyen
		expect(screen.getByText(formatDate(mockTodo.dueDate as string))).toBeInTheDocument();

		// Vérifier que les boutons d'action sont présents
		expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
	});

	test('should switch to edit mode when edit button is clicked', async () => {
		const user = userEvent.setup();

		render(
			<TodoDetailModal isOpen={true} onClose={mockOnClose} todo={mockTodo} onSave={mockOnSave} />
		);

		// Cliquer sur le bouton Modifier
		await user.click(screen.getByRole('button', { name: /Edit/i }));

		// Vérifier que le mode d'édition est activé
		expect(screen.getByText('Edit Task')).toBeInTheDocument();
		expect(screen.getByDisplayValue(mockTodo.title)).toBeInTheDocument();
		expect(screen.getByDisplayValue(mockTodo.description as string)).toBeInTheDocument();

		// Vérifier que les boutons d'édition sont présents
		expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
	});

	test('should call onSave with updated data when save button is clicked', async () => {
		const user = userEvent.setup();

		render(
			<TodoDetailModal isOpen={true} onClose={mockOnClose} todo={mockTodo} onSave={mockOnSave} />
		);

		// Passer en mode édition
		await user.click(screen.getByRole('button', { name: /Edit/i }));

		// Modifier le titre
		const titleInput = screen.getByDisplayValue(mockTodo.title);
		await user.clear(titleInput);
		await user.type(titleInput, 'Updated Todo Title');

		// Modifier la description
		const descriptionInput = screen.getByDisplayValue(mockTodo.description as string);
		await user.clear(descriptionInput);
		await user.type(descriptionInput, 'Updated description');

		// Cliquer sur Enregistrer
		await user.click(screen.getByRole('button', { name: /Save/i }));

		// Vérifier que onSave a été appelé avec les données mises à jour
		expect(mockOnSave).toHaveBeenCalledTimes(1);
		expect(mockOnSave).toHaveBeenCalledWith(
			expect.objectContaining({
				id: mockTodo.id,
				title: 'Updated Todo Title',
				description: 'Updated description',
			})
		);
	});

	test('should revert changes when cancel button is clicked', async () => {
		const user = userEvent.setup();

		render(
			<TodoDetailModal isOpen={true} onClose={mockOnClose} todo={mockTodo} onSave={mockOnSave} />
		);

		// Passer en mode édition
		await user.click(screen.getByRole('button', { name: /Edit/i }));

		// Modifier le titre
		const titleInput = screen.getByDisplayValue(mockTodo.title);
		await user.clear(titleInput);
		await user.type(titleInput, 'This will be cancelled');

		// Cliquer sur Annuler
		await user.click(screen.getByRole('button', { name: /Cancel/i }));

		// Vérifier qu'on est revenu en mode lecture
		expect(screen.getByText('Task Details')).toBeInTheDocument();

		// Vérifier que les données originales sont affichées
		expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
		expect(screen.getByText(mockTodo.description as string)).toBeInTheDocument();

		// Vérifier que onSave n'a pas été appelé
		expect(mockOnSave).not.toHaveBeenCalled();
	});

	test('should call onClose when close button is clicked', async () => {
		const user = userEvent.setup();

		render(
			<TodoDetailModal isOpen={true} onClose={mockOnClose} todo={mockTodo} onSave={mockOnSave} />
		);

		// Cliquer sur le bouton Fermer
		await user.click(screen.getByRole('button', { name: /Close/i }));

		// Vérifier que onClose a été appelé
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	test('should not be visible when isOpen is false', () => {
		render(
			<TodoDetailModal isOpen={false} onClose={mockOnClose} todo={mockTodo} onSave={mockOnSave} />
		);

		// Vérifier que la modal n'est pas visible
		expect(screen.queryByText('Task Details')).not.toBeInTheDocument();
		expect(screen.queryByText(mockTodo.title)).not.toBeInTheDocument();
	});
});
