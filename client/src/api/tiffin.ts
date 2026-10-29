import { api } from "./axios"

export const getTiffins = async () => {
  try {
    return api.get("/tiffins")

  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
}

export const getTiffinById = async (tiffinId: string) => {
  return api.get(`/tiffins/${tiffinId}`);
};

export const addTiffin = async (data: FormData) => {
  return api.post("/tiffins/add", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteTiffin = async (tiffinId: string) => {
  return api.delete(`/tiffins/${tiffinId}`);
};

export const toggleTiffinAvailability = async (tiffinId: string, isAvailable: boolean) => {
  return api.patch(`/tiffins/${tiffinId}/toggle`, { isAvailable });
};