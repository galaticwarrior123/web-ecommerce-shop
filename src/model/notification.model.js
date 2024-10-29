import mongoose from "mongoose"


const notificationSchema = new mongoose.Schema({
    content: { type: String, required: true },
    actionURL: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

const NotificationModel = mongoose.model("Notification", notificationSchema);

export default NotificationModel;