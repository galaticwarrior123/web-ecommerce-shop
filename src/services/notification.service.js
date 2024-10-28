import { get } from "mongoose";
import NotificationModel from "../model/notification.model.js";



const getNotificationsService = async () => {

    try {
        const notifications = await NotificationModel.find().populate("user");
        return notifications;
    } catch (error) {
        throw error;
    }
}

const createNotificationService = async (notification) => {
    try {
        const newNotification = new NotificationModel(notification);
        await newNotification.save();
        return newNotification;
    } catch (error) {
        throw error;
    }
}


export default {
    getNotificationsService,
    createNotificationService,
};