/**
 * ============================================================================
 * DIAGRAMME DE CLASSE COMPLET (UML-style)
 * ============================================================================
 * 
 * LÉGENDE:
 *   ──────  = Relation
 *   ════════  = Inheritance (héritage)
 *   ◄►  = Bidirectionnel
 *   ►  = Unidirectionnel
 *   * = Zéro ou plusieurs
 *   1 = Exactement un
 * 
 * ============================================================================
 */

/**
 * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃                      USER                           ┃
 * ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ Attributs:                                         ┃
 * ┃ - id: UUID [PK] [auto-generated]                  ┃
 * ┃ - name: String [required]                         ┃
 * ┃ - email: String [required] [unique]               ┃
 * ┃ - password: String [required] [bcrypt hashed]     ┃
 * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 * 
 *   Données actuelles dans Neon:
 *   ┌─────────────────────────────────────────────────────────┐
 *   │ id                                   │ name │ email      │
 *   ├──────────────────────────────────────┼──────┼────────────┤
 *   │ 410544b2-4001-4271-9855-fec4b6a6... │ User │ user@...   │
 *   └─────────────────────────────────────────────────────────┘
 *   Total: 1 utilisateur
 * 
 * 
 * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃                    CUSTOMER                         ┃
 * ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ Attributs:                                         ┃
 * ┃ - id: UUID [PK] [auto-generated]                  ┃
 * ┃ - name: String [required]                         ┃
 * ┃ - email: String [required]                        ┃
 * ┃ - imageUrl: String [required]                     ┃
 * ┃                                                   ┃
 * ┃ Relations:                                        ┃
 * ┃ - invoices: Invoice[] (1 customer → N invoices)   ┃
 * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 *              ◄──────────────┐
 *                             │ 1:N
 *                             │
 *                             ▼
 * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃                    INVOICE                          ┃
 * ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ Attributs:                                         ┃
 * ┃ - id: UUID [PK] [auto-generated]                  ┃
 * ┃ - amount: Int [required] (en cents)               ┃
 * ┃ - status: String [required] (pending|paid)        ┃
 * ┃ - date: DateTime [required]                       ┃
 * ┃ - customerId: UUID [FK] → Customer.id             ┃
 * ┃                                                   ┃
 * ┃ Relations:                                        ┃
 * ┃ - customer: Customer (N invoices → 1 customer)    ┃
 * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 * 
 *   Données actuelles dans Neon:
 *   ┌──────────────────────────────────────────────────┐
 *   │ id │ customerId │ amount │ status   │ date       │
 *   ├────┼────────────┼────────┼──────────┼────────────┤
 *   │ .. │ d6e15727.. │ 15795  │ pending  │ 2022-12-06 │
 *   │ .. │ 3958dc9e.. │ 20348  │ pending  │ 2022-11-14 │
 *   │ .. │ cc27c14a.. │ 3040   │ paid     │ 2022-10-29 │
 *   │ .. │ 76d65c26.. │ 44800  │ paid     │ 2023-09-10 │
 *   └──────────────────────────────────────────────────┘
 *   Total: 13 invoices
 * 
 * 
 * ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃                    REVENUE                          ┃
 * ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ Attributs:                                         ┃
 * ┃ - month: String [PK] (ex: "Jan", "Feb", etc.)     ┃
 * ┃ - revenue: Int [required] (montant en dollars)    ┃
 * ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 * 
 *   Données actuelles dans Neon:
 *   ┌──────────────────┐
 *   │ month │ revenue  │
 *   ├───────┼──────────┤
 *   │ Jan   │ 2000     │
 *   │ Feb   │ 1800     │
 *   │ Mar   │ 2200     │
 *   │ Apr   │ 2500     │
 *   │ May   │ 2300     │
 *   │ Jun   │ 3200     │
 *   │ Jul   │ 3500     │
 *   │ Aug   │ 3700     │
 *   │ Sep   │ 2500     │
 *   │ Oct   │ 2800     │
 *   │ Nov   │ 3000     │
 *   │ Dec   │ 4800     │
 *   └──────────────────┘
 *   Total: 12 mois
 */

