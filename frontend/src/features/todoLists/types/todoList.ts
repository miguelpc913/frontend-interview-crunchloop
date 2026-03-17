export interface TodoItem {
  id: number;
  name: string;
  description?: string;
  done: boolean;
}

export interface TodoList {
  id: number;
  name: string;
  todoItems: TodoItem[];
}

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
