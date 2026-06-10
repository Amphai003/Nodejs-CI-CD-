import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { getRouteParam } from '../utils/params';

export class UserController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.findById(getRouteParam(req.params.id));
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationError = userService.validateCreateInput(req.body);
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      if (userService.isPrismaUniqueConstraintError(error)) {
        res.status(409).json({ error: 'Email already exists' });
        return;
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.update(getRouteParam(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.delete(getRouteParam(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
