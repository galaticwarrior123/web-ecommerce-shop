import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import wishlistController from "../controller/wishlist.controller.js"

const routerAPI = express.Router();
routerAPI.get("/", authMiddleware, wishlistController.getWishlistControllerByUser);
routerAPI.post("/add", authMiddleware, wishlistController.addProductToWishlistController);
routerAPI.delete("/:wishlistId/remove/:productId", authMiddleware, wishlistController.deleteProductFromWishlistController);

export default routerAPI 