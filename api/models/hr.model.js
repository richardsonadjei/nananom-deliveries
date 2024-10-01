import mongoose from 'mongoose';
import cron from 'node-cron';

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  position: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
    
  },
 
  hireDate: {
    type: Date,
    required: true
  },
  salary: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  employeeId: {
    type: String,
    unique: true
  },
  durationOfEmployment: {
    years: {
      type: Number,
      default: 0
    },
    months: {
      type: Number,
      default: 0
    },
    days: {
      type: Number,
      default: 0
    },
    formatted: {
      type: String,
      default: ''
    }
  }
});

// Autogenerate employeeId based on criteria
employeeSchema.pre('save', function(next) {
  const employee = this;
  const firstLetterFirstName = employee.firstName.charAt(0).toUpperCase();
  const firstLetterLastName = employee.lastName.charAt(0).toUpperCase();
  const hireMonth = employee.hireDate.getMonth() + 1; // getMonth() returns 0-indexed
  const hireYear = employee.hireDate.getFullYear();
  employee.employeeId = `${firstLetterFirstName}${firstLetterLastName}-${hireMonth}-${hireYear}`;
  next();
});

// Format durationOfEmployment into "X years Y months Z days"
const formatDuration = (years, months, days) => {
  let formatted = '';
  if (years > 0) {
    formatted += `${years} year${years > 1 ? 's' : ''} `;
  }
  if (months > 0) {
    formatted += `${months} month${months > 1 ? 's' : ''} `;
  }
  if (days > 0) {
    formatted += `${days} day${days > 1 ? 's' : ''}`;
  }
  return formatted.trim();
};

// Schedule cron job to update durationOfEmployment
cron.schedule('* * * * *', async () => {
  try {
    const employees = await Employee.find({ isActive: true });
    employees.forEach(employee => {
      const hireDate = employee.hireDate;
      const currentDate = new Date();
      const timeDifference = Math.abs(currentDate - hireDate);
      const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      const months = Math.floor(days / 30);
      const years = Math.floor(months / 12);
      employee.durationOfEmployment = {
        years,
        months: months % 12,
        days: days % 30,
        formatted: formatDuration(years, months % 12, days % 30)
      };
      employee.save();
    });
  } catch (error) {
    console.error('Error updating durationOfEmployment:', error);
  }
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
