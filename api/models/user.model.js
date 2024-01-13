// Import required dependencies
import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  telephoneNumber: {
    type: String,
    required: true
  },
  ghanaCardNumber: {
    type: String,
    required: true
  },
  witnessName: {
      type: String,
      required: true
    },
  witnessContact: {
      type: String,
      required: true
    },
  role: {
    type: String,
    enum: ['ceo','manager', 'employee',],
    default: 'employee'
  },
},
{ timestamps: true }
);

// Create and export the User model
export default mongoose.model('User', userSchema);