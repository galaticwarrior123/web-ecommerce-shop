import Product from "../model/product.model.js";
import mongoose from "mongoose";
import ShoppingCart from "../model/shoppingcart.model.js";


// Lấy giỏ hàng của người dùng
const getShoppingCart = async (userId) => {
    try {
        // Kiểm tra xem userId có phải là một ObjectId hợp lệ không
        if (!mongoose.isValidObjectId(userId)) {
            throw new Error("Invalid userId");
        }

        const shoppingcart = await ShoppingCart.findOne({ user: userId })
            .populate({
                path: "products.product",
                populate: { path: "category" } // Populate category
            });
        if (!shoppingcart) {
            return {
                success: false,
                message: "Shopping cart not found",
                shoppingcart: null
            };
        }
        return {
            success: true,
            message: "Shopping cart retrieved successfully",
            shoppingcart
        };
    } catch (error) {
        console.error("Error getting shopping cart:", error);
        return {
            success: false,
            message: error.message || "Internal server error",
            shoppingcart: null
        };
    }
};

export default {
    getShoppingCart
}
