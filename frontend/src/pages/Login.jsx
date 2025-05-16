import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { NotificationContainer, useNotification } from "../components/NotificationBar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/auth/login", formData);
      login(response.data);
      showNotification(
        "Login Successfully",
        "success"
      );
      navigate("/employee");
    } catch (error) {
      alert(`Login failed: ${error.response.data.message}`);
    }
  }

  return (
    <div className="bg-white w-[600px] p-6 mx-auto mt-10 shadow-md">
      <h1 className="text-2xl text-lg font-medium text-center bg-primary py-2 text-white">
        Log in
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-primary-light space-y-4 p-4 shadow-md"
      >
        <div className="flex items-center justify-between">
          <label className="pl-2 text-white text-medium font-medium">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border border-gray-300 px-2 py-1 w-96 shadow-md"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="pl-2 text-white text-medium font-medium">Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="border border-gray-300 px-2 py-1 w-96 shadow-md"
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
