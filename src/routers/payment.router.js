
import express from "express";
import PaymentController from "../controller/payment.controller.js";


const routerAPI = express.Router();
routerAPI.post("/", PaymentController.createPayment);
export default routerAPI;