import express from "express";
import ProductController from "../controller/product.controller.js";


const routerAPI = express.Router();
routerAPI.get("/", ProductController.getProduct);

routerAPI.get("/top-10-best-selling", ProductController.getTop10BestSellingProducts);
routerAPI.get("/top-10-best-viewing", ProductController.getTop10BestViewProducts);

export default routerAPI;
