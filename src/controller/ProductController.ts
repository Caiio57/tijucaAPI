import { Request, Response } from "express"
import { prisma } from "../database/prisma"

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, amount, description, size, category, subcategory } = req.body
  //const requestImages = req.files as Express.Multer.File[]
  // const images = requestImages.map((image) => {
  //   return{
  //     path: image.filename
  //   }
  // })

  const Product = await prisma.product.create({
    data: {
      name,
      price,
      amount,
      description,
      size,
      Category: {
        connect: {
          name: category,
        },
      },
      Subcategory: {
        connect: {
          name: subcategory,
        }
      },
      // Image: {
      //   create: images
      // }
    },
  });

  return res.json(Product);
};

export const getAllProducts = async (req: Request, res: Response) => {
  const Products = await prisma.product.findMany();

  return res.json(Products);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { name, price, amount, description, size } = req.body
  const { category, subcategory } = req.params
  const { productId } = req.params

  const isProduct = await prisma.product.findMany({
    where: {
      id: productId,
    }
  })

  if (!isProduct) {
    return res.status(404).json({ message: "Product not found" })
  }

  const Product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      price,
      amount,
      description,
      size,
      Category: {
        connect: {
          name: category,
        },
      },
      Subcategory: {
        connect: {
          name: subcategory,
        }
      }
    },
  });

  return res.json(Product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { productId} = req.params

  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id: productId,
      }
    })

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" })
    }

    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting the product" })
  }
};
