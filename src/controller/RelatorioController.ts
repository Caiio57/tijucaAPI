// // salesReportGenerator.ts
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function generateSalesReport() {
//   try {
//     const userSales = await prisma.sale.groupBy({
//       by: ['buyerId'],
//       _sum: {
//         total_value: true,
//       },
//       orderBy: {
//         _sum: {
//           total_value: 'desc',
//         },
//       },
//     });

//     console.log('Soma total de vendas por usuário:');

//     for (const userSale of userSales) {
//       console.log(`Comprador ID: ${userSale.buyerId}, Total de Vendas: ${userSale._sum.total_value}`);

//       const mostSoldProduct = await prisma.saleProduct.findFirst({
//         where: {
//           sale: {
//             buyerId: userSale.buyerId,
//           },
//         },
//         orderBy: {
//           quantity: 'desc',
//         },
//         select: {
//           product: true,
//           quantity: true,
//         },
//       });

//       if (mostSoldProduct) {
//         console.log(`Produto mais vendido: ${mostSoldProduct.product.name}, Quantidade: ${mostSoldProduct.quantity}`);
//       } else {
//         console.log('Nenhum produto vendido por este comprador.');
//       }
//     }
//   } catch (error) {
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }
