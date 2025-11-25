/**
 * ============================================================================
 * GUIDE COMPLET : Comment votre BD se connecte à l'application via Prisma
 * ============================================================================
 * 
 * Ce document explique le flux complet de connexion et communication entre
 * votre Next.js, Prisma et la base de données Neon (PostgreSQL).
 * 
 * ============================================================================
 * ÉTAPE 1 : Variables d'environnement (.env)
 * ============================================================================
 * 
 * Fichier: .env
 * Contenu:
 *   DATABASE_URL=postgresql://neondb_owner:npg_qLzjs61iwkRy@...
 * 
 * Flux:
 *   1. Vous stockez l'URL de connexion à Neon dans .env
 *   2. Au démarrage, dotenv charge les variables depuis .env
 *   3. process.env.DATABASE_URL devient accessible partout dans l'app
 * 
 * URL Anatomy (anatomie de l'URL) :
 *   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
 *   ├─ postgresql  = Driver/protocol utilisé
 *   ├─ USER        = neondb_owner (user Neon)
 *   ├─ PASSWORD    = npg_qLzjs61iwkRy (password Neon - À GARDER PRIVÉ!)
 *   ├─ HOST        = ep-green-voice-...pooler.c-2.us-east-1.aws.neon.tech
 *   ├─ PORT        = 5432 (par défaut, implicit)
 *   ├─ DATABASE    = neondb (le nom de votre base)
 *   └─ sslmode     = require (connexion sécurisée obligatoire)
 */

/**
 * ============================================================================
 * ÉTAPE 2 : Configuration Prisma (prisma.config.ts)
 * ============================================================================
 * 
 * Fichier: prisma.config.ts
 * 
 * Processus:
 *   1. import "dotenv/config" → charge les variables d'environnement
 *   2. import { defineConfig, env } from "prisma/config" → charge config Prisma
 *   3. import { PrismaPg } from "@prisma/adapter-pg" → charge adapter Postgres
 *   4. env("DATABASE_URL") → Prisma récupère DATABASE_URL depuis les variables
 *   5. new PrismaPg({ connectionString: ... }) → crée l'adapter de connexion
 *   6. datasource: { url: ..., adapter: ... } → configure la source de données
 * 
 * Rôle de PrismaPg:
 *   - C'est un DRIVER (adaptateur) pour PostgreSQL
 *   - Il traduit les requêtes Prisma en requêtes PostgreSQL brutes
 *   - Il gère la connexion à Neon et envoie/reçoit les données
 * 
 * Export:
 *   defineConfig({...}) retourne un objet configuration que Prisma utilise
 */

/**
 * ============================================================================
 * ÉTAPE 3 : Schéma Prisma (prisma/schema.prisma)
 * ============================================================================
 * 
 * Fichier: prisma/schema.prisma
 * 
 * Ce fichier DÉCRIT la structure de votre base de données en TypeScript.
 * 
 * Exemple:
 *   model Customer {
 *     id       String    @id @default(uuid()) @db.Uuid
 *     name     String
 *     email    String
 *     imageUrl String
 *     invoices Invoice[]  ← Relation: un customer a plusieurs invoices
 *   }
 * 
 *   model Invoice {
 *     id         String   @id @default(uuid()) @db.Uuid
 *     amount     Int
 *     status     String
 *     date       DateTime
 *     customer   Customer @relation(fields: [customerId], references: [id])
 *     customerId String   @db.Uuid
 *   }
 * 
 * Comment Prisma utilise ce schéma:
 *   1. Prisma LIT ce fichier au démarrage
 *   2. Il VALIDE que la base contient bien ces tables/colonnes
 *   3. Il GÉNÈRE le client TypeScript avec types intelligents
 *   4. Il permet les migrations (prisma migrate / prisma db push)
 * 
 * Les annotations (@):
 *   @id           = Cette colonne est la clé primaire
 *   @default      = Valeur par défaut (uuid() ou autoincrement)
 *   @db.Uuid      = Type PostgreSQL: UUID
 *   @relation     = Relation entre deux modèles
 */

