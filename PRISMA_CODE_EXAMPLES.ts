/**
 * ============================================================================
 * EXEMPLES D'UTILISATION PRISMA DANS VOTRE APPLICATION
 * ============================================================================
 * 
 * Ce fichier montre comment utiliser Prisma pour lire/écrire dans la BD
 * avec des commentaires détaillés sur ce qui se passe en coulisses.
 */

// ============================================================================
// EXEMPLE 1 : Récupérer tous les customers
// ============================================================================

/**
 * async function getAllCustomers() {
 *   // Prisma crée une requête SQL:
 *   //   SELECT "id", "name", "email", "imageUrl" FROM "Customer"
 *   
 *   const customers = await prisma.customer.findMany();
 *   
 *   // Résultat:
 *   // [
 *   //   { id: "d6e15727...", name: "Evil Rabbit", email: "evil@rabbit.com", ... },
 *   //   { id: "3958dc9e...", name: "Delba de Oliveira", ... },
 *   //   ...
 *   // ]
 *   
 *   return customers;
 * }
 */

// ============================================================================
// EXEMPLE 2 : Récupérer un customer avec ses invoices
// ============================================================================

/**
 * async function getCustomerWithInvoices(customerId: string) {
 *   // Prisma crée deux requêtes SQL:
 *   //   1. SELECT ... FROM "Customer" WHERE "id" = $1
 *   //   2. SELECT ... FROM "Invoice" WHERE "customerId" = $1
 *   // Puis combine les résultats
 *   
 *   const customer = await prisma.customer.findUnique({
 *     where: { id: customerId },
 *     include: { invoices: true }  // ← Inclure les invoices liées
 *   });
 *   
 *   // Résultat si customer existe:
 *   // {
 *   //   id: "d6e15727...",
 *   //   name: "Evil Rabbit",
 *   //   email: "evil@rabbit.com",
 *   //   imageUrl: "/customers/evil-rabbit.png",
 *   //   invoices: [
 *   //     {
 *   //       id: "...uuid...",
 *   //       amount: 15795,
 *   //       status: "pending",
 *   //       date: 2022-12-06T...,
 *   //       customerId: "d6e15727..."
 *   //     },
 *   //     ...
 *   //   ]
 *   // }
 *   
 *   // Résultat si customer N'existe PAS: null
 *   
 *   return customer;
 * }
 */

// ============================================================================
// EXEMPLE 3 : Créer un nouveau customer
// ============================================================================

/**
 * async function createCustomer(name: string, email: string, imageUrl: string) {
 *   // Prisma crée une requête SQL:
 *   //   INSERT INTO "Customer" ("id", "name", "email", "imageUrl")
 *   //   VALUES (gen_random_uuid(), $1, $2, $3)
 *   //   RETURNING *
 *   
 *   const newCustomer = await prisma.customer.create({
 *     data: {
 *       name: "John Doe",
 *       email: "john@example.com",
 *       imageUrl: "/customers/john.png"
 *       // id est auto-généré (uuid()) donc pas besoin de le spécifier
 *     }
 *   });
 *   
 *   // Résultat:
 *   // {
 *   //   id: "550e8400-e29b-41d4-a716-446655440000",  // UUID généré
 *   //   name: "John Doe",
 *   //   email: "john@example.com",
 *   //   imageUrl: "/customers/john.png"
 *   // }
 *   
 *   return newCustomer;
 * }
 */

// ============================================================================
// EXEMPLE 4 : Créer une invoice pour un customer
// ============================================================================

