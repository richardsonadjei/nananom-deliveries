import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for a motorbike
const motorbikeSchema = new Schema({
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },
  engineSize: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true, // Ensures that the registration number is unique
    trim: true
  },
  datePurchased: {
    type: Date,
    required: true, // Ensure this field is provided when recording the motorbike
    default: Date.now // Default to the current date
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Maintenance', 'Reserved'],
    default: 'Available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update `updatedAt` on save
motorbikeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Motorbike model
const Motorbike = mongoose.model('Motorbike', motorbikeSchema);

export default Motorbike;
