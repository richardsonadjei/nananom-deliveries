import mongoose from 'mongoose';

const { Schema } = mongoose;

const fuelExpenditureSchema = new Schema(
  {
    fuelPurchaseNumber: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      default: 'fuel',
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
      default: function () {
        const purchaseDate = this.date.toISOString().split('T')[0]; // Extracting date in 'YYYY-MM-DD' format
        return `Purchase of Fuel on ${purchaseDate}`;
      },
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

// Autogenerate fuelPurchaseNumber before saving
fuelExpenditureSchema.pre('save', async function (next) {
  try {
    const lastRecord = await this.constructor.findOne({}, {}, { sort: { fuelPurchaseNumber: -1 } });
    const lastFuelPurchaseNumber = lastRecord ? parseInt(lastRecord.fuelPurchaseNumber.replace('FP', '')) : 0;
    const nextFuelPurchaseNumber = lastFuelPurchaseNumber + 1;
    this.fuelPurchaseNumber = `FP${nextFuelPurchaseNumber.toString().padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

const FuelExpenditure = mongoose.model('FuelExpenditure', fuelExpenditureSchema);

export default FuelExpenditure;
