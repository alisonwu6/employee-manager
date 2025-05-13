import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosConfig";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function LeavePage() {
  const [formData, setFormData] = useState({
    selectedDate: new Date(),
    reason: "",
    leaveType: "paid_leave"
  });
  const [leaves, setLeaves] = useState([]);
  const [needToApprovedLeaves, setNeedToApprovedLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [requestHistoryIsOpen, setrequestHistoryIsOpen] = useState(true);
  const [leaveRequestIsOpen, setLeaveRequestIsOpen] = useState(false);
  const { user, token } = useAuth();

  const fetchLeaves = async () => {
    try {
      const response = await axiosInstance.get("/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(response.data.leaves);
      setLeaveBalance(response.data.remainingLeaveCount);
      setNeedToApprovedLeaves(response.data.needToApproveLeaves);
    } catch (error) {
      alert(`Failed to fetch notifications. Please try again. Error: ${error}`);
    }
  };
  
  useEffect(() => {
    if(user) fetchLeaves();
  }, [user]);

  const handeReadRequest = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(`/api/leaves`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({
        selectedDate: new Date(),
        reason: "",
        leaveType: "paid_leave"
      });

      await fetchLeaves();
    } catch (error) {
      alert(`Failed to submit leave. Please try again. Error: ${error}`);
    }
  };

  const handleLeaveRequestToggle = () => {
    if(!leaveRequestIsOpen) {
      setrequestHistoryIsOpen(false);
    }

    setLeaveRequestIsOpen(!leaveRequestIsOpen);
  }

  const handleRequestHistoryToggle = () => {
    if(!requestHistoryIsOpen && user.isAdmin) {
      setLeaveRequestIsOpen(false);
    }

    setrequestHistoryIsOpen(!requestHistoryIsOpen);
  }

  const handleDecisionMaking = async (id, decision) => {
    try {
      await axiosInstance.post(`/api/leaves/${id}/${decision}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchLeaves();
    } catch (error) {
      alert(`Failed to make decision. Please try again. Error: ${error}`);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 justify-stretch items-start min-h-screen bg-gradient-to-br from-[#e0ecf7] to-[#5b97b1] p-4 md:p-8 w-full overflow-x-auto">
      <div className="bg-white rounded shadow-lg p-6 flex-1 max-w-full mb-8 md:mb-0 border-2">
        <div className="bg-[#8EBFD8] text-[#274c5b] text-center font-bold py-2 rounded-t">
          Request For Day Off
        </div>
        <div className="bg-[#6096B4] p-6 flex flex-col items-center rounded-b w-full">
          <div className="flex flex-row w-full items-start gap-6 justify-evenly bg-white p-6 pb-10">
            <div className="flex-shrink-0">
              <Calendar
                onChange={(date) => {
                  setFormData({
                    ...formData,
                    selectedDate: date
                  });
                }}
                value={formData.selectedDate}
                className="bg-white rounded"
                minDate={new Date()}
              />
            </div>
            <div className="flex flex-col gap-4 justify-center flex-shrink-0 min-w-[170px]">
              <div className="flex items-center text-white font-bold">
                <span className="text-[#6096B4]">Leave balance:</span>
                <span className="ml-2 bg-[#c9dbe9] text-[#274c5b] px-2 py-1 rounded font-bold text-lg">{leaveBalance}</span>
              </div>
              <div className="flex items-center text-white font-bold">
                <span className="text-[#6096B4]">Selected date:</span>
                <span className="ml-2 bg-[#c9dbe9] text-[#274c5b] px-2 py-1 rounded font-bold text-lg">
                  {formData.selectedDate ? new Date(formData.selectedDate).toLocaleDateString("en-GB") : "--/--/--"}
                </span>
              </div>
              <div className="flex items-center text-white font-bold">
                <span className="text-[#6096B4]">Type: </span>
                <select
                  value={formData.leaveType}
                  onChange={(e) =>
                    setFormData({ ...formData, leaveType: e.target.value })
                  }
                  className="border border-gray-300 px-2 py-1 text-[#6096B4] ml-3"
                >
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="flex items-center text-white font-bold">
                <span className="text-[#6096B4]">Reason:</span>
                <textarea className="ml-2 border text-[#274c5b] px-2 py-1 rounded font-bold text-lg" 
                placeholder="Please type your reason here.."
                value={formData.reason}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    reason: e.target.value
                  });
                }} required></textarea>
              </div>
              <button className="bg-[#6096B4] text-white font-bold px-6 py-2 rounded shadow" onClick={handeReadRequest} disabled={leaveBalance <= -5}>
                Submit request
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-lg p-4 md:max-w-[30%] w-full">
      {user.isAdmin && (
          <>
            <div className="mb-5">
              <div className="bg-[#8EBFDB] text-[#274c5b] text-center font-bold py-2 rounded-t" onClick={handleLeaveRequestToggle}>
                Leave Request {leaveRequestIsOpen ? '▲' : '▼'}
              </div>
              {leaveRequestIsOpen && (
                <table className="w-full border-collapse mb-5">
                  <thead>
                    <tr className="bg-[#E5F5FE]">
                      <th className="py-2 px-2 text-center font-bold text-[#6096B4]">Name</th>
                      <th className="py-2 px-2 text-center font-bold text-[#6096B4]">DD/MM/YY</th>
                      <th className="py-2 px-2 text-center font-bold text-[#6096B4]">Type</th>
                      <th colSpan={2} className="py-2 px-2 text-center font-bold text-[#6096B4]">Approval</th>
                    </tr>
                  </thead>
                  <tbody>
                    {needToApprovedLeaves.map((l, idx) => (
                      <tr key={idx} className="bg-[#6096B4] border-t border-white">
                        <td className="py-2 px-2 text-white border-r text-center">{l.applier.name}</td>
                        <td className="py-2 px-2 text-white border-r text-center">
                        {new Date(l.selectedDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        })}
                        </td>
                        <td className="py-2 px-2 text-white border-r text-center">{l.leaveType}</td>
                        <td className="py-2 px-2 text-white border-r text-center">
                          <a className="text-white underline hover:text-blue-200" onClick={() => handleDecisionMaking(l._id, "approve")}>Yes</a>
                        </td>
                        <td className="py-2 px-2 text-white border-r text-center">
                          <a className="text-white underline hover:text-blue-200" onClick={() => handleDecisionMaking(l._id, "reject")}>No</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        <div>
          <div className="bg-[#8EBFDB] text-[#274c5b] text-center font-bold py-2 rounded-t" onClick={handleRequestHistoryToggle}>
            Request History {requestHistoryIsOpen ? '▲' : '▼'}
          </div>
          {requestHistoryIsOpen && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#E5F5FE]">
                  <th className="py-2 px-2 text-center font-bold text-[#6096B4]">DD/MM/YY</th>
                  <th className="py-2 px-2 text-center font-bold text-[#6096B4]">Type</th>
                  <th className="py-2 px-2 text-center font-bold text-[#6096B4]">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l, idx) => (
                  <tr key={idx} className="bg-[#6096B4] border-t border-white">
                    <td className="py-2 px-2 text-white border-r text-center">
                    {new Date(l.selectedDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    })}
                    </td>
                    <td className="py-2 px-2 text-white border-r text-center">{l.leaveType}</td>
                    <td className="py-2 px-2 text-white border-r text-center">{l.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>

    
  );
} 