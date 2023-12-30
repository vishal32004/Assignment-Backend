import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { updateSchema, updateType } from "../Schema/userSchemas";

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
                city: true,
                phoneNumber: true
            },
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const updatedUser = { ...user, phoneNumber: user.phoneNumber?.toString() };
        res.status(200).json(updatedUser);
        // res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateUserDetails = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log(userId)
        if (!userId) {
            res.status(400).json({ error: "User ID not found" });
            return;
        }

        const { name, email, city, phoneNumber } = updateSchema.parse(req.body);

        const updateData: updateType = {
            name,
            email,
            city,
            phoneNumber,
        };

        console.log(updateData)

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateData,
        });
        const userWithUpdatedPhoneNumber = { ...updatedUser, phoneNumber: updatedUser.phoneNumber?.toString() };
        res.status(200).json(userWithUpdatedPhoneNumber);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export { getUser, updateUserDetails };
