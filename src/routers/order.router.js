import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import OrderController from "../controller/order.controller.js";
const routerAPI = express.Router();

routerAPI.get("/", authMiddleware, OrderController.getOrderByUser);
routerAPI.get("/product-purchased", authMiddleware, OrderController.getProductUserPurchased);
routerAPI.get("/admin", authMiddleware, OrderController.getOrderByAdmin);
routerAPI.get("/:orderId", authMiddleware, OrderController.getOrderById);
routerAPI.post("/", authMiddleware, OrderController.postCreateOrder);
routerAPI.put("/cancel-order/:orderId", authMiddleware, OrderController.putCancelOrder);
routerAPI.put("/:orderId/status", authMiddleware, OrderController.putChangeOrderStatus);

export default routerAPI;
