import { Request, Response, NextFunction } from 'express';
import { postService } from '../services/post.service';
import { getRouteParam } from '../utils/params';

export class PostController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const posts = await postService.findAll();
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.findById(getRouteParam(req.params.id));
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validationError = postService.validateCreateInput(req.body);
      if (validationError) {
        res.status(400).json({ error: validationError });
        return;
      }

      const post = await postService.create(req.body);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.update(getRouteParam(req.params.id), req.body);
      res.json(post);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await postService.delete(getRouteParam(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
