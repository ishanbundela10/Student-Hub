import { api } from "./axios"

export const getTiffins = async () => {
  try {
    return api.get("/tiffins")

  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
}

export const addTiffin = async (data: FormData) => {
  return api.post("/tiffins/add", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
