import mongoose from 'mongoose';

// Define the payroll schema
const payrollSchema = new mongoose.Schema({
  payrollNumber: {
    type: String,
    unique: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  payPeriodStart: {
    type: Date,
    required: true
  },
  payPeriodEnd: {
    type: Date,
    required: true
  },
  baseSalary: {
    type: Number,
    required: true
  },
  otherBenefits: [{
    category: {
      type: String,
    },
    amount: {
      type: Number,
    }
  }],
  deductions: [{
    category: {
      type: String,
    },
    amount: {
      type: Number,
    }
  }],
  netPay: {
    type: Number,
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware to generate and assign payroll number before saving
payrollSchema.pre('save', async function(next) {
  if (!this.payrollNumber) {
    const latestPayroll = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    const lastPayrollNumber = latestPayroll ? latestPayroll.payrollNumber : 0;
    this.payrollNumber = (parseInt(lastPayrollNumber) + 1).toString().padStart(6, '0');
  }
  
  const totalBenefits = this.otherBenefits.reduce((acc, benefit) => acc + benefit.amount, 0);
  const totalDeductions = this.deductions.reduce((acc, deduction) => acc + deduction.amount, 0);
  this.netPay = (this.baseSalary + totalBenefits) - totalDeductions;
  
  next();
});

// Create the model from the schema
const Payroll = mongoose.model('Payroll', payrollSchema);

export default Payroll;
