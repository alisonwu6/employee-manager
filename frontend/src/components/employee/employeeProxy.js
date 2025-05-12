import axios from 'axios';



class EmployeeService {
    async getEmployees(){
        try {
            const response = await axios.get('/api/employees');
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    async getEmployeesById(id) {
        try {
            const response = await axios.get(`/api/employees/${id}`);
            return response.data;
        } catch (error){
            console.error('Error fetching employee:', error);
            throw error;
        }
    }

    async addEmployee(employeeData) {
        try {
            const response = await axios.post('/api/employees', employeeData);
            return response.data;
        } catch (error) {
            console.error('Error adding employee:', error)
            throw error;
        }
    }

    async updateEmployee(id, employeeData) {
        try {
            const response = await axios.put(`/api/employees/${id}`, employeeData);
            return response.data;
        } catch (error){
            console.error('Error updating employee:', error);
            throw error;
        }
    }

    async deleteEmployee(id) {
        try {
            const response = await axios.delete(`/api/employees/${id}`);
            return response.data;
        } catch (error){
            console.error ('Error deleting employee:', error);
            throw error;
        }
    }
}

class EmployeeProxy {
    constructor(userRole) {
        this.employeeService = new EmployeeService();
        this.userRole = userRole;
    }
    async getEmployees() {
        try {
            const employees = await this.employeeService.getEmployees();

            if (this.userRole !== 'admin'){
                return employees.map(employee => {
                    const {salary, ...rest} = employee;
                    return rest;
                });
            }

            return employees;
        } catch (error) {
            console.warn('API error, using fake data', error);
            const mockData = [
                {id:1, name: 'Shelley Ma', email: 'shelley@happy.com', position: 'Developer', department: 'IT', salary: 85000},
                {id:2, name: 'Sean Er', email: 'sean@hotdog.com', position: 'Developer', department: 'IT', salary: 82000},
            ];

            if (this.userRole !== 'admin') {
                return mockData.map(employee => {
                    const {salary, ...rest} = employee;
                    return rest;
                });
            }

            return mockData;
        }
    }

    async getEmployeesById(id) {
        try {
            const employee = await this.employeeService.getEmployeesById(id);

            if (this.userRole !== 'admin' && employee) {
                const {salary, ...rest} = employee;
                return rest;
            }
            return employee;
        } catch (error){
            throw new Error('Error fetching employee details');
        }
    }

    async addEmployee(employeeData) {
        if (this.userRole !== 'admin') {
            throw new Error('Unauthorised: Admin Only');
        }

        return this.employeeService.addEmployee(employeeData);
    }

    async updateEmployee(id, employeeData){
        if (this.userRole !== 'admin'){
            throw new Error('Unauthorised: Admin Only');
        }

        return this.employeeService.updateEmployee(id, employeeData);
    }

    async deleteEmployee(id) {
        if (this.userRole !== 'admin'){
            throw new Error('Unauthorised: Admin Only');
        }

        return this.employeeService.deleteEmployee(id);
    }
}

export default EmployeeProxy;