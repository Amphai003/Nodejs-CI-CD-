import dotenv from 'dotenv';

dotenv.config();

process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5432/nodejs_cicd_test?schema=public';
