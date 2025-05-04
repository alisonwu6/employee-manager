import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, isAuthLoaded } = useAuth();

  if (!isAuthLoaded) return <p>Loading</p>;
  if (!token) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
