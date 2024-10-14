import axios from "axios";
import paymentService from "../services/payment.service.js";


const createPayment = async (req, res) => {
    try {
        const url = await paymentService.createPaymentService(req, res);
        return res.status(200).json({
            DT: url,
            EM: "Create payment successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

export default {
    createPayment
};
