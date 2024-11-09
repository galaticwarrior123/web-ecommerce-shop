import Product from "../model/product.model.js";
import mongoose from "mongoose";
import ShoppingCart from "../model/shoppingcart.model.js";
import ProductModel from "../model/product.model.js";


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

//Thêm sản phẩm vào giỏ hàng
// Tính tổng tiền giỏ hàng
const calculateTotalAmount = (products) => {
    return products.reduce((total, item) => {
        const price = (item.product.sale_price > 0) ? item.product.sale_price : item.product.origin_price || 0; // Sử dụng sale_price nếu > 0, nếu không sử dụng origin_price
        return total + price * item.quantity;
    }, 0);
};

const addProductToCart = async (userId, productId, quantity) => {
    try {
        if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
            throw new Error("Invalid userId or productId");
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        let shoppingcart = await ShoppingCart.findOne({ user: userId });
        if (!shoppingcart) {
            shoppingcart = new ShoppingCart({ user: userId, products: [], totalAmount: 0 });
        }

        const productIndex = shoppingcart.products.findIndex(p => p.product.toString() === productId)

        if (productIndex >= 0) {
            // If product already exists, update the quantity
            shoppingcart.products[productIndex].quantity += quantity;
        } else {
            // If product is not in the cart, add a new entry
            shoppingcart.products.push({ product: productId, quantity });
        }

        shoppingcart.totalAmount = calculateTotalAmount(shoppingcart.products);
        await shoppingcart.save();

        return {
            success: true,
            message: "Product added to cart successfully",
            shoppingcart,
        };
    } catch (error) {
        console.error("Error adding product to shopping cart:", error);
        return {
            success: false,
            message: error.message || "Internal server error",
        };
    }
}

//Cập nhật số lượng sản phẩm 
const updateProductQuantity = async (shoppingCartId, productId, quantity) => {
    if (!mongoose.isValidObjectId(shoppingCartId)) {
        throw new Error("Invalid cart ID");
    }
    const shoppingCart = await ShoppingCart.findById(shoppingCartId);
    if (!shoppingCart) {
        throw new Error("Shopping cart not found");
    }

    const productIndex = shoppingCart.products.findIndex(p => p.product.toString() === productId);
    if (productIndex < 0) {
        throw new Error("Product not found in cart");
    }

    shoppingCart.products[productIndex].quantity = quantity;
    await shoppingCart.save();
    return shoppingCart;
}

//Xóa sản phẩm khỏi giỏ hàng
const removeProductFromCart = async (shoppingCartId, productId) => {
    try {
        if (!mongoose.isValidObjectId(shoppingCartId) || !mongoose.isValidObjectId(productId)) {
            throw new Error("Invalid shoppingCartId or productId");
        }

        const shoppingCart = await ShoppingCart.findById(shoppingCartId);
        if (!shoppingCart) {
            throw new Error("Shopping cart not found");
        }

        // Tìm index của sản phẩm cần xóa
        const productIndex = shoppingCart.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (productIndex < 0) {
            throw new Error("Product not found in cart");
        }

        // Xóa sản phẩm khỏi mảng products
        shoppingCart.products.splice(productIndex, 1);

        // Cập nhật tổng tiền giỏ hàng
        shoppingCart.totalAmount = calculateTotalAmount(shoppingCart.products);

        // Lưu lại giỏ hàng
        await shoppingCart.save();

        return {
            success: true,
            message: "Product removed from cart successfully",
            shoppingCart,
        };
    } catch (error) {
        console.error("Error removing product from shopping cart:", error);
        return {
            success: false,
            message: error.message || "Internal server error",
        };
    }
};

export default {
    getShoppingCart,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart
}
