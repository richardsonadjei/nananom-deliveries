// salesModel.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const dailySalesSchema = new Schema(
  {
    salesNumber: {
      type: String,
      unique: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    salesAmount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    recordedBy: {
      type: String,
      required: true,
    },
    // Add more fields as needed
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Autogenerate salesNumber before saving
dailySalesSchema.pre('save', async function (next) {
  try {
    const lastRecord = await this.constructor.findOne({}, {}, { sort: { salesNumber: -1 } });
    const lastSalesNumber = lastRecord ? parseInt(lastRecord.salesNumber.replace('DS', '')) : 0;
    const nextSalesNumber = lastSalesNumber + 1;
    this.salesNumber = `DS${nextSalesNumber.toString().padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

const DailySales = mongoose.model('DailySales', dailySalesSchema);

export default DailySales;
