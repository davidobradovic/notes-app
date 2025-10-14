import { Router, Application } from 'express';
import TableController from '../controllers/tableController';
import { authenticate } from '../middleware/auth';

const router = Router();
const tableController = new TableController();

export function setTableRoutes(app: Application) {
    app.use('/api/tables', authenticate, router);

    router.post('/', tableController.createTable.bind(tableController));
    router.get('/', tableController.getTables.bind(tableController));
    router.get('/:id', tableController.getTableById.bind(tableController));
    router.put('/:id', tableController.updateTable.bind(tableController));
    router.delete('/:id', tableController.deleteTable.bind(tableController));
}
