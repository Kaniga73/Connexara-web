import { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

const initialColleges = [
  { id: 1, code: "SVCE001", name: "Sri Venkateswara College of Engineering" },
  { id: 2, code: "PSG002", name: "PSG College of Technology" },
  { id: 3, code: "CIT003", name: "Coimbatore Institute of Technology" },
  { id: 4, code: "KEC004", name: "Kongu Engineering College" },
  { id: 5, code: "BAIT005", name: "Bannari Amman Institute of Technology" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [colleges, setColleges] = useState(initialColleges);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editCode, setEditCode] = useState("");
  const [newCollegeName, setNewCollegeName] = useState("");
  const [newCollegeCode, setNewCollegeCode] = useState("");

  const filtered = colleges.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newCollegeName.trim() || !newCollegeCode.trim()) return;
    const newId = Date.now();
    setColleges([
      ...colleges,
      {
        id: newId,
        code: newCollegeCode.trim(),
        name: newCollegeName.trim(),
      },
    ]);
    setNewCollegeName("");
    setNewCollegeCode("");
    setShowAddModal(false);
  };

  const startEdit = (college) => {
    setEditingId(college.id);
    setEditValue(college.name);
    setEditCode(college.code);
  };

  const saveEdit = (id) => {
    if (!editValue.trim() || !editCode.trim()) return;
    setColleges(
      colleges.map((c) =>
        c.id === id
          ? { ...c, code: editCode.trim(), name: editValue.trim() }
          : c
      )
    );
    setEditingId(null);
    setEditValue("");
    setEditCode("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditCode("");
  };

  const confirmDelete = (id) => setShowDeleteModal(id);

  const handleDelete = () => {
    setColleges(colleges.filter((c) => c.id !== showDeleteModal));
    setShowDeleteModal(null);
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
                  {colleges.length} colleges registered
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
                    <td colSpan="3" className="dash-empty">
                      No colleges found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((college, index) => (
                    <tr key={college.id} className="dash-row">
                      <td className="col-serial">{index + 1}</td>
                      <td className="col-code">
                        {editingId === college.id ? (
                          <input
                            className="dash-edit-input"
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                          />
                        ) : (
                          <span className="dash-code-badge">
                            {college.code}
                          </span>
                        )}
                      </td>
                      <td className="col-name">
                        {editingId === college.id ? (
                          <input
                            className="dash-edit-input"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                        ) : (
                          <span className="dash-college-name">
                            {college.name}
                          </span>
                        )}
                      </td>
                      <td className="col-action">
                        <div className="dash-action-btns">
                          <button
                            className="dash-btn dash-view-btn"
                            onClick={() =>
                              navigate(`/view-details/${college.id}`)
                            }
                          >
                            <FontAwesomeIcon icon={faEye} />
                            <span>View</span>
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
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="dash-modal-overlay"
          onClick={() => setShowDeleteModal(null)}
        >
          <div className="dash-modal dash-modal-sm">
            <p>
              Delete{" "}
              {
                colleges.find((c) => c.id === showDeleteModal)?.name
              }
              ?
            </p>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}