import { z } from 'zod';

export const todoItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  done: z.boolean(),
});

export const todoListSchema = z.object({
  id: z.number(),
  name: z.string(),
  todoItems: z.array(todoItemSchema),
});

export const todoListsSchema = z.array(todoListSchema);
export const todoItemsSchema = z.array(todoItemSchema);
