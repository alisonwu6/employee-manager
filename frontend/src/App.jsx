import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import ProtectedRoute from "./components/protectRoute";
import Employee from "./pages/Employee";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Notification from "./pages/Notification";
import Leave from "./pages/Leave";
import { NotificationProvider } from "./components/NotificationBar";
import "./App.css";

function App() {
  return (
    <NotificationProvider>
      <div>
        <Routes>
          <Route
<<<<<<< HEAD
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
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
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
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves"
              element={
                <ProtectedRoute>
                  <Leave />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
    </NotificationProvider>
=======
            path="/employee/*"
            element={
              <ProtectedRoute>
                <Employee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
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
>>>>>>> db1840a (Unfinifshed employee CRUD)
  );
}

export default App;
