import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            createdAt: { 
                type: Date, 
                default: Date.now // Mặc định là thời điểm sản phẩm được thêm vào wishlist
            },
        },
    ],
    //createdAt: { type: Date, default: Date.now },
});

const Wishlist = mongoose.model("wishlist", wishlistSchema);

export default Wishlist;