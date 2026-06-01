import { Router } from 'express';
import { chatController } from './controllers/chat.controller';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import prismaConfig from './prisma.config.ts';

const databaseUrl = prismaConfig.datasource?.url;

if (!databaseUrl) {
   throw new Error('DATABASE_URL is not configured in prisma.config.ts');
}

const adapter = new PrismaMariaDb(databaseUrl);

export const routes = Router();

routes.get('/', (_req, res) => {
   res.send('Hello, World!');
});

routes.get('/api/hello', (_req, res) => {
   res.json({ message: 'Hello, World!' });
});

routes.post('/api/chat', chatController.sendMessage);

routes.get('/api/products/:id/reviews', async (req, res) => {
   const productId = parseInt(req.params.id, 10);

   if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
   }

   const prisma = new PrismaClient({ adapter });

   // res.json({ message: 'Hello, World!', productId });
   try {
      const reviews = await prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
      res.json(reviews);
   } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error });
   }
});
