import express from 'express';
import { createExpense, createExpenseCategory, createIncome, createTransfer, deleteExpense, deleteExpenseCategory, deleteIncome, deleteTransfer, getAllExpenseCategories, getAllExpenses, getAllIncomesAndExpenses, getAllIncomesForBike, getAllIncomesForBikeWithinPeriod, getAllTransfers, getExpenseById, getExpenseCategoryById, getExpensesByMotorbike, getExpensesByMotorbikeAndPeriod,  getIncomeById, getIncomes, getTransferById, updateExpense, updateExpenseCategory, updateIncome, updateTransfer } from '../controllers/finance.controller.js';


const financeRouter = express.Router();

// Route to create a new expense category
financeRouter.post('/expense-categories', createExpenseCategory);

// Route to get all expense categories
financeRouter.get('/expense-categories', getAllExpenseCategories);

// Route to get a single expense category by ID
financeRouter.get('/expense-categories/:id', getExpenseCategoryById);

// Route to update an expense category by ID
financeRouter.put('/expense-categories/:id', updateExpenseCategory);

// Route to delete an expense category by ID
financeRouter.delete('/expense-categories/:id', deleteExpenseCategory);

financeRouter.post('/expenses', createExpense);          // Create a new expense
financeRouter.get('/expenses', getAllExpenses);          // Get all expenses
financeRouter.get('/expenses/:id', getExpenseById);      // Get a specific expense by ID
financeRouter.put('/expenses/:id', updateExpense);       // Update an expense by ID
financeRouter.delete('/expenses/:id', deleteExpense);    // Delete an expense by ID

// Create a new income
financeRouter.post('/income', createIncome);

// Get all incomes
financeRouter.get('/income', getIncomes);

// Get a single income by ID
financeRouter.get('/income/:id', getIncomeById);

// Update an income by ID
financeRouter.put('/income/:id', updateIncome);

// Delete an income by ID
financeRouter.delete('/income/:id', deleteIncome);

financeRouter.get('/incomes-expenses', getAllIncomesAndExpenses);

// Create a new transfer
financeRouter.post('/transfers', createTransfer);

// Get all transfers
financeRouter.get('/transfers', getAllTransfers);

// Get a single transfer by ID
financeRouter.get('/transfers/:id', getTransferById);

// Update a transfer
financeRouter.put('/transfers/:id', updateTransfer);

// Delete a transfer
financeRouter.delete('/transfers/:id', deleteTransfer);
financeRouter.get('/incomes/:motorbikeId', getAllIncomesForBike);
financeRouter.get('/incomes/:motorbikeId/period', getAllIncomesForBikeWithinPeriod);
financeRouter.get('/expenses-motorbike/:motorbikeId', getExpensesByMotorbike);
financeRouter.get('/expenses/motorbike/:motorbikeId/period', getExpensesByMotorbikeAndPeriod);
export default financeRouter;