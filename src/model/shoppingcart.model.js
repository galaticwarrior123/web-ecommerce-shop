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
        },
    ],
    totalAmount: { type: Number, required: true }, //tổng tiền của từng item một
    //createdAt: { type: Date, default: Date.now },
});

// Tính tổng tiền giỏ hàng
shoppingCartSchema.methods.calculateTotalAmount = function () {
    this.totalAmount = this.products.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
};


const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);

export default ShoppingCart;