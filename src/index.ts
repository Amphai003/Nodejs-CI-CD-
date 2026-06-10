import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const app = createApp();

async function main(): Promise<void> {
  try {
    await prisma.$connect();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} (${env.nodeEnv})`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
