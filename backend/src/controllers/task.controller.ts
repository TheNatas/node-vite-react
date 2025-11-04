import { Request, Response, NextFunction } from 'express';
import { taskRepository } from '../services/task.repository';
import { CreateTaskDTO, UpdateTaskDTO, TaskQuery, TaskFilter } from '../types/task.types';
import { ValidationError } from '../types/errors';

export class TaskController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateTaskDTO = req.body;
      const task = await taskRepository.create(data);
      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: TaskQuery = {
        filter: req.query.filter as TaskFilter,
        search: req.query.search as string,
        userId: req.query.userId as string,
      };

      const tasks = await taskRepository.findAll(query);
      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const task = await taskRepository.findById(id);

      if (!task) {
        throw new ValidationError(`Task with id ${id} not found`);
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: UpdateTaskDTO = req.body;

      const task = await taskRepository.update(id, data);
      res.status(200).json({
        success: true,
        data: task,
        message: 'Task updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await taskRepository.delete(id);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await taskRepository.deleteAll();

      res.status(200).json({
        success: true,
        message: 'All tasks deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.query.userId as string | undefined;

      const total = await taskRepository.count({ userId });
      const completed = await taskRepository.count({
        userId,
        filter: TaskFilter.COMPLETED,
      });
      const pending = await taskRepository.count({
        userId,
        filter: TaskFilter.PENDING,
      });

      res.status(200).json({
        success: true,
        data: {
          total,
          completed,
          pending,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
