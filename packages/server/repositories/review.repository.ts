import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import prismaConfig from '../prisma.config';
import { PrismaClient } from '../generated/prisma/client';
import dayjs from 'dayjs';

const databaseUrl = prismaConfig.datasource?.url;

if (!databaseUrl) {
   throw new Error('DATABASE_URL is not configured in prisma.config.ts');
}

const adapter = new PrismaMariaDb(databaseUrl);

const prisma = new PrismaClient({ adapter });

export const reviewRepository = {
   async getReviewsByProductId(productId: number, limit?: number) {
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },

   async storeReview(productId: number, content: string) {
      const now = new Date();
      const expiresAt = dayjs(now).add(7, 'day').toDate();
      const data = { content, expiresAt, generatedAt: now, productId };

      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },

   async getSummaryByProductId(productId: number): Promise<string | null> {
      const summary = await prisma.summary.findFirst({
         where: {
            AND: [{ productId }, { expiresAt: { gt: new Date() } }],
         },
      });

      return summary ? summary.content : null;
   },
};
