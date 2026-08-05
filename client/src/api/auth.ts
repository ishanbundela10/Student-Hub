import { api } from "./axios";

export const signup = (data: any) =>
  api.post("/users/signup", data);

export const login = (data: any) =>
  api.post("/users/login", data);

export const logout = () =>
  api.post("/users/logout");

export const getCurrentUser = () =>
  api.get("/users/currentuser");

export const updateProfile = (data: any) =>
  api.patch("/users/updateProfile", data);

export const changePassword = (data: any) =>
  api.post("/users/updatepass", data);