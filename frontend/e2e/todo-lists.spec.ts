import { test, expect, type Locator, type Page } from '@playwright/test';
import {
  createTestList,
  getAllTestLists,
  deleteTestList,
  addTestItem,
  getApiBaseUrl,
} from './helpers';

/**
 * Selects a filter option from the Radix DropdownMenu inside a todo list card.
 *
 * The interaction is wrapped in `expect().toPass()` because Radix UI dropdown
 * menu items can be detached from the DOM mid-click when React re-renders the
 * card (e.g. after a TanStack Query refetch). The retry block re-opens the
 * dropdown and re-attempts the selection until it succeeds or the outer
 * timeout (10 s) is reached.
 */
async function selectFilter(card: Locator, page: Page, name: string) {
  await expect(async () => {
    await card.locator('[data-slot="dropdown-menu-trigger"]').click();
    await page
      .getByRole('menuitemradio', { name, exact: true })
      .click({ timeout: 2000 });
  }).toPass({ timeout: 10000 });
}

test.describe('TodoLists', () => {
  test.beforeEach(async ({ request }) => {
    const lists = await getAllTestLists(request);
    for (const list of lists) {
      if (list.name.startsWith('E2E')) {
        await deleteTestList(request, list.id);
      }
    }
  });

  test('page loads and displays existing todo lists', async ({
    page,
    request,
  }) => {
    const list = await createTestList(request, 'E2E Display List');
    try {
      await page.goto('/');
      await expect(
        page.locator('[data-list-name="E2E Display List"]'),
      ).toBeVisible();
    } finally {
      await deleteTestList(request, list.id);
    }
  });

  test('create a new todo list', async ({ page, request }) => {
    const name = `E2E New List ${Date.now()}`;
    await page.goto('/');
    await page.getByLabel('Todo list name').fill(name);
    await page.getByRole('button', { name: 'Add list' }).click();
    await expect(
      page.locator(`[data-list-name="${name}"]`),
    ).toBeVisible();

    const lists = await getAllTestLists(request);
    const created = lists.find((l) => l.name === name);
    if (created) {
      await deleteTestList(request, created.id);
    }
  });

  test('add a task to a list', async ({ page, request }) => {
    const listName = 'E2E Add Task List';
    const list = await createTestList(request, listName);
    try {
      await page.goto('/');
      const card = page.locator(`[data-list-name="${listName}"]`);
      await expect(card).toBeVisible();
      await card.getByPlaceholder('Add your task...').fill('New task item');
      await card.getByRole('button', { name: 'Add task' }).click();
      await expect(card.locator('[data-task-name="New task item"]')).toBeVisible();
    } finally {
      await deleteTestList(request, list.id);
    }
  });

  test('toggle a task done and undone', async ({ page, request }) => {
    const listName = 'E2E Toggle List';
    const list = await createTestList(request, listName);
    await addTestItem(request, list.id, 'Task to toggle');
    try {
      await page.goto('/');
      const card = page.locator(`[data-list-name="${listName}"]`);
      const taskRow = card.locator('li[data-task-name="Task to toggle"]');
      await taskRow.getByRole('checkbox', { name: 'Mark as complete' }).click();
      await expect(
        taskRow.getByRole('checkbox', { name: 'Mark as incomplete' }),
      ).toBeVisible();
      await taskRow.getByRole('checkbox', { name: 'Mark as incomplete' }).click();
      await expect(
        taskRow.getByRole('checkbox', { name: 'Mark as complete' }),
      ).toBeVisible();
    } finally {
      await deleteTestList(request, list.id);
    }
  });

  test('delete a task', async ({ page, request }) => {
    const listName = 'E2E Delete Task List';
    const list = await createTestList(request, listName);
    await addTestItem(request, list.id, 'Task to delete');
    try {
      await page.goto('/');
      const card = page.locator(`[data-list-name="${listName}"]`);
      await expect(card.locator('[data-task-name="Task to delete"]')).toBeVisible();
      await card
        .locator('li[data-task-name="Task to delete"]')
        .locator('button[aria-label="Delete task"]')
        .click();
      await page
        .getByRole('button', { name: 'Confirm delete task' })
        .click();
      await expect(card.locator('[data-task-name="Task to delete"]')).not.toBeVisible();
    } finally {
      await deleteTestList(request, list.id);
    }
  });

  test('search tasks within a list', async ({ page, request }) => {
    const listName = 'E2E Search List';
    const list = await createTestList(request, listName);
    await addTestItem(request, list.id, 'Alpha task');
    await addTestItem(request, list.id, 'Beta task');
    await addTestItem(request, list.id, 'Gamma task');
    try {
      await page.goto('/');
      const card = page.locator(`[data-list-name="${listName}"]`);
      await expect(card.locator('[data-task-name="Alpha task"]')).toBeVisible();
      await expect(card.locator('[data-task-name="Beta task"]')).toBeVisible();
      await card.getByPlaceholder('Search in this list...').fill('Beta');
      await expect(card.locator('[data-task-name="Alpha task"]')).not.toBeVisible();
      await expect(card.locator('[data-task-name="Beta task"]')).toBeVisible();
      await expect(card.locator('[data-task-name="Gamma task"]')).not.toBeVisible();
    } finally {
      await deleteTestList(request, list.id);
    }
  });

  test('filter tasks by done and not done', async ({ page, request }) => {
    const listName = 'E2E Filter List';
    const list = await createTestList(request, listName);
    await addTestItem(request, list.id, 'Incomplete one');
    const doneItem = await addTestItem(request, list.id, 'Done one');
    const baseUrl = getApiBaseUrl();
    await request.put(
      `${baseUrl}/api/todo-lists/${list.id}/todo-items/${doneItem.id}`,
      { data: { done: true }, headers: { 'Content-Type': 'application/json' } },
    );
    try {
      await page.goto('/');
      const card = page.locator(`[data-list-name="${listName}"]`);
      await expect(card.locator('[data-task-name="Incomplete one"]')).toBeVisible();
      await expect(card.locator('[data-task-name="Done one"]')).toBeVisible();

      await selectFilter(card, page, 'Done');
      await expect(card.locator('[data-task-name="Incomplete one"]')).not.toBeVisible();
      await expect(card.locator('[data-task-name="Done one"]')).toBeVisible();

      await selectFilter(card, page, 'Not done');
      await expect(card.locator('[data-task-name="Incomplete one"]')).toBeVisible();
      await expect(card.locator('[data-task-name="Done one"]')).not.toBeVisible();
    } finally {
      await deleteTestList(request, list.id);
    }
  });
});
