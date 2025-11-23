import express from 'express';
import bodyParser from 'body-parser';
const cors = require('cors');
import { setNotesRoutes } from './routes/notesRoutes';
import { setTableRoutes } from './routes/tableRoutes';
import { setEventRoutes } from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
setNotesRoutes(app);
setTableRoutes(app);
setEventRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});