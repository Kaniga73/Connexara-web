import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}