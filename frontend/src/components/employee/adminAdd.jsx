import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig";
import {useAuth} from "../../contexts/AuthContext";
import {
    NotificationContainer,
    useNotification,
} from "../../components/NotificationBar";

const EmployeeAdd = ({ isAdmin}) => {
    const {user, token} = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        role: 'employee'
    });
    const [error, setError] = useState(null);
    const [registerUrl, setRegisterUrl] = useState(null);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

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
            const res = await axiosInstance.post('/api/employees', formData, {headers: { Authorization: `Bearer ${token}` }});
            const registerToken = res.data.registerToken;
            const registerUrl = `${window.location.origin}/register?token=${registerToken}`;
            setRegisterUrl(registerUrl);;
            showNotification("Employee Added", "success");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCopy = async () => {
        navigator.clipboard.writeText(registerUrl).then(() => {
            alert("Link Copied!");
        });
    }

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

                <div className="bg-white p-5 shadow-md">
                    { registerUrl && (
                        <div className="block text-primary text-sm font-bold my-2 border-primary rounded border p-4">
                            Please click the button to copy the registration URL:
                            <button onClick={handleCopy} className="text-sm bg-primary text-white hover:bg-white hover:text-primary font-bold rounded outline ml-2 p-1">
                                Copy
                            </button>
                        </div>
                    )}
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
                        <div className="flex justify-end">
                            {!registerUrl &&
                                <button type="submit" className="text-sm bg-primary hover:bg-blue-100 hover:text-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                    Add
                                </button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeAdd;