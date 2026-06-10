import { PostService } from '../../src/services/post.service';

describe('PostService', () => {
  const postService = new PostService();

  describe('validateCreateInput', () => {
    it('returns null for valid input', () => {
      const result = postService.validateCreateInput({
        title: 'My First Post',
        content: 'Hello world',
        authorId: 'user-123',
      });
      expect(result).toBeNull();
    });

    it('returns error when title is missing', () => {
      const result = postService.validateCreateInput({
        title: '  ',
        authorId: 'user-123',
      });
      expect(result).toBe('Title is required');
    });

    it('returns error when authorId is missing', () => {
      const result = postService.validateCreateInput({
        title: 'My Post',
        authorId: '',
      });
      expect(result).toBe('Author ID is required');
    });
  });
});
