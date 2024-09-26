import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String },
    avatar: { type: String },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    phone: { type: String, required: true },
    address: { type: String },
    
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    otp: { type: String },
    otpExpires: { type: Date },

});

const User = mongoose.model("users", userSchema);

export default User;

