import mongoose from 'mongoose';

const { Schema } = mongoose;

const otherExpenseSchema = new Schema(
  {
    otherExpenseNumber: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      default: 'others',
   
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
    },
    purchasedBy: {
      type: String,
    },
    // Add more fields as needed
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Autogenerate otherExpenseNumber before saving
otherExpenseSchema.pre('save', async function (next) {
  try {
    const lastRecord = await this.constructor.findOne({}, {}, { sort: { otherExpenseNumber: -1 } });
    const lastOtherExpenseNumber = lastRecord ? parseInt(lastRecord.otherExpenseNumber.replace('OE', '')) : 0;
    const nextOtherExpenseNumber = lastOtherExpenseNumber + 1;
    this.otherExpenseNumber = `OE${nextOtherExpenseNumber.toString().padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

const OtherExpense = mongoose.model('OtherExpense', otherExpenseSchema);

export default OtherExpense;
