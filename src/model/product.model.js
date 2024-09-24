const mongoose = require("mongoose");

const productchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    quantity: { type: Number, required: true },
    images: { type: [String], default: [] },
    price: { type: Number, required: true },
});

const Product = mongoose.model("Product", productchema);

module.exports = Product;
