import notificationController from "../controller/notification.controller.js";
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { gatewayMiddleware } from "../middleware/notification.middleware.js";


const routerAPI = express.Router();
   
routerAPI.get("/notifications", authMiddleware, notificationController.getNotifications);
routerAPI.put("/notifications/:id", authMiddleware, notificationController.markAsRead);
routerAPI.post("/notifications", authMiddleware,  notificationController.createNotification);


export default routerAPI;