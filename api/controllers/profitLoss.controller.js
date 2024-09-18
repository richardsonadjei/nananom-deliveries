import DailySales from '../models/sales.model.js';
import FuelExpenditure from '../models/fuelExpense.model.js';
import MaintenanceExpense from '../models/maintenanceExpenses.model.js';
import OtherExpense from '../models/otherExpense.model.js';

const calculateTotalIncome = async (startDate, endDate) => {
  try {
    const salesRecords = await DailySales.find({
      date: { $gte: startDate, $lte: endDate },
    });
    const totalIncome = salesRecords.reduce((total, record) => total + record.salesAmount, 0);
    return totalIncome;
  } catch (error) {
    throw error;
  }
};

const calculateTotalExpenditure = async (startDate, endDate) => {
  try {
    const fuelExpenditures = await FuelExpenditure.find({
      date: { $gte: startDate, $lte: endDate },
    });
    const maintenanceExpenses = await MaintenanceExpense.find({
      date: { $gte: startDate, $lte: endDate },
    });
    const otherExpenses = await OtherExpense.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const totalFuelExpense = fuelExpenditures.reduce((total, expense) => total + expense.amount, 0);
    const totalMaintenanceExpense = maintenanceExpenses.reduce((total, expense) => total + expense.amount, 0);
    const totalOtherExpense = otherExpenses.reduce((total, expense) => total + expense.amount, 0);

    const totalExpenditure = {
      fuel: totalFuelExpense,
      maintenance: totalMaintenanceExpense,
      otherExpense: totalOtherExpense,
    };

    return totalExpenditure;
  } catch (error) {
    throw error;
  }
};

const calculateProfitLoss = async (totalIncome, totalExpenditure) => {
  try {
    const totalExpense = Object.values(totalExpenditure).reduce((total, expense) => total + expense, 0);
    const profitLoss = totalIncome - totalExpense;
    return profitLoss;
  } catch (error) {
    throw error;
  }
};

const getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Calculate total income
    const totalIncome = await calculateTotalIncome(startDate, endDate);

    // Calculate total expenditure for each category
    const totalExpenditure = await calculateTotalExpenditure(startDate, endDate);

    // Calculate profit/loss
    const profitLoss = await calculateProfitLoss(totalIncome, totalExpenditure);

    // Send the financial summary as the response
    res.status(200).json({
      totalIncome,
      totalExpenditure,
      profitLoss,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { getFinancialSummary };

