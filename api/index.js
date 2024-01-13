import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
dotenv.config();
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes/sales.router.js';
import expenseRouter from './routes/expense.routes.js';
import financialRouter from './routes/profitLoss.router.js';

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cookieParser());

// Add body-parser middleware to parse JSON data
app.use(express.json());

app.listen(3000, () => {
    
  console.log('Server is running on port 3000!');
});

app.use('/api/auth', authRouter);
app.use('/api/', router);
app.use('/api/', expenseRouter);
app.use('/api/', financialRouter);



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});