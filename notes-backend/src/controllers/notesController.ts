import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/index';

const prisma = new PrismaClient();

export default class NotesController {
    async createNote(req: AuthenticatedRequest, res: Response) {
        const { title, content } = req.body;
        const { userId } = (req as any).user; // get userId from auth middleware
        const note = await prisma.note.create({
            data: { title, content, userId }
        });
        res.json(note);
    }

    async getNotes(req: AuthenticatedRequest, res: Response) {
        const { userId, role } = req.user!;
        if (role === 'owner') {
            const notes = await prisma.note.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            res.json(notes);
        } else {
            // For regular users, return today's note specifically
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const todaysNote = await prisma.note.findFirst({
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
            
            res.json(todaysNote ? [todaysNote] : []);
        }
    }

    async getNoteById(req: Request, res: Response) {
        const { id } = req.params;
        const note = await prisma.note.findUnique({ where: { id: Number(id) } });
        if (note) res.json(note);
        else res.status(404).json({ error: 'Note not found' });
    }

    async updateNote(req: Request, res: Response) {
        const { id } = req.params;
        const { title, content } = req.body;
        const note = await prisma.note.update({
            where: { id: Number(id) },
            data: { title, content }
        });
        res.json(note);
    }

    async deleteNote(req: Request, res: Response) {
        const { id } = req.params;
        await prisma.note.delete({ where: { id: Number(id) } });
        res.json({ message: 'Note deleted' });
    }
}