import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosConfig";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    address: "",
  });
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: response.data.name,
          gender: response.data.gender,
          phone: response.data.phone,
          address: response.data.address,
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
      await axiosInstance.post("/api/auth/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile Updated!");
    } catch (error) {
      alert(`Login failed: ${error.response.data.message}`);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg">
      <div className="grid grid-cols-[6fr_4fr]">
        <div className="">
          <h1 className="text-2xl font-bold text-center bg-primary py-2 text-white">
            Profile
          </h1>
          <div className="bg-blue-100 p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white space-y-4 p-4"
            >
              <div className="flex items-center justify-between">
                <label className="min-w-[100px] pl-2 text-blue-500 font-bold">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border border-gray-300 px-2 py-1 w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="min-w-[100px] pl-2 text-blue-500 font-bold">
                  Gender
                </label>
                <select
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="border border-gray-300 px-2 py-1 w-full"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="min-w-[100px] pl-2 text-blue-500 font-bold">
                  Phone
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
                <label className="min-w-[100px] pl-2 text-blue-500 font-bold">
                  Address
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
              <div className="flex justify-end">
                <button className="bg-primary text-white p-2 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-gray-100 p-4">avatar</div>
      </div>
    </div>
  );
}

export default Profile;
