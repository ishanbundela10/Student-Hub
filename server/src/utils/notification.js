import { Notification } from "../models/notification.model.js";

/**
 * Helper to send notification to any user/owner
 */
export const createNotification = async ({ recipient, title, message, type, link = "" }) => {
    try {
        if (!recipient) return null;
        
        const notification = await Notification.create({
            recipient,
            title,
            message,
            type, // "booking_request", "visit_request", "tiffin_subscription", "system"
            link,
            isRead: false
        });

        return notification;
    } catch (error) {
        console.error("Error generating notification:", error);
        return null;
    }
};