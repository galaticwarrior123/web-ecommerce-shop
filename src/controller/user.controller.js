import userService from "../services/user.service.js";



const postSignupUser = async (req, res) => {
    try {
        await userService.signupService(req.body);
        return res.status(200).send("Create user successfully");
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const postSigninUser = async (req, res) => {    
    

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

const forgotPassword_sendOTP = async(req, res) =>{
    try{
        await userService.forgotPassword_sendOTPService(req.body);
        return res.status(200).json({ message: "OTP is sent successfully!" });
        //await userService.forgotPassword_sendOTPService(req.body);
        // return res.status(200).send("Found user successfully and OTP is sent!");
    } catch (error){
        return res.status(400).json({ error: error.message });
    }
};

const verifyOTPForgotPassword = async(req, res) => {
    try {
        await userService.verifyOTPForgotPasswordService(req.body);
        return res.status(200).json({message: "OTP is verified successfully!"});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const changePassword = async(req, res) => {
    try {
        await userService.changePasswordService(req.body);
        return res.status(200).json({message: "Password is changed successfully!"});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}




export default {
    postSignupUser,
    postSendOTP,
    verifiedService,
    postSigninUser,

    forgotPassword_sendOTP,
    verifyOTPForgotPassword,
    changePassword
};

