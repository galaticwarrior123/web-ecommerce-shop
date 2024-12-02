import NotificationGateway from "../gateway/notification.gateway.js";
import NotificationModel from "../model/notification.model.js";
import User from "../model/user.model.js";

const getNotificationsService = async (userId) => {
    try {

        const notifications = await NotificationModel.find({ recipient: userId }).sort({ createdAt: -1 });
        return notifications;
    } catch (error) {
        throw new Error(error);
    }
};

const markAsReadService = async (notificationId) => {
    try {
        const notification = await NotificationModel.findById(notificationId);
        if (!notification) throw new Error("Notification not found");
        notification.isRead = true;
        await notification.save();
        return notification;
    } catch (error) {
        throw new Error(error);
    }
};

const createNotificationService = async (data, notificationGateway = null, req, res) => {
    try {
        // Tạo thông báo mới trong cơ sở dữ liệu
        const { content, type, recipient, link } = data;
        let userRecipient = null;


        // kiểm tra nếu có recipient 
        if (data.recipient === 'admin') {
            const user = await User.findOne({ isAdmin: true });
            userRecipient = user._id.toString();
            data.recipient = userRecipient;
        } else {
            userRecipient = recipient.toString();
        }


        const notification = new NotificationModel(data);
        await notification.save();





        // Gửi thông báo tới admin
        if (notificationGateway) {
            notificationGateway.sendNotificationToUser(userRecipient, notification);
        }


        return notification;
    } catch (error) {
        throw new Error(error);
    }
};

export default {
    getNotificationsService,
    markAsReadService,
    createNotificationService,
};
