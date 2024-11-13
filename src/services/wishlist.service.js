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

const addToWishlist = async(userId, productId) => {
    try {
        if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
            throw new Error("Invalid userId or productId");
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }

        const productIndex = wishlist.products.findIndex(p => p.product.toString() === productId)

        if (productIndex >= 0) {
            return res.status(200).json({ message: "Sản phẩm đã được yêu thích", exists: true });
        } else {
            wishlist.products.push({ product: productId });
        }
        await wishlist.save();

        return {
            success: true,
            message: "Đã thêm sản phẩm vào wishlist",
            wishlist,
        };
    } catch (error) {
        console.error("Lỗi thêm sản phẩm vào danh sách yêu thích:", error);
        return {
            success: false,
            message: error.message || "Internal server error",
        };
    }
}

export default {
    getWishlist,
    addToWishlist  
};