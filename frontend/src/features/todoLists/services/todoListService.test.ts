import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'

import {
  deleteTodoList,
  getAllTodoItems,
  getTodoItemById,
  deleteTodoItem,
  getAllTodoLists,
} from '@/shared/api/todoLists'
import { server } from '@/test/server'
import { ApiError } from '@/shared/api/apiClient'

describe('todoListService', () => {
  it('deleteTodoList removes the list', async () => {
    await deleteTodoList(1)

    const lists = await getAllTodoLists()
    expect(lists.find((list) => list.id === 1)).toBeUndefined()
  })

  it('getAllTodoItems returns list items', async () => {
    const items = await getAllTodoItems(1)
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveProperty('name')
  })

  it('getTodoItemById returns an item', async () => {
    const item = await getTodoItemById(1, 1)
    expect(item).toHaveProperty('id', 1)
    expect(item).toHaveProperty('name', 'Task A')
  })

  it('deleteTodoItem removes the item from the list', async () => {
    await deleteTodoItem(1, 1)

    const items = await getAllTodoItems(1)
    expect(items.find((item) => item.id === 1)).toBeUndefined()
  })

  it('throws a readable error when API responds with non-ok status', async () => {
    server.use(
      http.get('*/api/todo-lists/999/todo-items/999', () =>
        HttpResponse.json({ message: 'Task not found' }, { status: 404 }),
      ),
    )

    await expect(getTodoItemById(999, 999)).rejects.toThrow('Task not found')
  })

  it('throws ApiError with status code for non-ok responses', async () => {
    server.use(
      http.get('*/api/todo-lists/500/todo-items/1', () =>
        HttpResponse.text('Server exploded', { status: 500 }),
      ),
    )

    await expect(getTodoItemById(500, 1)).rejects.toBeInstanceOf(ApiError)
    await expect(getTodoItemById(500, 1)).rejects.toMatchObject({
      status: 500,
      message: 'Server exploded',
    })
  })
})