/**
 * ============================================================================
 * FLUX DE CONNEXION : De votre application à la base de données
 * ============================================================================
 * 
 * FICHIER: .env
 * ┌──────────────────────────────────────────────────────────────┐
 * │ DATABASE_URL=postgresql://neondb_owner:...@...neon.tech/...  │
 * └──────────────────────────────────────────────────────────────┘
 *                              ▲
 *                              │ charge au startup
 *                              │
 * FICHIER: prisma.config.ts
 * ┌──────────────────────────────────────────────────────────────┐
 * │ import "dotenv/config"                                       │
 * │ → Charge les variables depuis .env                          │
 * │                                                              │
 * │ const dbUrl = process.env.DATABASE_URL                      │
 * │ → Récupère l'URL depuis les variables d'environnement       │
 * │                                                              │
 * │ new PrismaPg({ connectionString: dbUrl })                   │
 * │ → Crée un adapter Postgres pour gérer la connexion          │
 * │                                                              │
 * │ datasource: {                                                │
 * │   url: dbUrl,                                               │
 * │   adapter: new PrismaPg(...)                                │
 * │ }                                                            │
 * │ → Configure la source de données pour Prisma               │
 * └──────────────────────────────────────────────────────────────┘
 *                              ▲
 *                              │ utilise
 *                              │
 * FICHIER: prisma/schema.prisma
 * ┌──────────────────────────────────────────────────────────────┐
 * │ generator client {                                           │
 * │   provider = "prisma-client-js"                             │
 * │ }                                                            │
 * │ → Prisma génère du code TypeScript automagiquement          │
 * │                                                              │
 * │ datasource db {                                              │
 * │   provider = "postgresql"                                   │
 * │ }                                                            │
 * │ → Dit à Prisma que la BD est PostgreSQL                    │
 * │                                                              │
 * │ model Customer {                                             │
 * │   id: UUID @id @default(uuid())                            │
 * │   name: String                                              │
 * │   ...                                                       │
 * │ }                                                            │
 * │ → Décrit la structure de chaque table                       │
 * └──────────────────────────────────────────────────────────────┘
 *                              ▲
 *                              │ lu par
 *                              │
 * COMMANDE: pnpm exec prisma generate
 * ┌──────────────────────────────────────────────────────────────┐
 * │ 1. Prisma lit schema.prisma                                  │
 * │ 2. Prisma lit prisma.config.ts                               │
 * │ 3. Prisma génère @prisma/client (types + méthodes)           │
 * │ 4. Code généré stocké dans node_modules/.pnpm/@prisma/      │
 * └──────────────────────────────────────────────────────────────┘
 *                              ▲
 *                              │ utilisé par
 *                              │
 * COMMANDE: pnpm exec prisma db push
 * ┌──────────────────────────────────────────────────────────────┐
 * │ 1. Se connecte à Neon via DATABASE_URL                       │
 * │ 2. Compare les tables souhaitées vs actuelles                │
 * │ 3. Crée les tables manquantes                                │
 * │ 4. Retour: "Database synced with schema"                     │
 * └──────────────────────────────────────────────────────────────┘
 *                              ▲
 *                              │ puis
 *                              │
 * FICHIER: prisma/seed.ts
 * ┌──────────────────────────────────────────────────────────────┐
 * │ import 'dotenv/config'                                       │
 * │ → Charge DATABASE_URL                                       │
 * │                                                              │
 * │ import { PrismaClient } from '@prisma/client'                │
 * │ → Importe le client généré                                  │
 * │                                                              │
 * │ const prisma = new PrismaClient({ adapter })                 │
 * │ → Crée une instance du client avec l'adapter                │
 * │                                                              │
 * │ await prisma.customer.createMany({ data: [...] })            │
 * │ → Envoie les requêtes INSERT à Neon                          │
 * └──────────────────────────────────────────────────────────────┘
 *                              ▲
 *                              │ utilise
 *                              │
 * INTERNET (HTTPS/SSL)
 * ┌──────────────────────────────────────────────────────────────┐
 * │ Connexion sécurisée entre votre machine et Neon             │
 * │ Port: 5432 (PostgreSQL)                                      │
 * │ SSL Mode: require (obligatoire)                              │
 * └──────────────────────────────────────────────────────────────┘
 *                              ▲
 *                              │ communique via
 *                              │
 * NEON (Serverless PostgreSQL sur AWS)
 * ┌──────────────────────────────────────────────────────────────┐
 * │ Host: ep-green-voice-ads79e2b-pooler.c-2.us-east-1...       │
 * │ Database: neondb                                             │
 * │ User: neondb_owner                                           │
 * │                                                              │
 * │ Exécute les requêtes SQL:                                    │
 * │ - CREATE TABLE "Customer" (...)                              │
 * │ - INSERT INTO "Customer" VALUES (...)                        │
 * │ - SELECT * FROM "Customer"                                   │
 * │                                                              │
 * │ Stocke les données en PostgreSQL                             │
 * └──────────────────────────────────────────────────────────────┘
 */

