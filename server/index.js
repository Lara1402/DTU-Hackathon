import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import designRouter from './routes/design.js';
import refineRouter from './routes/refine.js';
import diagnoseRouter from './routes/diagnose.js';
import repairRouter from './routes/repair.js';
import testRouter from './routes/test.js';
import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import { gemmaService } from './services/gemmaService.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health / Status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    product: 'MoodUI Studio Server',
    tagline: 'Imagine. Build. Refine. Debug.',
    aiConfigured: gemmaService.isConfigured(),
    defaultModel: process.env.GEMMA_MODEL || 'gemma-2-9b-it',
    timestamp: new Date().toISOString()
  });
});

// Primary API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/design', designRouter);
app.use('/api/refine', refineRouter);
app.use('/api/diagnose', diagnoseRouter);
app.use('/api/repair', repairRouter);
app.use('/api/test', testRouter);

// Start server with graceful error handling
const server = app.listen(PORT, () => {
  console.log(`MoodUI Studio Server running on http://localhost:${PORT}`);
  console.log(`AI Integration: ${gemmaService.isConfigured() ? 'Gemma / Google AI Ready ✓' : 'Local High-Fidelity Synthesis Mode (Active)'}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] Port ${PORT} is already in use. Another server instance may still be running.\n`);
    setTimeout(() => process.exit(1), 500);
  } else {
    throw err;
  }
});

