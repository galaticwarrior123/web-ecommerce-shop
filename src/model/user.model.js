import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    address: { type: String },
    otp: { type: String },
    is_verified: { type: Boolean, default: false },

});

const User = mongoose.model("users", userSchema);

export default User;

