// dailySalesController.js
import DailySales from '../models/sales.model.js';

// Create a new daily sale
export const createDailySale = async (req, res) => {
    try {
      const { salesAmount, recordedBy, date } = req.body;
  
      // Set the description with the default value
      const description = date ? `Sales Made For ${new Date(date).toDateString()}` : 'Sales Made';
  
      const newDailySale = new DailySales({
        salesAmount,
        description,
        recordedBy,
        date: date || new Date(), // If date is not provided, use the current date
      });
  
      const savedSale = await newDailySale.save();
  
      res.status(201).json(savedSale);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  


// Get all daily sales within a specific period
export const getAllDailySales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Check if both startDate and endDate are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Both startDate and endDate are required.' });
    }

    const dailySalesWithinPeriod = await DailySales.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    res.status(200).json(dailySalesWithinPeriod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get a specific daily sale by ID
export const getDailySaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await DailySales.findById(id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.status(200).json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a specific daily sale by ID
export const updateDailySaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { salesAmount, date, description, recordedBy } = req.body;

    const updatedSale = await DailySales.findByIdAndUpdate(
      id,
      {
        salesAmount,
        date,
        description,
        recordedBy,
      },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.status(200).json(updatedSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Delete a specific daily sale by ID
export const deleteDailySaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSale = await DailySales.findByIdAndRemove(id);

    if (!deletedSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.status(200).json(deletedSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
