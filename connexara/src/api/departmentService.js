import api from "./axios";

/**
 * Create a new department under a college.
 *
 * @param {{ collegeId: string, name: string }} data
 * @returns {Promise<object>} The created department object
 */
export const createDepartment = async (data) => {
  const response = await api.post("/departments", data);
  return response.data;
};

/**
 * Get paginated list of departments for a college.
 *
 * @param {string} collegeId
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<{ data: object[], meta: { total: number, page: number, limit: number } }>}
 */
export const getDepartments = async (collegeId, page = 1, limit = 10) => {
  const response = await api.get("/departments", {
    params: { collegeId, page, limit },
  });
  return response.data;
};

/**
 * Update an existing department (partial update).
 *
 * @param {string} id - Department UUID
 * @param {object} data - Fields to update (e.g. { name })
 * @returns {Promise<object>} The updated department object
 */
export const updateDepartment = async (id, data) => {
  const response = await api.patch(`/departments/${id}`, data);
  return response.data;
};
