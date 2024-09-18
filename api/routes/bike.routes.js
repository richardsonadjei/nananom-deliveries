import express from 'express';
import { createMotorbike, deleteMotorbike, getAllMotorbikes, getMotorbikeById, updateMotorbike } from '../controllers/bike.controllers.js';


const bikeRouter = express.Router();

bikeRouter.post('/motorbikes', createMotorbike);           // Create a new motorbike
bikeRouter.get('/motorbikes', getAllMotorbikes);           // Get all motorbikes
bikeRouter.get('/motorbikes/:id', getMotorbikeById);       // Get a motorbike by ID
bikeRouter.put('/motorbikes/:id', updateMotorbike);        // Update a motorbike by ID
bikeRouter.delete('/motorbikes/:id', deleteMotorbike);     // Delete a motorbike by ID

export default bikeRouter;
