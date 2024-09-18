import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the schema for an Expense
const expenseSchema = new Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: Schema.Types.ObjectId, // Reference to the ExpenseCategory model
    ref: 'ExpenseCategory',
    required: true,
  },
  motorbike: {
    type: Schema.Types.ObjectId, // Reference to the Motorbike model
    ref: 'Motorbike', // Add motorbike as a reference
    required: false, // Not all expenses may be linked to a motorbike, so this can be optional
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Momo'], // Ensure the payment method is either 'Cash' or 'Momo'
    default: 'Cash',
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  time: {
    type: String,
    required: true,
    trim: true,
  },
  recordedBy: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` timestamps
});

// Create the Expense model
const Expense = model('Expense', expenseSchema);

export default Expense;
