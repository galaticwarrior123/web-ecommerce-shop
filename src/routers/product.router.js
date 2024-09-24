import express from "express";
import ProductController from "../controller/product.controller.js";


const routerAPI = express.Router();
routerAPI.get("/", ProductController.getProduct);

export default routerAPI;