/**
 * ============================================================================
 * EXEMPLE D'UNE REQUÊTE COMPLÈTE
 * ============================================================================
 * 
 * Vous écrivez:
 *   const customers = await prisma.customer.findMany({
 *     include: { invoices: true }
 *   });
 * 
 * Voici ce qui se passe dans les coulisses:
 * 
 * 1️⃣ TYPESCRIPT (votre code)
 *    ↓
 *    const customers = await prisma.customer.findMany(...)
 *                                 ^^^^^^^^              ← Appellé sur le client Prisma
 * 
 * 2️⃣ PRISMA CLIENT (généré)
 *    ↓
 *    Prisma reçoit l'appel findMany()
 *    Prisma consulte le schéma pour connaître la structure de Customer
 *    Prisma génère une requête SQL:
 * 
 *      SELECT
 *        c."id", c."name", c."email", c."imageUrl"
 *      FROM "Customer" c
 * 
 *    Prisma construit aussi une sous-requête pour les invoices:
 * 
 *      SELECT
 *        i."id", i."amount", i."status", i."date", i."customerId"
 *      FROM "Invoice" i
 *      WHERE i."customerId" IN (...)  ← IDs des customers
 * 
 * 3️⃣ PRISMA ADAPTER (PrismaPg)
 *    ↓
 *    L'adapter reçoit les requêtes SQL
 *    L'adapter ouvre une connexion TCP/SSL à Neon
 *    L'adapter envoie les requêtes via HTTPS à Neon
 *    L'adapter attend les résultats
 * 
 * 4️⃣ NEON (PostgreSQL)
 *    ↓
 *    Neon reçoit les requêtes SQL
 *    Neon exécute: SELECT ... FROM "Customer"
 *    Neon retourne les résultats au format JSON-like
 * 
 * 5️⃣ INTERNET (HTTPS)
 *    ↓
 *    Les résultats voyagent de Neon vers votre machine
 * 
 * 6️⃣ PRISMA ADAPTER
 *    ↓
 *    L'adapter reçoit les résultats JSON
 *    L'adapter transforme les résultats en objets TypeScript
 *    L'adapter type-check les résultats contre le schéma
 * 
 * 7️⃣ RETOUR À VOTRE CODE
 *    ↓
 *    customers = [
 *      {
 *        id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
 *        name: "Evil Rabbit",
 *        email: "evil@rabbit.com",
 *        imageUrl: "/customers/evil-rabbit.png",
 *        invoices: [
 *          {
 *            id: "...uuid...",
 *            amount: 15795,
 *            status: "pending",
 *            date: 2022-12-06T00:00:00.000Z,
 *            customerId: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa"
 *          },
 *          {
 *            id: "...uuid...",
 *            amount: 666,
 *            status: "pending",
 *            date: 2023-06-27T00:00:00.000Z,
 *            customerId: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa"
 *          }
 *        ]
 *      },
 *      // ... d'autres customers
 *    ]
 * 
 * Temps total: ~150ms (latence réseau + exécution DB)
 */

/**
 * ============================================================================
 * TYPES GÉNÉRÉS PAR PRISMA (ce que vous pouvez utiliser)
 * ============================================================================
 * 
 * Quand vous exécutez "pnpm exec prisma generate", Prisma crée:
 * 
 * 1. TYPE Customer (TypeScript)
 *    interface Customer {
 *      id: string;                 // UUID
 *      name: string;
 *      email: string;
 *      imageUrl: string;
 *    }
 * 
 * 2. TYPE CustomerWithInvoices
 *    interface Customer {
 *      id: string;
 *      name: string;
 *      email: string;
 *      imageUrl: string;
 *      invoices: Invoice[];        // Array of related invoices
 *    }
 * 
 * 3. METHODS sur prisma.customer
 *    - findMany(options?: FindManyCustomerArgs): Promise<Customer[]>
 *    - findUnique(where: CustomerId): Promise<Customer | null>
 *    - create(data: CustomerCreateInput): Promise<Customer>
 *    - update(where, data): Promise<Customer>
 *    - delete(where): Promise<Customer>
 *    - count(): Promise<number>
 * 
 * 4. Toutes les méthodes sont TYPÉES et ont AUTOCOMPLÉTION dans votre IDE!
 */

/**
 * ============================================================================
 * RÉSUMÉ VISUEL
 * ============================================================================
 * 
 *  YOUR APP              PRISMA                  NEON
 *  ────────              ───────                 ────
 * 
 *  ┌──────────┐        ┌──────────┐          ┌──────────┐
 *  │  React   │        │ Prisma   │          │ Postgres │
 *  │Component │───────▶│ Client   │──────────▶│ neondb   │
 *  └──────────┘        │          │          └──────────┘
 *       ▲               └──────────┘               ▲
 *       │                    ▲                     │
 *       │ TypeScript         │ SQL +              │ Requêtes SQL
 *       │ (findMany,         │ Types              │ (SELECT, INSERT,
 *       │  create,...)       │ Checking           │  UPDATE, DELETE)
 *       │                    │                    │
 *       └────────────────────┴────────────────────┘
 *                    HTTPS/SSL (sécurisé)
 */

export {}; // Fichier de documentation
