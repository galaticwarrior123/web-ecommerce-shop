import mongoose from "mongoose";


const loyaltySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tham chiếu đến User
    points: { type: Number, required: true, default: 0 }, // Số điểm hiện tại
    lastUpdated: { type: Date, default: Date.now } // Lần cập nhật cuối
});

const Loyalty = mongoose.model("Loyalty", loyaltySchema);

export default Loyalty;