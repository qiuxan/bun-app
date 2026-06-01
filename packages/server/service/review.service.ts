import type { Review } from '../generated/prisma/browser';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

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

      const prompt = `Summarize the following reviews for product ${productId} into a short paragraph highlighting the key themes, both positive and negative:\n\n ${joinedReviews}`;

      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         prompt,
         temperature: 0.2,
         max_output_tokens: 200,
      });

      return response.message;
   },
};
