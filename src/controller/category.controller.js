import categoryService from "../services/category.service";



const createCategory = async (req, res) => {

    try {
        const response = await categoryService.createCategoryService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const getAllCategory = async (req, res) => {
    try {
        const response = await categoryService.getAllCategoryService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const response = await categoryService.updateCategoryService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


const deleteCategory = async (req, res) => {
    try {
        const response = await categoryService.deleteCategoryService(req.body);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export default {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}