import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import shoppingcartController from "../controller/shoppingcart.controller.js";

const routerAPI = express.Router();

routerAPI.get("/", authMiddleware, shoppingcartController.getShoppingCartControllerByUser);

export default routerAPI;
