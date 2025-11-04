import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import {
  createTaskValidation,
  updateTaskValidation,
  taskQueryValidation,
} from '../middleware/validators';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional filters
 * @query   filter: all | pending | completed
 * @query   search: string
 * @query   userId: string
 */
router.get('/', taskQueryValidation, validateRequest, taskController.getAll.bind(taskController));

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics
 * @query   userId: string (optional)
 */
router.get('/stats', taskController.getStats.bind(taskController));

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 */
router.get('/:id', taskController.getById.bind(taskController));

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @body    title: string, description: string, userId?: string
 */
router.post(
  '/',
  createTaskValidation,
  validateRequest,
  taskController.create.bind(taskController)
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @body    title?: string, description?: string, completed?: boolean
 */
router.put(
  '/:id',
  updateTaskValidation,
  validateRequest,
  taskController.update.bind(taskController)
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
router.delete('/:id', taskController.delete.bind(taskController));

/**
 * @route   DELETE /api/tasks
 * @desc    Delete all tasks (use with caution)
 */
router.delete('/', taskController.deleteAll.bind(taskController));

export default router;
