'use server';
/**
 * Prisma Client Singleton
 * 
 * Crée une instance unique de PrismaClient pour l'application.
 * Ceci évite les fuites mémoire et les multiples connexions.
 */

// Ligne 8 – remplace par ça :
// Ligne 8-9 : remplace par ça
import { PrismaClient } from '@prisma/client';  // ← Retour à l'import normal
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    }),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
