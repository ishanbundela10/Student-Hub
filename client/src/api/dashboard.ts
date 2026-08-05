import { api } from "./axios";

export const getOwnerDashboardStats = async() => {
    try {
        return api.get("/dashboard/ownerstats")
    } catch (error) {
        console.log(error)
    }
}

