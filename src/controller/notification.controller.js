import notificationService from "../services/notification.service.js";

const getNotifications = async (req, res) => {
    try {
        const userId =  req.userId;
        const notifications = await notificationService.getNotificationsService(userId);
        return res.status(200).json({
            DT: notifications,
            EM: "Get notifications successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await notificationService.markAsReadService(notificationId);
        return res.status(200).json({
            DT: notification,
            EM: "Mark as read successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
};

const createNotification = async (req, res) => {
    try {
        const data = req.body;

       
        
        // Sử dụng notificationGateway từ middleware
        const notification = await notificationService.createNotificationService(
            data,
            req.app.get("notificationGateway"),
        );

        return res.status(201).json({
            DT: notification,
            EM: "Notification created successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
};

export default {
    getNotifications,
    markAsRead,
    createNotification,
};
