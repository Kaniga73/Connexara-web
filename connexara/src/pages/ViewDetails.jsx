import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/ViewDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faBuilding,
  faUserTie,
  faChalkboardTeacher,
  faPenToSquare,
  faSpinner,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { getDepartments, updateDepartment } from "../api/departmentService";
import { updateCollege } from "../api/collegeService";
import { updateHod, getHods } from "../api/hodService";

export default function ViewDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // ── College Info (received from Dashboard via route state) ──
  const [college, setCollege] = useState(location.state?.college || null);
  const [editingCollege, setEditingCollege] = useState(false);
  const [collegeEdit, setCollegeEdit] = useState(location.state?.college ? { ...location.state.college } : {});
  const [collegeSaving, setCollegeSaving] = useState(false);
  const [collegeEditError, setCollegeEditError] = useState("");

  // ── Departments ──
  const [depts, setDepts] = useState([]);
  const [deptsLoading, setDeptsLoading] = useState(true);
  const [deptsError, setDeptsError] = useState("");
  const [deptsTotalCount, setDeptsTotalCount] = useState(0);

  // ── HODs map (departmentId → hod object) ──
  const [hodsMap, setHodsMap] = useState({});

  // ── Edit HOD Modal ──
  const [editHod, setEditHod] = useState(null);
  const [hodForm, setHodForm] = useState({ name: "", email: "" });
  const [hodErrors, setHodErrors] = useState({});
  const [isSavingHod, setIsSavingHod] = useState(false);

  // ── Edit Department Modal ──
  const [editDept, setEditDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: "" });
  const [deptErrors, setDeptErrors] = useState({});
  const [isSavingDept, setIsSavingDept] = useState(false);



  // ── Fetch departments ──
  const fetchDepartments = async () => {
    setDeptsLoading(true);
    setDeptsError("");
    try {
      const result = await getDepartments(id);
      setDepts(result.data);
      setDeptsTotalCount(result.meta.total);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load departments.";
      setDeptsError(message);
    } finally {
      setDeptsLoading(false);
    }
  };

  // ── Fetch HODs and build a departmentId → hod map ──
  const fetchHods = async () => {
    try {
      const result = await getHods(id);
      const map = {};
      // Handle different response formats
      const hodList = Array.isArray(result) ? result : (result?.data || []);
      hodList.forEach((hod) => {
        if (hod.departmentId) {
          map[hod.departmentId] = hod;
        }
      });
      setHodsMap(map);
    } catch (err) {
      // HOD list endpoint may not exist yet — fail silently
      console.warn("Could not fetch HODs:", err.response?.status || err.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDepartments();
      fetchHods();
    }
  }, [id]);

  // ── College edit ──
  const saveCollegeEdit = async () => {
    setCollegeSaving(true);
    setCollegeEditError("");
    try {
      const updated = await updateCollege(id, {
        name: collegeEdit.name?.trim(),
        emailAddress: collegeEdit.emailAddress?.trim(),
        city: collegeEdit.city?.trim(),
        state: collegeEdit.state?.trim(),
      });
      setCollege(updated);
      setCollegeEdit({ ...updated });
      setEditingCollege(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update college.";
      setCollegeEditError(message);
    } finally {
      setCollegeSaving(false);
    }
  };

  const cancelCollegeEdit = () => {
    setCollegeEdit({ ...college });
    setEditingCollege(false);
    setCollegeEditError("");
  };

  // ── Edit HOD handlers ──
  const openEditHod = (hod) => {
    setEditHod(hod);
    setHodForm({
      name: hod.name || "",
      email: hod.email || "",
    });
    setHodErrors({});
  };

  const closeEditHod = () => {
    setEditHod(null);
    setHodForm({ name: "", email: "" });
    setHodErrors({});
  };

  const handleHodChange = (e) => {
    const { name, value } = e.target;
    setHodForm({ ...hodForm, [name]: value });
    if (hodErrors[name]) setHodErrors({ ...hodErrors, [name]: "" });
  };

  const handleHodSave = async () => {
    const errs = {};
    if (!hodForm.name.trim()) errs.name = "Name is required";
    if (!hodForm.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hodForm.email)) {
      errs.email = "Invalid email";
    }
    if (Object.keys(errs).length > 0) {
      setHodErrors(errs);
      return;
    }

    setIsSavingHod(true);
    try {
      await updateHod(editHod.id, {
        name: hodForm.name.trim(),
        email: hodForm.email.trim(),
      });
      closeEditHod();
      fetchHods();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update HOD.";
      setHodErrors({ _server: message });
    } finally {
      setIsSavingHod(false);
    }
  };

  // ── Edit Department handlers ──
  const openEditDept = (dept) => {
    setEditDept(dept);
    setDeptForm({ name: dept.name || "" });
    setDeptErrors({});
  };

  const closeEditDept = () => {
    setEditDept(null);
    setDeptForm({ name: "" });
    setDeptErrors({});
  };

  const handleDeptChange = (e) => {
    setDeptForm({ ...deptForm, [e.target.name]: e.target.value });
    if (deptErrors[e.target.name]) setDeptErrors({ ...deptErrors, [e.target.name]: "" });
  };

  const handleDeptSave = async () => {
    if (!deptForm.name.trim()) {
      setDeptErrors({ name: "Department name is required" });
      return;
    }

    setIsSavingDept(true);
    try {
      await updateDepartment(editDept.id, { name: deptForm.name.trim() });
      closeEditDept();
      fetchDepartments();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update department.";
      setDeptErrors({ _server: message });
    } finally {
      setIsSavingDept(false);
    }
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
                  <button className="vd-save-btn" onClick={saveCollegeEdit} disabled={collegeSaving}>
                    {collegeSaving ? <><FontAwesomeIcon icon={faSpinner} spin /> Saving...</> : "Save"}
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

          {college ? (
            <div className="vd-form">
              {collegeEditError && (
                <p className="vd-hod-server-error" style={{ margin: "0 0 14px" }}>⚠️ {collegeEditError}</p>
              )}

              {/* College Code */}
              <div className="vd-info-row">
                <span className="vd-info-label">College Code</span>
                <span className="vd-code-badge">{college.collegeCode}</span>
              </div>

              {/* College Name */}
              <div className="vd-info-row">
                <span className="vd-info-label">College Name</span>
                {editingCollege ? (
                  <input
                    className="vd-info-input"
                    value={collegeEdit.name || ""}
                    onChange={(e) => setCollegeEdit({ ...collegeEdit, name: e.target.value })}
                  />
                ) : (
                  <span className="vd-info-value">{college.name}</span>
                )}
              </div>

              {/* Email */}
              <div className="vd-info-row">
                <span className="vd-info-label">Email</span>
                {editingCollege ? (
                  <input
                    className="vd-info-input"
                    value={collegeEdit.emailAddress || ""}
                    onChange={(e) => setCollegeEdit({ ...collegeEdit, emailAddress: e.target.value })}
                  />
                ) : (
                  <span className="vd-info-value">{college.emailAddress}</span>
                )}
              </div>

              {/* City */}
              <div className="vd-info-row">
                <span className="vd-info-label">City</span>
                {editingCollege ? (
                  <input
                    className="vd-info-input"
                    value={collegeEdit.city || ""}
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
                    value={collegeEdit.state || ""}
                    onChange={(e) => setCollegeEdit({ ...collegeEdit, state: e.target.value })}
                  />
                ) : (
                  <span className="vd-info-value">{college.state}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="vd-error" style={{ padding: "40px 32px" }}>
              <p>⚠️ No college data available. Please go back to the dashboard.</p>
              <button className="vd-retry-btn" onClick={() => navigate("/dashboard")}>Go Back</button>
            </div>
          )}
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
                <p className="vd-card-sub">{deptsTotalCount} department{deptsTotalCount !== 1 ? "s" : ""} registered</p>
              </div>
            </div>
            <div className="vd-dept-header-btns">
              <button className="vd-add-dept-btn" onClick={() => navigate("/add-dept", { state: { collegeId: id } }) }>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add Dept</span>
              </button>
              <button
                className="vd-add-hod-btn"
                onClick={() => navigate("/hod-details", { state: { depts, collegeId: id } })}
              >
                <FontAwesomeIcon icon={faUserTie} />
                <span>Add HOD</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="vd-table-wrapper">
            {deptsLoading ? (
              <div className="vd-loading">
                <FontAwesomeIcon icon={faSpinner} spin className="vd-loading-icon" />
                <span>Loading departments...</span>
              </div>
            ) : deptsError ? (
              <div className="vd-error">
                <p>⚠️ {deptsError}</p>
                <button className="vd-retry-btn" onClick={fetchDepartments}>
                  Retry
                </button>
              </div>
            ) : (
              <table className="vd-table">
                <thead>
                  <tr>
                    <th className="vd-th-sno">S.No</th>
                    <th>Department</th>
                    <th>HOD</th>
                    <th className="vd-th-action">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {depts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="vd-empty">No departments added yet.</td>
                    </tr>
                  ) : (
                    depts.map((d, index) => {
                      const hod = hodsMap[d.id];
                      return (
                        <tr key={d.id} className="vd-row">
                          <td className="vd-th-sno">{index + 1}</td>
                          <td className="vd-dept-name">{d.name}</td>
                          <td>
                            <span className="vd-hod-name">
                              {hod ? hod.name : "—"}
                            </span>
                          </td>
                          <td className="vd-th-action">
                            <div className="vd-row-actions">
                              <button
                                className="vd-row-btn vd-row-edit"
                                onClick={() => openEditDept(d)}
                              >
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <span>Edit Dept</span>
                              </button>
                              {hod && (
                                <button
                                  className="vd-row-btn vd-row-edit"
                                  onClick={() => openEditHod(hod)}
                                >
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                  <span>Edit HOD</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ================= EDIT HOD MODAL ================= */}
      {editHod && (
        <div className="vd-overlay" onClick={closeEditHod}>
          <div className="vd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vd-modal-header">
              <h3 className="vd-modal-title">
                Edit HOD — <span className="vd-modal-dept-name">{editHod.name}</span>
              </h3>
              <button className="vd-modal-close" onClick={closeEditHod}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="vd-modal-body">
              {hodErrors._server && (
                <p className="vd-hod-server-error">⚠️ {hodErrors._server}</p>
              )}

              <label className="vd-modal-label">HOD Name</label>
              <input
                className={`vd-modal-input ${hodErrors.name ? "vd-input-error" : ""}`}
                name="name"
                value={hodForm.name}
                onChange={handleHodChange}
                placeholder="Enter HOD name"
              />
              {hodErrors.name && <span className="vd-field-error">{hodErrors.name}</span>}

              <label className="vd-modal-label" style={{ marginTop: 8 }}>Email</label>
              <input
                className={`vd-modal-input ${hodErrors.email ? "vd-input-error" : ""}`}
                name="email"
                type="email"
                value={hodForm.email}
                onChange={handleHodChange}
                placeholder="Enter email address"
              />
              {hodErrors.email && <span className="vd-field-error">{hodErrors.email}</span>}
            </div>

            <div className="vd-modal-footer">
              <button className="vd-modal-cancel" onClick={closeEditHod}>
                Cancel
              </button>
              <button
                className="vd-modal-confirm"
                onClick={handleHodSave}
                disabled={isSavingHod}
              >
                {isSavingHod ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT DEPARTMENT MODAL ================= */}
      {editDept && (
        <div className="vd-overlay" onClick={closeEditDept}>
          <div className="vd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vd-modal-header">
              <h3 className="vd-modal-title">Edit Department</h3>
              <button className="vd-modal-close" onClick={closeEditDept}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="vd-modal-body">
              {deptErrors._server && (
                <p className="vd-hod-server-error">⚠️ {deptErrors._server}</p>
              )}

              <label className="vd-modal-label">Department Name</label>
              <input
                className={`vd-modal-input ${deptErrors.name ? "vd-input-error" : ""}`}
                name="name"
                value={deptForm.name}
                onChange={handleDeptChange}
                placeholder="Enter department name"
                onKeyDown={(e) => e.key === "Enter" && !isSavingDept && handleDeptSave()}
              />
              {deptErrors.name && <span className="vd-field-error">{deptErrors.name}</span>}
            </div>

            <div className="vd-modal-footer">
              <button className="vd-modal-cancel" onClick={closeEditDept}>
                Cancel
              </button>
              <button
                className="vd-modal-confirm"
                onClick={handleDeptSave}
                disabled={isSavingDept}
              >
                {isSavingDept ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}