import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import ProtectedRoute from "./components/protectRoute";
import Employee from "./pages/Employee";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Layout />}
        >
          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Register"
            element={<Register />}
          />
          <Route
            path="/Login"
            element={<Login />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
