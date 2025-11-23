import { Router, Application } from 'express';
import EventController from '../controllers/eventController';
import { authenticate } from '../middleware/auth';

const router = Router();
const eventController = new EventController();

export function setEventRoutes(app: Application) {
    app.use('/api/events', authenticate, router);

    router.post('/', eventController.createEvent.bind(eventController));
    router.get('/', eventController.getEvents.bind(eventController));
    router.put('/:id', eventController.updateEvent.bind(eventController));
    router.delete('/:id', eventController.deleteEvent.bind(eventController));
}