import express from 'express';
import { registerUser, signin, signout, updateProfile,  } from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const authRouter = express.Router();

authRouter.post("/signup", registerUser);

// Sign-in route
authRouter.post('/signin', signin);
authRouter.post('/signout', signout);

// Update user profile (userName and email)
authRouter.put('/update/:id', verifyToken, updateProfile);

export default authRouter;