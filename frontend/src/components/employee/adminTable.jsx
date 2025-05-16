import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import {useAuth} from "../../contexts/AuthContext";

const AdminEmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const {user, token} = useAuth();
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await axiosInstance.get('/api/employees', {headers: { Authorization: `Bearer ${token}` }});
                setEmployees(data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employees');
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleEdit = (id) => {
        navigate(`/employee/edit/${id}`);
    };

    const handleAdd = () => {
        navigate('/employee/add');
    };

    if (loading) return <div className="text-center mt-4 ">Loading...</div>;
    if (error) return <div className="text-center mt-4 text-red-500">{error}</div>;

    const emptyRows = Array(10 - employees.length > 0 ? 10 - employees.length : 0).fill(0);

    return (
        <div className="h-full flex flex-col items-center pt-6">
            <div className="w-4/5 max-w-4x1">
                <div className="bg-primary py-3 text-white px-4 relative">
                    <div className="text-center"> 
                        <h2 className="text-lg font-medium ">
                            Employee Record
                        </h2>
                    </div>
                    <button onClick={handleAdd} className="text-sm bg-sky-800 text-white px-4 py-1 rounded hover:bg-blue-100 hover:text-primary absolute right-6 top-1/2 transform -translate-y-1/2"><span>Add</span></button>
                </div>

                <table className="w-full bg-white border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Name</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Email</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Role</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Position</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Department</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Salary</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Status</th>
                            <th className="py-2 text-center text-xs font-medium text-primary uppercase tracking-wider border">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map(employee => (
                            <tr key={employee._id || employee.id} className="bg-white border-b">
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.name}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.email}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.role}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.position}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.department}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.salary}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">{employee.active ? "Active" :  "Inactive"}</td>
                                <td className="py-2 whitespace-nowrap text-center text-sm text-primary border">
                                    <button onClick={() => handleEdit(employee._id || employee.id)} className="bg-primary text-white px-4 py-1 rounded hover:bg-blue-100 hover:text-primary">Edit</button>
                                </td>
                            </tr>
                        ))}

                        {emptyRows.map((_, index) => (
                            <tr key={`empty-${index}`} className="bg-white border-b">
                                <td className="py-4 whitespace-nowrap border"></td>
                                <td className="py-4 whitespace-nowrap border"></td>
                                <td className="py-4 whitespace-nowrap border"></td>
                                <td className="py-4 whitespace-nowrap border"></td>
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

export default AdminEmployeeTable;