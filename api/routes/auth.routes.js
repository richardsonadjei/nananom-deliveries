import express from 'express';
import { registerUser, signin } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/signup", registerUser);

// Sign-in route
authRouter.post('/signin', signin);

export default authRouter;