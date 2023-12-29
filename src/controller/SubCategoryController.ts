import { Request, Response } from "express"
import { prisma } from "../database/prisma"


export const createSubCategory = async (req:Request, res:Response) => {
    const { name } = req.body;

    const subcategory = await prisma.subcategory.create({
        data: { name },
    })

    return res.json(subcategory)
}