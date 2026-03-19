export interface CreateTodoListDto {
  name: string;
}

export interface UpdateTodoListDto {
  name?: string;
}

export interface AddTodoItemDto {
  name: string;
  description?: string;
}

export interface UpdateTodoItemDto {
  name?: string;
  description?: string;
  done?: boolean;
}

export type {
  TodoItem,
  TodoList
} from '@/shared/types/todoList';
