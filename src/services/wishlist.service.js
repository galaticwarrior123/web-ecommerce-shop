import mongoose from "mongoose";
import Wishlist from "../model/wishlist.model.js";
import Product from "../model/product.model.js";

// Lấy danh sách yêu thích của người dùng
const getWishlist = async (userId) => {
    try {
        // Kiểm tra xem userId có phải là một ObjectId hợp lệ không
        if (!mongoose.isValidObjectId(userId)) {
            throw new Error("Invalid userId");
        }

        const wishlist = await Wishlist.findOne({ user: userId })
            .populate({
                path: "products.product",
                populate: { path: "category" } // Populate category
            });
        if (!wishlist) {
            return {
                success: false,
                message: "Wishlist not found",
                wishlist: null
            };
        }
        return {
            success: true,
            message: "Wishlist retrieved successfully",
            wishlist
        };
    } catch (error) {
        console.error("Error getting wishlist:", error);
        return {
            success: false,
            message: error.message || "Internal server error",
            wishlist: null
        };
    }
};

export default {
    getWishlist   
};