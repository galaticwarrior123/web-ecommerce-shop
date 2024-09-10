import express from "express";
import UserController from "../controller/user.controller.js"; // Đảm bảo có .js

const routerAPI = express.Router();
routerAPI.post("/signup", UserController.postSignupUser);

export default routerAPI;
