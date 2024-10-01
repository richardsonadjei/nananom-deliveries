import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  deactivateEmployee,
} from '../controllers/hr.controller.js';

const hRRouter = express.Router();

hRRouter.post('/employees', createEmployee);
hRRouter.get('/employees', getAllEmployees);
hRRouter.get('/employees/:id', getEmployeeById);
hRRouter.put('/employees/:id', updateEmployee);
hRRouter.delete('/employees/:id', deleteEmployee);
hRRouter.patch('/employees/:id/deactivate', deactivateEmployee);

export default hRRouter;
