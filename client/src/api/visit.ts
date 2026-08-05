import { api } from "./axios";

export const requestVisit = (data: {
    propertyId: string;
    day: string;
    from: string;
    to: string;
    message: string;
}) => {
    return api.post("/visits/request", data)
}

export const getPendingVisits = () =>
    api.get("/visits/owner/pending");

export const getOwnerVisits = () =>
    api.get("/visits/owner");

export const updateVisitStatus = (visitId: string, status: "accepted" | "rejected") =>
    api.patch(`/visits/${visitId}/status`, { status });

export const deleteVisit = (visitId: string) => 
    api.delete(`/visits/${visitId}`);

export const clearAllVisits = () => 
    api.delete("/visits/owner/clear-all");