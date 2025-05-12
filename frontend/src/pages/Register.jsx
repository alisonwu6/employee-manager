import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode";

const Register = () => {
  const [formData, setFormData] = useState({
    token: "",
    password: "",
  });
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const registerToken = new URLSearchParams(window.location.search).get("token");

    if (!registerToken) {
      navigate("/login");
      return;
    }

    const registerInfo = jwtDecode(registerToken);
    setRegisterInfo({
      name: registerInfo.name,
      email: registerInfo.email,
    });
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("formData", formData);
      await axiosInstance.post("/api/auth/register", formData);     
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      alert(`Registration failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="bg-primary w-[600px] p-6 mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center bg-white py-2 text-primary">
        Register
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-primary-light space-y-4 p-4"
      >
        <div className="flex items-center justify-between">
          <label className="pl-2 text-blue-500 font-bold">Email</label>
          <input
            type="email"
            value={registerInfo.email}
            className="border border-gray-300 px-2 py-1 w-96 bg-gray-200 text-gray-400 cursor-not-allowed"
            disabled
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="pl-2 text-blue-500 font-bold">Name</label>
          <input
            type="text"
            value={formData.name}
            className="border border-gray-300 px-2 py-1 w-96 bg-gray-200 text-gray-400 cursor-not-allowed"
            disabled
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-white text-primary p-2 rounded"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
