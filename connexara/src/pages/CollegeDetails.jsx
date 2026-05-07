import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CollegeDetails.css";
import loginlogo from "../assets/loginlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faBuilding,
  faHashtag,
  faLocationDot,
  faMap,
  faEnvelope,
  faSpinner,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { createCollege } from "../api/collegeService";

export default function CollegeDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    collegeCode: "",
    name: "",
    emailAddress: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.collegeCode.trim()) newErrors.collegeCode = "College code is required";
    if (!formData.name.trim()) newErrors.name = "College name is required";
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!isValidEmail(formData.emailAddress)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    return newErrors;
  };

  const handleNext = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await createCollege({
        name: formData.name.trim(),
        emailAddress: formData.emailAddress.trim(),
        collegeCode: formData.collegeCode.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
      });
      setShowSuccess(true);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create college. Please try again.";
      setErrorMsg(message);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cd-bg">

      {/* Main Content */}
      <div className="cd-content">
        {/* Form Card */}
        <div className="cd-card">
          <div className="cd-card-top">
            <button className="cd-back-btn" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back</span>
            </button>
            <div>
              <h1 className="cd-page-title">College Details</h1>
              <p className="cd-page-sub">Fill in the details to register a new college</p>
            </div>
          </div>

          <div className="cd-form">
            {/* College Code */}
            <div className="cd-form-row">
              <label className="cd-label" htmlFor="collegeCode">
                College Code
              </label>
              <div className="cd-input-group">
                <div className={`cd-input-wrapper ${errors.collegeCode ? "cd-input-error" : ""}`}>
                  <span className="cd-input-icon">
                    <FontAwesomeIcon icon={faHashtag} />
                  </span>
                  <input
                    id="collegeCode"
                    type="text"
                    name="collegeCode"
                    className="cd-input"
                    placeholder="e.g. SVCE001"
                    value={formData.collegeCode}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
                {errors.collegeCode && (
                  <span className="cd-error-msg">{errors.collegeCode}</span>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="cd-form-row">
              <label className="cd-label" htmlFor="name">
                Name
              </label>
              <div className="cd-input-group">
                <div className={`cd-input-wrapper ${errors.name ? "cd-input-error" : ""}`}>
                  <span className="cd-input-icon">
                    <FontAwesomeIcon icon={faBuilding} />
                  </span>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className="cd-input"
                    placeholder="Enter college name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
                {errors.name && (
                  <span className="cd-error-msg">{errors.name}</span>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="cd-form-row">
              <label className="cd-label" htmlFor="emailAddress">
                Email Address
              </label>
              <div className="cd-input-group">
                <div className={`cd-input-wrapper ${errors.emailAddress ? "cd-input-error" : ""}`}>
                  <span className="cd-input-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <input
                    id="emailAddress"
                    type="email"
                    name="emailAddress"
                    className="cd-input"
                    placeholder="Enter college email"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
                {errors.emailAddress && (
                  <span className="cd-error-msg">{errors.emailAddress}</span>
                )}
              </div>
            </div>

            {/* City */}
            <div className="cd-form-row">
              <label className="cd-label" htmlFor="city">
                City
              </label>
              <div className="cd-input-group">
                <div className={`cd-input-wrapper ${errors.city ? "cd-input-error" : ""}`}>
                  <span className="cd-input-icon">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </span>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    className="cd-input"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
                {errors.city && (
                  <span className="cd-error-msg">{errors.city}</span>
                )}
              </div>
            </div>

            {/* State */}
            <div className="cd-form-row">
              <label className="cd-label" htmlFor="state">
                State
              </label>
              <div className="cd-input-group">
                <div className={`cd-input-wrapper ${errors.state ? "cd-input-error" : ""}`}>
                  <span className="cd-input-icon">
                    <FontAwesomeIcon icon={faMap} />
                  </span>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    className="cd-input"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </div>
                {errors.state && (
                  <span className="cd-error-msg">{errors.state}</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="cd-form-footer">
              <button
                className="cd-next-btn"
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin /> Submitting...
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SUCCESS POPUP ================= */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2 style={{ color: "#27ae60" }}>
              <FontAwesomeIcon icon={faCheckCircle} /> Success
            </h2>
            <p>College has been registered successfully!</p>
            <button
              className="popup-btn"
              onClick={() => {
                setShowSuccess(false);
                navigate("/dashboard");
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ================= ERROR POPUP ================= */}
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