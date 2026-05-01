import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faRightFromBracket,
  faChevronRight,
  faChevronLeft,
  faGraduationCap,
  faPlus,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import loginlogo from "../assets/loginlogo.png";
import "../styles/Sidebar.css";

export default function Sidebar({ onLogout, onCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [collegesOpen, setCollegesOpen] = useState(true);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (onCollapse) onCollapse(next);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>

      {/* ── HEADER ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo-area">
          <img
            src={loginlogo}
            alt="Connexara Logo"
            className="sidebar-logo-img"
          />
          {!collapsed && <span className="sidebar-brand">Connexara</span>}
        </div>

        {/* Collapse toggle */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => toggle()}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />
        </button>
      </div>

      {/* ── NAV ── */}
      <nav className="sidebar-nav">
        {!collapsed && <p className="sidebar-section-label">MENU</p>}

        {/* Dashboard */}
        <button
          type="button"
          className={`sidebar-item ${isActive("/dashboard") ? "sidebar-item-active" : ""}`}
          onClick={() => navigate("/dashboard")}
          title="Dashboard"
        >
          <span className="sidebar-item-icon">
            <FontAwesomeIcon icon={faBorderAll} />
          </span>
          {!collapsed && <span className="sidebar-item-label">Dashboard</span>}
          {!collapsed && (
            <FontAwesomeIcon icon={faChevronRight} className="sidebar-arrow" />
          )}
        </button>

        {/* Colleges Group */}
        {!collapsed && <p className="sidebar-group-title">Colleges</p>}

        {/* Colleges parent */}
        <button
          type="button"
          className={`sidebar-item ${collegesOpen && !collapsed ? "sidebar-item-open" : ""}`}
          onClick={() => {
            if (collapsed) navigate("/dashboard");
            else setCollegesOpen(!collegesOpen);
          }}
          title="Colleges"
        >
          <span className="sidebar-item-icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </span>
          {!collapsed && <span className="sidebar-item-label">Colleges</span>}
          {!collapsed && (
            <FontAwesomeIcon
              icon={faChevronRight}
              className={`sidebar-arrow ${collegesOpen ? "sidebar-arrow-down" : ""}`}
            />
          )}
        </button>

        {/* Sub-items */}
        {!collapsed && collegesOpen && (
          <div className="sidebar-subitems">
            <button
              type="button"
              className={`sidebar-subitem ${isActive("/dashboard") ? "sidebar-subitem-active" : ""}`}
              onClick={() => navigate("/dashboard")}
            >
              <span className="sidebar-dot" />
              <FontAwesomeIcon icon={faList} className="sidebar-sub-icon" />
              College List
            </button>

            <button
              type="button"
              className={`sidebar-subitem ${isActive("/college-details") ? "sidebar-subitem-active" : ""}`}
              onClick={() => navigate("/college-details")}
            >
              <span className="sidebar-dot" />
              <FontAwesomeIcon icon={faPlus} className="sidebar-sub-icon" />
              Add College
            </button>
          </div>
        )}
      </nav>

      {/* ── LOGOUT ── */}
      <button className="sidebar-logout-btn" onClick={onLogout} title="Logout">
        <FontAwesomeIcon icon={faRightFromBracket} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}