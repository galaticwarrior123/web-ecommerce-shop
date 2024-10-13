import categoryService from "../services/category.service.js";

const getCategory = async (req, res) => {
    try {
        const categories = await categoryService.getCategoryService();
        return res.status(200).json({
            DT: categories,
            EM: "Get category successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}
const createCategory = async (req, res) => {
    try {
        const category = req.body;
        const newCategory = await categoryService.createCategoryService(category, req, res);
        return res.status(200).json({
            DT: newCategory,
            EM: "Create category successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

export default {
    getCategory,
    createCategory,
};