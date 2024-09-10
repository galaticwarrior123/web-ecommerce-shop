import express from "express";
import userController from "../controller/user.controller";
const routerAPI = express.Router();
routerAPI.post("/signup", userController.postSignupUser);

export default routerAPI;
