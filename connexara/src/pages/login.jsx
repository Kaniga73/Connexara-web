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
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  faGoogle,
  faFacebookF,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { loginUser } from "../api/authService";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // popup states
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    const { email, password } = formData;

    // check empty fields
    if (!email || !password) {
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

    // Call the login API
    setIsLoading(true);
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please check your credentials.";
      setErrorMsg(message);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
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
            <span className="login-brand">Connexaara</span>
          </div>

          {/* HEADER */}
          <div className="login-card-header">
            <h1 className="login-title">Sign In</h1>
            <p className="login-subtitle">
              Please enter your login details
            </p>
          </div>

          <div className="login-form">

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
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

          </div>
        </div>
      </div>

      {isLoading && (
        <div className="login-loading-overlay">
          <div className="login-loading-panel">
            <div className="login-spinner" />
            <p className="login-loading-text">Signing you in...</p>
          </div>
        </div>
      )}

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