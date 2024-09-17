import userService from "../services/user.service.js";
import { loginDto } from "../dto/login.dto.js";
import { validate } from "class-validator";


const postSignupUser = async (req, res) => {
    try {
        await userService.signupService(req.body);
        return res.status(200).send("Create user successfully");
    } catch (error) {
        return res.status(400).send(error.message);
    }
};



const postSigninUser = async (req, res) => {
    const { email, password } = req.body;
    const loginData = new loginDto(email, password);
    const errors = await validate(loginData);

    if (errors.length > 0) {
        return res.status(400).send(errors);
    }

    try {
        const { user, token } = await userService.signinService(req.body);
        return res.status(200).send({ user, token });
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
    postSigninUser
};

