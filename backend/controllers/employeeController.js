const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employees',
            error: error.message
        });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee){
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee',
            error: error.message
        });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        if (req.user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: 'Unauthorised: Admin Only'
            });
        }

        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();

        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error adding employee',
            error: error.message
        });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorised: Admin Only'
            });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );

        if (!updatedEmployee){
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating employee',
            error: error.message
        });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        if (req.user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: 'Unauthorised: Admin Only'
            });
        }

        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

        if (!deletedEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error){
        res.status(500).json({
            success: false,
            message: 'Error deleting employee',
            error: error.message
        });
    }
};