import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

import reviewTemplate from '../prompts/sumarize-reviews.txt';

export const reviewService = {
   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getSummaryByProductId(productId);

      if (existingSummary) {
         return existingSummary;
      }

      const reviews = await reviewRepository.getReviewsByProductId(
         productId,
         10
      );
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');

      const prompt = reviewTemplate.replace('{{joinedReviews}}', joinedReviews);

      //   return prompt;
      const summary = await llmClient.generateSummaryWithHuggingFace(prompt);

      await reviewRepository.storeReview(productId, summary);

      return summary;
   },
};
