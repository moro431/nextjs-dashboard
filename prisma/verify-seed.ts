// @ts-nocheck
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function verifySeed() {
  console.log('\n=== VÉRIFICATION DU SEEDING ===\n');

  // Vérifier les users
  const users = await prisma.user.findMany();
  console.log(`✓ Users: ${users.length} enregistrement(s)`);
  users.forEach((u) => console.log(`  - ${u.name} (${u.email})`));

  // Vérifier les customers
  const customers = await prisma.customer.findMany();
  console.log(`\n✓ Customers: ${customers.length} enregistrement(s)`);
  customers.forEach((c) => console.log(`  - ${c.name} (${c.email})`));

  // Vérifier les invoices
  const invoices = await prisma.invoice.findMany({
    include: { customer: true },
  });
  console.log(`\n✓ Invoices: ${invoices.length} enregistrement(s)`);
  invoices.slice(0, 3).forEach((inv) =>
    console.log(
      `  - ${inv.customer.name}: $${inv.amount} (${inv.status})`
    )
  );
  if (invoices.length > 3) {
    console.log(`  ... et ${invoices.length - 3} autres`);
  }

  // Vérifier revenue
  const revenue = await prisma.revenue.findMany();
  console.log(`\n✓ Revenue: ${revenue.length} enregistrement(s) (mois)`);
  revenue.slice(0, 3).forEach((r) => console.log(`  - ${r.month}: $${r.revenue}`));
  if (revenue.length > 3) {
    console.log(`  ... et ${revenue.length - 3} autres`);
  }

  console.log('\n=== SEEDING VÉRIFIÉ AVEC SUCCÈS ===\n');
}

verifySeed()
  .catch((e) => {
    console.error('Erreur lors de la vérification:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
