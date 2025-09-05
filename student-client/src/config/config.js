const API = import.meta.env.VITE_API_URL;


const config = {
  API_BASE_URL: API,
  STUDENT_API_URL: `${API}/student-api`,
  ADMIN_API_URL: `${API}/admin-api`
};

export default config;
