import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const rateProduct = async (req: Request, res: Response) => {
  try {
    const { productId, stars, comment } = req.body;
    const userId = req.params.userId;

    const existingRating = await prisma.productRating.findFirst({
      where: {
        productId: productId,
        userId: userId
      }
    });

    if (existingRating) {
      return res.status(400).json({ message: "Você já classificou este produto" });
    }

    const newRating = await prisma.productRating.create({
      data: {
        productId,
        userId,
        stars,
        comment
      },
    });

    return res.json(newRating);
  } catch (error) {
    console.error("Erro ao classificar o produto:", error);
    return res.status(500).json({ message: "Erro ao classificar o produto" });
  }
};

export const deleteRateProduct = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const deletedRateProduct = await prisma.productRating.delete({
      where: {
        id: id,
      }
    })

    if (!deletedRateProduct) {
      return res.status(404).json({ message: "Avaliação não encontrada" })
    }

    return res.json({ message: "Avaliação removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover avaliação:", error);
    return res.status(500).json({ message: "Erro ao remover avaliação" })
  }
};

export const getAllRates = async (req: Request, res: Response) => {
try {
  const Rates = await prisma.productRating.findMany();

  if (!Rates) {
    return res.status(400).json({ message: "Não há avaliações disponíveis" });
  }
  return res.json(Rates);
  
} catch (error) {
  console.error("Erro ao ver todas as avaliações:", error);
    return res.status(500).json({ message: "Erro ao ver todas as avaliações" });
}
};