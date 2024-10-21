import shoppingCartService from "../services/shoppingcart.service.js";

const getShoppingCartControllerByUser = async (req, res) => {
    try {
        const userId = req.user._id; // Đảm bảo bạn có thuộc tính `_id` trong `req.user`
        const cart = await shoppingCartService.getShoppingCart(userId);
        console.log('Cart Response:', cart);    
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error getting shopping cart:', error);
        res.status(500).json({ message: error.message });
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
    getShoppingCartControllerByUser
}
