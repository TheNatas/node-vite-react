import { body, query, ValidationChain } from 'express-validator';

export const createTaskValidation: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Description must be between 3 and 500 characters'),
  body('userId')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('User ID must not be empty if provided'),
];

export const updateTaskValidation: ValidationChain[] = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage('Description must be between 3 and 500 characters'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
];

export const taskQueryValidation: ValidationChain[] = [
  query('filter')
    .optional()
    .isIn(['all', 'pending', 'completed'])
    .withMessage('Filter must be one of: all, pending, completed'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  query('userId')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('User ID must not be empty if provided'),
];
