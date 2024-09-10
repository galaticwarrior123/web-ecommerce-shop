import userService from "../services/user.service.js";

const postSignupUser = async (req, res) => {
    try {
        await userService.signupService(req.body);
        return res.status(200).send("Create user successfully");
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const postSendOTP = async (req, res) => {
    try {
        await userService.sendOTPService(req.body);
        return res.status(200).send("Send OTP successfully");
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const verifiedService = async (req, res) => {
    try {
        await userService.verifiedService(req.body);
        return res.status(200).send("Verified successfully");
    } catch (error) {
        return res.status(400).send(error.message);
    }
};
export default {
    postSignupUser,
    postSendOTP,
    verifiedService,
};