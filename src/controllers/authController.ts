import { generateToken, clearToken } from "../utils/auth";
import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { registrationSchema,loginSchema } from '../Schema/userSchemas';
import dotenv from "dotenv";
import { z } from 'zod';
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
dotenv.config();

const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = registrationSchema.parse(req.body);;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'The user already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        generateToken(res, newUser.id);
        return res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Error:', error);
            return res.status(400).json({ message: 'Invalid data provided', errors: error.errors });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const authenticateUser = async (req: Request, res: Response) => {
    const { email, password } = loginSchema.parse(req.body);

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'User not found / password incorrect' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            generateToken(res, user.id);
            return res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } else {
            return res.status(401).json({ message: 'User not found / password incorrect' });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Error:', error);
            return res.status(400).json({ message: 'Invalid data provided', errors: error.errors });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const logoutUser = async (req: Request, res: Response) => {
    try {
        clearToken(res);
        return res.status(200).json({ message: 'User logged out' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export { registerUser, authenticateUser, logoutUser };