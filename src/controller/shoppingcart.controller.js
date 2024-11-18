import shoppingCartService from "../services/shoppingcart.service.js";

const getShoppingCartControllerByUser = async (req, res) => {
    try {
        //const userId = req.user._id; // Đảm bảo có thuộc tính `_id` trong `req.user`
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in request" });
        }
        // console.log("USERID: ", userId);
        const cart = await shoppingCartService.getShoppingCart(userId);
        // console.log('Cart Response:', cart);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error getting shopping cart:', error);
        res.status(500).json({ message: error.message });
    }
};

const addProductToCartController = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in request" });
        }
        const { productId, quantity } = req.body;

        // Call the service function
        const response = await shoppingCartService.addProductToCart(userId, productId, quantity);
        // console.log('Add to shopping cart response:', response);

        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error adding product to cart:", error);
        return res.status(500).json({ message: error.message });
    }
};

const updateProductQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const { shoppingCartId } = req.params;

    try {
        const shoppingCart = await shoppingCartService.updateProductQuantity(shoppingCartId, productId, quantity);
        return res.status(200).json({ success: true, message: "Quantity updated successfully", shoppingcart: shoppingCart });
    } catch (error) {
        console.error("Error updating product quantity:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProductFromCartController = async (req, res) => {
    try {
        const { shoppingCartId, productId } = req.params;

        const result = await shoppingCartService.removeProductFromCart(shoppingCartId, productId);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            shoppingCart: result.shoppingCart,
        });
    } catch (error) {
        console.error("Error in deleteProductFromCartController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// const getShoppingCartController = async (req, res) => {
//     try {
//         const userId = "66f8e454f36fd9092033e20c"; // Sử dụng ID cụ thể để kiểm tra
//         console.log("User ID:", userId); // Log user ID để xác nhận

//         const cart = await shoppingcartService.getShoppingCart(userId);

//         // Kiểm tra xem giỏ hàng có tồn tại không
//         if (!cart) {
//             return res.status(404).json({ message: "Giỏ hàng không tìm thấy." });
//         }

//         console.log("Shopping Cart:", cart); // Log nội dung giỏ hàng để xem thông tin
//         res.status(200).json(cart); 
//     } catch (error) {
//         console.error("Error fetching cart:", error); // Log lỗi để xem thông tin chi tiết
//         res.status(400).json({ error: error.message });
//     }
// };


export default {
    getShoppingCartControllerByUser,
    addProductToCartController,
    updateProductQuantity,
    deleteProductFromCartController
}
