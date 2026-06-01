import { Router } from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controllers.ts';

export const routes = Router();

routes.get('/', (_req, res) => {
   res.send('Hello, World!');
});

routes.get('/api/hello', (_req, res) => {
   res.json({ message: 'Hello, World!' });
});

routes.post('/api/chat', chatController.sendMessage);

routes.get('/api/products/:id/reviews', reviewController.getReviews);
