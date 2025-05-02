import { expect, test } from '@playwright/test';

test.describe('Todo Detail Modal', () => {
	test.beforeEach(async ({ page }) => {
		// Naviguer vers l'application
		await page.goto('http://localhost:5174/');

		// Créer une tâche test
		await page.getByPlaceholder('Ajouter une tâche').fill('Tâche pour tester la modal');
		await page
			.getByPlaceholder('Description (optionnelle)')
			.fill('Description détaillée de la tâche test');
		await page.getByRole('button', { name: 'Ajouter' }).click();
	});

	test('should open detail modal when clicking on a todo item', async ({ page }) => {
		// Cliquer sur la tâche
		await page.getByText('Tâche pour tester la modal').click();

		// Vérifier que la modal s'est ouverte
		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Détails de la tâche' })).toBeVisible();

		// Vérifier que les détails sont affichés
		await expect(page.getByText('Tâche pour tester la modal')).toBeVisible();
		await expect(page.getByText('Description détaillée de la tâche test')).toBeVisible();

		// Fermer la modal
		await page.getByRole('button', { name: 'Fermer' }).click();
		await expect(page.getByRole('dialog')).not.toBeVisible();
	});

	test('should edit todo from the detail modal', async ({ page }) => {
		// Ouvrir la modal
		await page.getByText('Tâche pour tester la modal').click();

		// Cliquer sur le bouton Modifier
		await page.getByRole('button', { name: 'Modifier' }).click();

		// Vérifier que le mode d'édition est actif
		await expect(page.getByRole('heading', { name: 'Modifier la tâche' })).toBeVisible();

		// Modifier le titre et la description
		await page.getByLabel('Titre').fill('Titre modifié depuis la modal');
		await page.getByLabel('Description').fill('Description modifiée depuis la modal');

		// Enregistrer les modifications
		await page.getByRole('button', { name: 'Enregistrer' }).click();

		// Vérifier que la modal s'est fermée
		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Vérifier que les modifications sont appliquées dans la liste
		await expect(page.getByText('Titre modifié depuis la modal')).toBeVisible();
		await expect(page.getByText('Description modifiée depuis la modal')).toBeVisible();
	});

	test('should cancel editing in the detail modal', async ({ page }) => {
		// Ouvrir la modal
		await page.getByText('Tâche pour tester la modal').click();

		// Cliquer sur le bouton Modifier
		await page.getByRole('button', { name: 'Modifier' }).click();

		// Modifier le titre et la description
		await page.getByLabel('Titre').fill('Ce titre ne devrait pas être sauvegardé');
		await page.getByLabel('Description').fill('Cette description ne devrait pas être sauvegardée');

		// Cliquer sur Annuler
		await page.getByRole('button', { name: 'Annuler' }).click();

		// Vérifier qu'on revient en mode lecture
		await expect(page.getByRole('heading', { name: 'Détails de la tâche' })).toBeVisible();

		// Vérifier que le texte d'origine est toujours affiché
		await expect(page.getByText('Tâche pour tester la modal')).toBeVisible();
		await expect(page.getByText('Description détaillée de la tâche test')).toBeVisible();

		// Fermer la modal
		await page.getByRole('button', { name: 'Fermer' }).click();

		// Vérifier que les modifications n'ont pas été appliquées dans la liste
		await expect(page.getByText('Tâche pour tester la modal')).toBeVisible();
		await expect(page.getByText('Description détaillée de la tâche test')).toBeVisible();
	});
});
