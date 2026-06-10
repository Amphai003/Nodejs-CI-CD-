import { Router } from 'express';
import { prisma } from '../lib/prisma';
import postRoutes from './post.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

// Simple database health check using Prisma
router.get('/db-health', async (_req, res) => {
	try {
		// A lightweight query to verify DB connectivity
		await prisma.$queryRaw`SELECT 1`;
		res.json({ ok: true, db: 'connected' });
	} catch (err) {
		res.status(500).json({ ok: false, error: String(err) });
	}
});

export default router;
