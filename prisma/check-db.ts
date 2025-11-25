// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function checkDB() {
  // Requête SQL brute
  const result = await prisma.$queryRaw`
    SELECT 
      (SELECT COUNT(*) FROM "User") as users,
      (SELECT COUNT(*) FROM "Customer") as customers,
      (SELECT COUNT(*) FROM "Invoice") as invoices,
      (SELECT COUNT(*) FROM "Revenue") as revenue;
  `;
  
  console.log('Totals:', result);
  
  // Voir quelques invoices
  const invoices = await prisma.invoice.findMany({
    take: 5,
    include: { customer: true }
  });
  console.log('\nSample invoices:', invoices);
}

checkDB()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());