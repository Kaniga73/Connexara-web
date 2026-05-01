import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Hoddetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faUserTie, faBuilding } from "@fortawesome/free-solid-svg-icons";

const defaultDepts = [
  { id: 1, dept: "CSE" },
  { id: 2, dept: "ECE" },
  { id: 3, dept: "EEE" },
];

export default function HodDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const depts = location.state?.depts?.map((item) => ({ id: item.id, dept: item.dept })) || defaultDepts;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [deptName, setDeptName] = useState(depts[0]?.dept || "");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !deptName.trim()) return;
    // TODO: persist HOD assignment to the selected department
    navigate(-1);
  };

  return (
    <div className="hd-bg">
      <div className="hd-content">
        <div className="hd-card">
          <div className="hd-card-top">
            <button className="hd-back-btn" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back</span>
            </button>
            <div className="hd-title-group">
              <h1 className="hd-page-title">HOD Assign</h1>
              <p className="hd-page-sub">Fill in the HOD details and select the department.</p>
            </div>
          </div>

          <div className="hd-form">
            <label className="hd-label">
              Name
              <div className="hd-field">
                <FontAwesomeIcon icon={faUserTie} className="hd-icon" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter HOD name"
                />
              </div>
            </label>

            <label className="hd-label">
              Email
              <div className="hd-field">
                <FontAwesomeIcon icon={faEnvelope} className="hd-icon" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </label>

            <label className="hd-label">
              Assign Dept
              <div className="hd-field">
                <FontAwesomeIcon icon={faBuilding} className="hd-icon" />
                <input
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="Type or select department"
                />
              </div>
            </label>

            <button className="hd-submit-btn" onClick={handleSubmit}>
              Save HOD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
