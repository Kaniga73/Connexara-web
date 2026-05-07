import api from "./axios";

/**
 * Create a new college.
 *
 * @param {{ name: string, emailAddress: string, collegeCode: string, city: string, state: string }} data
 * @returns {Promise<object>} The created college object
 */
export const createCollege = async (data) => {
  const response = await api.post("/colleges", data);
  return response.data;
};

/**
 * Get paginated list of colleges.
 *
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<{ data: object[], meta: { total: number, page: number, limit: number } }>}
 */
export const getColleges = async (page = 1, limit = 10) => {
  const response = await api.get("/colleges", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get a single college by ID.
 *
 * @param {string} id - College UUID
 * @returns {Promise<object>} The college object
 */
export const getCollegeById = async (id) => {
  const response = await api.get(`/colleges/${id}`);
  return response.data;
};

/**
 * Update an existing college (partial update).
 *
 * @param {string} id - College UUID
 * @param {object} data - Fields to update (e.g. { name, city, state, emailAddress })
 * @returns {Promise<object>} The updated college object
 */
export const updateCollege = async (id, data) => {
  const response = await api.patch(`/colleges/${id}`, data);
  return response.data;
};
