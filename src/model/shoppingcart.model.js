import mongoose from "mongoose";

const shoppingCartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true },
            priceAtOrder: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    //createdAt: { type: Date, default: Date.now },
});

const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);

export default ShoppingCart;