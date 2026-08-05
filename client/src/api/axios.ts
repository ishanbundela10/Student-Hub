import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:1003/api/v1",
  withCredentials: true,
});
