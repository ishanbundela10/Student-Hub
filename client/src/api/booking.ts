import { api } from "./axios";

export const createBooking = async (data: { propertyId: string; message?: string }) => {
    try {
        const response = await api.post("/bookings/create", data);
        // console.log(response)
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const getOwnerBookings = async() =>{
try {
    const response = await api.get("/bookings/owner");
    return response
    
} catch (error) {
    console.error(error)
    throw error
}}

export const getMyBookings = () =>
    api.get("/bookings/my");


export const updateBookingStatus = async(bookingId: string, status: "accepted" | "rejected") =>{
    try {
        const response = await api.patch(`/bookings/${bookingId}/status`, { status });
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteBooking = (bookingId: string) =>
    api.delete(`/bookings/${bookingId}`);

export const getOwnerContacts = () =>
    api.get("/bookings/contacts");