import axios from "axios";

// One axios instance for the whole app. baseURL comes from the env var,
// so the same code points at localhost in dev and Render in production.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export default client;