import Expense from "../models/expense.model.js";
import ExpenseCategory from "../models/expenseCategory.model.js";
import Income from "../models/income.model.js";
import Transfer from "../models/transfers.model.js";


// Create a new expense category
export const createExpenseCategory = async (req, res) => {
  try {
    const { name, notes } = req.body;
    const newCategory = new ExpenseCategory({ name, notes });
    await newCategory.save();
    res.status(201).json({ message: 'Expense category created successfully', newCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all expense categories
export const getAllExpenseCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single expense category by ID
export const getExpenseCategoryById = async (req, res) => {
  try {
    const category = await ExpenseCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Expense category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an expense category
export const updateExpenseCategory = async (req, res) => {
  try {
    const { name, notes } = req.body;
    const category = await ExpenseCategory.findByIdAndUpdate(
      req.params.id,
      { name, notes },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Expense category not found' });
    }
    res.status(200).json({ message: 'Expense category updated successfully', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an expense category
export const deleteExpenseCategory = async (req, res) => {
  try {
    const category = await ExpenseCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Expense category not found' });
    }
    res.status(200).json({ message: 'Expense category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create a new expense
export const createExpense = async (req, res) => {
  const { amount, category, motorbike, paymentMethod, notes, date, time, recordedBy } = req.body;

  try {
    const expense = new Expense({
      amount,
      category,
      motorbike: motorbike || null, // Only set motorbike if it's provided
      paymentMethod,
      notes,
      date,
      time,
      recordedBy
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense); // Return the newly created expense
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('category');
    res.status(200).json(expenses); // Return all expenses
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an expense by ID
export const getExpenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findById(id).populate('category');
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json(expense); // Return the expense
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an expense by ID
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category, paymentMethod, notes, date, time, recordedBy } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { amount, category, paymentMethod, notes, date, time, recordedBy },
      { new: true } // Return the updated document
    ).populate('category');

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(updatedExpense); // Return the updated expense
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an expense by ID
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' }); // Confirm deletion
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Create a new income
export const createIncome = async (req, res) => {
  const { motorbike, amount, category, paymentMethod, notes, date, time, recordedBy } = req.body;

  try {
    const newIncome = new Income({
      motorbike,
      amount,
      category,
      paymentMethod,
      notes,
      date,
      time,
      recordedBy,
    });

    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome); // Return the newly created income
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all incomes
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().populate('motorbike'); // Populate motorbike field with details
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get an income by ID
export const getIncomeById = async (req, res) => {
  const { id } = req.params;

  try {
    const income = await Income.findById(id).populate('motorbike');
    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an income
export const updateIncome = async (req, res) => {
  const { id } = req.params;
  const { motorbike, amount, category, paymentMethod, notes, date, time, recordedBy } = req.body;

  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { motorbike, amount, category, paymentMethod, notes, date, time, recordedBy },
      { new: true } // Return the updated document
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an income
export const deleteIncome = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIncome = await Income.findByIdAndDelete(id);
    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fetch all incomes and expenses
export const getAllIncomesAndExpenses = async (req, res) => {
  try {
    // Fetch all incomes, populating the motorbike field
    const incomes = await Income.find()
      .populate('motorbike', 'model registrationNumber') // Populate motorbike with model and registration number
      .exec();

    // Fetch all expenses, populating the category and motorbike fields
    const expenses = await Expense.find()
      .populate('category', 'name') // Populate category with name
      .populate('motorbike', 'model registrationNumber') // Populate motorbike with model and registration number
      .exec();

    // Return both incomes and expenses in a single response
    res.status(200).json({
      incomes,
      expenses,
    });
  } catch (error) {
    console.error('Error fetching incomes and expenses:', error);
    res.status(500).json({ message: 'Error fetching incomes and expenses' });
  }
};



export const createTransfer = async (req, res) => {
  const session = await Transfer.startSession();
  session.startTransaction();

  try {
    // Create and save the new transfer
    const transfer = new Transfer(req.body);
    await transfer.save({ session });

    // Find the "Transfers" expense category
    const transferCategory = await ExpenseCategory.findOne({ name: 'Transfers' });
    if (!transferCategory) {
      throw new Error('Transfers expense category not found');
    }

    // Construct the notes based on payment method
    let expenseNotes = `Transfer expense for transfer: ${transfer._id}`;
    if (transfer.paymentMethod === 'Momo' && transfer.momoNumber) {
      expenseNotes = `Transferred funds to Momo number: ${transfer.momoNumber}`;
    }

    // Create and save the corresponding expense
    const newExpense = new Expense({
      amount: transfer.amount,
      category: transferCategory._id,
      motorbike: transfer.motorbike,
      paymentMethod: transfer.paymentMethod,
      notes: expenseNotes,  // Updated notes to include Momo number if applicable
      date: transfer.createdAt,
      time: transfer.createdAt.toTimeString().split(' ')[0], // Extracts time from createdAt
      recordedBy: transfer.recordedBy,
    });
    await newExpense.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ 
      transfer,
      message: 'Transfer created and corresponding expense recorded successfully'
    });
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};


// Get all transfers
export const getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find().populate('motorbike');
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single transfer by ID
export const getTransferById = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id).populate('motorbike');
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }
    res.status(200).json(transfer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a transfer
export const updateTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }
    res.status(200).json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a transfer
export const deleteTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByIdAndDelete(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }
    res.status(200).json({ message: 'Transfer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};