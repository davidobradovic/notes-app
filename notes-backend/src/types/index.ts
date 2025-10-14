import { Request } from 'express';

export interface Note {
    id: string;
    title: string;
    content: string;
    timestamp: Date;
}

export interface CreateNote {
    title: string;
    content: string;
}

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}