import express from 'express';
import {
  createFuelExpenditure,
  getFuelExpenditures,
  getFuelExpenditureById,
  updateFuelExpenditure,
  deleteFuelExpenditure,
  createMaintenanceExpense,
  getMaintenanceExpenses,
  getMaintenanceExpenseById,
  updateMaintenanceExpense,
  deleteMaintenanceExpense,

  createOtherExpense,
  getOtherExpenses,
  getOtherExpenseById,
  updateOtherExpense,
  deleteOtherExpense,
} from '../controllers/expense.controllers.js'; // Adjust the import path

const expenseRouter = express.Router();

// Create
expenseRouter.post('/buy-fuel', createFuelExpenditure);

// Read all
expenseRouter.get('/fuel-expenditures', getFuelExpenditures);

// Read single
expenseRouter.get('/fuel-expenditures/:id', getFuelExpenditureById);

// Update
expenseRouter.put('/fuel-expenditures/:id', updateFuelExpenditure);

// Delete
expenseRouter.delete('/fuel-expenditures/:id', deleteFuelExpenditure);

// MIANTENANCE
expenseRouter.post('/add-maintenance-expenses', createMaintenanceExpense);
expenseRouter.get('/maintenance-expenses', getMaintenanceExpenses);
expenseRouter.get('/maintenance-expenses/:id', getMaintenanceExpenseById);
expenseRouter.put('/maintenance-expenses/:id', updateMaintenanceExpense);
expenseRouter.delete('/maintenance-expenses/:id', deleteMaintenanceExpense);


expenseRouter.post('/add-other-expenses', createOtherExpense);
expenseRouter.get('/other-expenses', getOtherExpenses);
expenseRouter.get('/other-expenses/:id', getOtherExpenseById);
expenseRouter.put('/other-expenses/:id', updateOtherExpense);
expenseRouter.delete('/other-expenses/:id', deleteOtherExpense);

export default expenseRouter;
