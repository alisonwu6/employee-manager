const User = require('../models/User');
const bcrypt = require('bcrypt');
class EmployeeService {
    async findAll() {
        return await User.find();
    }

    async findById(id) {
        return await User.findById(id);
    }

    async create(employeeData) {
        const newEmployee = new User(employeeData);
        const randomPassword = Math.random().toString(36).substring(2, 12);
        newEmployee.password = await bcrypt.hash(randomPassword, 10);

        return await newEmployee.save();
    }

    async update(id, employeeData) {
        return await User.findByIdAndUpdate(
            id,
            employeeData,
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

class EmployeeProxy {
    constructor(isAdmin) {
        this.employeeService = new EmployeeService();
        this.isAdmin = isAdmin;
    }

    filterSensitiveData(employee) {
        if (!employee) return null;
        
        if (this.isAdmin) {
            return employee;
        }

        const employeeObj = employee.toObject();
        // filter out sensitive data, e.g. salary
        const { salary, ...filteredEmployee } = employeeObj;
        
        return filteredEmployee;
    }

    async findAll() {
        const employees = await this.employeeService.findAll();

        return employees.map(employee => this.filterSensitiveData(employee));
    }

    async findById(id) {
        const employee = await this.employeeService.findById(id);
        return this.filterSensitiveData(employee);
    }

    async create(employeeData) {
        if (!this.isAdmin) {
            throw new Error('Unauthorized: Admin Only');
        }
        const employee = await this.employeeService.create(employeeData);
        return this.filterSensitiveData(employee);
    }

    async update(id, employeeData) {
        if (!this.isAdmin) {
            throw new Error('Unauthorized: Admin Only');
        }
        const employee = await this.employeeService.update(id, employeeData);
        return this.filterSensitiveData(employee);
    }

    async delete(id) {
        if (!this.isAdmin) {
            throw new Error('Unauthorized: Admin Only');
        }
        return await this.employeeService.delete(id);
    }
}

module.exports = EmployeeProxy; 