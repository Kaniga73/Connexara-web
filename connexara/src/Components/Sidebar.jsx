import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faBuilding,
  faCheckCircle,
  faRightFromBracket,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import loginlogo from "../assets/loginlogo.png";
import "../styles/Sidebar.css";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-area">
          <img
            src={loginlogo}
            alt="Connexaara Logo"
            className="sidebar-logo-img"
          />
          <div>
            <span className="sidebar-brand">Connexaara</span>
            <p className="sidebar-caption">Admin Dashboard</p>
          </div>
        </div>

        <button className="sidebar-logout-btn" onClick={onLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Logout</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu</div>

        <button
          type="button"
          className="sidebar-item active"
          onClick={() => navigate("/dashboard")}
        >
          <div className="sidebar-item-icon">
            <FontAwesomeIcon icon={faGaugeHigh} />
          </div>
          Dashboard
          <FontAwesomeIcon icon={faChevronRight} className="sidebar-arrow" />
        </button>

        <div className="sidebar-group-title">Colleges</div>

        
      </nav>
    </aside>
  );
}
