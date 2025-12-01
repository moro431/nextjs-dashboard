import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client/edge';

// Création du Pool PostgreSQL
const connectionString = process.env.POSTGRES_URL!;
const pool = new Pool({ connectionString });

// Adaptateur Prisma pour PostgreSQL
const adapter = new PrismaPg(pool);

// Création du client Prisma
const prisma = new PrismaClient({ adapter });

// Export
export default prisma;
