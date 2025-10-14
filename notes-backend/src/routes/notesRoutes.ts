import { Router, Application } from 'express';
import NotesController from '../controllers/notesController';
import { authenticate } from '../middleware/auth';

const router = Router();
const notesController = new NotesController();

export function setNotesRoutes(app: Application) {
    app.use('/api/notes', authenticate, router);

    router.post('/', notesController.createNote.bind(notesController));
    router.get('/', notesController.getNotes.bind(notesController));
    router.get('/:id', notesController.getNoteById.bind(notesController));
    router.put('/:id', notesController.updateNote.bind(notesController));
    router.delete('/:id', notesController.deleteNote.bind(notesController));
}