import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const addToWishList = async (req: Request, res: Response) => {
    try {
      const { userId, productid } = req.body;
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
  
      const product = await prisma.product.findUnique({
        where: { id: productid },
      });
  
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
  
      const wishlistItem = await prisma.wishList.create({
        data: {
          user: { connect: { id: userId } },
          product: { connect: { id: productid } },
        },
      });
  
      return res.json(wishlistItem);
    } catch (error) {
      console.error("Erro ao adicionar à lista de desejos:", error);
      return res.status(500).json({ message: "Erro ao adicionar à lista de desejos" });
    }
  };

export const removeFromWishList = async (req: Request, res: Response) => {
    try {
      const { userId, productid } = req.params;
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
  
      const product = await prisma.product.findUnique({
        where: { id: productid },
      });
  
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
  
      await prisma.wishList.deleteMany({
        where: {
          userId,
          productid,
        },
      });
  
      return res.json({ message: "Item removido da lista de desejos com sucesso" });
    } catch (error) {
      console.error("Erro ao remover da lista de desejos:", error);
      return res.status(500).json({ message: "Erro ao remover da lista de desejos" });
    }
  };