import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import path from 'path';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes/sales.router.js';
import expenseRouter from './routes/expense.routes.js';
import financialRouter from './routes/profitLoss.router.js';
import momoDepositsRouter from './routes/momoDeposits.routes.js';
import bikeRouter from './routes/bike.routes.js';
import financeRouter from './routes/finance.routes.js';
import hRRouter from './routes/hr.routes.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });


  const __dirname = path.resolve();
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
app.use('/api/', momoDepositsRouter);
app.use('/api/', bikeRouter);
app.use('/api/', financeRouter);
app.use('/api/', hRRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});