import { Request, Response } from "express"
import { prisma } from "../database/prisma"


export const createCategory = async (req:Request, res:Response) => {
    const { name } = req.body;

    const category = await prisma.category.create({
        data: { name },
    })

    return res.json(category)
}