import { useState } from "react";
import "../styles/login.css";
import loginlogo from "../assets/loginlogo.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDesktop,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faFacebookF,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Login() {
  const [formData, setFormData] = useState({
    platform: "",
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // popup states
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);

    const { platform, email, password } = formData;

    // check empty fields
    if (!platform || !email || !password) {
      setErrorMsg("Please fill out all required fields");
      setShowError(true);
      return;
    }

    // check email format
    if (!isValidEmail(email)) {
      setErrorMsg("Please enter a valid email address");
      setShowError(true);
      return;
    }

    // success
    navigate("/dashboard");
  };

  return (
    <div className="login-bg">
      <div className="login-wrapper">

        <div className="login-card">

          {/* LOGO */}
          <div className="login-logo-area">
            <img
              src={loginlogo}
              alt="Connexara Logo"
              className="login-logo-img"
            />
            <span className="login-brand">connexara</span>
          </div>

          {/* HEADER */}
          <div className="login-card-header">
            <h1 className="login-title">Sign In</h1>
            <p className="login-subtitle">
              Please enter your login details
            </p>
          </div>

          <div className="login-form">

            {/* Platform */}
            <div className="form-group">
              <label className="form-label">Platform</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FontAwesomeIcon icon={faDesktop} />
                </span>
                <input
                  type="text"
                  name="platform"
                  placeholder="Enter your platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="form-options">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                  className="remember-checkbox"
                />
                <span className="checkmark"></span>
                <span className="remember-text">
                  Remember me
                </span>
              </label>
            </div>

            {/* Button */}
            <button
              type="button"
              className="signin-btn"
              onClick={handleSubmit}
            >
              Sign In
            </button>

          </div>
        </div>
      </div>

      {/* ================= POPUP ================= */}
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