import { payment } from "../config/payment.js";



const createPaymentService = async () => {
    try {
        const requestBody = JSON.stringify({
            partnerCode : payment.partnerCode,
            partnerName : "Test",
            storeId : "MomoTestStore",
            requestId : payment.requestId,
            amount : payment.amount,
            orderId : payment.orderId,
            orderInfo : payment.orderInfo,
            redirectUrl : payment.redirectUrl,
            ipnUrl : payment.ipnUrl,
            lang : payment.lang,
            requestType: payment.requestType,
            autoCapture: payment.autoCapture,
            extraData : payment.extraData,
            orderGroupId: payment.orderGroupId,
            signature : payment.signature
        });

        return requestBody;
    } catch (error) {
        throw new Error(error.message);
    }
}






export default {
    createPaymentService ,
};