/**
 * ============================================================================
 * ÉTAPE 4 : Génération du client Prisma (prisma generate)
 * ============================================================================
 * 
 * Commande: pnpm exec prisma generate
 * 
 * Processus:
 *   1. Prisma LIT prisma/schema.prisma
 *   2. Prisma LIT prisma.config.ts pour trouver les datasources
 *   3. Prisma GÉNÈRE du code TypeScript automatiquement
 *   4. Le code généré est stocké dans node_modules/.pnpm/@prisma/client
 *   5. Ce code contient:
 *      - Types TypeScript pour chaque modèle (Customer, Invoice, etc.)
 *      - Méthodes pour lire/créer/mettre à jour/supprimer les records
 *      - Intellisense / autocomplétion dans votre IDE
 * 
 * Exemple de code généré:
 *   interface Customer {
 *     id: string
 *     name: string
 *     email: string
 *     imageUrl: string
 *   }
 * 
 *   class PrismaClient {
 *     customer = {
 *       findMany: async () => Customer[]
 *       findUnique: async (where) => Customer | null
 *       create: async (data) => Customer
 *       update: async (where, data) => Customer
 *       delete: async (where) => Customer
 *     }
 *   }
 */

/**
 * ============================================================================
 * ÉTAPE 5 : Synchroniser la BD avec le schéma (prisma db push)
 * ============================================================================
 * 
 * Commande: pnpm exec prisma db push
 * 
 * Processus:
 *   1. Prisma LIT prisma/schema.prisma (la structure souhaitée)
 *   2. Prisma SE CONNECTE à Neon via DATABASE_URL
 *   3. Prisma DEMANDE à Neon: "Montre-moi tes tables actuelles"
 *   4. Prisma COMPARE:
 *      - Tables en schéma = tables souhaitées
 *      - Tables en BD = tables actuelles
 *      - Différences détectées?
 *   5. Prisma CRÉE/MODIFIE les tables manquantes
 *   6. Message: "Your database is now in sync with your Prisma schema"
 */

/**
 * ============================================================================
 * ÉTAPE 6 : Seeding (insertion de données de test) - prisma/seed.ts
 * ============================================================================
 * 
 * Fichier: prisma/seed.ts
 * Commande: pnpm exec ts-node prisma/seed.ts
 * 
 * Processus:
 *   1. import 'dotenv/config' → charge DATABASE_URL
 *   2. import { PrismaClient } from '@prisma/client' → charge le client généré
 *   3. import { PrismaPg } from '@prisma/adapter-pg' → charge l'adapter Postgres
 *   4. const adapter = new PrismaPg({ connectionString })
 *      → Crée une connexion à Neon
 *   5. const prisma = new PrismaClient({ adapter })
 *      → Instancie le client Prisma avec l'adapter
 *   6. await prisma.customer.createMany({ data: [...] })
 *      → Envoie la requête au serveur Neon
 *      → Neon CRÉE les enregistrements dans la table "Customer"
 *   7. await prisma.$disconnect()
 *      → Ferme la connexion à Neon
 * 
 * Flux de données dans Prisma:
 *   TypeScript Code → Prisma Client → PrismaPg Adapter → SQL → Neon → PostgreSQL
 */

/**
 * ============================================================================
 * ÉTAPE 7 : Utiliser les données dans l'application
 * ============================================================================
 * 
 * Exemple: Dans un composant Next.js
 * 
 *   import { PrismaClient } from '@prisma/client';
 *   
 *   const prisma = new PrismaClient();
 *   
 *   export async function GET() {
 *     // Récupère tous les customers depuis la BD
 *     const customers = await prisma.customer.findMany();
 *     return Response.json(customers);
 *   }
 * 
 * Flux au runtime:
 *   1. Utilisateur accède à la route /api/customers
 *   2. Next.js exécute la fonction GET()
 *   3. Prisma construit une requête SQL: SELECT * FROM "Customer"
 *   4. PrismaPg envoie la requête à Neon
 *   5. Neon exécute la requête PostgreSQL
 *   6. Neon retourne les résultats
 *   7. Prisma transforme les résultats en objets TypeScript
 *   8. La fonction retourne Response.json(customers)
 *   9. Le navigateur reçoit les données en JSON
 */

