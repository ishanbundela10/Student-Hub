import { api } from "./axios"

export const addProperty = async (data: FormData) => {
  try {
    const response = await api.post('/properties/addproperties', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
};

export const getMyProperties = async () => {
  try {
    return api.get("/properties/myproperties")

  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
}

export const getAllProperties = async (propertyType?: string) => {
  try {
    return api.get("/properties", {
      params: {
        propertyType,
      }
    })

  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
      
  }
}

export const getPropertyById = async(id: string) => {
  return api.get(`/properties/${id}`)
}

export const saveProperties = async(id: string) => {
  return api.post(`/properties/save/${id}`)
}

export const updateProperty = (propertyId: string, data: FormData) => {
  return api.patch(`/properties/${propertyId}`, data, {
    headers: {
      'Content-Type' : 'multipart/form-data',
    },
  })
}

export const deleteProperty = (propertyId: string) => {
  return api.delete(`/properties/${propertyId}`)
}