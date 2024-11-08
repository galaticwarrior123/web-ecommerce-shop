import PromotionService from "../services/promotion.service.js";



const PromotionController = {
    

    async createPromotionProduct(req, res) {
        try {
            const { id } = req.params;   
            const promotionProduct = req.body;
            const newPromotionProduct = await PromotionService.createPromotionProductService(id, promotionProduct, req, res);
            return res.status(200).json({
                DT: newPromotionProduct,
                EM: "Create promotion successfully",
            });
        } catch (error) {
            return res.status(400).json({
                DT: null,
                EM: error.message,
            });
        }
    },

    async getAllPromotionProduct(req, res) {
        try {
            const promotions = await PromotionService.getAllPromotionProductService();
            return res.status(200).json({
                DT: promotions,
                EM: "Get promotion successfully",
            });
        } catch (error) {
            return res.status(400).json({
                DT: null,
                EM: error.message,
            });
        }
    },

    async getPromotionById(req, res) {
        const { id } = req.params; // Lấy ID từ request params

        try {
            const promotion = await PromotionService.getPromotionProductService(id);
            if (!promotion) {
                return res.status(404).json({ message: 'Khuyến mãi không tìm thấy' });
            }
            return res.status(200).json(promotion);
        } catch (error) {
            console.error('Lỗi khi lấy khuyến mãi:', error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },

    async findProductsWithoutPromotion(req, res) {
        try {
            const products = await PromotionService.findProductsWithoutPromotionService();
            return res.status(200).json({
                DT: products,
                EM: "Get products successfully",
            });
        } catch (error) {
            return res.status(400).json({
                DT: null,
                EM: error.message,
            });
        }
    },

    async updatePromotionProduct(req, res) {
        try {
            const { id } = req.params;
            const promotionProduct = req.body;
            const updatedPromotionProduct = await PromotionService.updatePromotionProductService(id, promotionProduct, req, res);
            return res.status(200).json({
                DT: updatedPromotionProduct,
                EM: "Update promotion successfully",
            });
        } catch (error) {
            return res.status(400).json({
                DT: null,
                EM: error.message,
            });
        }
    },

    async deletePromotionProduct(req, res) {
        const { id } = req.params; // Lấy ID từ request params

        try {
            const promotion = await PromotionService.deletePromotionProductService(id);

            if (!promotion) {
                return res.status(404).json({ message: 'Khuyến mãi không tìm thấy' });
            }
            return res.status(200).json({
                DT: promotion,
                EM: "Delete promotion successfully",
            });
        } catch (error) {
            console.error('Lỗi khi xóa khuyến mãi:', error);
            return res.status(500).json({ message: 'Lỗi server' });
        }
    },

};

export default PromotionController;