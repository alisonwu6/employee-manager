import React, {useState, useEffect} from "react";
import { ServerRouter, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import {useAuth} from "../../contexts/AuthContext";
import {
  NotificationContainer,
  useNotification,
} from "../../components/NotificationBar";

const EmployeeEdit = () => {
    const {id} = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        role: 'employee'
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

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
                        department: employee.department || '',
                        salary: employee.salary || '',
                        role: employee.role || ''
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
            showNotification("Employee Updated", "success");
            navigate('/employee')
        } catch(err){
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this employee?')){
            try {
                await axiosInstance.delete(`/api/employees/${id}`, {headers: { Authorization: `Bearer ${token}` }});
                showNotification("Employee Deleted", "success");
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

                <div className="bg-white p-5 shadow-md">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-primary text-sm font-bold mb-2" htmlFor="name">
                                Name:
                            </label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-primary text-sm font-bold mb-2" htmlFor="email">
                                Email:
                            </label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-primary text-sm font-bold mb-2" htmlFor="admin">
                                Admin:
                            </label>
                            <input
                                type="checkbox"
                                checked={formData.role === "admin"}
                                onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.checked ? "admin" : "employee",
                                })
                                }
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-primary text-sm font-bold mb-2" htmlFor="position">
                                Position:
                            </label>
                            <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                        </div>
                        <div className="mb-4">
                            <label className="block text-primary text-sm font-bold mb-2" htmlFor="department">
                                Department:
                            </label>
                            <select
                                value={formData.department}
                                onChange={(e) =>
                                    setFormData({ ...formData, department: e.target.value })
                                }
                                className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select an option</option>
                                <option value="finance">Finance</option>
                                <option value="operations">Operations</option>
                                <option value="sales">Sales</option>
                                <option value="marketing">Marketing</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="design">Design</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-primary text-sm font-bold mb-2" htmlFor="salary">
                                Salary:
                            </label>
                            <input type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange} className="text-sm shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required/>
                        </div>
                        <div className="flex justify-between">
                            <button type="button" onClick={handleDelete} className="text-sm bg-orange-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Delete
                            </button>
                            <button type="submit" className="text-sm bg-primary hover:bg-blue-100 hover:text-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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