/**
 * ============================================================================
 * DIAGRAMME D'ARCHITECTURE COMPLÈTE
 * ============================================================================
 * 
 *                        ┌─────────────────────────────────────┐
 *                        │   VOTRE APPLICATION (Next.js)       │
 *                        │                                     │
 *                        │  Composants React / Pages / Routes  │
 *                        │         (app/page.tsx, etc)         │
 *                        └────────────────┬────────────────────┘
 *                                         │
 *                                         │ import PrismaClient
 *                                         ▼
 *                        ┌─────────────────────────────────────┐
 *                        │    PRISMA CLIENT (Généré)           │
 *                        │                                     │
 *                        │ Types + Méthodes pour chaque modèle │
 *                        │  - customer.findMany()              │
 *                        │  - invoice.create()                 │
 *                        │  - revenue.findUnique()             │
 *                        └────────────────┬────────────────────┘
 *                                         │
 *                                         │ Utilise
 *                                         ▼
 *                        ┌─────────────────────────────────────┐
 *                        │   PRISMA ADAPTER (PrismaPg)        │
 *                        │                                     │
 *                        │ Traduit Prisma → SQL               │
 *                        │ Gère la connexion à Neon           │
 *                        └────────────────┬────────────────────┘
 *                                         │
 *                    ┌────────────────────┴────────────────────┐
 *                    │  Lit DATABASE_URL depuis .env           │
 *                    │  HOST: ep-green-voice-...               │
 *                    │  USER: neondb_owner                     │
 *                    │  PASSWORD: npg_qLzjs61iwkRy             │
 *                    └────────────────────┬────────────────────┘
 *                                         │
 *                                    INTERNET
 *                                   (HTTPS/SSL)
 *                                         │
 *                                         ▼
 *                        ┌─────────────────────────────────────┐
 *                        │   NEON (Serverless PostgreSQL)      │
 *                        │                                     │
 *                        │  ep-green-voice-ads79e2b.aws...    │
 *                        │                                     │
 *                        │  Tables:                            │
 *                        │   - "User" (1 enregistrement)       │
 *                        │   - "Customer" (6 enregistrements)  │
 *                        │   - "Invoice" (13 enregistrements)  │
 *                        │   - "Revenue" (12 enregistrements)  │
 *                        └─────────────────────────────────────┘
 */

/**
 * ============================================================================
 * FLUX DÉTAILLÉ : Une requête de bout en bout
 * ============================================================================
 * 
 * Scénario: Vous appelez await prisma.customer.findMany()
 * 
 * Étape 1 (TYPESCRIPT):
 *   const customers = await prisma.customer.findMany();
 *                              ^^^^^^^^                  ← Prisma Client
 * 
 * Étape 2 (PRISMA CLIENT):
 *   - Prisma reçoit l'appel findMany()
 *   - Prisma regarde le schéma pour connaître la structure de Customer
 *   - Prisma génère une requête SQL:
 *     SELECT "id", "name", "email", "imageUrl" FROM "Customer"
 * 
 * Étape 3 (PRISMA ADAPTER - PrismaPg):
 *   - L'adapter reçoit la requête SQL
 *   - L'adapter utilise DATABASE_URL pour se connecter à Neon
 *   - L'adapter envoie la requête SQL via HTTPS/SSL à Neon
 * 
 * Étape 4 (NEON - PostgreSQL):
 *   - Neon reçoit la requête SQL
 *   - Neon exécute: SELECT ... FROM "Customer" WHERE ...
 *   - Neon retourne les résultats au format JSON
 *     [
 *       { id: "d6e15727...", name: "Evil Rabbit", email: "evil@...", ... },
 *       { id: "3958dc9e...", name: "Delba de Oliveira", ... },
 *       ...
 *     ]
 * 
 * Étape 5 (PRISMA ADAPTER):
 *   - L'adapter reçoit les résultats de Neon
 *   - L'adapter transforme les résultats en objets TypeScript
 *   - L'adapter vérifie que les types correspondent au schéma
 * 
 * Étape 6 (RETOUR À VOTRE CODE):
 *   customers = [
 *     { id: "d6e15727...", name: "Evil Rabbit", ... },
 *     { id: "3958dc9e...", name: "Delba de Oliveira", ... },
 *     ...
 *   ]
 * 
 * Temps total: ~100-200ms (selon latence réseau vers Neon)
 */

