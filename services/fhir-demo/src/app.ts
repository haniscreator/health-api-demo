import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fhirRoutes from './routes/fhirRoutes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware - disable CSP to allow inline UI styling/fonts for local POC
app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: '*', // For POC. In production, restrict to trusted origins.
  methods: ['GET', 'POST'] // Limit to expected HTTP methods for the FHIR POC
}));

app.use(express.json());

// Serve static UI assets
app.use(express.static(path.join(__dirname, '../public')));

// GET /health
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FHIR Demo API Running'
  });
});

// Mount routes
app.use('/', fhirRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
