import { http, HttpResponse } from 'msw'
import type {
  AddTodoItemDto,
  TodoItem,
  TodoList,
  UpdateTodoItemDto,
} from '@/features/todoLists/types/todoList'
import type { CreateTodoListDto, UpdateTodoListDto } from '@/features/todoLists/types/todoList'

const initialTodoLists: TodoList[] = [
  {
    id: 1,
    name: 'List One',
    todoItems: [
      {
        id: 1,
        name: 'Task A',
        description: 'Alpha description',
        done: false,
      },
      {
        id: 2,
        name: 'Task B',
        description: 'Beta details',
        done: true,
      },
    ],
  },
  {
    id: 2,
    name: 'List Two',
    todoItems: [
      {
        id: 1,
        name: 'Another Task',
        description: 'Contains keyword',
        done: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Empty List',
    todoItems: [],
  },
]

let todoLists: TodoList[] = structuredClone(initialTodoLists)

export function resetTodoLists() {
  todoLists = structuredClone(initialTodoLists)
}

export function setTodoLists(next: TodoList[]) {
  todoLists = structuredClone(next)
}

function getNextTodoItemId(listId: number) {
  const list = todoLists.find((l) => l.id === listId)
  if (!list) return 1
  return Math.max(0, ...list.todoItems.map((i) => i.id)) + 1
}

function getNextTodoListId() {
  return Math.max(0, ...todoLists.map((l) => l.id)) + 1
}

export const handlers = [
  http.get('*/api/todo-lists', () => {
    return HttpResponse.json(todoLists)
  }),

  http.get('*/api/todo-lists/:id', ({ params }) => {
    const id = Number(params.id)
    const list = todoLists.find((l) => l.id === id)
    if (!list) {
      return HttpResponse.json(null, { status: 404 })
    }
    return HttpResponse.json(list)
  }),

  http.post('*/api/todo-lists', async ({ request }) => {
    const body = (await request.json()) as CreateTodoListDto
    const created: TodoList = {
      id: getNextTodoListId(),
      name: body.name.trim(),
      todoItems: [],
    }

    todoLists = [...todoLists, created]
    return HttpResponse.json(created)
  }),

  http.put('*/api/todo-lists/:id', async ({ request, params }) => {
    const id = Number(params.id)
    const body = (await request.json()) as UpdateTodoListDto
    const list = todoLists.find((l) => l.id === id)
    if (!list) {
      return HttpResponse.json(null, { status: 404 })
    }

    const updated: TodoList = {
      ...list,
      ...(body.name ? { name: body.name } : null),
    }
    todoLists = todoLists.map((l) => (l.id === id ? updated : l))
    return HttpResponse.json(updated)
  }),

  http.delete('*/api/todo-lists/:id', ({ params }) => {
    const id = Number(params.id)
    todoLists = todoLists.filter((l) => l.id !== id)
    return HttpResponse.json(null, { status: 204 })
  }),

  http.get('*/api/todo-lists/:id/todo-items', ({ params }) => {
    const listId = Number(params.id)
    const list = todoLists.find((l) => l.id === listId)
    if (!list) return HttpResponse.json(null, { status: 404 })
    return HttpResponse.json(list.todoItems)
  }),

  http.get('*/api/todo-lists/:id/todo-items/:itemId', ({ params }) => {
    const listId = Number(params.id)
    const itemId = Number(params.itemId)
    const list = todoLists.find((l) => l.id === listId)
    if (!list) return HttpResponse.json(null, { status: 404 })
    const item = list.todoItems.find((i) => i.id === itemId)
    if (!item) return HttpResponse.json(null, { status: 404 })
    return HttpResponse.json(item)
  }),

  http.post('*/api/todo-lists/:id/todo-items', async ({ request, params }) => {
    const listId = Number(params.id)
    const list = todoLists.find((l) => l.id === listId)
    if (!list) return HttpResponse.json(null, { status: 404 })

    const body = (await request.json()) as AddTodoItemDto
    const created: TodoItem = {
      id: getNextTodoItemId(listId),
      name: body.name.trim(),
      description: '',
      done: false,
    }

    const updated: TodoList = {
      ...list,
      todoItems: [...list.todoItems, created],
    }

    todoLists = todoLists.map((l) => (l.id === listId ? updated : l))
    return HttpResponse.json(created)
  }),

  http.put(
    '*/api/todo-lists/:id/todo-items/:itemId',
    async ({ request, params }) => {
      const listId = Number(params.id)
      const itemId = Number(params.itemId)
      const list = todoLists.find((l) => l.id === listId)
      if (!list) return HttpResponse.json(null, { status: 404 })

      const body = (await request.json()) as UpdateTodoItemDto
      const item = list.todoItems.find((i) => i.id === itemId)
      if (!item) return HttpResponse.json(null, { status: 404 })

      const updatedItem: TodoItem = {
        ...item,
        ...(body.name !== undefined ? { name: body.name } : null),
        ...(body.description !== undefined
          ? { description: body.description }
          : null),
        ...(body.done !== undefined ? { done: body.done } : null),
      }

      const updated: TodoList = {
        ...list,
        todoItems: list.todoItems.map((i) => (i.id === itemId ? updatedItem : i)),
      }

      todoLists = todoLists.map((l) => (l.id === listId ? updated : l))
      return HttpResponse.json(updatedItem)
    },
  ),

  http.delete('*/api/todo-lists/:id/todo-items/:itemId', ({ params }) => {
    const listId = Number(params.id)
    const itemId = Number(params.itemId)
    const list = todoLists.find((l) => l.id === listId)
    if (!list) return HttpResponse.json(null, { status: 404 })

    const updated: TodoList = {
      ...list,
      todoItems: list.todoItems.filter((i) => i.id !== itemId),
    }
    todoLists = todoLists.map((l) => (l.id === listId ? updated : l))
    return HttpResponse.json(null, { status: 204 })
  }),
]

