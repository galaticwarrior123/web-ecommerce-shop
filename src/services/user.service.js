import bcrypt from 'bcrypt';
import User from '../model/user.model.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
import crypto from 'crypto';
import transporter from '../config/email.transporter.js';
import { get } from 'http';
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { database, storage } from "../config/firebase.js";
import { ref as databaseRef, child, push, update } from "firebase/database";
import ShoppingCart from '../model/shoppingcart.model.js';
import mongoose from 'mongoose';
import { console } from 'inspector';
import Order from '../model/order.model.js';



const signupService = async (data) => {
    console.log("Data received: ", data);
    const session = await mongoose.startSession(); // Bắt đầu session
    session.startTransaction(); // Bắt đầu transaction
    
    try {
        const { email, password, username, gender, phone, address } = data;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng
        const user = await User.create([{
            email,
            password: hashedPassword,
            username,
            gender,
            phone,
            address,
        }], { session }); // Truyền session để sử dụng trong transaction


        await session.commitTransaction(); // Commit nếu không có lỗi
        session.endSession();

        return user[0];
    } catch (e) {
        await session.abortTransaction(); // Rollback nếu có lỗi
        session.endSession();
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

        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.otp !== otp) {
            throw new Error("OTP is incorrect");
        }

        // Cập nhật trạng thái user
        user.isVerified = true;
        user.otp = null;

        console.log("User verified: ", user);
        // Tạo giỏ hàng mới
        const shoppingCart = new ShoppingCart({
            user: user._id,
            products: [],
            totalAmount: 0,
            isActive: true,
            isPaid: false,
        });

        // Chạy song song cả hai thao tác
        await Promise.all([user.save(), shoppingCart.save()]);
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
const changePasswordService = async (data) => {
    try {
        //Bước 4: Đổi mật khẩu
        const { newPassword, confirmPassword, token } = data;

        if (newPassword !== confirmPassword) {
            throw new Error("New password and confirm password do not match");
        }

        console.log("Token received: ", token);
        console.log("New password received: ", newPassword + " " + confirmPassword);

        //Xác thực token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token: ", decoded);
        const email = decoded.user.email;
        console.log("Email from token: ", email);

        const user = await User.findOne({ email });
        console.log("User found: ", user);
        if (!user) {
            throw new Error("User not found");
        }

        // if (user.otpExpires < Date.now()) {
        //     throw new Error("OTP is expired");
        // }
        user.password = await bcrypt.hash(newPassword, 10);
        user.otpExpires = Date.now();
        await user.save();

        return { message: 'Password is reset successfully' };

    } catch (error) {
        throw new Error(error.message);
    }
}


const getAllUsersService = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (e) {
        throw e;
    }
};

const updateUserService = async (id, data, req, res) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        if (req.file) {
            const image = await uploadImage(req.file);
            user.avatar = image;
        }
        for (let key in data) {
            user[key] = data[key];
        }
        await user.save();
        return user;
    } catch (e) {
        throw e;
    }
};

// Hàm xem lịch sử mua hàng của user
const getShoppingHistoryService = async (userId) => {
    try {
        const shoppingHistory = await Order.find({ user: userId }).populate('shoppingCart');
        console.log("Shopping history: ", shoppingHistory);
        return shoppingHistory;
    } catch (e) {
        throw e;
    }
};




async function uploadImage(file) {
    try {
        // Tạo một reference cho ảnh trong Firebase Storage
        const storageReference = storageRef(storage, `images/${file.originalname}`);
        console.log('Uploading file:', file.originalname);

        const metadata = {
            contentType: file.mimetype
        };

        // Tải ảnh lên Firebase Storage (truyền `file.buffer` thay vì `file`)
        await uploadBytes(storageReference, file.buffer, metadata);
        console.log('File uploaded successfully!');

        // Lấy URL của ảnh sau khi upload thành công
        const downloadURL = await getDownloadURL(storageReference);
        console.log('Download URL:', downloadURL);

        // Lưu URL của ảnh vào Firebase Realtime Database
        const imageDatabaseRef = child(databaseRef(database), 'images');
        await push(imageDatabaseRef, { url: downloadURL }); // Lưu URL dưới dạng object

        console.log('Image URL saved to Realtime Database');
        return downloadURL; // Trả về URL của ảnh
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload image');
    }
}

export default {
    signupService,
    sendOTPService,
    verifiedService,
    signinService,

    forgotPassword_sendOTPService,
    verifyOTPForgotPasswordService,
    changePasswordService,

    getAllUsersService,
    updateUserService,
    getShoppingHistoryService,
};