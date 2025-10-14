import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export default class AuthController {
    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, role: user.role });
    }

    async register(req: Request, res: Response) {
        const { username, password, role } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { username, password: hash, role } });
        res.json({ id: user.id, username: user.username, role: user.role });
    }
}