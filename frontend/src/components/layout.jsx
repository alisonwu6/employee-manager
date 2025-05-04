import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-40 bg-white shadow-md border-r-2">
        <div className="block flex justify-center m-4">
          <div className="bg-primary text-white flex justify-center items-center font-bold logo">
            EM
          </div>
        </div>
        {token && (
          <nav className="mt-4 text-center">
            <Link
              to="/employee"
              className="block p-2 text-gray-700 hover:bg-gray-200 border-b-2"
            >
              Employee
            </Link>
            <Link
              to="/profile"
              className="block p-2 text-gray-700 hover:bg-gray-200 border-b-2"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block p-2 text-gray-700 hover:bg-gray-200 border-b-2 w-full"
            >
              Logout
            </button>
          </nav>
        )}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white px-4 py-9 flex justify-between items-center">
          <h1 className="text-primary text-2xl font-bold">Employee Manager</h1>
        </header>

        <main className="p-6 flex-1 overflow-y-auto bg-gradient-to-l from-primary to-white h-64 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
