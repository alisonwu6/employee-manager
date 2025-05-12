import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import {useAuth} from "../../contexts/AuthContext";

const EmployeeAdd = ({ isAdmin}) => {
    const {user, token} = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await axiosInstance.post('/api/employees', formData, {headers: { Authorization: `Bearer ${token}` }});
            navigate('/employee');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="h-full flex flex-col items-center pt-6">
            <div className="w-4/5 max-w-4x1">
                <div className="bg-primary py-3 text-white text-center">
                    <h2 className="text-lg font-medium">Add Employee</h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                        {error}
                    </div>
                )}

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
                        <div className="flex justify-end">
                            <button type="submit" className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAdd;