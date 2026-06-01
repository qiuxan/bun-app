import type { Request, Response } from 'express';
import { reviewService } from '../service/review.service';
import { reviewRepository } from '../repositories/review.repository';
import { productRepository } from '../repositories/product.repository';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const id = req.params.id as string;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }

      try {
         const product = await productRepository.getProductById(productId);

         if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
         }

         const reviews =
            await reviewRepository.getReviewsByProductId(productId);
         const summary =
            await reviewRepository.getSummaryByProductId(productId);

         res.json({ reviews, summary });
      } catch (error) {
         console.error('Error fetching reviews:', error);
         res.status(500).json({ error: 'Failed to fetch reviews' });
      }
   },

   async summarizeReviews(req: Request, res: Response) {
      const id = req.params.id as string;

      const product = await productRepository.getProductById(parseInt(id, 10));

      if (!product) {
         res.status(404).json({ error: 'Product not found' });
         return;
      }

      const reviews = await reviewRepository.getReviewsByProductId(
         parseInt(id, 10),
         1
      );

      if (!reviews.length) {
         res.status(404).json({ error: 'No reviews found for this product' });
         return;
      }

      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }

      try {
         const summary = await reviewService.summarizeReviews(productId);
         res.json({ summary });
      } catch (error) {
         console.error('Error summarizing reviews:', error);
         res.status(500).json({ error: 'Failed to summarize reviews' });
      }
   },
};
