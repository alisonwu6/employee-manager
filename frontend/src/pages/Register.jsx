import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("handleSubmit");
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
          <label className="pl-2 text-blue-500 font-bold">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-300 px-2 py-1 w-96"
          />
        </div>
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
