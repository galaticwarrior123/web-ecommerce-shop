import mongoose from "mongoose";

const productchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    quantity: { type: Number, required: true },
    origin_price: { type: Number ,default: 0},
    sale_price: { type: Number ,default: 0},
    sold_count:{ type: Number,default:0 }, //SL lượt bán
    view_count:{ type: Number, default:0}, //SL lượt xem
    badge: { type: String }, //new, sale
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    supplier: { type: String, required: true },
    origin: { type: String, required: true },
    expired: { type: Date, required: true },
    promotion: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion" },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model("Product", productchema);

export default ProductModel;
