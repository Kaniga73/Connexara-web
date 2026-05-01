import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddDept.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AddDept() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = () => {
    const name = department.trim();
    if (!name) return;

    setDepartments((prev) => [...prev, { id: Date.now(), name }]);
    setDepartment("");
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
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Enter department name"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button className="ad-submit-btn" onClick={handleAdd}>
              <FontAwesomeIcon icon={faPlus} /> {editingId ? "Save" : "Add"}
            </button>
          </div>

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
