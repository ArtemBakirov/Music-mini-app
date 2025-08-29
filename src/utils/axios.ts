import axios from "axios";

const apiInstance = axios.create({
  // baseURL: "https://express-server-production-aeca.up.railway.app/api",
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // change to true if you're using cookies/auth
});

export default apiInstance;

export const jamendoApiInstance = axios.create({
  // baseURL: "https://express-server-production-aeca.up.railway.app/api",
  baseURL: import.meta.env.VITE_JAMENDO_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // change to true if you're using cookies/auth
});
