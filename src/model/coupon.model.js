import mongoose from "mongoose";


const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Mã coupon
    discount: { type: Number, required: true }, // Số tiền/Phần trăm giảm
    discountType: { type: String, enum: ['percent', 'fixed'], required: true }, // Loại: phần trăm hoặc số tiền cụ thể
    expirationDate: { type: Date, required: true }, // Ngày hết hạn
    minimumPurchase: { type: Number, default: 0 }, // Mua tối thiểu để áp dụng
    isActive: { type: Boolean, default: true }, // Trạng thái hoạt động
    createdAt: { type: Date, default: Date.now }, // Ngày tạo
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;