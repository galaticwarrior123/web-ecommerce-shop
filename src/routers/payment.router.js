
import express from "express";
import PaymentController from "../controller/payment.controller.js";


const routerAPI = express.Router();
routerAPI.post("/", PaymentController.createPayment);
routerAPI.post("/callback", PaymentController.callbackPayment);
export default routerAPI;