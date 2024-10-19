import axios from "axios";
import paymentService from "../services/payment.service.js";


const createPayment = async (req, res) => {
    try {
        const requestBody = await paymentService.createPaymentService ();
        const option = {
            method: "POST",
            url: "https://test-payment.momo.vn/v2/gateway/api/create",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };

        await axios(option)
            .then((response) => {
                return res.status(200).json({
                    DT: response.data,
                    EM: "Create payment successfully",
                });
            })
            .catch((error) => {
                throw new Error(error.message);
            });

    }
    catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const callbackPayment = async (req, res) => {
    try {
        console.log("Callback payment");
        const data = req.body;
        console.log(data);
        return res.status(200).json({
            DT: data,
            EM: "Callback payment successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

export default {
    createPayment,
    callbackPayment,
};
