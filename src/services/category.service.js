import Category from '../model/category.model.js';

const getCategoryService = async () => {
    try {
        const categories = await Category.find();
        return categories;
    } catch (error) {
        throw error;
    }
};

export default { getCategoryService };