import { Post } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type CreatePostInput = {
  title: string;
  content?: string;
  published?: boolean;
  authorId: string;
};

export type UpdatePostInput = {
  title?: string;
  content?: string;
  published?: boolean;
};

export class PostService {
  async findAll(): Promise<Post[]> {
    return prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  }

  async findById(id: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async create(data: CreatePostInput): Promise<Post> {
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published ?? false,
        authorId: data.authorId,
      },
      include: { author: true },
    });
  }

  async update(id: string, data: UpdatePostInput): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
      include: { author: true },
    });
  }

  async delete(id: string): Promise<Post> {
    return prisma.post.delete({ where: { id } });
  }

  validateCreateInput(data: CreatePostInput): string | null {
    if (!data.title?.trim()) {
      return 'Title is required';
    }
    if (!data.authorId?.trim()) {
      return 'Author ID is required';
    }
    return null;
  }
}

export const postService = new PostService();
