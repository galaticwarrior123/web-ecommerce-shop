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

const updateCategory = async (req, res) => {
    try {
        const category = req.body;
        const { id } = req.params;
        const newCategory = await categoryService.updateCategoryService(id, category, req, res);
        return res.status(200).json({
            DT: newCategory,
            EM: "Update category successfully",
        });
    } catch (error) {
        return res.status(400).json({
            DT: null,
            EM: error.message,
        });
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params; // Lấy ID từ request params

    try {
        const category = await categoryService.deleteCategoryService(id);

        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tìm thấy' });
        }
        return res.status(200).json({
            DT: category,
            EM: "Delete category successfully",
        });
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
};
export default {
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};