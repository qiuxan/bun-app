import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import prismaConfig from '../prisma.config';

const databaseUrl = prismaConfig.datasource?.url;

if (!databaseUrl) {
   throw new Error('DATABASE_URL is not configured in prisma.config.ts');
}

const adapter = new PrismaMariaDb(databaseUrl);

const prisma = new PrismaClient({ adapter });
export const productRepository = {
   async getProductById(productId: number) {
      return prisma.product.findUnique({
         where: { id: productId },
      });
   },
};
