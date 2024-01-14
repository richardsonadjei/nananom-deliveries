// dailySalesRouter.js
import express from 'express';
import {
  createDailySale,
  getAllDailySales,
  getDailySaleById,
  updateDailySaleById,
  deleteDailySaleById,
} from '../controllers/sales.controller.js';

const router = express.Router();

// Create a new daily sale
router.post('/create-sales', createDailySale);

// Get all daily sales
router.get('/daily-sales', getAllDailySales);

// Get a specific daily sale by ID
router.get('/sales:id', getDailySaleById);

// Update a specific daily sale by ID
router.put('/update-sales:id', updateDailySaleById);

// Delete a specific daily sale by ID
router.delete('/:id', deleteDailySaleById);

export default router;
