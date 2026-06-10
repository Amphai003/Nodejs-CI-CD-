import request from 'supertest';
import { createApp } from '../../src/app';
import { cleanDatabase, disconnectDatabase } from '../helpers';

const app = createApp();

describe('Post API Routes', () => {
  let authorId: string;

  beforeEach(async () => {
    await cleanDatabase();

    const user = await request(app)
      .post('/api/users')
      .send({ email: 'author@example.com', name: 'Author' });

    authorId = user.body.id;
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /api/posts', () => {
    it('creates a new post', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({
          title: 'Hello World',
          content: 'My first post',
          authorId,
          published: true,
        })
        .expect(201);

      expect(response.body).toMatchObject({
        title: 'Hello World',
        content: 'My first post',
        published: true,
        authorId,
      });
      expect(response.body.author).toBeDefined();
    });

    it('returns 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ title: '', authorId })
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });
  });

  describe('GET /api/posts', () => {
    it('returns all posts', async () => {
      await request(app)
        .post('/api/posts')
        .send({ title: 'Post 1', authorId });

      const response = await request(app).get('/api/posts').expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Post 1');
    });
  });

  describe('GET /api/posts/:id', () => {
    it('returns a post by id', async () => {
      const created = await request(app)
        .post('/api/posts')
        .send({ title: 'Post 1', authorId });

      const response = await request(app)
        .get(`/api/posts/${created.body.id}`)
        .expect(200);

      expect(response.body.title).toBe('Post 1');
    });

    it('returns 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/api/posts/non-existent-id')
        .expect(404);

      expect(response.body.error).toBe('Post not found');
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('updates a post', async () => {
      const created = await request(app)
        .post('/api/posts')
        .send({ title: 'Post 1', authorId });

      const response = await request(app)
        .put(`/api/posts/${created.body.id}`)
        .send({ title: 'Updated Post', published: true })
        .expect(200);

      expect(response.body.title).toBe('Updated Post');
      expect(response.body.published).toBe(true);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('deletes a post', async () => {
      const created = await request(app)
        .post('/api/posts')
        .send({ title: 'Post 1', authorId });

      await request(app).delete(`/api/posts/${created.body.id}`).expect(204);

      await request(app).get(`/api/posts/${created.body.id}`).expect(404);
    });
  });
});
