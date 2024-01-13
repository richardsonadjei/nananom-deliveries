import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

import jwt from 'jsonwebtoken';

export const registerUser = async (req, res,next) => {
  const {
    name,
    userName,
    email,
    password,
    telephoneNumber,
    ghanaCardNumber,
    witnessName,
    witnessContact,
    role,
  } = req.body;

  // Hash the password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    // Check if the user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });

    if (existingUser) {
      return res.status(400).json({ error: 'User with the same email or username already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      userName,
      email,
      password: hashedPassword,
      telephoneNumber,
      ghanaCardNumber,
      witnessName,
      witnessContact,
      role,
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json('User registered successfully!');
  } catch (error) {
    next(error);
  }
};




export const signin = async (req, res, next) => {
  const { userNameOrEmail, password } = req.body;
  
  try {
    // Find user by userName or email
    const validUser = await User.findOne({
      $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    });

    if (!validUser) {
      return res.status(404).json({ error: 'User not found!' });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Wrong credentials!' });
    }

    // Include relevant information in the token payload
    const tokenPayload = {
      id: validUser._id,
      userName: validUser.userName,
      email: validUser.email,
      role: validUser.role,
    };

    // Sign the token with the payload
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the token as a cookie and include user details in the response
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({
        id: validUser._id,
        userName: validUser.userName,
        email: validUser.email,
        role: validUser.role,
      });
  } catch (error) {
    next(error);
  }
};


export const updateProfile = async (req, res, next) => {
  const userId = req.params.id;
  const { userName, email, password, newPassword, confirmPassword } = req.body;

  try {
    // Authentication check
    if (!req.user || req.user.id !== userId) {
      return next(errorHandler(401, 'You can only update your own account!'));
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }

    // Update userName and email fields
    user.userName = userName;
    user.email = email;

    // Update password if provided
    if (password && newPassword !== confirmPassword) {
      
      return res.status(400).json({ error: "New password and confirm password don't match." });
    }

    if (newPassword) {
      // Hash the new password before saving
      const saltRounds = 10;
      const hashedPassword = await bcryptjs.hash(newPassword, saltRounds);
      user.password = hashedPassword;
    }

    // Save the updated user
    await user.save();

    // Respond with the updated user (excluding sensitive information)
    const { password: userPassword, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// auth.controller.js
export const signout = (req, res) => {
  // Clear the token cookie to sign the user out
  res.clearCookie('access_token', { httpOnly: true });
  
  // Send a response indicating successful sign out
  res.status(200).json({ success: true, message: 'User signed out successfully!' });
};