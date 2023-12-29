import { Request, Response } from "express"
import { prisma } from "../database/prisma"

export const findProductbyCategory = async (req: Request, res: Response) => {
    const {search} = req.query
    console.log(req.query, 'aaaaaaaaaaaaaaaaaaaa')
    const result = await prisma.product.findMany({
        where:{
            category:{
                contains: String(search).toLowerCase()
            }
        }
    })

    if(!search) {
        return res.status(404).json({message: "Product not found"})
      }

    return res.json(result)
}