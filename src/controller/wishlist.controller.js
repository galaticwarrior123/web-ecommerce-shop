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
        const response = await wishlistService.addToWishlist(userId, productId);
        console.log('Add to wishlist response:', response);

        if (response.success) {
            if (response.exists) {
                return res.status(200).json({ message: "Sản phẩm đã được yêu thích", exists: true });
            }
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteProductFromWishlistController = async (req, res) => {
    try {
        const { wishlistId, productId } = req.params;

        const result = await wishlistService.removeProductFromWishlist(wishlistId, productId);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: result.message,
            wishlist: result.wishlist,
        });
    } catch (error) {
        console.error("Error in deleteProductFromWishlistController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default {
    getWishlistControllerByUser,
    addProductToWishlistController,
    deleteProductFromWishlistController
};