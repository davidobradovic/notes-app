import express from 'express';
import bodyParser from 'body-parser';
import { setNotesRoutes } from './routes/notesRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

setNotesRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});