export type TaskStatus = "todo" | "in progress" | "done";

export type FilterStatus = "all" | TaskStatus;

export interface User {
  id: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  authorId: number;
  createdAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
}

export interface AuthInput {
  email: string;
  password: string;
}
