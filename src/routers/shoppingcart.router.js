import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import shoppingcartController from "../controller/shoppingcart.controller.js";

const routerAPI = express.Router();

routerAPI.get("/", authMiddleware, shoppingcartController.getShoppingCartControllerByUser);
routerAPI.post("/add", authMiddleware, shoppingcartController.addProductToCartController);
routerAPI.put("/:shoppingCartId/update", shoppingcartController.updateProductQuantity);

export default routerAPI;
