import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const createSale = async (req: Request, res: Response) => {
  const { products, userId } = req.body;
  const { id } = req.params;

  try {
    const productsByDatabase = await prisma.product.findMany({
      where: {
        id: { in: products.map((product: any) => product.id) },
      },
    });

    const productWithQuantity = productsByDatabase.map((product) => {
      const { id, name, price } = product;
      const quantity = products.find((p: any) => p.id === product.id).quantity;
      return {
        id,
        name,
        price,
        quantity,
      };
    });

    let total = 0;
    for (const product of productWithQuantity) {
      total += product.price * parseInt(product.quantity);
    }

    const sale = await prisma.sale.create({
      data: {
        total_value: total,
        seller: { connect: { id: userId } },
        buyer: { connect: { id } },
        saleProduct: {
          create: productWithQuantity.map((product) => ({
            product: { connect: { id: product.id } },
            quantity: product.quantity,
          })),
        },
      },
      include: {
        saleProduct: true,
      },
    });

    await Promise.all(
      productWithQuantity.map(async (product) => {
        await prisma.product.updateMany({
          where: { id: product.id },
          data: {
            amount: {
              decrement: parseInt(product.quantity),
            },
          },
        });
      })
    );

    return res.status(201).json({ sale, message: "Compra realizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};
