import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "./errorMiddleware";
const prisma = new PrismaClient();

const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.jwt;

        if (!token) {
            res.status(401);
            throw new AuthenticationError("Token not found");
        }

        const jwtSecret = process.env.JWT_SECRET || "";
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        if (!decoded || !decoded.userId || !decoded.userEmail) {
            res.status(401);
            throw new AuthenticationError("UserId not found");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                roles: true
            },
        });

        if (!user) {
            res.status(401);
            throw new AuthenticationError("User not found");
        }

        req.user = user;
        next();
    } catch (e) {
        res.status(401);
        throw new AuthenticationError("Invalid token");
    }
});


const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRoles = req.user?.roles;

        if (
            !userRoles ||
            !userRoles.some((role: string) => allowedRoles.includes(role))
        ) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

export { authenticate,authorize };
