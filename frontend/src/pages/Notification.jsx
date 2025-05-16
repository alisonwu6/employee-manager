import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosConfig";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
        
      } catch (error) {
        alert(`Failed to fetch notifications. Please try again. Error: ${error}`);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  const handeReadRequest = async (id, link) => {
    try {
      const response = await axiosInstance.post(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(link);
    } catch (error) {
      alert(`Failed to read notification. Please try again. Error: ${error}`);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg">
      <h1 className="text-lg font-medium text-center bg-primary py-2 text-white notification-header">
        Notification
      </h1>
      <table className="w-full notification-table">
        <thead>
          <tr className="bg-[#E5F5FE]">
            <th className="py-2 px-4 text-left font-bold text-primary text-medium font-medium">Name</th>
            <th className="py-2 px-4 text-left font-bold text-primary text-medium font-medium">
              Message (Click to go to the details page)
            </th>
            <th className="py-2 px-4 text-left font-bold text-primary text-medium font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n, idx) => (
            <tr key={idx} className="bg-[#6096B4] border-t border-white">
              <td className="py-2 px-4 text-white border-r border-white">{n.sender.name}</td>
              <td className="py-2 px-4 border-r border-white">
                <a className="text-white underline hover:text-blue-200" onClick={() => handeReadRequest(n._id, n.link)}>
                  {n.message}
                </a>
              </td>
              <td className="py-2 px-4 text-white border-r border-white">
                {new Date(n.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Notification;