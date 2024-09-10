import bcrypt from 'bcrypt';
import User from '../model/user.model.js';
import crypto from 'crypto';
import transporter from '../config/email.transporter.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
        return { user, token };

    }
    catch (e) {
        throw e;
    }
}


export default {
    signupService,
    sendOTPService,
    verifiedService,
    signinService
};