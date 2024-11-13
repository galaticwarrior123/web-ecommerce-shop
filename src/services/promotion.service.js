import ProductModel from "../model/product.model.js";
import PromotionModel from "../model/promotion.model.js";




const PromotionService = {
    async createPromotionProductService(id,promotionProduct, req, res) {
        try {
            const currentProduct = await ProductModel.findById(id);
            if (!currentProduct) {
                throw new Error('Không tìm thấy sản phẩm');
            }
            const newPromotionProduct = new PromotionModel(promotionProduct);
            newPromotionProduct.product = id;
            await newPromotionProduct.save();
            currentProduct.sale_price = currentProduct.origin_price - (currentProduct.origin_price * newPromotionProduct.discount / 100);
            await currentProduct.save();
            return newPromotionProduct;
        } catch (error) {
            throw new Error('Lỗi khi tạo khuyến mãi');
        }
    },



    async updatePromotionProductService(id, promotionProduct, req, res) {
        try {
            const updatedPromotionProduct = await PromotionModel.findById(id);
            if (!updatedPromotionProduct) {
                throw new Error('Không tìm thấy khuyến mãi');
            }
            updatedPromotionProduct.discount = promotionProduct.discount;
            updatedPromotionProduct.promotionName = promotionProduct.promotionName;
            updatedPromotionProduct.description = promotionProduct.description;
            updatedPromotionProduct.startDate = promotionProduct.startDate;
            updatedPromotionProduct.endDate = promotionProduct.endDate;
            await updatedPromotionProduct.save();
            return updatedPromotionProduct;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật khuyến mãi');
        }
    },

    async getAllPromotionProductService() {
        try {
            const promotionProduct = await PromotionModel.find().populate('product');
            return promotionProduct;
        } catch (error) {
            throw new Error('Lỗi khi lấy danh sách khuyến mãi');
        }
    },

    async getPromotionProductService(id) {
        try {
            const promotionProduct = await PromotionModel.findById(id);
            return promotionProduct;
        }
        catch (error) {
            throw new Error('Lỗi khi lấy khuyến mãi');
        }
    },

    async deletePromotionProductService(id) {
        try {
            const promotionProduct = await PromotionModel.findOneAndDelete(id);
            if (!promotionProduct) {
                throw new Error('Không tìm thấy khuyến mãi');
            }
            return { message: 'Xóa khuyến mãi thành công' };
        } catch (error) {
            throw error;
        }
    }

    
};

export default PromotionService;