import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';

export const registerUser = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};



// Controller to get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update a user by ID
export const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to delete a user by ID
export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
