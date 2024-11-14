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
            return {
                success: true,
                message: "Sản phẩm đã được yêu thích",
                exists: true,
            };
        } else {
            wishlist.products.push({ product: productId });
        }
        await wishlist.save();

        return {
            success: true,
            message: "Thêm vào danh sách yêu thích thành công",
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

//Xóa sản phẩm khỏi wishlist
const removeProductFromWishlist = async (wishlistId, productId) => {
    try {
        if (!mongoose.isValidObjectId(wishlistId) || !mongoose.isValidObjectId(productId)) {
            throw new Error("Invalid wishlistId or productId");
        }

        const wishlist = await Wishlist.findById(wishlistId);
        if (!wishlist) {
            throw new Error("Wishlist not found");
        }

        // Tìm index của sản phẩm cần xóa
        const productIndex = wishlist.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (productIndex < 0) {
            throw new Error("Product not found in wishlist");
        }

        // Xóa sản phẩm khỏi mảng products
        wishlist.products.splice(productIndex, 1);

        // Lưu lại giỏ hàng
        await wishlist.save();

        return {
            success: true,
            message: "Product removed from wishlist successfully",
            wishlist,
        };
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        return {
            success: false,
            message: error.message || "Internal server error",
        };
    }
};

export default {
    getWishlist,
    addToWishlist,
    removeProductFromWishlist
};