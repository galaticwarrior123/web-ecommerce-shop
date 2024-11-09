import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Tham chiếu đến Product
    promotionName: { type: String, required: true }, // Tên chương trình khuyến mãi
    description: { type: String, required: true }, // Mô tả chương trình khuyến mãi
    discount: { type: Number, required: true }, // Số tiền/Phần trăm giảm
    startDate: { type: Date, required: true }, // Ngày bắt đầu
    endDate: { type: Date, required: true }, // Ngày kết thúc
    isActive: { type: Boolean, default: true } // Trạng thái hoạt động
});

const PromotionModel = mongoose.model("Promotion", promotionSchema);

export default PromotionModel;