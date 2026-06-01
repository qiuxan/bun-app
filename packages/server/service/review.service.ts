import type { Review } from '../generated/prisma/browser';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviewsByProductId(productId: number): Promise<Review[]> {
      return reviewRepository.getReviewsByProductId(productId);
   },
};
