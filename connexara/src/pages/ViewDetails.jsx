import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ViewDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faBuilding,
  faUserTie,
  faChalkboardTeacher,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

// Sample college data passed via route state or props — using static for now
const collegeData = {
  code: "SVCE001",
  name: "Sri Venkateswara College of Engineering",
  city: "Chennai",
  state: "Tamil Nadu",
};

const initialDepts = [
  { id: 1, dept: "CSE", hod: "Dr. Aditya" },
  { id: 2, dept: "ECE", hod: "Dr. Priya" },
];

export default function ViewDetails() {
  const navigate = useNavigate();

  // ── College Info ──
  const [college, setCollege] = useState(collegeData);
  const [editingCollege, setEditingCollege] = useState(false);
  const [collegeEdit, setCollegeEdit] = useState({ ...collegeData });

  // ── Departments ──
  const [depts, setDepts] = useState(initialDepts);

  // ── College edit ──
  const saveCollegeEdit = () => {
    setCollege({ ...collegeEdit });
    setEditingCollege(false);
  };

  const cancelCollegeEdit = () => {
    setCollegeEdit({ ...college });
    setEditingCollege(false);
  };

  return (
    <div className="vd-bg">
     {/* Content */}
      <div className="vd-content">
        <div className="vd-card">
          <div className="vd-card-top">
            <button className="vd-back-btn" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back</span>
            </button>
            <div>
              <h1 className="vd-page-title">College Details</h1>
              <p className="vd-page-sub">View and manage college information</p>
            </div>
            <div className="vd-edit-actions" style={{ marginLeft: "auto" }}>
              {editingCollege ? (
                <>
                  <button className="vd-save-btn" onClick={saveCollegeEdit}>
                    Save
                  </button>
                  <button className="vd-cancel-btn" onClick={cancelCollegeEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="vd-edit-college-btn"
                  onClick={() => setEditingCollege(true)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>

          <div className="vd-form">
            {/* College Code */}
            <div className="vd-info-row">
              <span className="vd-info-label">College Code</span>
              {editingCollege ? (
                <input
                  className="vd-info-input"
                  value={collegeEdit.code}
                  onChange={(e) => setCollegeEdit({ ...collegeEdit, code: e.target.value })}
                />
              ) : (
                <span className="vd-code-badge">{college.code}</span>
              )}
            </div>

            {/* College Name */}
            <div className="vd-info-row">
              <span className="vd-info-label">College Name</span>
              {editingCollege ? (
                <input
                  className="vd-info-input"
                  value={collegeEdit.name}
                  onChange={(e) => setCollegeEdit({ ...collegeEdit, name: e.target.value })}
                />
              ) : (
                <span className="vd-info-value">{college.name}</span>
              )}
            </div>

            {/* City */}
            <div className="vd-info-row">
              <span className="vd-info-label">City</span>
              {editingCollege ? (
                <input
                  className="vd-info-input"
                  value={collegeEdit.city}
                  onChange={(e) => setCollegeEdit({ ...collegeEdit, city: e.target.value })}
                />
              ) : (
                <span className="vd-info-value">{college.city}</span>
              )}
            </div>

            {/* State */}
            <div className="vd-info-row">
              <span className="vd-info-label">State</span>
              {editingCollege ? (
                <input
                  className="vd-info-input"
                  value={collegeEdit.state}
                  onChange={(e) => setCollegeEdit({ ...collegeEdit, state: e.target.value })}
                />
              ) : (
                <span className="vd-info-value">{college.state}</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Dept / HOD Card ── */}
        <div className="vd-card">
          <div className="vd-card-header">
            <div className="vd-card-header-left">
              <div className="vd-card-icon">
                <FontAwesomeIcon icon={faChalkboardTeacher} />
              </div>
              <div>
                <h2 className="vd-card-title">Departments & HODs</h2>
                <p className="vd-card-sub">{depts.length} department{depts.length !== 1 ? "s" : ""} registered</p>
              </div>
            </div>
            <div className="vd-dept-header-btns">
              <button className="vd-add-dept-btn" onClick={() => navigate("/add-dept") }>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Dept</span>
              </button>
              <button
                className="vd-add-hod-btn"
                onClick={() => navigate("/hod-details", { state: { depts } })}
              >
                <FontAwesomeIcon icon={faUserTie} />
                <span>Add HOD</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="vd-table-wrapper">
            <table className="vd-table">
              <thead>
                <tr>
                  <th className="vd-th-sno">S.No</th>
                  <th>Department</th>
                  <th>HOD</th>
                </tr>
              </thead>
              <tbody>
                {depts.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="vd-empty">No departments added yet.</td>
                  </tr>
                ) : (
                  depts.map((d, index) => (
                    <tr key={d.id} className="vd-row">
                      <td className="vd-th-sno">{index + 1}</td>
                      <td className="vd-dept-name">{d.dept}</td>
                      <td>
                        <span className="vd-hod-name">{d.hod}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>


    </div>
  );
}