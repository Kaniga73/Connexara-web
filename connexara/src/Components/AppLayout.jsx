import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/Layout.css";

export default function AppLayout() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} onCollapse={setSidebarCollapsed} />
      <main className={`app-content${sidebarCollapsed ? " app-content-collapsed" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
