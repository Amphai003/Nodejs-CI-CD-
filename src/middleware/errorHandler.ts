import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'A record with this value already exists' });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Record not found' });
      return;
    }
  }

  const statusCode = err.statusCode ?? 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
}
