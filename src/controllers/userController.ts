import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { updatePasswordSchema, updateSchema } from "../Schema/userSchemas";
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(400).json({ error: "User ID not found" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
                email: true,
            },
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateUserDetails = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ error: "User ID not found" });
        }

        const { name, email } = updateSchema.parse(req.body);

        if (!name && !email) {
            return res.status(400).json({ error: "At least one field is required for update" });
        }

        const updateData: { [key: string]: any } = {};

        if (name) updateData.name = name;
        if (email) updateData.email = email;

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateData,
            select: {
                name: true,
                email: true,
            },
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updatePassword = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
  
      if (!userId) {
        return res.status(400).json({ error: "User ID not found" });
      }
  
      const { password } = updatePasswordSchema.parse(req.body);
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
        select: {
            name: true,
            email: true,
        },
      });
  
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };

export { getUser, updateUserDetails,updatePassword };
