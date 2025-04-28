import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import Employee from "./pages/Employee";
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
            element={<Employee />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
