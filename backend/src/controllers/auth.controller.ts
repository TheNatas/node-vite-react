import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { getAuthService } from '../services/auth.service';
import { AppError } from '../types/errors';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  private get authService() {
    return getAuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(
          `Validation failed: ${errors.array().map(e => e.msg).join(', ')}`,
          400
        );
      }

      const { email, password, name } = req.body;
      const result = await this.authService.register({ email, password, name });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already registered') {
        next(new AppError('Email already registered', 409));
      } else {
        next(error);
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(
          `Validation failed: ${errors.array().map(e => e.msg).join(', ')}`,
          400
        );
      }

      const { email, password } = req.body;
      const result = await this.authService.login({ email, password });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        next(new AppError('Invalid credentials', 401));
      } else {
        next(error);
      }
    }
  };

  getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        throw new AppError('User ID not found', 401);
      }

      const user = await this.authService.getUserById(req.userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
