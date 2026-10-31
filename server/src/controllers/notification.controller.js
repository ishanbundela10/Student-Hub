import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch notifications for the currently logged in user
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(20);

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        console.log(`[NOTIFICATIONS API] Fetched ${notifications.length} notifications for user: ${userId}`);

        return res.status(200).json({
            success: true,
            data: notifications,
            unreadCount
        });
    } catch (error) {
        console.error("Error in getNotifications:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch notifications"
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { isRead: true },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update notification"
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to mark notifications as read"
        });
    }
};