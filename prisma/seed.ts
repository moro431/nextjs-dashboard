// @ts-nocheck
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const { users, customers, invoices, revenue } = await import('./placeholder-data.mjs');

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Customers
  await prisma.customer.createMany({
    data: customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      imageUrl: c.image_url,
    })),
    skipDuplicates: true,
  });

  // Users (hash passwords)
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: hashed,
      },
    });
  }

  // Invoices
  await prisma.invoice.createMany({
    data: invoices.map((inv) => ({
      amount: inv.amount,
      status: inv.status,
      date: new Date(inv.date),
      customerId: inv.customer_id,
    })),
    skipDuplicates: true,
  });

  // Revenue
  await prisma.revenue.createMany({
    data: revenue.map((r) => ({ month: r.month, revenue: r.revenue })),
    skipDuplicates: true,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
