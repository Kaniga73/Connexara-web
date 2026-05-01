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
} from "@fortawesome/free-solid-svg-icons";

export default function CollegeDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    collegeCode: "",
    name: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.collegeCode.trim()) newErrors.collegeCode = "College code is required";
    if (!formData.name.trim()) newErrors.name = "College name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigate("/dashboard");
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

            {/* Next Button */}
            <div className="cd-form-footer">
              <button className="cd-next-btn" onClick={handleNext}>
                <span>Submit</span>
              
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}