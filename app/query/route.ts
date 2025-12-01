// ============================================================================
// QUERY ROUTE: Démonstration de requête Prisma
// ============================================================================
// 
// Ce fichier montre comment utiliser Prisma pour interroger la base de données
// avec une jointure (JOIN) entre les tables Invoices et Customers.
//
// Requête SQL équivalente:
//   SELECT invoices.amount, customers.name
//   FROM invoices
//   JOIN customers ON invoices.customer_id = customers.id
//   WHERE invoices.amount = 666;
//

import prisma from '@/app/lib/prisma';


/**
 * listInvoices()
 * 
 * Récupère les invoices avec le montant de 666 (cents = $6.66)
 * et retourne le montant + le nom du customer.
 * 
 * Avec Prisma, on utilise include pour charger les données liées (customer)
 * puis on filtre et transforme les résultats.
 */
async function listInvoices() {

  try {
    // Prisma génère une requête SQL similaire à:
    //   SELECT 
    //     i."id", i."amount", i."status", i."date", i."customerId",
    //     c."id", c."name", c."email", c."imageUrl"
    //   FROM "Invoice" i
    //   JOIN "Customer" c ON i."customerId" = c."id"
    //   WHERE i."amount" = 666

    const invoices = await prisma.invoice.findMany({
      where: {
        amount: 666, // Filtre: montant = 666 cents ($6.66)
      },
      include: {
        customer: true, // Inclure les données du customer (JOIN)
      },
    });

    // Transformer les résultats pour retourner uniquement
    // amount et customer.name (comme dans la requête SQL originale)
    const result = invoices.map((invoice) => ({
      amount: invoice.amount,
      name: invoice.customer.name,
    }));

    return result;
    
    // Résultat attendu (basé sur les données seedées):
    // [
    //   {
    //     amount: 666,
    //     name: "Evil Rabbit"  ← Le customer associé à cette invoice
    //   }
    // ]
  } catch (error) {
    throw error;
  }
}

/**
 * GET()
 * 
 * Route API: GET /api/query
 * 
 * Exécute listInvoices() et retourne les résultats en JSON.
 * Si une erreur survient, retourne un message d'erreur.
 */
export async function GET() {
  try {
    // Exécute la requête et retourne les résultats
    const data = await listInvoices();
    
    return Response.json({
      success: true,
      message: 'Requête Prisma exécutée avec succès (JOIN Invoice + Customer)',
      data: data,
      count: data.length,
    });
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    
    return Response.json(
      {
        success: false,
        error: 'Erreur lors de l\'exécution de la requête',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

