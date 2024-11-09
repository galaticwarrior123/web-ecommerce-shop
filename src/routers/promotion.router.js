import express from "express";
import PromotionController from "../controller/promotion.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const routerAPI = express.Router();
routerAPI.post("/:id", authMiddleware, PromotionController.createPromotionProduct);
routerAPI.get("/", PromotionController.getAllPromotionProduct);
routerAPI.get("/:id", PromotionController.getPromotionById);
routerAPI.put("/:id", authMiddleware, PromotionController.updatePromotionProduct);
routerAPI.delete("/:id", authMiddleware, PromotionController.deletePromotionProduct);
export default routerAPI;