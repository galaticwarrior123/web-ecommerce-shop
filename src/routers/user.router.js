import express from "express";
import UserController from "../controller/user.controller.js"; // Đảm bảo có .js
import User from "../model/user.model.js";

const routerAPI = express.Router();
routerAPI.post("/signup", UserController.postSignupUser);
routerAPI.post("/send-otp", UserController.postSendOTP);
routerAPI.post("/verified", UserController.verifiedService);
// routerAPI.post("/forgot-password", UserController.forgotPassword);
// routerAPI.post("/reset-password", UserController.resetPassword);

export default routerAPI;
