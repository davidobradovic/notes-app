import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/index';

const prisma = new PrismaClient();

export default class TableController {
    async createTable(req: AuthenticatedRequest, res: Response) {
        const { name, rows } = req.body;
        const { userId } = (req as any).user;
        
        const table = await prisma.table.create({
            data: { 
                name: name || "Tabela", 
                rows: JSON.stringify(rows || []), 
                userId 
            }
        });
        res.json(table);
    }

    async getTables(req: AuthenticatedRequest, res: Response) {
        const { userId, role } = req.user!;
        
        if (role === 'owner') {
            // Owner can see all tables
            const tables = await prisma.table.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            res.json(tables);
        } else {
            // Regular users see only today's table
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const todaysTable = await prisma.table.findFirst({
                where: {
                    userId,
                    createdAt: {
                        gte: today,
                        lt: tomorrow
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            res.json(todaysTable ? [todaysTable] : []);
        }
    }

    async getTableById(req: Request, res: Response) {
        const { id } = req.params;
        const table = await prisma.table.findUnique({ where: { id: Number(id) } });
        if (table) res.json(table);
        else res.status(404).json({ error: 'Table not found' });
    }

    async updateTable(req: Request, res: Response) {
        const { id } = req.params;
        const { name, rows } = req.body;
        
        const table = await prisma.table.update({
            where: { id: Number(id) },
            data: { 
                name,
                rows: JSON.stringify(rows)
            }
        });
        res.json(table);
    }

    async deleteTable(req: Request, res: Response) {
        const { id } = req.params;
        await prisma.table.delete({ where: { id: Number(id) } });
        res.json({ message: 'Table deleted' });
    }
}
