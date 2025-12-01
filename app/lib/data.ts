/**
 * app/lib/data.ts - OPTIMISÉ pour la PERFORMANCE + TypeScript strict compliant
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

// ──────────────────────────────────────────────────────────────
// Types spécifiques pour les résultats de groupBy (évite les `any`)
// ──────────────────────────────────────────────────────────────

type InvoiceStatusAggregation = {
  status: 'paid' | 'pending';
  _sum: { amount: number | null };
};

type CustomerInvoiceAggregation = {
  customerId: string;
  status: 'paid' | 'pending';
  _count: { id: number };
  _sum: { amount: number | null };
};

// ──────────────────────────────────────────────────────────────
// Helper partagé pour les filtres de recherche
// ──────────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────────
// Revenue
// ──────────────────────────────────────────────────────────────

export async function fetchRevenue() {
  try {
    const data = await prisma.revenue.findMany({ orderBy: { month: 'asc' } });
    return data as Revenue[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

// ──────────────────────────────────────────────────────────────
// Latest Invoices
// ──────────────────────────────────────────────────────────────

export async function fetchLatestInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { customer: true },
    });

    const latestInvoices = invoices.map((inv) => ({
      id: inv.id,
      name: inv.customer.name,
      image_url: inv.customer.imageUrl,
      email: inv.customer.email,
      amount: formatCurrency(inv.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

// ──────────────────────────────────────────────────────────────
// Card Data (Dashboard summary)
// ──────────────────────────────────────────────────────────────

export async function fetchCardData() {
  try {
    const [invoicesByStatus, customerCount, invoiceCount] = await Promise.all([
      prisma.invoice.groupBy({
        by: ['status'],
        _sum: { amount: true },
      }),

      prisma.customer.count(),
      prisma.invoice.count(),
    ]);

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

// ──────────────────────────────────────────────────────────────
// Invoices (paginated + filtered)
// ──────────────────────────────────────────────────────────────

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

    const mapped: InvoicesTable[] = invoices.map((inv) => ({
      id: inv.id,
      customer_id: inv.customerId,
      name: inv.customer.name,
      email: inv.customer.email,
      image_url: inv.customer.imageUrl,
      date: inv.date.toISOString(),
      amount: inv.amount,
      status: inv.status as 'pending' | 'paid',
    }));

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

// ──────────────────────────────────────────────────────────────
// Single Invoice
// ──────────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────────
// Customers
// ──────────────────────────────────────────────────────────────

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
  try {
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

    const invoiceAggs = await prisma.invoice.groupBy({
      by: ['customerId', 'status'],
      _count: { id: true },
      _sum: { amount: true },
      where: {
        customerId: { in: customers.map((c) => c.id) },
      },
    });

    // Construction d'une map pour accès rapide
    const aggMap: Record<string, Record<'paid' | 'pending', { count: number; sum: number }>> = {};

    invoiceAggs.forEach((agg) => {
      if (!aggMap[agg.customerId]) {
        aggMap[agg.customerId] = {
          paid: { count: 0, sum: 0 },
          pending: { count: 0, sum: 0 },
        };
      }
      aggMap[agg.customerId][agg.status] = {
        count: agg._count.id,
        sum: agg._sum.amount ?? 0,
      };
    });

    const mapped: CustomersTableType[] = customers.map((c) => {
      const aggs = aggMap[c.id] ?? { paid: { count: 0, sum: 0 }, pending: { count: 0, sum: 0 } };

      const total_invoices = aggs.paid.count + aggs.pending.count;
      const total_paid = aggs.paid.sum;
      const total_pending = aggs.pending.sum;

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        image_url: c.imageUrl,
        total_invoices,
        total_pending,
        total_paid,
      };
    });

    return mapped;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}