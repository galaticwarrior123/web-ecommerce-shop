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

export default {
    getWishlistControllerByUser
};