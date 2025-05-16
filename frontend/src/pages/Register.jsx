import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import {
  NotificationContainer,
  useNotification,
} from "../components/NotificationBar";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    password: "",
  });
  const [registerInfo, setRegisterInfo] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const registerToken = new URLSearchParams(window.location.search).get("token");

    if (!registerToken) {
      navigate("/login");
      return;
    } 
    
    setFormData((prev) => ({
      ...prev,
      token: registerToken,
      email: registerInfo.email,
    }));

    const registerInfo = jwtDecode(registerToken);
    setRegisterInfo({
      email: registerInfo.email,
    });

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/auth/register", formData);     
      showNotification("Successfully registered. Please Log in", "success");
      navigate("/login");
    } catch (error) {
      alert(`Login failed: ${error.response.data.message}`);
      alert(`Registration failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="bg-primary w-[600px] p-6 mx-auto mt-10 shadow-md">
      <h1 className="text-lg font-medium text-center bg-white py-2 text-primary">
        Register
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-primary-light space-y-4 p-4 shadow-md"
      >
        <div className="flex items-center justify-between">
          <label className="pl-2 text-medium font-medium text-white">Email:</label>
          <input
            type="email"
            value={registerInfo.email}
            className="border border-gray-300 px-2 py-1 w-96 bg-gray-200 text-gray-400 cursor-not-allowed shadow-md"
            disabled
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="pl-2 text-medium font-medium text-white">Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="border border-gray-300 px-2 py-1 w-96 shadow-md"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="shadow-md bg-white text-primary text-medium font-medium p-2 rounded cursor pointer hover:bg-primary hover:text-white"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
