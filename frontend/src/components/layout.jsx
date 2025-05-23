import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { NotificationContainer, useNotification } from "./NotificationBar";
import { useRef, useLayoutEffect, useState } from "react";

const Layout = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const location = useLocation();
  const linkClass = (path) =>
    `block p-2 ${
      location.pathname.startsWith(path)
        ? "bg-primary text-white font-bold"
        : "text-primary font-bold hover:bg-primary hover:text-white hover:font-bold"
    }`;

  const handleLogout = () => {
    logout();
    showNotification('Log out, please log in to access the employee manager.', 'success');
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
              className={`${linkClass("/employee")} border-b-2`}
            >
              Employee
            </Link>
            <Link
              to="/leaves"
              className={`${linkClass("/leaves")} border-b-2`}
            >
              Leave
            </Link>
            <Link
              to="/notifications"
              className={`${linkClass("/notifications")} border-b-2`}
            >
              Notification
            </Link>
            <Link
              to="/profile"
              className={`${linkClass("/profile")} border-b-2`}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block p-2 text-primary hover:text-white hover:bg-primary border-b-2 w-full hover:font-bold font-bold"
            >
              Logout
            </button>
          </nav>
        )}
      </aside>

      <div className="flex-1 flex flex-col relative">
        <header
          ref={headerRef}
          className="bg-white px-4 py-9 flex justify-between items-center"
        >
          <h1 className="text-primary text-2xl font-bold">Employee Manager</h1>
          {user && (
            <div>
              <span className="text-primary font-bold">{user?.isAdmin ? "Admin" : "Employee"} : </span>
              <Link to="/Profile" className="font-bold px-1 text-primary underline cursor-pointer">{user?.name}</Link>
            </div>
          )}
        </header>

        <NotificationContainer top={headerHeight} />

        <main className="p-6 flex-1 overflow-y-auto bg-gradient-to-l from-primary to-white h-64 w-full">
          <div className="mt-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