/**
 * ============================================================================
 * DIAGRAMME DE CLASSE (CLASS DIAGRAM)
 * ============================================================================
 * 
 * Voici la structure de votre base de données:
 * 
 * ┌────────────────────────────────────────────────────────────────────┐
 * │                             USER                                   │
 * ├────────────────────────────────────────────────────────────────────┤
 * │ id          : UUID (PK) ← Clé primaire, généré automatiquement    │
 * │ name        : String                                              │
 * │ email       : String (UNIQUE) ← Une seule valeur par email       │
 * │ password    : String (hashé avec bcrypt)                          │
 * └────────────────────────────────────────────────────────────────────┘
 *
 * ┌────────────────────────────────────────────────────────────────────┐
 * │                          CUSTOMER                                  │
 * ├────────────────────────────────────────────────────────────────────┤
 * │ id          : UUID (PK)                                           │
 * │ name        : String                                              │
 * │ email       : String                                              │
 * │ imageUrl    : String (chemin vers /public/customers/...)          │
 * │ invoices    : Invoice[] ← Relation: 1 customer → N invoices      │
 * └────────────────────────────────────────────────────────────────────┘
 *                                 △
 *                                 │ 1
 *                         ┌───────┴────────┐
 *                         │  "a many"      │ (N:1 Relationship)
 *                         │                │
 *                         ▼                │
 * ┌────────────────────────────────────────────────────────────────────┐
 * │                          INVOICE                                   │
 * ├────────────────────────────────────────────────────────────────────┤
 * │ id          : UUID (PK)                                           │
 * │ amount      : Int (montant en cents, ex: 15795 = $157.95)        │
 * │ status      : String ("pending" ou "paid")                        │
 * │ date        : DateTime (ex: 2022-12-06)                           │
 * │ customerId  : UUID (FK) ← Clé étrangère, référence Customer.id   │
 * │ customer    : Customer ← Relation: accès au customer              │
 * └────────────────────────────────────────────────────────────────────┘
 *
 * ┌────────────────────────────────────────────────────────────────────┐
 * │                          REVENUE                                   │
 * ├────────────────────────────────────────────────────────────────────┤
 * │ month       : String (PK, ex: "Jan", "Feb", etc.)                │
 * │ revenue     : Int (montant en dollars)                            │
 * └────────────────────────────────────────────────────────────────────┘
 * 
 * Notations:
 *   PK = Primary Key (clé primaire)
 *   FK = Foreign Key (clé étrangère, référence à une autre table)
 *   UUID = Type de données (identifiant unique)
 *   String = Texte
 *   Int = Nombre entier
 *   DateTime = Date et heure
 *   UNIQUE = Valeur unique (pas de doublons)
 */

/**
 * ============================================================================
 * RELATIONS EN DÉTAIL
 * ============================================================================
 * 
 * Relation 1:N (One-to-Many) - Customer ↔ Invoice
 * 
 *   1 Customer a PLUSIEURS Invoices
 *   N Invoices appartiennent à 1 Customer
 * 
 *   Exemple:
 *     Customer: "Evil Rabbit"
 *       ├─ Invoice 1: $15,795 (pending)
 *       ├─ Invoice 2: $666 (pending)
 *       └─ Invoice 3: ... (pas d'invoices supplémentaires dans les données)
 * 
 *   Implémentation en SQL:
 *     - Table Customer: id (UUID, PK)
 *     - Table Invoice: id (UUID, PK), customerId (UUID, FK → Customer.id)
 * 
 *   Utilisation en Prisma:
 *     // Récupérer tous les invoices d'un customer
 *     const customer = await prisma.customer.findUnique({
 *       where: { id: "d6e15727..." },
 *       include: { invoices: true }  ← Inclure les invoices liées
 *     });
 *     console.log(customer.invoices); // Array d'invoices
 */

/**
 * ============================================================================
 * RÉSUMÉ : Comment tout fonctionne ensemble
 * ============================================================================
 * 
 * 1. .env contient DATABASE_URL (adresse + credentiels de Neon)
 * 
 * 2. prisma.config.ts lit .env et configure l'adapter PrismaPg
 * 
 * 3. prisma/schema.prisma décrit la structure: Customer, Invoice, etc.
 * 
 * 4. pnpm exec prisma generate crée le client TypeScript
 * 
 * 5. pnpm exec prisma db push synchronise le schéma avec Neon
 * 
 * 6. prisma/seed.ts insère des données de test avec:
 *    await prisma.customer.createMany({ data: [...] })
 * 
 * 7. Dans votre app, vous utilisez:
 *    const customers = await prisma.customer.findMany()
 * 
 * 8. Prisma traduit cela en SQL et envoie à Neon via HTTPS
 * 
 * 9. Neon retourne les données
 * 
 * 10. Vous obtenez un Array<Customer> fortement typé avec autocomplétion!
 */

export {}; // Fichier de documentation (pas d'export)
