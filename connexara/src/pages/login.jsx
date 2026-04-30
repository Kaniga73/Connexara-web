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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);

    if (formData.email && formData.password) {
      navigate("/dashboard");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="login-bg">
      <div className="login-wrapper">

        <div className="login-card">

          {/* ✅ LOGO INSIDE CARD */}
          <div className="login-logo-area">
            <img
              src={loginlogo}
              alt="Connexara Logo"
              className="login-logo-img"
            />
            <span className="login-brand">connexara</span>
          </div>

          {/* CARD HEADER */}
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
    </div>
  );
}