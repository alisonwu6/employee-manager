import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/auth/login", formData);
      login(response.data);
      navigate("/employee");
    } catch (error) {
      alert(`Login failed: ${error.response.data.message}`);
    }
  }

  return (
    <div className="bg-primary w-[600px] p-6 mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center bg-white py-2 text-primary">
        Login
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-primary-light space-y-4 p-4"
      >
        <div className="flex items-center justify-between">
          <label className="pl-2 text-blue-500 font-bold">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border border-gray-300 px-2 py-1 w-96"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="pl-2 text-blue-500 font-bold">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="border border-gray-300 px-2 py-1 w-96"
          />
        </div>
        <div className="flex justify-end items-center">
          <button className="bg-white text-primary p-2 rounded">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
