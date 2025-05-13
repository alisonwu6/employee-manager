import React, {useEffect, useState} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import AdminEmployeeTable from "../components/employee/adminTable";
import UserEmployeeTable from "../components/employee/userTable";
import EmployeeAdd from "../components/employee/adminAdd";
import EmployeeEdit from "../components/employee/adminEdit";
import {useAuth} from "../contexts/AuthContext";

const EmployeePage = () => {

const {user, token} = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user.isAdmin ? <AdminEmployeeTable /> : <UserEmployeeTable />} />
      { user.isAdmin ? (
        <>
          <Route path="/add" element={<EmployeeAdd isAdmin={user.isAdmin} />} />
          <Route path="/edit/:id" element={<EmployeeEdit isAdmin={user.isAdmin} />} />
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