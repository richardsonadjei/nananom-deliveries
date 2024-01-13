import express from 'express';
import { getFinancialSummary } from '../controllers/profitLoss.controller.js';

const financialRouter = express.Router();

// Endpoint to get financial summary
financialRouter.get('/financial-summary', getFinancialSummary);

export default financialRouter;