/**
 * async function createInvoiceForCustomer(
 *   customerId: string,
 *   amount: number,
 *   status: "pending" | "paid",
 *   date: Date
 * ) {
 *   // Prisma crée une requête SQL:
 *   //   INSERT INTO "Invoice" ("id", "amount", "status", "date", "customerId")
 *   //   VALUES (gen_random_uuid(), $1, $2, $3, $4)
 *   //   RETURNING *
 *   
 *   const newInvoice = await prisma.invoice.create({
 *     data: {
 *       amount: 25000,                           // 250.00 en cents
 *       status: "pending",
 *       date: new Date("2023-12-01"),
 *       customerId: customerId                   // FK vers Customer
 *       // id est auto-généré
 *     },
 *     include: { customer: true }                // Inclure le customer associé
 *   });
 *   
 *   // Résultat:
 *   // {
 *   //   id: "...",
 *   //   amount: 25000,
 *   //   status: "pending",
 *   //   date: 2023-12-01T00:00:00.000Z,
 *   //   customerId: "d6e15727...",
 *   //   customer: {
 *   //     id: "d6e15727...",
 *   //     name: "Evil Rabbit",
 *   //     email: "evil@rabbit.com",
 *   //     imageUrl: "/customers/evil-rabbit.png"
 *   //   }
 *   // }
 *   
 *   return newInvoice;
 * }
 */

// ============================================================================
// EXEMPLE 5 : Mettre à jour une invoice
// ============================================================================

/**
 * async function markInvoiceAsPaid(invoiceId: string) {
 *   // Prisma crée une requête SQL:
 *   //   UPDATE "Invoice"
 *   //   SET "status" = 'paid'
 *   //   WHERE "id" = $1
 *   //   RETURNING *
 *   
 *   const updatedInvoice = await prisma.invoice.update({
 *     where: { id: invoiceId },
 *     data: {
 *       status: "paid"
 *     }
 *   });
 *   
 *   // Résultat:
 *   // {
 *   //   id: "...",
 *   //   amount: 15795,
 *   //   status: "paid",        // ← Changé de "pending" à "paid"
 *   //   date: 2022-12-06T...,
 *   //   customerId: "d6e15727..."
 *   // }
 *   
 *   return updatedInvoice;
 * }
 */

// ============================================================================
// EXEMPLE 6 : Obtenir les invoices d'un customer avec filtrage
// ============================================================================

/**
 * async function getCustomerPendingInvoices(customerId: string) {
 *   // Prisma crée une requête SQL:
 *   //   SELECT ...
 *   //   FROM "Invoice"
 *   //   WHERE "customerId" = $1 AND "status" = 'pending'
 *   
 *   const pendingInvoices = await prisma.invoice.findMany({
 *     where: {
 *       customerId: customerId,
 *       status: "pending"
 *     }
 *   });
 *   
 *   // Résultat (pour Evil Rabbit):
 *   // [
 *   //   {
 *   //     id: "...",
 *   //     amount: 15795,
 *   //     status: "pending",
 *   //     date: 2022-12-06T...,
 *   //     customerId: "d6e15727..."
 *   //   },
 *   //   {
 *   //     id: "...",
 *   //     amount: 666,
 *   //     status: "pending",
 *   //     date: 2023-06-27T...,
 *   //     customerId: "d6e15727..."
 *   //   }
 *   // ]
 *   
 *   return pendingInvoices;
 * }
 */

// ============================================================================
// EXEMPLE 7 : Compter les invoices par customer
// ============================================================================

/**
 * async function countInvoicesByCustomer(customerId: string) {
 *   // Prisma crée une requête SQL:
 *   //   SELECT COUNT(*)
 *   //   FROM "Invoice"
 *   //   WHERE "customerId" = $1
 *   
 *   const count = await prisma.invoice.count({
 *     where: { customerId: customerId }
 *   });
 *   
 *   // Résultat (pour Evil Rabbit): 2
 *   
 *   return count;
 * }
 */

// ============================================================================
// EXEMPLE 8 : Supprimer une invoice
// ============================================================================

