import axios from "axios";

const apiInstance = axios.create({
  baseURL: "https://bastyon-mini-app-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // change to true if you're using cookies/auth
});

export default apiInstance;
