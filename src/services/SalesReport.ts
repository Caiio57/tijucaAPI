import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Sale {
  id: string;
  total_value: number;
  buyerId: string | null;
  sellerId: string | null;
  created_at: Date;
  updated_at: Date;
}

class SalesReport {
  async addSale(buyerId: string, sellerId: string, saleProducts: { productId: string; quantity: number }[]): Promise<Sale> {
    try {
      const totalValue = await saleProducts.reduce(async (totalPromise, { productId, quantity }) => {
        const total = await totalPromise;

        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { price: true },
        });

        return total + (product?.price || 0) * quantity;
      }, Promise.resolve(0));

      const sale = await prisma.sale.create({
        data: {
          total_value: totalValue,
          buyerId,
          sellerId,
          saleProduct: {
            create: saleProducts.map((saleProduct) => ({
              ...saleProduct,
              product: {
                connect: { id: saleProduct.productId },
              },
            })),
          },
        },
      });

      return sale;
    } catch (error) {
      console.error('Erro adicionando venda:', error);
      throw new Error('Falha em adicionar venda.');
    }
  }

  async calculateTotalSales(): Promise<Sale[]> {
    try {
      const sales = await prisma.sale.findMany();

      return sales;
    } catch (error) {
      console.error('Erro calculando as vendas:', error);
      throw new Error('Falha em calcular as vendas.');
    }
  }

  async displaySalesReport(): Promise<void> {
    try {
      const sales = await this.calculateTotalSales();

      console.log("Relatório de vendas:");
      console.log("--------------------");

      sales.forEach((sale) => {
        console.log(`ID: ${sale.id}`);
        console.log(`Valor total: ${sale.total_value}`);
        console.log(`Comprador ID: ${sale.buyerId}`);
        console.log(`Vendedor ID: ${sale.sellerId}`);
        console.log(`Created At: ${sale.created_at}`);
        console.log(`Updated At: ${sale.updated_at}`);
        console.log("--------------------");
      });
    } catch (error) {
      console.error('Erro ao mostrar relatório:', error);
      throw new Error('Falha em mostrar relatório.');
    }
  }
}

export { SalesReport };
