import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên chương trình khuyến mãi
    description: String, // Mô tả
    discount: { type: Number, required: true }, // Số tiền/Phần trăm giảm
    discountType: { type: String, enum: ['percent', 'fixed'], required: true }, // Loại giảm giá
    startDate: { type: Date, required: true }, // Ngày bắt đầu
    endDate: { type: Date, required: true }, // Ngày kết thúc
    isActive: { type: Boolean, default: true } // Trạng thái hoạt động
});

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;