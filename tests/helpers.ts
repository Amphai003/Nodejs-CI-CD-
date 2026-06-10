import { prisma } from '../src/lib/prisma';

export async function cleanDatabase(): Promise<void> {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
