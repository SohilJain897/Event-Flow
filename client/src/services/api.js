
import axios from "axios";

const API = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const adminToken = sessionStorage.getItem("adminToken");

  if (adminToken) {
    config.headers["x-admin-key"] = adminToken;
  }

  return config;
});

export const getEvents = async () => {
  const response = await API.get("/events");
  return response.data.events;
};

export const getEventById = async (id) => {
  const response = await API.get(`/events/${id}`);
  return response.data.event;
};

export default API;