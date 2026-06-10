import { Router } from 'express';
import { postController } from '../controllers/post.controller';

const router = Router();

router.get('/', (req, res, next) => postController.getAll(req, res, next));
router.get('/:id', (req, res, next) => postController.getById(req, res, next));
router.post('/', (req, res, next) => postController.create(req, res, next));
router.put('/:id', (req, res, next) => postController.update(req, res, next));
router.delete('/:id', (req, res, next) => postController.delete(req, res, next));

export default router;
