import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosConfig";
import {
  NotificationContainer,
  useNotification,
} from "../components/NotificationBar";
import avatar from "../assets/avatar.png";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    address: "",
    email: "",
    salary: "",
    position: "",
    department: "",
  });
  const { user, token } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.name || "",
          gender: response.data.gender || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          email: response.data.email || "",
          salary: response.data.salary || "",
          position: response.data.position || "",
          department: response.data.department || "",
        });
      } catch (error) {
        alert(`Failed to fetch profile. Please try again. Error: ${error}`);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Profile Updated", "success");
    } catch (error) {
      alert(`Login failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg">
      <div className="grid grid-cols-[6fr_4fr] gap-4">
        <div className="">
          <h1 className="text-lg font-medium text-center bg-primary py-2 text-white">
            Profile
          </h1>
          <div className="bg-[#E5F5FE] p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white space-y-4 p-4"
            >
              <div className="flex items-center justify-between">
                <label className="min-w-[120px] pl-2 text-primary text-md font-bold">
                  Name:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  className="bg-gray-100 text-gray-400  border border-gray-300 px-2 py-1 w-full "
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="min-w-[120px] pl-2 text-primary text-md font-bold">
                  Gender:
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="border border-gray-300 px-2 py-1 w-full"
                >
                  <option value="">Select an option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="min-w-[120px] pl-2 text-primary text-md font-bold">
                  Phone:
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="border border-gray-300 px-2 py-1 w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="min-w-[120px] pl-2 text-primary text-md font-bold">
                  Address:
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="border border-gray-300 px-2 py-1 w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="min-w-[120px] pl-2 text-primary text-md font-bold">
                  Email:
                </label>
                <input
                  type="text"
                  value={formData.email}
                  className="bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300 px-2 py-1 w-full "
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="min-w-[120px] pl-2 text-primary text-md font-bold">
                  Salary:
                </label>
                <input
                  type="text"
                  value={formData.salary}
                  className="bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-300 px-2 py-1 w-full "
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="min-w-[120px] pl-2 text-primary text-md font-bold">
                  Position:
                </label>
                <input
                  type="text"
                  value={formData.position}
                  className="bg-gray-100 text-gray-400 cursor-not-allowed border capitalize border-gray-300 px-2 py-1 w-full "
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="min-w-[120px] pl-2 text-primary text-md font-bold">
                  Department:
                </label>
                <input
                  type="text"
                  value={formData.department}
                  className="bg-gray-100 text-gray-400 cursor-not-allowed border capitalize border-gray-300 px-2 py-1 w-full "
                  disabled
                />
              </div>
              <div className="flex justify-end">
                <button className="text-md bg-primary hover:bg-blue-100 hover:text-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className=" bg-primary p-6">
          <div className="bg-[#E5F5FE] p-6 h-full flex justify-center items-center">
            <img
              src={avatar}
              alt="Avatar"
              className="h-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
