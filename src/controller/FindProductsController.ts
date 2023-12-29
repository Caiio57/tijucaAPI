import { Request, Response } from "express"
import { prisma } from "../database/prisma"

export const findProduct = async (req: Request, res: Response) => {
    const {search} = req.query

    const result = await prisma.product.findMany({
        where:{
            name:{
                contains: String(search).toLowerCase()
            }
        }
    })

    return res.json(result)
}