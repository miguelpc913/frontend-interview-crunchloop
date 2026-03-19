import { z } from 'zod';

export const todoListNameSchema = z.string().trim().min(1, 'Name should not be empty');

export const todoItemNameSchema = z.string().trim().min(1, 'Name should not be empty');

export const todoItemDescriptionSchema = z
  .string()
  .max(255, 'Description should not exceed 255 characters');

export const createTodoListSchema = z.object({
  name: todoListNameSchema,
});

export const addTodoItemSchema = z.object({
  name: todoItemNameSchema,
});

export const editTodoListNameSchema = z.object({
  name: todoListNameSchema,
});

export const editTodoItemSchema = z.object({
  name: todoItemNameSchema,
  description: todoItemDescriptionSchema.optional(),
});

export type CreateTodoListFormValues = z.infer<typeof createTodoListSchema>;
export type AddTodoItemFormValues = z.infer<typeof addTodoItemSchema>;
export type EditTodoListNameFormValues = z.infer<typeof editTodoListNameSchema>;
export type EditTodoItemFormValues = z.infer<typeof editTodoItemSchema>;
