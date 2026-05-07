import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import loginlogo from "../assets/loginlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faRightFromBracket,
  faGraduationCap,
  faSearch,
  faXmark,
  faCheck,
  faEye,
  faSpinner,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getColleges, updateCollege } from "../api/collegeService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Loading & error
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Edit modal
  const [editCollege, setEditCollege] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    emailAddress: "",
    collegeCode: "",
    city: "",
    state: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchColleges = async (pageNum) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getColleges(pageNum, limit);
      setColleges(result.data);
      setTotalCount(result.meta.total);
      setTotalPages(Math.ceil(result.meta.total / result.meta.limit));
      setPage(result.meta.page);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to load colleges. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges(1);
  }, []);

  const filtered = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = (id) => setShowDeleteModal(id);

  const handleDelete = () => {
    setColleges(colleges.filter((c) => c.id !== showDeleteModal));
    setShowDeleteModal(null);
  };

  const selectedCollege = colleges.find((c) => c.id === showDeleteModal);

  // ── Edit handlers ──
  const openEditModal = (college) => {
    setEditCollege(college);
    setEditForm({
      name: college.name || "",
      emailAddress: college.emailAddress || "",
      collegeCode: college.collegeCode || "",
      city: college.city || "",
      state: college.state || "",
    });
    setEditErrors({});
  };

  const closeEditModal = () => {
    setEditCollege(null);
    setEditForm({ name: "", emailAddress: "", collegeCode: "", city: "", state: "" });
    setEditErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
    if (editErrors[name]) setEditErrors({ ...editErrors, [name]: "" });
  };

  const handleEditSave = async () => {
    const errs = {};
    if (!editForm.name.trim()) errs.name = "Name is required";
    if (!editForm.collegeCode.trim()) errs.collegeCode = "Code is required";
    if (!editForm.city.trim()) errs.city = "City is required";
    if (!editForm.state.trim()) errs.state = "State is required";
    if (!editForm.emailAddress.trim()) {
      errs.emailAddress = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.emailAddress)) {
      errs.emailAddress = "Invalid email";
    }
    if (Object.keys(errs).length > 0) {
      setEditErrors(errs);
      return;
    }

    setIsSaving(true);
    try {
      await updateCollege(editCollege.id, {
        name: editForm.name.trim(),
        emailAddress: editForm.emailAddress.trim(),
        collegeCode: editForm.collegeCode.trim(),
        city: editForm.city.trim(),
        state: editForm.state.trim(),
      });
      closeEditModal();
      fetchColleges(page);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update college.";
      setEditErrors({ _server: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dash-bg">
      <div className="dash-content">
        <div className="dash-page-header">
          <div>
            <h1 className="dash-page-title">Dashboard</h1>
            <p className="dash-page-sub">
              Manage and review your college list
            </p>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <div className="dash-card-title-row">
              <div className="dash-card-title-icon">
                <FontAwesomeIcon icon={faGraduationCap} />
              </div>
              <div>
                <h2 className="dash-card-title">College List</h2>
                <p className="dash-card-count">
                  {totalCount} colleges registered
                </p>
              </div>
            </div>

            <button
              className="dash-add-btn"
              onClick={() => navigate("/college-details")}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="dash-search-row">
            <div className="dash-search-wrapper">
              <FontAwesomeIcon icon={faSearch} className="dash-search-icon" />
              <input
                type="text"
                className="dash-search-input"
                placeholder="Search colleges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="dash-search-clear"
                  onClick={() => setSearch("")}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="dash-table-wrapper">
            {isLoading ? (
              <div className="dash-loading">
                <FontAwesomeIcon icon={faSpinner} spin className="dash-loading-icon" />
                <span>Loading colleges...</span>
              </div>
            ) : error ? (
              <div className="dash-error">
                <p>⚠️ {error}</p>
                <button className="dash-retry-btn" onClick={() => fetchColleges(page)}>
                  Retry
                </button>
              </div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th className="col-serial">S.No</th>
                    <th className="col-code">College Code</th>
                    <th className="col-name">College Name</th>
                    <th className="col-action">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="dash-empty">
                        No colleges found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((college, index) => (
                      <tr key={college.id} className="dash-row">
                        <td className="col-serial">
                          {(page - 1) * limit + index + 1}
                        </td>
                        <td className="col-code">
                          <span className="dash-code-badge">
                            {college.collegeCode}
                          </span>
                        </td>
                        <td className="col-name">
                          <span className="dash-college-name">
                            {college.name}
                          </span>
                        </td>
                        <td className="col-action">
                          <div className="dash-action-btns">
                            <button
                              className="dash-btn dash-view-btn"
                              onClick={() =>
                                navigate(`/view-details/${college.id}`, { state: { college } })
                              }
                            >
                              <FontAwesomeIcon icon={faEye} />
                              <span>View</span>
                            </button>
                            <button
                              className="dash-btn dash-edit-btn"
                              onClick={() => openEditModal(college)}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                              <span>Edit</span>
                            </button>
                            <button
                              className="dash-btn dash-delete-btn"
                              onClick={() => confirmDelete(college.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="dash-pagination">
              <button
                className="dash-page-btn"
                disabled={page <= 1}
                onClick={() => fetchColleges(page - 1)}
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Prev
              </button>
              <span className="dash-page-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="dash-page-btn"
                disabled={page >= totalPages}
                onClick={() => fetchColleges(page + 1)}
              >
                Next <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editCollege && (
        <div className="dash-modal-overlay" onClick={closeEditModal}>
          <div
            className="dash-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dash-modal-header">
              <div className="dash-modal-heading">
                <div className="dash-modal-icon dash-modal-icon-edit">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </div>
                <div>
                  <h3 className="dash-modal-title">Edit College</h3>
                  <p className="dash-modal-subtitle">
                    Update college details below
                  </p>
                </div>
              </div>
              <button className="dash-modal-close" onClick={closeEditModal}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="dash-modal-body">
              {editErrors._server && (
                <p className="dash-edit-server-error">⚠️ {editErrors._server}</p>
              )}

              <div className="dash-edit-field">
                <label className="dash-modal-label">College Code</label>
                <input
                  className={`dash-modal-input ${editErrors.collegeCode ? "dash-input-error" : ""}`}
                  name="collegeCode"
                  value={editForm.collegeCode}
                  onChange={handleEditChange}
                  placeholder="e.g. SVCE001"
                />
                {editErrors.collegeCode && (
                  <span className="dash-edit-error">{editErrors.collegeCode}</span>
                )}
              </div>

              <div className="dash-edit-field">
                <label className="dash-modal-label">College Name</label>
                <input
                  className={`dash-modal-input ${editErrors.name ? "dash-input-error" : ""}`}
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Enter college name"
                />
                {editErrors.name && (
                  <span className="dash-edit-error">{editErrors.name}</span>
                )}
              </div>

              <div className="dash-edit-field">
                <label className="dash-modal-label">Email Address</label>
                <input
                  className={`dash-modal-input ${editErrors.emailAddress ? "dash-input-error" : ""}`}
                  name="emailAddress"
                  type="email"
                  value={editForm.emailAddress}
                  onChange={handleEditChange}
                  placeholder="Enter college email"
                />
                {editErrors.emailAddress && (
                  <span className="dash-edit-error">{editErrors.emailAddress}</span>
                )}
              </div>

              <div className="dash-edit-row-2col">
                <div className="dash-edit-field">
                  <label className="dash-modal-label">City</label>
                  <input
                    className={`dash-modal-input ${editErrors.city ? "dash-input-error" : ""}`}
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    placeholder="Enter city"
                  />
                  {editErrors.city && (
                    <span className="dash-edit-error">{editErrors.city}</span>
                  )}
                </div>
                <div className="dash-edit-field">
                  <label className="dash-modal-label">State</label>
                  <input
                    className={`dash-modal-input ${editErrors.state ? "dash-input-error" : ""}`}
                    name="state"
                    value={editForm.state}
                    onChange={handleEditChange}
                    placeholder="Enter state"
                  />
                  {editErrors.state && (
                    <span className="dash-edit-error">{editErrors.state}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="dash-modal-footer">
              <button className="dash-modal-cancel" onClick={closeEditModal}>
                Cancel
              </button>
              <button
                className="dash-modal-confirm"
                onClick={handleEditSave}
                disabled={isSaving}
              >
                {isSaving ? (
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

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div
          className="dash-modal-overlay"
          onClick={() => setShowDeleteModal(null)}
        >
          <div
            className="dash-modal dash-modal-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dash-modal-header">
              <div className="dash-modal-heading">
                <div className="dash-modal-icon">
                  <FontAwesomeIcon icon={faTrash} />
                </div>
                <div>
                  <h3 className="dash-modal-title">Confirm Delete</h3>
                  <p className="dash-modal-subtitle">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <button
                className="dash-modal-close"
                onClick={() => setShowDeleteModal(null)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="dash-modal-body">
              <p className="dash-modal-confirm-text">
                Are you sure you want to delete{' '}
                <strong>{selectedCollege?.name}</strong> from your college list?
              </p>
            </div>
            <div className="dash-modal-footer">
              <button
                className="dash-modal-cancel"
                onClick={() => setShowDeleteModal(null)}
              >
                Cancel
              </button>
              <button className="dash-modal-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}