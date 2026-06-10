import request from 'supertest';
import { createApp } from '../../src/app';
import { cleanDatabase, disconnectDatabase } from '../helpers';

const app = createApp();

describe('User API Routes', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /api/users', () => {
    it('creates a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'alice@example.com', name: 'Alice' })
        .expect(201);

      expect(response.body).toMatchObject({
        email: 'alice@example.com',
        name: 'Alice',
      });
      expect(response.body.id).toBeDefined();
    });

    it('returns 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ email: 'invalid', name: '' })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('returns 409 for duplicate email', async () => {
      await request(app)
        .post('/api/users')
        .send({ email: 'alice@example.com', name: 'Alice' })
        .expect(201);

      const response = await request(app)
        .post('/api/users')
        .send({ email: 'alice@example.com', name: 'Bob' })
        .expect(409);

      expect(response.body.error).toBe('Email already exists');
    });
  });

  describe('GET /api/users', () => {
    it('returns all users', async () => {
      await request(app)
        .post('/api/users')
        .send({ email: 'alice@example.com', name: 'Alice' });

      const response = await request(app).get('/api/users').expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].email).toBe('alice@example.com');
    });
  });

  describe('GET /api/users/:id', () => {
    it('returns a user by id', async () => {
      const created = await request(app)
        .post('/api/users')
        .send({ email: 'alice@example.com', name: 'Alice' });

      const response = await request(app)
        .get(`/api/users/${created.body.id}`)
        .expect(200);

      expect(response.body.email).toBe('alice@example.com');
    });

    it('returns 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('updates a user', async () => {
      const created = await request(app)
        .post('/api/users')
        .send({ email: 'alice@example.com', name: 'Alice' });

      const response = await request(app)
        .put(`/api/users/${created.body.id}`)
        .send({ name: 'Alice Updated' })
        .expect(200);

      expect(response.body.name).toBe('Alice Updated');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('deletes a user', async () => {
      const created = await request(app)
        .post('/api/users')
        .send({ email: 'alice@example.com', name: 'Alice' });

      await request(app).delete(`/api/users/${created.body.id}`).expect(204);

      await request(app).get(`/api/users/${created.body.id}`).expect(404);
    });
  });
});
