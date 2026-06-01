import type { Review } from '../generated/prisma/browser';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviewsByProductId(productId: number): Promise<Review[]> {
      return reviewRepository.getReviewsByProductId(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviewsByProductId(
         productId,
         10
      );
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');

      const summary = `This is a summary of reviews for product ${productId}:\n\n${joinedReviews}`;
      return summary;
   },
};
