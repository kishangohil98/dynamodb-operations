import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { router as tableRoute } from './src/routes/table'
import { router as dataRoute } from './src/routes/data'

const PORT: number = Number(process.env.PORT);

// Initialise server
const app: Express = express();

// Middleware
app.use(express.json());

// API Routes
app.use('/api', tableRoute);
app.use('/api', dataRoute);

app.listen(PORT, () => console.log(`Running on ${PORT}`));