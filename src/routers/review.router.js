import express from "express";
import reviewController from "../controller/review.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const routerAPI = express.Router();

routerAPI.get("/product/:productId", reviewController.getReviewByProduct);
routerAPI.post("/", authMiddleware, reviewController.postCreateReview);

export default routerAPI;