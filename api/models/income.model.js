import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the schema for an Income
const incomeSchema = new Schema({
  motorbike: {
    type: Schema.Types.ObjectId, // Reference to the Motorbike model
    ref: 'Motorbike',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    default: 'Sales',
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '', // Notes will have the default "Sales made for {current date}"
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Automatically set the current date
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

// Create the Income model
const Income = model('Income', incomeSchema);

export default Income;
