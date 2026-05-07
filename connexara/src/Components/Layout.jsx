import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";
import { logoutUser } from "../api/authService";

export default function Layout() {
  const handleLogout = () => {
    logoutUser();
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