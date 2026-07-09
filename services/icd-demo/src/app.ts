import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import icdAuthRoutes from './routes/icdAuthRoutes';
import icdRoutes from './routes/icdRoutes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware - disable CSP to allow inline UI styling/fonts for local POC
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: '*', // For POC, allow all. In production, restrict to trusted origins.
  methods: ['GET'] // Limit to expected HTTP methods (GET only as per requirements)
}));

app.use(express.json());

// Serve static UI assets
app.use(express.static(path.join(__dirname, '../public')));


// GET /health
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ICD Demo API Running'
  });
});

// Mount routes
app.use('/api/icd', icdAuthRoutes);
app.use('/api/icd', icdRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
