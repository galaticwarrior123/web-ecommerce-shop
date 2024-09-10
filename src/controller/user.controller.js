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

// // Gửi yêu cầu OTP để reset mật khẩu
// export const forgotPassword = async (req, res) => {
//     const { email } = req.body;
//     try {
//         const user = await userService.generateOTP(email);
//         res.status(200).json({ message: "OTP has been sent to your email", otp: user.otp });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Đổi mật khẩu khi đã có OTP
// export const resetPassword = async (req, res) => {
//     const { email, otp, newPassword } = req.body;
//     try {
//         const user = await userService.verifyOTP(email, otp, newPassword);
//         res.status(200).json({ message: "Password reset successful" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


export default { postSignupUser, postSendOTP, verifiedService };