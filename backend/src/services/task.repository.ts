import { v4 as uuidv4 } from 'uuid';
import { dbService } from './database.service';
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskQuery, TaskFilter } from '../types/task.types';
import { NotFoundError, DatabaseError } from '../types/errors';

const TASK_PREFIX = 'task:';

export class TaskRepository {
  private getTaskKey(id: string): string {
    return `${TASK_PREFIX}${id}`;
  }

  async create(data: CreateTaskDTO): Promise<Task> {
    try {
      const id = uuidv4();
      const now = new Date().toISOString();

      const task: Task = {
        id,
        title: data.title,
        description: data.description,
        completed: false,
        createdAt: now,
        updatedAt: now,
        userId: data.userId,
      };

      await dbService.put(this.getTaskKey(id), JSON.stringify(task));
      return task;
    } catch (error) {
      throw new DatabaseError('Failed to create task');
    }
  }

  async findById(id: string): Promise<Task | null> {
    try {
      const value = await dbService.get(this.getTaskKey(id));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  }

  async findAll(query?: TaskQuery): Promise<Task[]> {
    try {
      const entries = await dbService.getAll(TASK_PREFIX);
      let tasks: Task[] = entries.map((entry) => JSON.parse(entry.value));

      // Filter by userId if provided
      if (query?.userId) {
        tasks = tasks.filter((task) => task.userId === query.userId);
      }

      // Filter by status
      if (query?.filter) {
        switch (query.filter) {
          case TaskFilter.PENDING:
            tasks = tasks.filter((task) => !task.completed);
            break;
          case TaskFilter.COMPLETED:
            tasks = tasks.filter((task) => task.completed);
            break;
          case TaskFilter.ALL:
          default:
            // Return all tasks
            break;
        }
      }

      // Search by title or description
      if (query?.search) {
        const searchLower = query.search.toLowerCase();
        tasks = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
        );
      }

      // Sort by creation date (newest first)
      tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return tasks;
    } catch (error) {
      throw new DatabaseError('Failed to fetch tasks');
    }
  }

  async update(id: string, data: UpdateTaskDTO): Promise<Task> {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new NotFoundError(`Task with id ${id} not found`);
      }

      const updated: Task = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await dbService.put(this.getTaskKey(id), JSON.stringify(updated));
      return updated;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to update task');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new NotFoundError(`Task with id ${id} not found`);
      }

      await dbService.del(this.getTaskKey(id));
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to delete task');
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await dbService.clear(TASK_PREFIX);
    } catch (error) {
      throw new DatabaseError('Failed to delete all tasks');
    }
  }

  async count(query?: TaskQuery): Promise<number> {
    const tasks = await this.findAll(query);
    return tasks.length;
  }
}

export const taskRepository = new TaskRepository();
