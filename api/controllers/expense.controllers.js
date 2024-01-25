// Import the FuelExpenditure model
import FuelExpenditure from '../models/fuelExpense.model.js'; // Adjust the import path

// Your existing controllers go here



const createFuelExpenditure = async (req, res) => {
    try {
      const fuelExpenditureData = req.body;
      const newFuelExpenditure = await FuelExpenditure.create(fuelExpenditureData);
      res.status(201).json(newFuelExpenditure);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getFuelExpenditures = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Parse startDate and endDate strings into Date objects in UTC format
      const parsedStartDate = new Date(startDate + 'T00:00:00Z'); // Assuming startDate is in YYYY-MM-DD format
      const parsedEndDate = new Date(endDate + 'T23:59:59.999Z'); // Assuming endDate is in YYYY-MM-DD format
  
      // Query for fuel expenditures within the specified period
      const fuelExpenditures = await FuelExpenditure.find({
        date: { $gte: parsedStartDate, $lte: parsedEndDate },
      });
  
      res.status(200).json(fuelExpenditures);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  const getFuelExpenditureById = async (req, res) => {
    const { id } = req.params;
    try {
      const fuelExpenditure = await FuelExpenditure.findById(id);
      if (!fuelExpenditure) {
        return res.status(404).json({ message: 'Fuel expenditure not found' });
      }
      res.status(200).json(fuelExpenditure);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  const updateFuelExpenditure = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const updatedFuelExpenditure = await FuelExpenditure.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );
      if (!updatedFuelExpenditure) {
        return res.status(404).json({ message: 'Fuel expenditure not found' });
      }
      res.status(200).json(updatedFuelExpenditure);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  const deleteFuelExpenditure = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedFuelExpenditure = await FuelExpenditure.findByIdAndDelete(id);
      if (!deletedFuelExpenditure) {
        return res.status(404).json({ message: 'Fuel expenditure not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  
export {
    createFuelExpenditure,
    getFuelExpenditures,
    getFuelExpenditureById,
    updateFuelExpenditure,
    deleteFuelExpenditure,
  };

// Import Mongoose
import mongoose from 'mongoose';

// Import the MaintenanceExpense model
import MaintenanceExpense from '../models/maintenanceExpenses.model.js'; // Adjust the import path

// Your existing controllers go here





  const createMaintenanceExpense = async (req, res) => {
    try {
      const maintenanceExpenseData = req.body;
      const newMaintenanceExpense = await MaintenanceExpense.create(maintenanceExpenseData);
      res.status(201).json(newMaintenanceExpense);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getMaintenanceExpenses = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Parse startDate and endDate strings into Date objects in UTC format
      const parsedStartDate = new Date(startDate + 'T00:00:00Z'); // Assuming startDate is in YYYY-MM-DD format
      const parsedEndDate = new Date(endDate + 'T23:59:59.999Z'); // Assuming endDate is in YYYY-MM-DD format
  
      // Query for maintenance expenses within the specified period
      const maintenanceExpenses = await MaintenanceExpense.find({
        date: { $gte: parsedStartDate, $lte: parsedEndDate },
      });
  
      res.status(200).json(maintenanceExpenses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  const getMaintenanceExpenseById = async (req, res) => {
    const { id } = req.params;
    try {
      const maintenanceExpense = await MaintenanceExpense.findById(id);
      if (!maintenanceExpense) {
        return res.status(404).json({ message: 'Maintenance expense not found' });
      }
      res.status(200).json(maintenanceExpense);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  const updateMaintenanceExpense = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const updatedMaintenanceExpense = await MaintenanceExpense.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );
      if (!updatedMaintenanceExpense) {
        return res.status(404).json({ message: 'Maintenance expense not found' });
      }
      res.status(200).json(updatedMaintenanceExpense);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteMaintenanceExpense = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedMaintenanceExpense = await MaintenanceExpense.findByIdAndDelete(id);
      if (!deletedMaintenanceExpense) {
        return res.status(404).json({ message: 'Maintenance expense not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  export {
    createMaintenanceExpense,
    getMaintenanceExpenses,
    getMaintenanceExpenseById,
    updateMaintenanceExpense,
    deleteMaintenanceExpense,
  };

  import OtherExpense from '../models/otherExpense.model.js';


  const createOtherExpense = async (req, res) => {
    try {
      const otherExpenseData = req.body;
      const newOtherExpense = await OtherExpense.create(otherExpenseData);
      res.status(201).json(newOtherExpense);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getOtherExpenses = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      // Parse startDate and endDate strings into Date objects in UTC format
      const parsedStartDate = new Date(startDate + 'T00:00:00Z'); // Assuming startDate is in YYYY-MM-DD format
      const parsedEndDate = new Date(endDate + 'T23:59:59.999Z'); // Assuming endDate is in YYYY-MM-DD format
  
      // Query for other expenses within the specified period
      const otherExpenses = await OtherExpense.find({
        date: { $gte: parsedStartDate, $lte: parsedEndDate },
      });
  
      res.status(200).json(otherExpenses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const getOtherExpenseById = async (req, res) => {
    const { id } = req.params;
    try {
      const otherExpense = await OtherExpense.findById(id);
      if (!otherExpense) {
        return res.status(404).json({ message: 'Other expense not found' });
      }
      res.status(200).json(otherExpense);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const updateOtherExpense = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const updatedOtherExpense = await OtherExpense.findByIdAndUpdate(
        id,
        {
          otherExpenseNumber: updatedData.otherExpenseNumber,
          amount: updatedData.amount,
          description: updatedData.description,
          purchasedBy: updatedData.purchasedBy,
          // Add other fields as needed
        },
        { new: true }
      );
  
      if (!updatedOtherExpense) {
        return res.status(404).json({ message: 'Other expense not found' });
      }
  
      res.status(200).json(updatedOtherExpense);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deleteOtherExpense = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedOtherExpense = await OtherExpense.findByIdAndDelete(id);
      if (!deletedOtherExpense) {
        return res.status(404).json({ message: 'Other expense not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  
  export {
    createOtherExpense,
    getOtherExpenses,
    getOtherExpenseById,
    updateOtherExpense,
    deleteOtherExpense,
  };
  
  