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
      const { message: summary } = await llmClient.generateText({
         model: 'gpt-4o-mini',
         prompt,
         temperature: 0.2,
         max_output_tokens: 200,
      });

      await reviewRepository.storeReview(productId, summary);

      return summary;
   },
};
