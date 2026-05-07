import api from "./axios";

/**
 * Login user with email and password.
 * Stores the accessToken and user object in localStorage.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{accessToken: string, user: object}>}
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  const { accessToken, user } = response.data;

  // Persist auth data
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("user", JSON.stringify(user));

  return { accessToken, user };
};

/**
 * Logout the current user.
 * Clears localStorage and redirects to login.
 */
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "/";
};

/**
 * Get the currently stored user object.
 * @returns {object|null}
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated.
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};
