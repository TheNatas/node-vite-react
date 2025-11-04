import axios from 'axios';
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilter, TaskStats, ApiResponse } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // Get all tasks with optional filters
  async getTasks(filter?: TaskFilter, search?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filter) params.append('filter', filter);
    if (search) params.append('search', search);

    const response = await api.get<ApiResponse<Task[]>>(`/tasks?${params.toString()}`);
    return response.data.data || [];
  },

  // Get a single task by ID
  async getTaskById(id: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    if (!response.data.data) {
      throw new Error('Task not found');
    }
    return response.data.data;
  },

  // Create a new task
  async createTask(data: CreateTaskDTO): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);
    if (!response.data.data) {
      throw new Error('Failed to create task');
    }
    return response.data.data;
  },

  // Update a task
  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update task');
    }
    return response.data.data;
  },

  // Delete a task
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  // Delete all tasks
  async deleteAllTasks(): Promise<void> {
    await api.delete('/tasks');
  },

  // Get task statistics
  async getStats(): Promise<TaskStats> {
    const response = await api.get<ApiResponse<TaskStats>>('/tasks/stats');
    if (!response.data.data) {
      throw new Error('Failed to get stats');
    }
    return response.data.data;
  },

  // Toggle task completion
  async toggleTask(task: Task): Promise<Task> {
    return this.updateTask(task.id, { completed: !task.completed });
  },

  // Export tasks to JSON
  exportTasks(tasks: Task[]): void {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // Import tasks from JSON file
  async importTasks(file: File): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const tasks = JSON.parse(e.target?.result as string) as Task[];
          if (!Array.isArray(tasks)) {
            reject(new Error('Invalid file format'));
            return;
          }
          resolve(tasks);
        } catch {
          reject(new Error('Failed to parse file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },
};
