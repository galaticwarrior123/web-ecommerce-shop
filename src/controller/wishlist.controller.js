import wishlistService from "../services/wishlist.service.js";

const getWishlistControllerByUser = async (req, res) => {
    try {
        //const userId = req.user._id; // Đảm bảo có thuộc tính `_id` trong `req.user`
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in request" });
        }
        console.log("USERID: ", userId);
        const wishlist = await wishlistService.getWishlist(userId)
        console.log('Wishlist Response:', wishlist);
        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error getting wishlist:', error);
        res.status(500).json({ message: error.message });
    }
};

const addProductToWishlistController = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in request" });
        }
        const { productId } = req.body;

        // Call the service function
        const response = await wishlistService.addToWishlist(userId, productId);
        console.log('Add to wishlist response:', response);

        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        return res.status(500).json({ message: error.message });
    }
}

export default {
    getWishlistControllerByUser,
    addProductToWishlistController
};