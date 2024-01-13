import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
dotenv.config();
import bodyParser from 'body-parser';

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// Add body-parser middleware to parse JSON data
app.use(express.json());

app.listen(3000, () => {
    
  console.log('Server is running on port 3000!');
});

app.use('/api/auth', authRouter);