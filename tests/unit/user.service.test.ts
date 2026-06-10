import { UserService } from '../../src/services/user.service';
import { Prisma } from '@prisma/client';

describe('UserService', () => {
  const userService = new UserService();

  describe('isValidEmail', () => {
    it('returns true for valid email addresses', () => {
      expect(userService.isValidEmail('user@example.com')).toBe(true);
      expect(userService.isValidEmail('test.user+tag@domain.co')).toBe(true);
    });

    it('returns false for invalid email addresses', () => {
      expect(userService.isValidEmail('invalid')).toBe(false);
      expect(userService.isValidEmail('missing@domain')).toBe(false);
      expect(userService.isValidEmail('@domain.com')).toBe(false);
      expect(userService.isValidEmail('')).toBe(false);
    });
  });

  describe('validateCreateInput', () => {
    it('returns null for valid input', () => {
      const result = userService.validateCreateInput({
        email: 'user@example.com',
        name: 'John Doe',
      });
      expect(result).toBeNull();
    });

    it('returns error when name is missing', () => {
      const result = userService.validateCreateInput({
        email: 'user@example.com',
        name: '   ',
      });
      expect(result).toBe('Name is required');
    });

    it('returns error when email is missing', () => {
      const result = userService.validateCreateInput({
        email: '',
        name: 'John Doe',
      });
      expect(result).toBe('Email is required');
    });

    it('returns error for invalid email format', () => {
      const result = userService.validateCreateInput({
        email: 'not-an-email',
        name: 'John Doe',
      });
      expect(result).toBe('Invalid email format');
    });
  });

  describe('isPrismaUniqueConstraintError', () => {
    it('returns true for P2002 Prisma errors', () => {
      const error = new Prisma.PrismaClientKnownRequestError('Unique constraint', {
        code: 'P2002',
        clientVersion: '6.0.0',
      });
      expect(userService.isPrismaUniqueConstraintError(error)).toBe(true);
    });

    it('returns false for other errors', () => {
      expect(userService.isPrismaUniqueConstraintError(new Error('generic'))).toBe(false);
    });
  });
});
