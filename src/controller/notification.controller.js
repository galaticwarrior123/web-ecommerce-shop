import notificationService from "../services/notification.service.js";



const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getNotificationsService();
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
}

export default {
    getNotifications,
};