import { hash } from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { enviarEmailConfirmacao } from "../services/mail";  


const handleServerError = (res: Response, error: any) => {
  console.error(error);
  return res.status(500).json({ message: "Ocorreu um erro no servidor." });
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "A senha é obrigatória" });
    }

    const usuarioExistente = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // const isAccessName = await prisma.access.findUnique({
    //   where: {
    //     name: accessName,
    //   },
    // });

    // if (!isAccessName) {
    //   return res.status(400).json({ message: "Este nivel de acesso não existe" });
    // }

    if (usuarioExistente) {
      return res.status(400).json({ message: "Já existe um usuário com este email" });
    }

    const hashSenha = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashSenha,
        // userAccess: {
        //   create: {
        //     Access: {
        //       connect: {
        //         name: accessName,
        //       },
        //     },
        //   },
        // },
      },
      select: {
        id: true,
        name: true,
        email: true,
        userAccess: {
          select: {
            Access: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    await enviarEmailConfirmacao(user.email);

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const deleteManyUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.deleteMany();
    return res.status(200).json({ message: "Usuários deletados" });
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        userAccess: {
          select: {
            Access: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(users || {});
  } catch (error) {
    return handleServerError(res, error);
  }
};

export const getUniqueUser = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any)['user'];

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        userAccess: {
          select: {
            Access: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(user || {});
  } catch (error) {
    return handleServerError(res, error);
  }
};
