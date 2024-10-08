import mongoose from "mongoose";

const productchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    quantity: { type: Number, required: true },
    images_1: { type: [String], default: [] },
    images_2: { type: [String], default: [] },
    origin_price: { type: Number, required: true },
    sale_price: { type: Number, required: true },
    sold_count:{ type: Number, required: true }, //SL lượt bán
    view_count:{ type: Number, required: true }, //SL lượt xem
    badge: { type: String, required: true }
});

const Product = mongoose.model("Product", productchema);

export default Product;
