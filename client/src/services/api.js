
import axios from "axios";

const api = axios.create({
 baseURL: "https://shopease-mern-w2y9.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
