import { Request, Response } from "express";
import { Pool } from 'pg';
import { generateToken, clearToken } from "../utils/auth";
import dotenv from "dotenv";
dotenv.config();
const bcrypt = require('bcrypt');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWD,
    port: Number(process.env.PORT)
});
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client:', err.stack);
    }
    console.log('Connected to the database');
});
const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const userExistsQuery = 'SELECT * FROM users WHERE email = $1';
        const existingUser = await pool.query(userExistsQuery, [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'The user already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createUserQuery = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
        const newUser = await pool.query(createUserQuery, [name, email, hashedPassword]);

        if (newUser.rows.length > 0) {
            const user = newUser.rows[0];
            generateToken(res, user.id);
            return res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } else {
            return res.status(400).json({ message: 'An error occurred in creating the user' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const authenticateUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const userQuery = 'SELECT * FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'User not found / password incorrect' });
        }

        const user = userResult.rows[0];
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
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const logoutUser = (req: Request, res: Response) => {
    clearToken(res);
    res.status(200).json({ message: 'User logged out' });
};

export { registerUser, authenticateUser, logoutUser };
