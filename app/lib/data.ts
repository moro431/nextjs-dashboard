/**
 * app/lib/data.ts - OPTIMISÉ pour la PERFORMANCE
 *
 * Prisma-based data access helpers. Optimizations:
 * 1. fetchCardData: utilise groupBy au lieu de 2 aggregate séparées (-1 requête DB)
 * 2. fetchFilteredCustomers: utilise groupBy côté DB au lieu d'inclure toutes les factures en JS
 * 3. buildSearchFilter: helper partagé pour éviter la duplication de logique
 */

import { prisma } from './prisma';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

const ITEMS_PER_PAGE = 6;

// Optimisation (FR):
// - Helper pour construire le filtre OR commun aux recherches complexes.
// - Évite la duplication de logique et facilite la maintenance.
function buildSearchFilter(query: string) {
  const whereOr: any[] = [
    { customer: { name: { contains: query, mode: 'insensitive' } } },
    { customer: { email: { contains: query, mode: 'insensitive' } } },
    { status: { contains: query, mode: 'insensitive' } },
  ];

  const maybeNumber = Number(query);
  if (!Number.isNaN(maybeNumber)) {
    whereOr.push({ amount: maybeNumber });
  }

  const parsedDate = Date.parse(query);
  if (!Number.isNaN(parsedDate)) {
    const d = new Date(parsedDate);
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    whereOr.push({ date: { gte: start, lte: end } });
  }

  return whereOr;
}

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany({ orderBy: { month: 'asc' } });
    return data as Revenue[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { customer: true },
    });

    const latest = invoices.map((inv) => ({
      id: inv.id,
      name: inv.customer.name,
      image_url: inv.customer.imageUrl,
      email: inv.customer.email,
      amount: formatCurrency(inv.amount),
    })) as LatestInvoiceRaw[] | any;

    return latest;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  // Important (OPTIMISATION):
  // - AVANT: 4 requêtes = invoiceCount, customerCount, paidAgg, pendingAgg
  // - APRÈS: 3 requêtes = groupBy('status') combine les 2 aggregations en 1
  // - Réduit le nombre de round-trips à la BDD de 4 à 3
  try {
    const [invoicesByStatus, customerCount, invoiceCount] = await Promise.all([
      // Agrégation unique: récupère paid ET pending en une seule requête
      prisma.invoice.groupBy({
        by: ['status'],
        _sum: { amount: true },
      }),
      prisma.customer.count(),
      prisma.invoice.count(),
    ]);

    // Extraire les montants du groupBy
    const paidData = invoicesByStatus.find((row) => row.status === 'paid');
    const pendingData = invoicesByStatus.find((row) => row.status === 'pending');

    const numberOfInvoices = invoiceCount ?? 0;
    const numberOfCustomers = customerCount ?? 0;
    const totalPaidInvoices = formatCurrency(paidData?._sum.amount ?? 0);
    const totalPendingInvoices = formatCurrency(pendingData?._sum.amount ?? 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const whereOr = buildSearchFilter(query);

    const invoices = await prisma.invoice.findMany({
      where: { OR: whereOr },
      include: { customer: true },
      orderBy: { date: 'desc' },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    const mapped = invoices.map((inv) => ({
      id: inv.id,
      customer_id: inv.customerId,
      name: inv.customer.name,
      email: inv.customer.email,
      image_url: inv.customer.imageUrl,
      date: inv.date.toISOString(),
      amount: inv.amount,
      status: inv.status as 'pending' | 'paid',
    })) as InvoicesTable[];

    return mapped;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const whereOr = buildSearchFilter(query);
    const count = await prisma.invoice.count({ where: { OR: whereOr } });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const inv = await prisma.invoice.findUnique({
      where: { id },
      select: { id: true, customerId: true, amount: true, status: true },
    });

    if (!inv) return null;

    const invoice: InvoiceForm = {
      id: inv.id,
      customer_id: inv.customerId,
      amount: inv.amount / 100,
      status: inv.status as 'pending' | 'paid',
    };

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await prisma.customer.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return customers as CustomerField[];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  // Important (OPTIMISATION):
  // - AVANT: include: { invoices: true } chargeait TOUTES les factures en mémoire et agrégait en JS
  // - APRÈS: groupBy côté DB agrège les données, puis on les mappe
  // - Amélioration: réduit l'utilisation mémoire et le temps de traitement pour les clients avec beaucoup de factures
  try {
    // 1. Récupère les clients correspondants
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, email: true, imageUrl: true },
      orderBy: { name: 'asc' },
    });

    if (customers.length === 0) return [];

    // 2. Récupère les agrégations par client en une seule requête (optimisé!)
    const invoiceAggs = await prisma.invoice.groupBy({
      by: ['customerId', 'status'],
      _count: { id: true },
      _sum: { amount: true },
      where: {
        customerId: { in: customers.map((c) => c.id) },
      },
    });

    // 3. Construit un map pour accès rapide
    const aggMap: Record<string, Record<string, any>> = {};
    invoiceAggs.forEach((agg) => {
      if (!aggMap[agg.customerId]) {
        aggMap[agg.customerId] = { paid: { count: 0, sum: 0 }, pending: { count: 0, sum: 0 } };
      }
      aggMap[agg.customerId][agg.status] = {
        count: agg._count.id,
        sum: agg._sum.amount ?? 0,
      };
    });

    // 4. Mappe les clients avec les agrégations
    const mapped = customers.map((c) => {
      const aggs = aggMap[c.id] || { paid: { count: 0, sum: 0 }, pending: { count: 0, sum: 0 } };
      const total_invoices = (aggs.paid.count || 0) + (aggs.pending.count || 0);
      const total_paid = aggs.paid.sum || 0;
      const total_pending = aggs.pending.sum || 0;

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        image_url: c.imageUrl,
        total_invoices,
        total_pending: formatCurrency(total_pending),
        total_paid: formatCurrency(total_paid),
      } as unknown as CustomersTableType | any;
    });

    return mapped;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
