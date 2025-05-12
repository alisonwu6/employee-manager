import React, {useState, useEffect} from "react";
import { ServerRouter, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import {useAuth} from "../../contexts/AuthContext";

const EmployeeEdit = () => {
    const {id} = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const {user, token} = useAuth();
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axiosInstance.get(`/api/employees/${id}`, {headers: { Authorization: `Bearer ${token}` }});
                const employee = response.data;
                if (employee){
                    setFormData({
                        name: employee.name || '',
                        email: employee.email || '',
                        position: employee.position || '',
                        department: employee.position || '',
                        salary: employee.salary || '',
                    });
                } else {
                    setError('Employee not found');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employee details');
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.put(`/api/employees/${id}`, formData, {headers: { Authorization: `Bearer ${token}` }});
            navigate('/employee')
        } catch(err){
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this employee?')){
            try {
                await axiosInstance.delete(`/api/employees/${id}`, {headers: { Authorization: `Bearer ${token}` }});
                navigate('/employee');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div className="text-center mt-4">Loading...</div>;
    if (error) return <div className="text-center mt-4 text-red-500">{error}</div>;

    return(
        <div className="h-full flex flex-col items-center pt-6">
            <div className="w-4/5 max-w-4x1">
                <div className="bg-primary py-3 text-white text-center">
                    <h2 className="text-lg font-medium">Edit Employee</h2>
                </div>

                <div className="bg-white p-6 rounded shadow-md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <lable className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name:
                            </lable>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                        </div>
                        <div className="mb-4">
                            <lable className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email:
                            </lable>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                        </div>
                        <div className="mb-4">
                            <lable className="block text-gray-700 text-sm font-bold mb-2" htmlFor="position">
                                Position:
                            </lable>
                            <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                        </div>
                        <div className="mb-4">
                            <lable className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                                Department:
                            </lable>
                            <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                        </div>
                        <div className="mb-6">
                            <lable className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salary">
                                Salary:
                            </lable>
                            <input type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                        </div>
                        <div className="flex justify-between">
                            <button type="button" onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Delete
                            </button>
                            <button type="submit" className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeEdit;