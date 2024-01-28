// momoDepositModel.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const momoDepositSchema = new Schema(
  {
    transactionNumber: {
      type: String,
      unique: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    depositAmount: {
      type: Number,
      required: true,
    },
    depositNumber: {
        type: String,
        default: '0541919739', 
     
      },
    description: {
      type: String,
    },
    recordedBy: {
        type: String,
        required: true,
      },
  },
  {
    timestamps: true, 
  }
);

// Autogenerate transactionNumber before saving
momoDepositSchema.pre('save', async function (next) {
  try {
    const lastRecord = await this.constructor.findOne({}, {}, { sort: { transactionNumber: -1 } });
    const lastTransactionNumber = lastRecord ? parseInt(lastRecord.transactionNumber.replace('MD', '')) : 0;
    const nextTransactionNumber = lastTransactionNumber + 1;
    this.transactionNumber = `MD${nextTransactionNumber.toString().padStart(4, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

const MoMoDeposit = mongoose.model('MoMoDeposit', momoDepositSchema);

export default MoMoDeposit;
