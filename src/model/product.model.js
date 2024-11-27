import mongoose from "mongoose";

const productchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    quantity: { type: Number, required: true },
    images_1: { type: [String], default: [] },
    images_2: { type: [String], default: [] },
    origin_price: { type: Number ,default: 0},
    sale_price: { type: Number ,default: 0},
    sold_count:{ type: Number,default:0 }, //SL lượt bán
    view_count:{ type: Number, default:0}, //SL lượt xem
    badge: { type: String, default: "new" }, //new, hot, sale
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    supplier: { type: String, required: true },
    origin: { type: String, required: true },
    expired: { type: Date, required: true },
    promotion: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion" },
});

const ProductModel = mongoose.model("Product", productchema);

export default ProductModel;
