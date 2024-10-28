import notificationController from "../controller/notification.controller.js";
import express from "express";

const routerAPI = express.Router();


routerAPI.get("/", notificationController.getNotifications);


export default routerAPI;