import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const rows = await prisma.invoice.findMany({
    where: { amount: 666 },
    include: { customer: { select: { name: true } } },
  });

  const output = rows.map((r) => ({ amount: r.amount, name: r.customer?.name ?? null }));
  console.log('Query result:', JSON.stringify(output, null, 2));
}

main()
  .catch((e) => {
    console.error('Error running query:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch (e) {
      /* ignore */
    }
  });
