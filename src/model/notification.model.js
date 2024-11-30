import mongoose from "mongoose"


const notificationSchema = new mongoose.Schema({
    content : {type: String, required: true},
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    type: {type: String, required: true},
    isRead: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    image: {type: String},
    link: {type: String}
});

const NotificationModel = mongoose.model("Notification", notificationSchema);

export default NotificationModel;