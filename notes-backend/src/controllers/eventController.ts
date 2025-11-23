import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/index';

const prisma = new PrismaClient();

export default class EventController {
    async createEvent(req: AuthenticatedRequest, res: Response) {
      const { title, description, start, end, allDay } = req.body;
        const { userId } = (req as any).user; // get userId from auth middleware
        const note = await prisma.event.create({
            data: { title, description, start: new Date(start), end: new Date(end), allDay, userId }
        });
        res.json(note);
    }

    async getEvents(req: AuthenticatedRequest, res: Response) {
        const { userId, role } = req.user!;
        if (role === 'owner') {
            const notes = await prisma.event.findMany({
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

            const todaysNote = await prisma.event.findFirst({
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

    async updateEvent(req: Request, res: Response) {
        const { id } = req.params;
        const { title, description, start, end, allDay } = req.body;
        const note = await prisma.event.update({
            where: { id: Number(id) },
            data: { title, description, start, end, allDay }
        });
        res.json(note);
    }

    async deleteEvent(req: Request, res: Response) {
        const { id } = req.params;
        await prisma.event.delete({ where: { id: Number(id) } });
        res.json({ message: 'Note deleted' });
    }
}