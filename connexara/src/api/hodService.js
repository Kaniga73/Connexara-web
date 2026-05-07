import api from "./axios";

/**
 * Create a new HOD.
 *
 * @param {{ name: string, email: string, password: string, collegeId: string, departmentId: string }} data
 * @returns {Promise<object>} The created HOD user object
 */
export const createHod = async (data) => {
  const response = await api.post("/hods", data);
  return response.data;
};

/**
 * Update an existing HOD (partial update).
 *
 * @param {string} id - HOD user UUID
 * @param {object} data - Fields to update (e.g. { name, email })
 * @returns {Promise<object>} The updated HOD object
 */
export const updateHod = async (id, data) => {
  const response = await api.patch(`/hods/${id}`, data);
  return response.data;
};

/**
 * Get list of HODs for a college.
 *
 * @param {string} collegeId
 * @param {number} [page=1]
 * @param {number} [limit=50]
 * @returns {Promise<{ data: object[], meta: object }>}
 */
export const getHods = async (collegeId, page = 1, limit = 50) => {
  const response = await api.get("/hods", {
    params: { collegeId, page, limit },
  });
  return response.data;
};
