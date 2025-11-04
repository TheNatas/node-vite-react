export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  userId?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export enum TaskFilter {
  ALL = 'all',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export interface TaskQuery {
  filter?: TaskFilter;
  search?: string;
  userId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
