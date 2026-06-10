import { Prisma, User } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type CreateUserInput = {
  email: string;
  name: string;
};

export type UpdateUserInput = {
  email?: string;
  name?: string;
};

export class UserService {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { posts: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  }

  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateCreateInput(data: CreateUserInput): string | null {
    if (!data.name?.trim()) {
      return 'Name is required';
    }
    if (!data.email?.trim()) {
      return 'Email is required';
    }
    if (!this.isValidEmail(data.email)) {
      return 'Invalid email format';
    }
    return null;
  }

  isPrismaUniqueConstraintError(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    );
  }
}

export const userService = new UserService();
