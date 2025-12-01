import Prisma from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: Prisma.PrismaClient | undefined;
}

// Singleton pour éviter plusieurs instances en DEV
const prisma = globalThis.prisma || new Prisma.PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
