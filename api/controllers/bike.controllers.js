import Motorbike from "../models/bike.model.js";


// Create a new motorbike
export const createMotorbike = async (req, res) => {
  const { make, model, year, engineSize, price, registrationNumber, datePurchased, status } = req.body;

  try {
    const newMotorbike = new Motorbike({
      make,
      model,
      year,
      engineSize,
      price,
      registrationNumber,
      datePurchased,
      status
    });

    await newMotorbike.save();
    return res.status(201).json(newMotorbike);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all motorbikes
export const getAllMotorbikes = async (req, res) => {
  try {
    const motorbikes = await Motorbike.find();
    return res.status(200).json(motorbikes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a motorbike by ID
export const getMotorbikeById = async (req, res) => {
  const { id } = req.params;

  try {
    const motorbike = await Motorbike.findById(id);
    if (!motorbike) {
      return res.status(404).json({ message: 'Motorbike not found' });
    }
    return res.status(200).json(motorbike);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a motorbike by ID
export const updateMotorbike = async (req, res) => {
  const { id } = req.params;
  const { make, model, year, engineSize, price, registrationNumber, datePurchased, status } = req.body;

  try {
    const updatedMotorbike = await Motorbike.findByIdAndUpdate(
      id,
      { make, model, year, engineSize, price, registrationNumber, datePurchased, status },
      { new: true, runValidators: true }
    );

    if (!updatedMotorbike) {
      return res.status(404).json({ message: 'Motorbike not found' });
    }

    return res.status(200).json(updatedMotorbike);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a motorbike by ID
export const deleteMotorbike = async (req, res) => {
  const { id } = req.params;

  try {
    const motorbike = await Motorbike.findByIdAndDelete(id);

    if (!motorbike) {
      return res.status(404).json({ message: 'Motorbike not found' });
    }

    return res.status(200).json({ message: 'Motorbike deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
