import mongoose from 'mongoose';

const { Schema } = mongoose;

const maintenanceExpenseSchema = new Schema(
  {
    maintenanceExpenseNumber: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      default: 'maintenance',
    
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

// Autogenerate maintenanceExpenseNumber before saving
maintenanceExpenseSchema.pre('save', async function (next) {
  try {
    const lastRecord = await this.constructor.findOne({}, {}, { sort: { maintenanceExpenseNumber: -1 } });
    const lastMaintenanceExpenseNumber = lastRecord
      ? parseInt(lastRecord.maintenanceExpenseNumber.replace('ME', ''))
      : 0;
    const nextMaintenanceExpenseNumber = lastMaintenanceExpenseNumber + 1;
    this.maintenanceExpenseNumber = `ME${nextMaintenanceExpenseNumber.toString().padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

const MaintenanceExpense = mongoose.model('MaintenanceExpense', maintenanceExpenseSchema);

export default MaintenanceExpense;
