import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import prismaConfig from '../prisma.config';
import { PrismaClient } from '../generated/prisma/client';

const databaseUrl = prismaConfig.datasource?.url;

if (!databaseUrl) {
   throw new Error('DATABASE_URL is not configured in prisma.config.ts');
}

const adapter = new PrismaMariaDb(databaseUrl);

const prisma = new PrismaClient({ adapter });

export const reviewRepository = {
   async getReviewsByProductId(productId: number) {
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
   },
};
