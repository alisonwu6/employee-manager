import React, {useState, useEffect} from "react";
import EmployeeProxy from "./employeeProxy";

const UserEmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const employeeProxy = new EmployeeProxy('employee');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await employeeProxy.getEmployees();
                setEmployees(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employees');
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <div className="text-center mt-4">Loading...</div>;
    if (error) return <div className="text-center mt-4 text-red-500">{error}</div>;

    const emptyRows = Array(10 - employees.length > 0 ? 10 - employees.length : 0).fill(0);

    return (
        <div className="h-full flex flex-col items-center pt-6">
            <div className="w-4/5 max-w-4x1">
                <div className="bg-primary py-3 text-white text-center justify-between items-center px-4">
                    <h2 className="text-lg font-medium">Employee Record</h2>
                </div>

                <table className="w-full bg-white border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Name</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Email</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Position</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Department</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee._id || employee.id} className="bg-white border-b">
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.name}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.email}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.position}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.department}</td>
                            </tr>
                        ))}

                        {emptyRows.map((_, index) => (
                            <tr key={`empty-${index}`} className="bg-white border-b">
                                <td className="py-4 whitespace-nowrap border"></td>
                                <td className="py-4 whitespace-nowrap border"></td>
                                <td className="py-4 whitespace-nowrap border"></td>
                                <td className="py-4 whitespace-nowrap border"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>    
            </div>
        </div>
    );
};

export default UserEmployeeTable;