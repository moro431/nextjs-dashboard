import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Connexion PostgreSQL standard
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL!,
});

// Adaptateur Prisma
const adapter = new PrismaPg(pool);

// Singleton pour éviter plusieurs instances en DEV
const prisma = globalThis.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
