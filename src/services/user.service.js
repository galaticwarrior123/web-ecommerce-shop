import bcrypt from 'bcrypt';
import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
import crypto from 'crypto';
import transporter from '../config/email.transporter.js';
import { get } from 'http';

const signupService = async (data) => {
    try {
        const { email, password, username, gender, phone, address } = data;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let res = await User.create({
            email,
            password: hashedPassword,
            username,
            gender,
            phone,
            address,
        });
        return res;
    } catch (e) {
        throw e;
    }
};

const signinService = async (data) => {
    try {
        const { email, password } = data;
        let user = await User.findOne({
            email,
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
        // return { user, token };
        const token = jwt.sign({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        }, JWT_SECRET, { expiresIn: 3600 });

        return { user, token };

    }
    catch (e) {
        throw e;
    }
}


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
        user.isVerified = true;
        user.otp = null;
        await user.save();
    } catch (error) {
        throw new Error(error.message);
    }
};

//XỬ LÝ QUÊN MẬT KHẨU 
//Hàm quên mật khẩu và gửi OTP
// const forgotPassword_sendOTPService = async (data) => {
//     try {
//         //Bước 1: Tìm kiếm user
//         const { email } = data;
//         //console.log("Received email: ", email);
//         const user = await User.findOne({
//             email
//         });
//         if (!user) {
//             throw new Error("User not found");
//         }
//         //console.log("User found: ", user);

//         //Bước 2.1: Tạo OTP và lưu vào database với thời gian hết hạn
//         const otp = crypto.randomInt(100000, 1000000).toString();
//         user.otp = otp;
//         user.otpExpires = Date.now() + 10 * 60 * 1000;
//         await user.save();

//         //Bước 2.2: Gửi OTP qua email
//         const mailOptions = {
//             from: "nguyenducphu200321@gmail.com",
//             to: user.email,
//             subject: `Your OTP for Password Reset`,
//             text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes. `,
//         };
//         try {
//             await transporter.sendMail(mailOptions);
//         } catch (err) {
//             throw new Error(err.message);
//         }

//         return { message: "OTP sent successfully!" };

//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

const forgotPassword_sendOTPService = async (data) => {
    try {
        //Bước 1: Tìm kiếm user
        const { email } = data;
        //console.log("Received email: ", email);
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        // Tạo JWT chứa email
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });

        //Bước 2.1: Tạo OTP và lưu vào database với thời gian hết hạn
        const otp = crypto.randomInt(100000, 1000000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        //Bước 2.2: Gửi OTP qua email
        const mailOptions = {
            from: "nguyenducphu200321@gmail.com",
            to: user.email,
            subject: `Your OTP for Password Reset`,
            text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes. `,
        };
        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            throw new Error(err.message);
        }

        return { message: "OTP sent successfully to your email!", token };

    } catch (error) {
        throw new Error(error.message);
    }
}

//Hàm xác nhận OTP của Forgot Password
const verifyOTPForgotPasswordService = async (otp, token) => {
    try {
        //Xác thực token
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }
        if (user.otp !== otp) {
            throw new Error("OTP is incorrect");
        }
        if (user.otpExpires < Date.now()) {
            throw new Error("OTP is expired");
        }

        // Xác thực thành công
        user.isVerified = true;
        //user.otp = null; // Bước này thì ko xóa OTP nha, qua tới change password mới set otp thành null
        await user.save();

        return { message: "OTP verified successfully!" };

    } catch (error) {
        throw new Error(error.message);
    }
}

// const verifyOTPForgotPasswordService = async (data) => {
//     //Bước 3: Xác nhận OTP của Forgot Password
//     try {
//         const { email, otp } = data;
//         const user = await User.findOne({ email });
//         if (!user) {
//             throw new Error("User not found");
//         }
//         if (user.otp !== otp) {
//             throw new Error("OTP is incorrect");
//         }
//         if (user.otpExpires < Date.now()) {
//             return res.status(400).send('OTP is expired');
//         }
//         user.isVerified = true;
//         user.otp = otp;
//         await user.save();

//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

//Hàm đổi mật khẩu
const changePasswordService = async (data, token) => {
    try {
        //Bước 4: Đổi mật khẩu
        const { newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword) {
            throw new Error("New password and confirm password do not match");
        }

        //Xác thực token
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        if (user.otpExpires < Date.now()) {
            throw new Error("OTP is expired");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        return { message: 'Password is reset successfully' };

    } catch (error) {
        throw new Error(error.message);
    }
}

// const changePasswordService = async (data) => {
//     try {
//         //Bước 4: Đổi mật khẩu
//         const { email, otp, newPassword } = data;
//         const user = await User.findOne({ email, otp });
//         if (!user) {
//             throw new Error("User not found");
//         }
//         if (user.otp !== otp) {
//             throw new Error("OTP is incorrect");
//         }
//         if (user.otpExpires < Date.now()) {
//             return res.status(400).send('OTP is expired');
//         }

//         user.password = await bcrypt.hash(newPassword, 10);
//         user.otp = null;
//         user.otpExpires = null;
//         await user.save();

//         // res.send('Password reset successful');
//     } catch (error) {
//         throw new Error(error.message);
//     }
// }

const getAllUsersService = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (e) {
        throw e;
    }
};

const updateUser = async (id, data) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        Object.keys(data).forEach((key) => {
            user[key] = data[key];
        });
        await user.save();
        return user;
    } catch (e) {
        throw e;
    }
};

export default {
    signupService,
    sendOTPService,
    verifiedService,
    signinService,

    forgotPassword_sendOTPService,
    verifyOTPForgotPasswordService,
    changePasswordService,

    getAllUsersService,
};