import Employee from "../models/hr.model.js";

// Create a new employee
export const createEmployee = async (req, res) => {
    try {
      const employee = new Employee(req.body);
      await employee.save();
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Get all employees
export const getAllEmployees = async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get employee by ID
export const getEmployeeById = async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.findById(id);
  
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Update employee by ID
export const updateEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json(updatedEmployee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // Delete employee by ID
export const deleteEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedEmployee = await Employee.findByIdAndDelete(id);
  
      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Deactivate employee by ID
export const deactivateEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true, runValidators: true }
      );
  
      if (!updatedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      res.status(200).json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  