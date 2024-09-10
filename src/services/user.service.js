import bcrypt from 'bcrypt';
import User from '../model/user.model.js';
import nodemailer from 'nodemailer';

const signupService = async (data) => {
    try {
        const { email, password } = data;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let res = await User.create({
            email,
            password: hashedPassword,
        });
        return res;
    } catch (e) {
        throw e;
    }
};

const sendOTPService = async (data) => {
    try {
        const { email } = data;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const otp = crypto.randomInt(100000, 1000000).toString();
        user.otp = otp;
        await user.save();
        const mailOptions = {
            from: "nguyenducphu200321@gmail.com",
            to: user.email,
            subject: `Your OTP for E-commerce Website`,
            text: `Your OTP is: ${otp}. `,
        };
        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            throw new Error(err.message);
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

const verifiedService = async (data) => {
    try {
        const { email, otp } = data;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.otp !== otp) {
            throw new Error("OTP is incorrect");
        }
        user.is_verified = true;
        user.otp = null;
        await user.save();
    } catch (error) {
        throw new Error(error.message);
    }
};

// //Create OTP and send through email
// const generateOTP = async (email) =>{
//     const user = await User.findOne({email});
//     if(!user) throw new Error ("User not found");

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();//OTP ngẫu nhiên 6 chữ số
//     const otpExpires = Date.now() + 10 * 60 * 1000; //OTP hết hạn sau 10p

//     user.otp = otp;
//     user.otpExpires = otpExpires;
//     await user.save();

//     //Gửi email OTP
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth:{
//             user: "hapbeehotel@gmail.com",
//             pass: "xsdh osai clee vwam"
//         }
//     });

//     const mailOptions = {
//         from: "hapbeehotel@gmail.com",
//         to: email,
//         subject: "Your OTP code",
//         text: "Your OTP code is ${otp}. It will expire in 10 minutes."
//     };

//     await transporter.sendMail(mailOptions);

//     return user;
// }

// // Xác thực OTP và thay đổi mật khẩu
// const verifyOTP = async (email, otp, newPassword) => {
//     const user = await User.findOne({ email });
//     if (!user) throw new Error("User not found");

//     if (user.otp !== otp || Date.now() > user.otpExpires) {
//         throw new Error("Invalid or expired OTP");
//     }

//     // Hash mật khẩu mới với bcrypt
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     // Cập nhật mật khẩu và xóa OTP
//     user.password = hashedPassword;
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     return user;
// };

export default { signupService, sendOTPService, verifiedService };