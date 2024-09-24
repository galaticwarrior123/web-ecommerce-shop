import { get } from "mongoose";
import productService from "../services/product.service.js";

const getProduct = async (req, res) => {
    try {
        const { search, category, sortOrder, page } = req.query;
        let rs = await productService.getProductService({
            search,
            category,
            sortOrder,
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
        const response = await productService.createProductService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export default {
    getProduct,
    createProduct
}


