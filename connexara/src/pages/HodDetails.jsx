
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Hoddetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";

import {
  faArrowLeft,
  faEnvelope,
  faUserTie,
  faBuilding,
  faSpinner,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import { createHod } from "../api/hodService";

export default function HodDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const depts = location.state?.depts || [];
  const collegeId = location.state?.collegeId || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState(depts[0]?.id || "");

  const departmentOptions = depts.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [showError, setShowError] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !departmentId) {
      setErrorMsg("Please fill out all required fields.");
      setShowError(true);
      return;
    }

    if (!collegeId) {
      setErrorMsg("College ID is missing. Please go back and try again.");
      setShowError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await createHod({
        name: name.trim(),
        email: email.trim(),
        collegeId,
        departmentId,
      });

      setShowSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create HOD. Please try again.";

      setErrorMsg(message);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hd-bg">
      <div className="hd-content">
        <div className="hd-card">

          {/* Header */}
          <div className="hd-card-top">
            <div className="hd-title-group">
              <h1 className="hd-page-title">HOD Assign</h1>

              <p className="hd-page-sub">
                Fill in the HOD details and select the department.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="hd-form">

            {/* Name */}
            <label className="hd-label">
              Name

              <div className="hd-field">
                <FontAwesomeIcon
                  icon={faUserTie}
                  className="hd-icon"
                />

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter HOD name"
                />
              </div>
            </label>

            {/* Email */}
            <label className="hd-label">
              Email

              <div className="hd-field">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="hd-icon"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </label>

            {/* Department */}
            <label className="hd-label">
              Assign Department

              <div className="hd-field hd-select-field">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="hd-icon"
                />

                <Select
                  options={departmentOptions}
                  placeholder="Select Department"
                  value={departmentOptions.find(
                    (opt) => opt.value === departmentId
                  )}
                  onChange={(selected) =>
                    setDepartmentId(selected.value)
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </label>

            {/* Footer Buttons */}
            <div className="hd-form-footer">

              <button
                className="hd-back-btn"
                onClick={() => navigate(-1)}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back</span>
              </button>

              <button
                className="hd-submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Saving...
                  </>
                ) : (
                  "Save HOD"
                )}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">

            <h2 style={{ color: "#27ae60" }}>
              <FontAwesomeIcon icon={faCheckCircle} /> Success
            </h2>

            <p>HOD has been assigned successfully!</p>

            <button
              className="popup-btn"
              onClick={() => {
                setShowSuccess(false);
                navigate(-1);
              }}
            >
              Go Back
            </button>

          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className="popup-overlay">
          <div className="popup-box">

            <h2>⚠️ Error</h2>

            <p>{errorMsg}</p>

            <button
              className="popup-btn"
              onClick={() => setShowError(false)}
            >
              Okay
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