/**
 * async function deleteInvoice(invoiceId: string) {
 *   // Prisma crée une requête SQL:
 *   //   DELETE FROM "Invoice"
 *   //   WHERE "id" = $1
 *   //   RETURNING *
 *   
 *   const deletedInvoice = await prisma.invoice.delete({
 *     where: { id: invoiceId }
 *   });
 *   
 *   // Résultat: l'invoice qui a été supprimée
 *   // {
 *   //   id: "...",
 *   //   amount: 15795,
 *   //   status: "pending",
 *   //   date: 2022-12-06T...,
 *   //   customerId: "d6e15727..."
 *   // }
 *   
 *   // Si l'invoice N'existe PAS:
 *   // Lance une PrismaClientKnownRequestError
 *   
 *   return deletedInvoice;
 * }
 */

// ============================================================================
// EXEMPLE 9 : Utiliser dans une route Next.js (API Route)
// ============================================================================

/**
 * // Fichier: app/api/customers/route.ts
 * 
 * import { PrismaClient } from '@prisma/client';
 * import { PrismaPg } from '@prisma/adapter-pg';
 * 
 * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
 * const prisma = new PrismaClient({ adapter });
 * 
 * export async function GET() {
 *   try {
 *     // Récupère tous les customers depuis la BD Neon
 *     const customers = await prisma.customer.findMany();
 *     
 *     // Retourne les customers en JSON
 *     return Response.json(customers);
 *   } catch (error) {
 *     return Response.json(
 *       { error: "Failed to fetch customers" },
 *       { status: 500 }
 *     );
 *   } finally {
 *     // Ferme la connexion à Neon
 *     await prisma.$disconnect();
 *   }
 * }
 * 
 * // Quand un utilisateur visite /api/customers:
 * // 1. Next.js exécute la fonction GET()
 * // 2. Prisma se connecte à Neon
 * // 3. Prisma récupère les customers
 * // 4. Next.js retourne { "application/json": customers }
 * // 5. Le navigateur reçoit l'array de customers
 */

// ============================================================================
// EXEMPLE 10 : Utiliser dans un Server Component React (Next.js 13+)
// ============================================================================

/**
 * // Fichier: app/customers/page.tsx
 * 
 * import { PrismaClient } from '@prisma/client';
 * import { PrismaPg } from '@prisma/adapter-pg';
 * 
 * async function CustomersPage() {
 *   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
 *   const prisma = new PrismaClient({ adapter });
 *   
 *   try {
 *     // Récupère les customers directement côté serveur
 *     const customers = await prisma.customer.findMany({
 *       include: { invoices: true }
 *     });
 *     
 *     return (
 *       <div>
 *         <h1>Customers</h1>
 *         <ul>
 *           {customers.map((customer) => (
 *             <li key={customer.id}>
 *               <h2>{customer.name}</h2>
 *               <p>{customer.invoices.length} invoices</p>
 *             </li>
 *           ))}
 *         </ul>
 *       </div>
 *     );
 *   } finally {
 *     await prisma.$disconnect();
 *   }
 * }
 * 
 * export default CustomersPage;
 * 
 * // Avantages de Server Components:
 * // - Pas de JavaScript envoyé au client
 * // - Requête à la BD directe (pas d'API route intermédiaire)
 * // - Plus sécurisé (credentiels BD restent côté serveur)
 */

// ============================================================================
// RÉSUMÉ : Flux de données (Prisma → SQL → Neon → Résultats)
// ============================================================================

/**
 * 
 * await prisma.customer.findMany()
 *            ▼
 *       Prisma Client
 *       (généré automatiquement)
 *            ▼
 *  SELECT * FROM "Customer"
 *            ▼
 *       Prisma Adapter (PrismaPg)
 *            ▼
 *    HTTPS vers Neon (AWS)
 *            ▼
 *       PostgreSQL
 *       (exécute SELECT)
 *            ▼
 *    Résultats JSON
 *            ▼
 *       HTTPS de retour
 *            ▼
 *       Prisma Adapter
 *       (transforme JSON → TypeScript)
 *            ▼
 *       Array<Customer>
 *       (fortement typé!)
 *            ▼
 *    Votre code reçoit les données
 */

export {};
