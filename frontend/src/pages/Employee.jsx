import React, {useEffect, useState} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';
import AdminEmployeeTable from "../components/employee/adminTable";
import UserEmployeeTable from "../components/employee/userTable";
import EmployeeAdd from "../components/employee/adminAdd";
import EmployeeEdit from "../components/employee/adminEdit";

const EmployeePage = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data && response.data.data) {
          setUserRole(response.data.data.role);
        } else{
          setUserRole('employee');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('employee');
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading){
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={userRole === 'admin' ? <AdminEmployeeTable /> : <UserEmployeeTable />} />
      {userRole === 'admin' ? (
        <>
          <Route path="/add" element={<EmployeeAdd userRole={userRole} />} />
          <Route path="/edit/:id" element={<Navigate to="/employee" />} />
        </>
      ):(
        <>
          <Route path="/add" element={<Navigate to="/employee" />} />
          <Route path="/edit/:id" element={<Navigate to="/employee" />} />
        </>
      )}
    </Routes>
  );
};

export default EmployeePage;