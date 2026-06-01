import type { Request, Response } from 'express';
import { reviewService } from '../service/review.service';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const id = req.params.id as string;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }

      try {
         const reviews = await reviewService.getReviewsByProductId(productId);
         res.json(reviews);
      } catch (error) {
         console.error('Error fetching reviews:', error);
         res.status(500).json({ error });
      }
   },
};
