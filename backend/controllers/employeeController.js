const EmployeeProxy = require('../proxies/EmployeeProxy');
const jwt = require("jsonwebtoken");

exports.getAllEmployees = async (req, res) => {
    try {
        const employeeProxy = new EmployeeProxy(req.user.isAdmin());
        const employees = await employeeProxy.findAll();
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
        const employeeProxy = new EmployeeProxy(req.user.isAdmin());
        const employee = await employeeProxy.findById(req.params.id);

        if (!employee) {
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
        const employeeProxy = new EmployeeProxy(req.user.isAdmin());
        const employee = await employeeProxy.create(req.body);

        const registerToken = jwt.sign(
            {
                email: employee.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({ registerToken });
    } catch (error) {
        if (error.message === 'Unauthorized: Admin Only') {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        res.status(400).json({
            success: false,
            message: 'Error adding employee',
            error: error.message
        });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employeeProxy = new EmployeeProxy(req.user.isAdmin());
        const employee = await employeeProxy.update(req.params.id, req.body);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json(employee);
    } catch (error) {
        if (error.message === 'Unauthorized: Admin Only') {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        res.status(400).json({
            success: false,
            message: 'Error updating employee',
            error: error.message
        });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employeeProxy = new EmployeeProxy(req.user.isAdmin());
        const deletedEmployee = await employeeProxy.delete(req.params.id);

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
    } catch (error) {
        if (error.message === 'Unauthorized: Admin Only') {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error deleting employee',
            error: error.message
        });
    }
};