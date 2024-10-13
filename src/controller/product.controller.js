import productService from "../services/product.service.js";

const getProduct = async (req, res) => {
    try {
        const { name, category, sort, page } = req.query;
        let rs = await productService.getProductService({
            name,
            category,
            sort,
            page,
        });
        return res.status(200).json({
            DT: rs,
            EM: "Get product successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}
const createProduct = async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await productService.createProductService(product, req, res);
        return res.status(200).json({
            DT: newProduct,
            EM: "Create product successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}
export default {
    getProduct,
    createProduct,
};