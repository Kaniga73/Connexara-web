import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AddDept.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faPenToSquare,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { createDepartment } from "../api/departmentService";

export default function AddDept() {
  const navigate = useNavigate();
  const location = useLocation();
  const collegeId = location.state?.collegeId;

  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const handleAdd = async () => {
    const name = department.trim();
    if (!name) return;

    if (!collegeId) {
      setAddError("College ID is missing. Please go back and try again.");
      return;
    }

    setIsAdding(true);
    setAddError("");
    try {
      const created = await createDepartment({ collegeId, name });
      setDepartments((prev) => [...prev, created]);
      setDepartment("");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add department. Please try again.";
      setAddError(message);
    } finally {
      setIsAdding(false);
    }
  };

  const startInlineEdit = (item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleSaveInline = (id) => {
    const name = editingName.trim();
    if (!name) return;

    setDepartments((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)));
    setEditingId(null);
    setEditingName("");
  };

  const handleCancelInline = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = (id) => {
    setDepartments((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      handleCancelInline();
    }
  };

  return (
    <div className="ad-bg">
      <div className="ad-content">
        <div className="ad-card">
          <div className="ad-card-top">
            <button className="ad-back-btn" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back</span>
            </button>
            <div className="ad-card-heading">
              <h1 className="ad-page-title">Add Department</h1>
              <p className="ad-page-sub">Enter the department name and add it to the list.</p>
            </div>
          </div>

          <div className="ad-form-row">
            <input
              className="ad-input"
              type="text"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                if (addError) setAddError("");
              }}
              placeholder="Enter department name"
              onKeyDown={(e) => e.key === "Enter" && !isAdding && handleAdd()}
              disabled={isAdding}
            />
            <button
              className="ad-submit-btn"
              onClick={handleAdd}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Adding...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} /> Add
                </>
              )}
            </button>
          </div>

          {addError && (
            <p className="ad-error-msg">⚠️ {addError}</p>
          )}

          <div className="ad-dept-section">
            <div className="ad-dept-header">
              <h2 className="ad-dept-title">Added Departments</h2>
              <span className="ad-dept-count">{departments.length} added</span>
            </div>
            {departments.length === 0 ? (
              <p className="ad-empty-message">No departments added yet. Add one using the field above.</p>
            ) : (
              <div className="ad-dept-list">
                {departments.map((item, index) => (
                  <div key={item.id} className="ad-dept-item">
                    <div className="ad-dept-item-left">
                      <p className="ad-dept-index">{index + 1}.</p>
                      {editingId === item.id ? (
                        <input
                          className="ad-inline-input"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSaveInline(item.id)}
                        />
                      ) : (
                        <p className="ad-dept-name">{item.name}</p>
                      )}
                    </div>
                    <div className="ad-dept-actions">
                      {editingId === item.id ? (
                        <>
                          <button className="ad-action-btn ad-edit-btn" onClick={() => handleSaveInline(item.id)}>
                            Save
                          </button>
                          <button className="ad-action-btn ad-delete-btn" onClick={handleCancelInline}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="ad-action-btn ad-edit-btn" onClick={() => startInlineEdit(item)}>
                            <FontAwesomeIcon icon={faPenToSquare} /> Edit
                          </button>
                          <button className="ad-action-btn ad-delete-btn" onClick={() => handleDelete(item.id)}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

