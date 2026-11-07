import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';
import feedbacksRouter from './routes/feedbacks.js';

const app = express();
const port = Number(process.env.PORT || 5000);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['http://localhost:5173'];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/feedbacks', feedbacksRouter);

app.use((error, _request, response, _next) => {
  const status = error.name === 'ValidationError' ? 400 : error.status || 500;
  if (status >= 500) {
    console.error(error);
  }
  response.status(status).json({ message: error.message || 'Server error' });
});

export function createApp() {
  return app;
}

export async function connectDatabase(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error('MONGO_URI is required. Copy .env.example to .env and configure it.');
  }
  await mongoose.connect(uri);
}

async function start() {
  try {
    await connectDatabase();
    app.listen(port, () => console.log(`API listening on port ${port}`));
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

if (fileURLToPath(import.meta.url) === process.argv[1] && process.env.NODE_ENV !== 'test') {
  start();
}
